/**
 * CorvicEngine — the shared data layer for every Live App.
 *
 * Feature views arrive as ZSTD-compressed Parquet with no query API. DuckDB-WASM
 * reads them natively, runs SQL in a Web Worker, and returns bounded result sets
 * (caller LIMIT). The app's own tables arrive in one batch per turn, each checked
 * against the version a name already holds; a size gate refuses oversized views.
 */
import * as duckdb from "@duckdb/duckdb-wasm";
/**
 * The duckdb-wasm release this bundle's JS glue is compiled against.
 *
 * The wasm ABI is coupled to that glue, and the version is in the asset path, so
 * a different release is a different URL and the two can never share a cache entry.
 */
export declare const ENGINE_VERSION: string;
/**
 * What a temporal column holds: a day, or an instant.
 *
 * A day is the same calendar day in every zone; an instant is a different clock
 * reading per zone. Arrow hands both over as milliseconds (a day as midnight UTC),
 * so the physical type is the last place the difference is visible — otherwise
 * "the 25th" becomes the evening of the 24th west of Greenwich. Returns undefined
 * when the column is not temporal.
 */
export declare function clockOf(type: string): Clock | undefined;
/**
 * The role a column plays, guessed from its name and physical type. An app that
 * knows better declares it when registering the source.
 */
export declare function inferRole(name: string, type: string): ColumnRole;
export interface EngineOptions {
    /**
     * Same-origin base URL for DuckDB-WASM assets (wasm + worker variants).
     * Required by the app sandbox CSP (`script`/`worker`/`connect` → `'self'`).
     * Defaults to the version-named path the app's own origin serves, so an app
     * that sets nothing loads the engine {@link ENGINE_VERSION} names.
     */
    assetBase?: string;
    /** Max compressed download size (bytes) before refusing a source. Default ~200MB. */
    maxBytes?: number;
    /** Optional bearer/session token appended as a header on data fetches. */
    fetchHeaders?: Record<string, string>;
    /**
     * Called with every failure this engine mints, before the caller is rejected.
     *
     * Binding, describing, and querying each report here. An abandoned query is
     * not a failure and is not reported.
     */
    reportError?: (err: unknown) => void;
}
export type Row = Record<string, unknown>;
/**
 * The Arrow table a query returns. Taken from duckdb-wasm's signature so the
 * bundle has one Arrow copy (`instanceof` stays coherent).
 */
export type ResultTable = Awaited<ReturnType<duckdb.AsyncDuckDBConnection["query"]>>;
/**
 * Flatten a result table into plain JS row objects, normalizing every cell (see
 * {@link normalizeCell}). The sanctioned row-wise read; `table.toArray()` leaves
 * BigInt, DECIMAL limbs, and internal URLs unnormalized.
 */
export declare function toRows(table: ResultTable): Row[];
/**
 * What a column means (not how DuckDB stores it). Membership grows additively;
 * consumers must have a default branch for unknown roles.
 */
export type ColumnRole = "measure" | "dimension" | "time" | "identifier" | "url" | (string & {});
/** What an app can say about a column that the file cannot. */
export interface ColumnMeta {
    readonly role?: ColumnRole;
    /**
     * For a temporal column, whether it holds a day or an instant.
     * A day is shown in no zone. See {@link clockOf}.
     */
    readonly clock?: Clock;
    /** Free-form unit, e.g. "USD", "ms", "count". Formatters interpret it. */
    readonly unit?: string;
    readonly label?: string;
}
/** A single column of a registered source, as apps and components see it. */
export interface Column extends ColumnMeta {
    readonly name: string;
    /** From name and physical type unless the registration declared it. */
    readonly role: ColumnRole;
    readonly nullable: boolean;
}
/** Which of the two things a temporal column can hold. */
export type Clock = "day" | "instant";
/** The value types the engine binds as SQL parameters. */
export type SqlValue = string | number | bigint | boolean | null;
/** A name and the URL it is bound to. */
export interface SourceBinding {
    readonly name: string;
    readonly url: string;
}
export declare class CorvicEngine {
    private readonly assetBase;
    private readonly maxBytes;
    private readonly fetchHeaders;
    private readonly reportError;
    private readonly tables;
    private db;
    private conn;
    private initPromise;
    /** Keyed by name: the unit a caller rebinds and releases. */
    private readonly bindings;
    /** What the app declared about each source's columns, for {@link describe}. */
    private readonly declared;
    /** Why each unbound name is unbound, for the reads that name it. */
    private readonly bindFailures;
    private tableCounter;
    constructor(options?: EngineOptions);
    /**
     * Idempotent init of the DuckDB-WASM worker + connection.
     *
     * Callers arriving while an attempt is in flight share it, and a boot that
     * succeeded answers every later call. A boot that failed is not kept: the
     * assets come over the network, so the next caller attempts it again.
     */
    init(): Promise<void>;
    private doInit;
    /**
     * Absolute, same-origin base for DuckDB extension autoload. DuckDB appends
     * `/<version>/<platform>/<name>.duckdb_extension.wasm`; no trailing slash.
     */
    private extensionRepository;
    /**
     * Bind `name` to the bytes currently at `url`, and return the name to query.
     *
     * Idempotent and replacing: re-checks the server; on new bytes drops the prior
     * view and its file buffer. Memory is bounded by live names. An unchanged
     * source (matching ETag) keeps its view (one conditional request).
     */
    source(name: string, url: string, columns?: Readonly<Record<string, ColumnMeta>>): Promise<string>;
    /**
     * Bind many names at once. Network work runs in parallel, the app's own tables
     * in one batch; DuckDB writes on the shared connection are serial.
     *
     * Each name binds or fails on its own: a name that fails is recorded against
     * itself and raised at the reads that name it, and every other name binds.
     */
    registerSources(entries: Iterable<readonly [string, string]>): Promise<void>;
    /** Why `name` is not bound, or null when nothing is recorded against it. */
    bindFailure(name: string): unknown | null;
    /** The names currently bound, and the URL each is bound to. */
    sources(): readonly SourceBinding[];
    /**
     * Decide how to satisfy one binding: keep what the name holds, or fetch fresh
     * bytes. Network I/O only; DuckDB mutation is {@link commitPlan}.
     */
    private planSource;
    /** {@link planSource} for a link that is fetched as it is: HEAD, then the bytes. */
    private planUrlSource;
    /** Apply a resolved {@link SourcePlan} to the shared DuckDB connection. */
    private commitPlan;
    /**
     * Drop a superseded view and unregister its Parquet buffer. Best-effort: the
     * binding is already replaced; failure here costs memory, not correctness.
     */
    private release;
    /** Expose an internal table under a caller-facing name. */
    private alias;
    /**
     * Build the `SELECT … FROM read_parquet(...)` body for a source view, rebinding
     * a resource `blob_url` column to a working image/file link.
     *
     * Stored `blob_url` values are internal pointers (storage URI, `"local upload"`,
     * or absolute apex user-content URL) and do not load in the sandboxed iframe.
     * The proxy cell endpoint `/table/<ref>/<row>/blob_url` does. Derive that URL
     * from row position: served Parquet is in output-row order; `file_row_number`
     * + 1 is the 1-based cell-endpoint row.
     *
     * Shapes:
     *   - source has `blob_url` → rebind it to the cell path;
     *   - source has `source_path` but no `blob_url` (proxy stripped it) →
     *     synthesize `blob_url` from row position.
     *
     * Plain `SELECT *` when the link has no parseable ref or neither shape applies.
     */
    private blobUrlProjection;
    /** Column names of a registered Parquet file buffer. */
    private parquetColumns;
    /**
     * Run SQL against the registered sources and return DuckDB's Arrow table.
     * Callers must keep result sets small (LIMIT). Read column-wise, or row-wise
     * through {@link rows} / {@link toRows} — not `toArray()`, which skips
     * normalization.
     *
     * `params` fill positional `?` via a prepared statement (user values stay data).
     *
     * `signal` releases the caller: an aborted query rejects with
     * {@link QueryAbortedError}; one aborted before start never reaches the engine.
     * It does not stop a statement already running: duckdb-wasm cancels per
     * connection, and a document has one connection. Safe cancel needs serialized
     * dispatch and is not implemented here.
     */
    query(sql: string, params?: readonly SqlValue[], signal?: AbortSignal): Promise<ResultTable>;
    /**
     * Run SQL and read the result row-wise with every cell normalised (BigInt →
     * Number; Corvic content URLs → same-origin). For hand-written render code;
     * {@link query} is for column-wise consumers.
     */
    rows(sql: string, params?: readonly SqlValue[], signal?: AbortSignal): Promise<Row[]>;
    /**
     * The source's columns: inspected schema merged with registration declarations.
     * `role` is inferred from name and physical type unless declared;
     * `unit`/`label` appear only when declared.
     */
    describe(name: string): Promise<readonly Column[]>;
    close(): Promise<void>;
    private head;
    /**
     * The bytes at `url`, re-asking while the failure says "later".
     *
     * A source load is a read the reader is waiting on with no way to repeat it,
     * so it spends the same budget a write does: the edge turns a dependency
     * restarting into a 503, and one attempt would make that a broken app.
     */
    private fetchBuffer;
    private assertDb;
    private assertConn;
}
