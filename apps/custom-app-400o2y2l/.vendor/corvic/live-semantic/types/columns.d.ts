/**
 * The names an answer gives to columns the request did not ask for.
 *
 * A request names coordinates and measures. An answer carries those and more:
 * the readings behind each number, whether it was read or worked out, the ends
 * of its interval, what it is being compared against, and how much the
 * statement left out.
 *
 * `derived` compares them with the request's names. Authored names are arbitrary
 * strings, including names that contain the separator used by generated names.
 */
/** What travels beside a measure's value. */
export type Aside = 
/** How many readings the coordinate holds. */
"sample"
/**
 * What share of the value was read here, the rest being worked out or carried.
 *
 * A share: a total is an aggregate and being carried is a property of its parts.
 * Sixty-four offices recounted a few at a time make every quarter partly carried.
 * Nought where nothing was read, one where everything was, and null where there is
 * no reading to hold a share of.
 */
 | "read"
/** Whether the answer covered this coordinate, before any prior ran. */
 | "missing"
/** The ends of the interval, where the measure is an estimate. */
 | "low" | "high"
/** The number being compared against, and the comparison itself. */
 | "whole" | "compared"
/**
 * The two sides of a rate, where recombining it needs them.
 *
 * A rate holds only its quotient, and a quotient does not determine what it
 * was a quotient of. These never reach a result: they are read by the window
 * that climbs and by nothing else.
 */
 | "over" | "under";
/** The column carrying `of` for `measure`. */
export declare function aside(measure: string, of: Aside): string;
/** How many rows the request kept, before anything it could not place. */
export declare const KEPT = "kept__";
/** The rows a request reads, joined to what its cuts are read from, where they are shared. */
export declare const READ = "read__";
/** How many rows have nothing in `column`, under the request's own filters. */
export declare function absent(column: string): string;
/** The ranking a truncation of `dimension` is taken from. */
export declare function ranked(dimension: string): string;
/** Where an attribute shown beside a cut is read from, before it takes its own name. */
export declare function shownBy(name: string): string;
/** How many members `dimension` has, under the request's own filters. */
export declare function members(dimension: string): string;
/**
 * The coarsening of `column` to `grain`, taken beside the column itself.
 *
 * A clock a fact reaches for is truncated where it is dense — in the calendar
 * table, once per date — once per row of the fact after an outer join would put
 * a null in it. So the coarsening arrives as a column of its own, and needs a
 * name that no source can also hold.
 */
export declare function bucketed(column: string, grain: string): string;
/** Whether the compiler added `column` beside the names the request asked for. */
export declare function derived(column: string, asked: readonly string[]): boolean;
