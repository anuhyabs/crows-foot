/**
 * The load-state machine a page shows its reader.
 *
 * Framework-neutral and React-free, which is why it is here rather than beside
 * `DataBoundary` in the component package: a page with no framework loads data
 * too.
 *
 * One property shapes every transition: a load that fails or restarts does not
 * discard the last successful data. That is what makes "stale" a state a report
 * can show, instead of a refresh that blanks a page an analyst was reading.
 */
/** Where a load is, and what it has to show. */
export interface LoadState<T> {
    readonly status: "idle" | "loading" | "ready" | "failed";
    /** The last successful result, kept across a reload and across a failure. */
    readonly data?: T;
    /** When {@link LoadState.data} arrived. */
    readonly loadedAt?: Date;
    /** What the most recent attempt rejected with. */
    readonly error?: unknown;
}
/** Nothing requested yet. */
export declare function idle<T>(): LoadState<T>;
/** An attempt is in flight; whatever was shown stays shown. */
export declare function loading<T>(previous?: LoadState<T>): LoadState<T>;
/** An attempt succeeded, replacing both the data and the failure. */
export declare function loaded<T>(data: T, at?: Date): LoadState<T>;
/** An attempt failed; the previous data survives it and is now stale. */
export declare function failed<T>(previous: LoadState<T>, error: unknown): LoadState<T>;
/**
 * Whether what is on screen is older than what was asked for: there is data, and
 * the current attempt has not (yet) confirmed it.
 */
export declare function isStale<T>(state: LoadState<T>): boolean;
