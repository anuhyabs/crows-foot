/**
 * Table reads issued together, sent as one batch to the app's own origin.
 *
 * Every source a page binds is a read of a table the app's ledger answers for. Each
 * read on its own costs the edge a whole resolution of that ledger; a batch costs
 * one for all of them. Reads issued in the same turn of the event loop — the page's
 * sources binding at once, or a refresh — share a request.
 */
import { type TablePart, type TableRead } from "@corvic/live-user-content";
import { type RetryOptions } from "./retry";
export interface TableBatchLinkOptions {
    /** Where batches go: `/table` on the ledger's origin. */
    endpoint: string;
    headers: Record<string, string>;
    /** Largest Parquet one read may deliver; see `tableBatchParts`. */
    maxPartBytes: number;
    retry?: RetryOptions;
}
export declare class TableBatchLink {
    private readonly options;
    private pending;
    constructor(options: TableBatchLinkOptions);
    /**
     * How `read` came out, re-asked while its failure says "later".
     *
     * Rejects only with what `fetch` itself rejected with.
     */
    read(read: TableRead): Promise<TablePart>;
    private enqueue;
    private flush;
}
