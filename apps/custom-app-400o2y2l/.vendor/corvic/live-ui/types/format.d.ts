/**
 * Turning typed values into text, at the one boundary where text is needed.
 *
 * The unit vocabulary is open: a unit this module does not recognize is
 * appended to the formatted number.
 */
/** Every scalar a query result can put in front of a formatter. */
export type CellValue = string | number | bigint | boolean | Date | null | undefined;
/** How a point or period in time is named. */
export type DatePrecision = "year" | "month" | "date" | "datetime" | "time";
/** A closed time interval, in typed dates. */
export interface DateRange {
    readonly start: Date;
    readonly end: Date;
}
/**
 * A change against a baseline. `kind` says how to read `value`: `"absolute"` is
 * in the metric's own unit, `"percent"` is in percentage points.
 */
export interface Delta {
    readonly value: number;
    readonly kind: "absolute" | "percent";
}
/** Which way is good for a measure. Required when a delta is shown. */
export type Direction = "up-is-good" | "down-is-good" | "neutral";
/** A delta read through its direction. */
export type Favorability = "favorable" | "unfavorable" | "neutral";
/** The text shown where a value is absent, `NaN`, or non-finite. */
export declare const MISSING_TEXT = "\u2014";
/** The accessible name for {@link MISSING_TEXT}. */
export declare const MISSING_LABEL = "no value";
export interface FormatOptions {
    /**
     * Semantic unit: an ISO 4217 currency code, `"percent"` (a number already in
     * percentage points), `"ratio"` (a fraction of one), `"bytes"`, `"ms"`,
     * `"s"`, `"count"`, or any other string, which is appended as a suffix.
     */
    readonly unit?: string;
    readonly locale?: string;
    readonly maximumFractionDigits?: number;
    /** Compact notation ("1.2M"), for space-constrained readouts. */
    readonly compact?: boolean;
    /**
     * How much of a time to show, and — for a number — that it is one at all.
     *
     * Set for a temporal column and left unset otherwise: a number with a precision beside it
     * is an instant in milliseconds, which is how a temporal column reads row-wise.
     */
    readonly precision?: DatePrecision;
}
/**
 * Format any query-result scalar, dispatching on the value's own type — and on the
 * column's where the value has none.
 *
 * A scalar out of a database is a number or a string; *what it is* is a property of
 * the column it came from. A precision on a number means an instant in milliseconds —
 * how a temporal column reads row-wise through Arrow.
 */
export declare function formatCell(value: CellValue, options?: FormatOptions): string;
/**
 * Format a number against its unit. A `bigint` beyond
 * `Number.MAX_SAFE_INTEGER` keeps its own digits.
 */
export declare function formatNumber(value: number | bigint, options?: FormatOptions): string;
/**
 * Format a typed date at a declared precision.
 *
 * A calendar precision is read in UTC (a day arrives as midnight UTC); an instant
 * is read in the reader's zone.
 */
export declare function formatDate(value: Date, precision: DatePrecision, locale?: string): string;
/** Format a closed interval as one phrase; both ends keep their typed precision. */
export declare function formatDateRange(range: DateRange, precision?: DatePrecision, locale?: string): string;
/** The machine-readable form for a `<time datetime="…">` attribute. */
export declare function isoDateTime(value: Date): string;
/** Format a delta with an explicit sign, except where it is zero. */
export declare function formatDelta(delta: Delta, options?: FormatOptions): string;
/**
 * Read a delta through the direction that says which way is good. A zero delta
 * is neutral for any direction, and so is an unrecognized direction.
 */
export declare function favorability(delta: Delta, direction: Direction): Favorability;
