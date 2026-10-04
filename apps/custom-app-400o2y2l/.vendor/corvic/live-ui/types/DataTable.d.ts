import type { ReactNode } from "react";
import type { Clock, ColumnRole } from "./contract";
import { type CellValue, type DatePrecision } from "./format";
/**
 * A typed column. `value` extracts the cell's value and never formats it;
 * sorting, filtering, and alignment all read the extracted value.
 */
export interface DataColumn<Row> {
    readonly id: string;
    readonly header: string;
    /** What the column means. Alignment and default sort order derive from it. */
    readonly role: ColumnRole;
    readonly unit?: string;
    readonly value: (row: Row) => CellValue;
    /**
     * What a temporal column holds, which decides how much of it is shown and in which zone.
     *
     * A catalog measures this; a day has no time of day to show and no zone to show it in.
     */
    readonly clock?: Clock;
    /** How much of a time to show, where the column's own kind is not the answer. */
    readonly precision?: DatePrecision;
    /** Overrides the unit-driven default at the rendering boundary only. */
    readonly format?: (value: CellValue) => string;
    /** Sortable unless stated otherwise: a result set column usually is. */
    readonly sortable?: boolean;
    /** A per-column text filter. Off by default. */
    readonly filterable?: boolean;
    /** Pin the column while the rest scrolls horizontally. */
    readonly sticky?: boolean;
    /**
     * The physical column behind this one, source-qualified (`deals.amount_usd`).
     *
     * Declared on the header only: a cell's column is its position.
     */
    readonly source?: string;
}
/**
 * What a table is looking at when the source is larger than the rows in hand.
 *
 * Ordering, filtering, and paging are over the whole source. The table reports
 * what it wants; the caller's query answers.
 */
export interface Window {
    /** Rows the source has, which is what the pages are counted from. */
    readonly count: number;
    /** Rows the caller has supplied, from `offset`. */
    readonly offset: number;
    /** Asked for whenever a reader turns a page, reorders, or filters. */
    readonly onWindow: (asked: Asked) => void;
}
/** A window a reader has asked for, in the terms a source can be queried in. */
export interface Asked {
    readonly offset: number;
    readonly limit: number;
    readonly sort: {
        readonly columnId: string;
        readonly descending: boolean;
    } | null;
    readonly filters: readonly {
        readonly columnId: string;
        readonly contains: string;
    }[];
}
export interface DataTableProps<Row> {
    /** The table's accessible name, and its visible caption. */
    readonly caption: string;
    readonly columns: readonly DataColumn<Row>[];
    readonly rows: readonly Row[];
    /**
     * Row identity, stable across the reordering that sorting and filtering do.
     *
     * A column's `id` names the field that identifies a row, which is what it
     * usually is; a function is for identity that has to be derived or composed.
     */
    readonly rowId: string | ((row: Row) => string);
    readonly pageSize?: number;
    readonly initialSort?: {
        readonly columnId: string;
        readonly descending?: boolean;
    };
    readonly emptyMessage?: string;
    readonly locale?: string;
    /**
     * Set when `rows` is a window onto a larger source.
     *
     * Absent, the table owns its paging, sorting and filtering. Present, it owns
     * none of them and says what it wants instead.
     */
    readonly window?: Window;
}
/**
 * A sortable, filterable, paginated table of typed rows.
 *
 * A first click sorts a measure or a time column largest-first and a dimension
 * smallest-first; missing values sort last in either direction.
 */
export declare function DataTable<Row>({ caption, columns, rows, rowId, pageSize, initialSort, emptyMessage, locale, window, }: DataTableProps<Row>): ReactNode;
