/**
 * A fragment of SQL and the parameters it binds, which travel together.
 *
 * Neither half of a compiled request owns this and both need it: a filter is
 * written once and then applied to a per-source aggregate and to the shared
 * domain that aggregate is projected onto. Binding parameters once keeps both
 * sites in step.
 */
import type { TimeGrain } from "./catalog";
import type { SqlValue } from "./contract";
/** One authored SQL identifier, quoted as data rather than parsed as syntax. */
export declare function identifier(name: string): string;
/** A qualified name whose parts are independently authored identifiers. */
export declare function qualified(...parts: readonly string[]): string;
/** One authored string value in SQL that cannot take a bound parameter. */
export declare function literal(value: string): string;
/** A filter with its dimension resolved to the column it restricts. */
export interface Restriction {
    readonly dimension: string;
    readonly sql: string;
    readonly params: readonly SqlValue[];
}
/** Some SQL and the values it binds, in the order the placeholders appear. */
export interface Bound {
    readonly sql: string;
    readonly params: readonly SqlValue[];
}
export declare function conjoin(restrictions: readonly Restriction[]): Bound | null;
/**
 * A timestamp truncated to a grain.
 *
 * The cast lets the domain meet the answer. `generate_series` yields timestamps
 * and `date_trunc` over a date column yields dates; a join between the two
 * matches nothing, and an answer that lost every row reads as a quiet empty chart.
 */
export declare function bucket(grain: TimeGrain, expr: string): string;
/**
 * Which bin a reading falls in, counted from nought in units of the width.
 *
 * `floor(x / width)` is wrong for ladder widths: a tenth or a fifth is not exact in a
 * double, so `2.4 / 0.2` is 11.999999999999998 and a reading on an edge lands one bin
 * below. Rounding the product of a wrong floor labels the wrong bar; casting to DECIMAL
 * does not help, because DuckDB divides decimals in doubles.
 *
 * Every width on the ladder is a one-digit integer times a power of ten, so scaling the
 * reading by that power turns the arithmetic into integers, where a quotient that ought
 * to be whole is whole. The scale is generous by six places: rounding the *reading* to
 * the width's precision would walk 2.399 up to 2.4 and across an edge.
 *
 * The room this leaves is 32 digits less the width's places — past which a quantity
 * measured in ångströms and summed over a galaxy would stop being binnable.
 */
export declare function binIndex(width: number, places: number, expr: string): string;
/**
 * The nth bin's left edge.
 *
 * Rounded because `12 * 0.2` is 2.4000000000000004, and an axis carrying that beside 2.4
 * has two labels a reader reads alike. One place both sides call, so the coordinate a
 * domain generates and the coordinate an answer computes are the same string of
 * arithmetic — which is what the join between them needs.
 */
export declare function edge(width: number, places: number, index: string): string;
/** The bin a reading falls in, named by its left edge. */
export declare function bin(width: number, places: number, expr: string): string;
/**
 * The cell a position falls in, named by the corner nearest the origin.
 *
 * Two bins in one coordinate, so a place stays one column and everything downstream that
 * groups, joins or draws a coordinate needs nothing said to it about planes. Written as
 * the two edges with a space between them: a coordinate a person can read in a result and
 * a renderer can take apart with the frame the place declared.
 *
 * The width is the same on both axes, so the pair reads as one number would: what a cell
 * is comes off the request the way a grain does.
 */
export declare function cell(width: number, places: number, north: string, east: string): string;
/**
 * A position, spelled the way a cell is so that one reader takes both apart.
 *
 * What a place reads as when the request cut it into nothing: the pair as it was measured,
 * which is a coordinate because something else in the request makes it one per row.
 *
 * Null where either half is. `concat_ws` drops a null argument, so a row missing its
 * latitude would otherwise report its longitude as a whole position — a mark on the
 * equator. Half a position is an absence, and an absence has a coordinate of its own
 * everywhere else here.
 */
export declare function position(north: string, east: string): string;
