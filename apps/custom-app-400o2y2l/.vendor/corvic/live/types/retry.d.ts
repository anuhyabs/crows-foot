/**
 * Fetching that outlives a dependency restarting underneath it.
 *
 * A live app is the last hop of a chain that already retries: the control plane
 * retries an `UNAVAILABLE` gRPC call five times before the per-ledger edge turns
 * it into a 503. The edge's meaning is "this exact request can succeed shortly".
 * An iframe has no navigation-level retry and the reader has no address bar; a
 * single attempt here is the app's final answer.
 *
 * Retryable statuses are those whose meaning is "later". A refusal for want of a
 * credential means "not as you are", so {@link fetchRetrying} answers it by
 * getting a credential and asking once more — see `credential.ts`.
 */
/** Whether {@link fetchRetrying} spends its budget on this status. */
export declare function isRetryableStatus(status: number): boolean;
export interface RetryOptions {
    /** Total tries, not extra ones: 1 disables retrying. */
    attempts?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    /** Seam for tests, which must not spend the wall-clock time. */
    sleep?: (ms: number) => Promise<void>;
    /** Seam for tests, which need the jitter to be a known value. */
    random?: () => number;
}
/**
 * `fetch`, repeated while the failure says "later".
 *
 * Resolves with the last response even when it is a failure, so the caller owns
 * the error it raises. Rejects only with what `fetch` itself rejected with,
 * after the attempts are spent. An abort propagates at once: it is the caller
 * having left.
 */
export declare function fetchRetrying(url: string, init?: RequestInit, options?: RetryOptions): Promise<Response>;
/** The attempt budget {@link fetchRetrying} spends, for callers that report it. */
export declare const FETCH_ATTEMPTS = 4;
/**
 * Wait as {@link fetchRetrying} does before attempt `attempt + 1`, for a caller
 * whose "later" arrives inside a response rather than as its status.
 */
export declare function sleepBeforeRetry(attempt: number, options?: RetryOptions): Promise<void>;
