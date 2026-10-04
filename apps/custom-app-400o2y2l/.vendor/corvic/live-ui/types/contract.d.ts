/**
 * What this package needs from `@corvic/live`, in one place.
 *
 * Re-exported, so `DataClient` has one definition. Type-only: `index.js` and the
 * vendored runtime stay separately delivered and separately versioned.
 */
import type { DateRange } from "./format";
export type { Clock, Column, ColumnMeta, ColumnRole, DataClient, PageContext, SourceBinding, SqlValue, } from "@corvic/live";
/**
 * What the platform knows about the data behind a figure.
 *
 * This package's own: provenance is something a report shows.
 */
export interface DataSourceMeta {
    /** The registered source name, as `DataClient.sources()` reports it. */
    readonly source: string;
    readonly refreshedAt?: Date;
    /** The period the data covers, which need not be the period asked for. */
    readonly coverage?: DateRange;
    readonly rowCount?: number;
    /** Grows additively, so a renderer must tolerate a status it does not know. */
    readonly status?: "fresh" | "stale" | "partial" | (string & {});
}
