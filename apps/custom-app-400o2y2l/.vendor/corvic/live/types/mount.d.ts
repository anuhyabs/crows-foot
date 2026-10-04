/**
 * One mount, one engine, one router.
 *
 * `mountApp` is how every app boots. It owns the DuckDB engine (one per document;
 * a navigation must not cost a 40 MB recompile), the router (an in-app link must
 * not tear down the realm), and the resolved theme. Markup, CSS, framework, and
 * refresh cadence belong to the pages.
 *
 * A page is a function of its context: it renders into `ctx.content`, reads data
 * through `ctx.db`, and returns an optional cleanup. Routes are lazy (code-split);
 * the panel path is an ordinary route (see {@link panelPage}).
 *
 * `URLPattern` matches routes and the Navigation API intercepts them. Both are
 * required: without them every click reloads the document and the engine.
 */
import { type Column, type ColumnMeta, CorvicEngine, type ResultTable, type Row, type SourceBinding, type SqlValue } from "./engine";
import { type ResolvedTheme, type ThemeOverride } from "./theme";
import { type WriteClient, type WriteDeclaration } from "./write";
/** Where the engine's version-named assets live. There is no default engine. */
export interface EngineAssets {
    /** Version-named asset root, e.g. "/.corvic/pinned/duckdb/1.32.0/". */
    base: string;
    /** The pinned duckdb-wasm version, for diagnostics and the `ready` event. */
    version: string;
}
export interface MountOptions {
    /** Absolute bundle root, inlined by the host into the bootstrap it generates. */
    base: string;
    /** The engine the manifest pinned. */
    engine: EngineAssets;
    /** Routes resolved from the manifest, in declared order; first match wins. */
    routes: readonly Route[];
    /**
     * The manifest's `data` block. Bound before the first query runs, so a page
     * reads `SELECT … FROM <id>` without restating what the manifest declared.
     */
    data?: readonly SourceDeclaration[];
    /**
     * The manifest's `writes` block. Empty for a read-only app, which is most.
     */
    writes?: readonly WriteDeclaration[];
    /**
     * The manifest's `catalogs` block, as the host inlined it.
     *
     * Opaque here: this package binds sources and renders routes. What a number
     * means belongs to `@corvic/live-semantic` (`declared` there).
     */
    catalogs?: readonly unknown[];
    /** The manifest's `theme` block; omit for the platform default. */
    theme?: ThemeOverride;
    /**
     * The mount region. Defaults to `#corvic-app` (host-generated), then `<body>`.
     */
    root?: HTMLElement;
}
/** One manifest data binding: the SQL name, and the governed link behind it. */
export interface SourceDeclaration {
    name: string;
    url: string;
    columns?: Readonly<Record<string, ColumnMeta>>;
}
export interface Route {
    /**
     * A bundle-relative URL pattern: "home", "reports/roles", or a
     * parameterized "deal/:id". Matched with `URLPattern` against `base`.
     */
    path: string;
    /** Nav label. Omit, or set `hidden`, to stay out of the generated nav. */
    title?: string;
    hidden?: boolean;
    /** Exactly one route sets this; the manifest schema is what enforces that. */
    home?: boolean;
    /** Loads the page module. Always lazy, so every route is code-split. */
    load: () => Promise<PageModule>;
    /**
     * The bundle-relative path `load` resolves, when the host document knows it.
     *
     * A failed import is cached against its specifier, so re-asking for a module
     * takes a URL that can be varied. Supplying it makes the route recoverable
     * from a load refused for want of a credential; omitting it makes such a
     * refusal final.
     */
    module?: string;
}
/** Release whatever a page acquired that an `AbortSignal` cannot cancel. */
export type PageCleanup = () => void | Promise<void>;
export type PageRender = (ctx: PageContext) => void | PageCleanup | Promise<void | PageCleanup>;
export type PageModule = PageRender | {
    default: PageRender;
};
/** Which route matched, and how. */
export interface RouteMatch {
    /** The matched route's declared `path`. */
    readonly path: string;
    readonly params: Readonly<Record<string, string>>;
    readonly url: URL;
}
export interface PageContext {
    /** The mount region: cleared before each render, then yours entirely. */
    readonly content: HTMLElement;
    /**
     * The one data client for this app session, available before the engine has
     * finished instantiating: the first call that needs it awaits it.
     */
    readonly db: DataClient;
    /**
     * The governed path back out, over the targets `app.yaml` declared. A page in a
     * read-only app never touches it; one that takes an upload or files a record
     * does everything through it.
     */
    readonly write: WriteClient;
    /**
     * What the manifest says its data means, for a page that reasons about numbers.
     * Passed through unchanged; `declared(ctx)` in `@corvic/live-semantic` types it.
     */
    readonly catalogs: readonly unknown[];
    readonly route: RouteMatch;
    /** Resolved theme, for apps that want the platform look. */
    readonly theme: ResolvedTheme;
    /**
     * Aborted when the user navigates away. Pass it to APIs that accept a signal;
     * return a {@link PageCleanup} for resources that do not.
     */
    readonly signal: AbortSignal;
    /**
     * Tell the host about a failure this page handled itself.
     *
     * Data failures are reported by the runtime. This is for the rest: a library
     * that did not load, a shape the data did not have, a canvas that would not
     * draw.
     */
    reportError(err: unknown): void;
    /** Navigate programmatically; equivalent to clicking the route's link. */
    navigate(to: string): void;
    /**
     * Re-read every declared source and render this route again.
     *
     * What a page calls after it writes. The engine re-asks the server for each
     * source and keeps the ones whose ETag is unchanged, so this is cheap when
     * nothing moved — but note it is not read-your-write: the read path caches a
     * materialized table briefly, so a just-appended row may not be in the answer
     * yet. Show what the reader did from what the page already knows, and let this
     * reconcile.
     */
    reload(): Promise<void>;
}
/** The governed path to live data. SQL is the whole interface to the engine. */
export interface DataClient {
    /**
     * Bind `name` to the current bytes at `url`, declaring what its columns mean if
     * the app knows. Idempotent and replacing, which is also how a single source is
     * refreshed.
     */
    registerSource(name: string, url: string, columns?: Readonly<Record<string, ColumnMeta>>): Promise<void>;
    /**
     * Run SQL and get DuckDB's Arrow table, for a consumer that reads columns.
     *
     * Pass `ctx.signal` from a page render: an abandoned query rejects with
     * `QueryAbortedError`.
     */
    query(sql: string, params?: readonly SqlValue[], signal?: AbortSignal): Promise<ResultTable>;
    /** The same query read row-wise, every cell normalized. */
    rows(sql: string, params?: readonly SqlValue[], signal?: AbortSignal): Promise<Row[]>;
    /** Inspected schema merged with whatever the registration declared. */
    describe(source: string): Promise<readonly Column[]>;
    /**
     * The names this app reads, and the URL each is bound to.
     *
     * Every declaration from the manifest, including before the engine has committed
     * it. Binding runs off the boot path; a synchronous reader (refresh, provenance)
     * must see the declared set immediately.
     */
    sources(): readonly SourceBinding[];
}
export interface AppHandle {
    readonly db: DataClient;
    readonly write: WriteClient;
    navigate(to: string): void;
    /**
     * Open `to` in a new browsing context, and say whether anything did.
     *
     * This document is sandboxed without `allow-popups`, so `window.open` here
     * creates nothing and reports nothing; the page embedding it is asked instead.
     * `false` means nobody was asked — a scheme other than http(s), or a host that
     * does not open tabs — so a caller can offer the reader the link instead of
     * leaving the click doing nothing.
     *
     * Only needed where there is no anchor: a `target="_blank"` link is already
     * brokered this way, without the app doing anything.
     */
    openExternal(to: string): boolean;
    /**
     * Re-register every binding in `db.sources()`, then re-render the current route.
     * A single source is refreshed by registering it again.
     */
    refresh(): Promise<void>;
    /** The single release path for the engine, router, and listeners. */
    destroy(): Promise<void>;
}
/**
 * Boot the app. Called exactly once by the host bootstrap. Resolves once the shell
 * and the first route have rendered; does not await the engine.
 */
export declare function mountApp(options: MountOptions): Promise<AppHandle>;
/** A page that renders a panel spec from a host-generated declarative route. */
export declare function panelPage(specUrl: string): PageRender;
/**
 * Bind what the manifest declared, once, off the boot path.
 *
 * Started without awaiting so a page paints before its data arrives; every read
 * awaits {@link BindGate.ready}. Nobody is waiting at boot, so a failure is left
 * with the engine, which holds it against the name and raises it at the reads of
 * that name; throwing here would be an unhandled rejection.
 *
 * A source that fails is held against that source alone: the page binds every
 * other name and only a read of the missing one fails. Failing the whole gate
 * instead would let one source take down panels that never name it — and, since
 * a source binds once, keep them down until the document was reloaded.
 *
 * Exported for unit tests of the gate under jsdom.
 */
export declare function bindDeclared(engine: CorvicEngine, declared: readonly SourceDeclaration[]): BindGate;
/** The declared bindings, as the reads and the refresh control see them. */
interface BindGate {
    /** Settles when every declared source has bound or failed; never rejects. */
    ready(): Promise<void>;
    /** Re-ask for every declared source, including ones that failed before. */
    rebind(): Promise<void>;
}
/**
 * Compile the declared routes into patterns rooted at `base`. Declared order is
 * match order; a trailing wildcard is the app's 404. Exported for unit tests of
 * matching under jsdom.
 */
export declare function routeTable(base: string, routes: readonly Route[]): {
    match(url: URL): {
        entry: Route;
        route: RouteMatch;
    } | null;
};
export {};
