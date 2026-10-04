/**
 * The errors `@corvic/live` rejects with.
 *
 * Call sites are generated app bundles; failures surface as rejections. The
 * mount wraps every page render and listens for `unhandledrejection` and
 * `error`, so a failure that arrives after the render returns is shown too
 * (see `reportUncaught` in `mount.ts`).
 */
/**
 * Base class for every error this runtime raises.
 *
 * Branch on {@link CorvicError.kind}: bundlers mangle class names, and an error
 * that crosses the worker boundary arrives as a structured clone with no
 * prototype. `kind` survives both.
 */
export declare abstract class CorvicError extends Error {
    abstract readonly kind: string;
}
/** SQL that the engine refused or failed to execute. */
export declare class QueryError extends CorvicError {
    readonly sql: string;
    readonly kind = "query";
    constructor(sql: string, cause: unknown);
}
/**
 * A query the caller stopped waiting for, because its signal aborted.
 *
 * Distinct from {@link QueryError}: navigation away is a normal outcome and is
 * not shown on an error surface; a failed SQL statement is a defect and is.
 */
export declare class QueryAbortedError extends CorvicError {
    readonly sql: string;
    readonly kind = "query-aborted";
    constructor(sql: string);
}
/** A source that could not be read: it 404s, is unreachable, or is not Parquet. */
export declare class SourceUnavailableError extends CorvicError {
    readonly source: string;
    readonly url: string;
    readonly kind = "source-unavailable";
    constructor(source: string, url: string, cause: unknown);
}
/**
 * A write the runtime refused before asking the server: the app is at fault.
 *
 * A target no manifest declares, a target used as the wrong kind, or a path that
 * climbs out of the one it was given. Separate from the two below because nothing
 * about the reader's situation changed — the same click will fail the same way
 * until the bundle is fixed.
 */
export declare class WriteRefusedError extends CorvicError {
    readonly target: string;
    readonly kind = "write-refused";
    constructor(target: string, reason: string);
}
/**
 * The reader's user-content session lapsed mid-write.
 *
 * Its own class because it is the one write failure that is nobody's mistake and
 * has a remedy a page can offer: the token lives five minutes, the embedder
 * re-mints it, and reloading picks up the fresh one. Reported as a lost
 * connection rather than a rejected upload, which is what it is.
 */
export declare class WriteSessionExpiredError extends CorvicError {
    readonly target: string;
    readonly kind = "write-session-expired";
    constructor(target: string);
}
/**
 * The server declined a write, or it never arrived.
 *
 * Carries the status and the server's own detail, because the refusals an app
 * provokes are specific and say what to fix: a row that does not match the
 * target's schema, a file posted to a row collection, a path that no longer
 * exists. `status` is 0 when the request itself failed.
 */
export declare class WriteRejectedError extends CorvicError {
    readonly target: string;
    readonly url: string;
    readonly status: number;
    readonly detail: string;
    readonly kind = "write-rejected";
    constructor(target: string, url: string, status: number, detail: string);
}
/**
 * A form was submitted and no page handler claimed it.
 *
 * Raised for a POST submission that reaches the router, which means the page
 * rendered a form and never called `preventDefault`. Its fields would go to a
 * path that serves the bundle, tearing the app down mid-entry.
 *
 * A GET form is not this: its fields are in the query string, so the router
 * handles it as an ordinary route change.
 */
export declare class FormNotHandledError extends CorvicError {
    readonly action: string;
    readonly kind = "form-not-handled";
    constructor(action: string);
}
/**
 * The frame this app is shown in refuses form submission.
 *
 * An iframe whose `sandbox` lacks `allow-forms` drops a submit before the
 * `submit` event fires, so no page handler runs and nothing is logged. Every
 * Save, Add and search box in the app does nothing. The page cannot fix this;
 * the embedder has to grant `allow-forms`.
 */
export declare class FormsBlockedError extends CorvicError {
    readonly kind = "forms-blocked";
    constructor();
}
/**
 * A source whose bytes exceed the engine's limit, refused before it is fetched.
 */
export declare class SourceTooLargeError extends CorvicError {
    readonly source: string;
    readonly url: string;
    readonly bytes: number;
    readonly limit: number;
    readonly kind = "source-too-large";
    constructor(source: string, url: string, bytes: number, limit: number);
}
