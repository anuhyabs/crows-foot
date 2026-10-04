import { type LoadState } from "@corvic/live/load-state";
import type { Table } from "apache-arrow";
import type { DataClient, SqlValue } from "./contract";
/** A load's current state, and the retry a reader can ask for. */
export interface DataLoad<T> {
    readonly state: LoadState<T>;
    /** Run the load again, keeping whatever is on screen until it resolves. */
    readonly retry: () => void;
}
/**
 * Run an async load, aborting it when its inputs change or the page unmounts.
 *
 * `deps` alone decides when to reload; `load` is read through a ref, so an
 * inline arrow at the call site does not re-run the load on every render.
 */
export declare function useDataLoad<T>(load: (signal: AbortSignal) => Promise<T>, deps: readonly unknown[]): DataLoad<T>;
/**
 * Run SQL through the app's one data client.
 *
 * Parameters bind; they are never interpolated.
 */
export declare function useQuery(db: DataClient, sql: string, params?: readonly SqlValue[]): DataLoad<Table>;
