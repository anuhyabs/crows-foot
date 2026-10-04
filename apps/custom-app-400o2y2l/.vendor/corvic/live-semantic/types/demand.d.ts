/**
 * What a fit looked up, and what it did not find.
 *
 * A profile is a measurement, and the expensive half of it prices reductions: what
 * coarsening this clock costs *this* measure, what naming ten of these members accounts
 * for. Measuring all of it is a cube — every rung of every column for every measure — and
 * a page reads a row of that cube: the measure it is drawing, the cuts it is drawing it
 * by, and only when a request does not fit in the room it was given.
 *
 * Reads go through here and record what was missing. The demand is the set of lookups that
 * actually happened: the trace an incremental build takes. A miss reads as nought, which
 * loses a tie and never wins one, so an unpriced ladder yields a rung that is correct and
 * possibly coarser than the best one. It cannot over-spend: how many coordinates a rung
 * costs is measured in the cheap half.
 */
import type { Catalog } from "./catalog";
/**
 * One curve a fit wanted, named by what would measure it.
 *
 * Per column: a curve is monotone by construction — every grain of a clock is measured
 * together and then made non-increasing — so pricing one rung alone would price it against
 * nothing.
 */
export type Demand = 
/** What coarsening this clock keeps, at each grain. */
{
    readonly kind: "clock";
    readonly measure: string;
    readonly of: string;
}
/** What each width of this continuum keeps. */
 | {
    readonly kind: "width";
    readonly measure: string;
    readonly of: string;
}
/** What naming the leading members keeps, and what they account for. */
 | {
    readonly kind: "rank";
    readonly measure: string;
    readonly of: string;
}
/** What grouping this column into that one keeps. */
 | {
    readonly kind: "rollup";
    readonly measure: string;
    readonly of: string;
    readonly into: string;
};
/** The same demand asked twice, so a caller can hold what it has already priced. */
export declare function spellDemand(demand: Demand): string;
/** Run `within`, telling `note` about every curve it wanted and did not have. */
export declare function noted<T>(note: (demand: Demand) => void, within: () => T): T;
/** What coarsening `of` to `grain` keeps of `measure`, or nought if nobody measured it. */
export declare function keptOver(catalog: Catalog, measure: string, of: string, grain: string): number;
/** What reading `of` in bands of `width` keeps of `measure`. */
export declare function keptAt(catalog: Catalog, measure: string, of: string, width: number): number;
/**
 * What keeping `keep` of `of`'s members and gathering the rest keeps of `measure`.
 *
 * Past where the curve was measured its last figure is a floor: keeping more members
 * keeps at least as much.
 */
export declare function keptKeeping(catalog: Catalog, measure: string, of: string, keep: number): number;
/**
 * What grouping `of` into `into` keeps of `measure`, where staying put keeps everything.
 *
 * The identity is not in the profile and does not need measuring: a column rolled up to
 * itself is the same grouping.
 */
export declare function keptInto(catalog: Catalog, measure: string, of: string, into: string): number;
/**
 * What each of `of`'s leaders accounts for of `measure`, cumulatively.
 *
 * The whole curve: a residual is the complement of a point on it, and a share names as
 * many members as it climbs past — both readers look for where it stops rising.
 */
export declare function leadingIn(catalog: Catalog, measure: string, of: string): readonly number[];
