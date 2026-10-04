/**
 * The widths a measured span can be cut at, and how many pieces each one lays over it.
 *
 * A clock has `TIME_GRAINS`: a fixed ladder, because a month is a month wherever it was
 * measured. Everything else — deal size, probability, latitude over a continent — has its
 * rungs laid over a measured extent. One ladder serves a quantity's bands and a place's
 * cells: the difference is how many axes the width is applied to. The shape of the ladder
 * is fixed (1, 2, 5, and again at the next decade); its rungs are not. That series buys a
 * round edge at every width — 0, 20,000, 40,000 becomes 0, 50,000, 100,000, where a width
 * of `extent / bins` moves every edge and lands on 14,754.
 *
 * It does not buy nesting: 2 does not divide 5, so widening from 20,000 re-cuts the axis
 * at edges a reader can still read. `TIME_GRAINS` makes the same trade — a week divides
 * no month — for the same reason: a ladder of only nesting rungs is 1, 2, 10, 20, which
 * jumps from thirteen bins to three.
 *
 * All of it pure, and none of it about SQL: bins are anchored at multiples of the width,
 * so an edge is a property of the width alone. A new outlier changes how many bins there
 * are and never where one starts.
 */
import type { Extent } from "./profile";
/**
 * The most pieces any page could ask a continuum to be cut into.
 *
 * One fact, wanted in two places that must agree: the profiler prices the rungs of a
 * ladder, and `fit` climbs them. A profiler measuring finer than `fit` can climb pays for
 * readings nobody can use, and a `fit` climbing finer than the profiler measured lands on
 * a rung whose retention reads as nought — a chart refusing a width it would have drawn.
 *
 * The figure is a bound: geometry decides how many marks a surface holds, and this only
 * keeps a ladder from running off either end of what a page could be.
 */
export declare const PIECES = 1000;
/** How many bins a width lays over an extent, anchored at multiples of the width. */
export declare function binsIn(extent: Extent, width: number): number;
/**
 * Decimal places a width needs, so an edge prints as the round number it is.
 *
 * A width off this ladder is exactly one significant figure, so the places it needs are
 * however far below the point that figure sits. Binary cannot hold 0.05 exactly and can
 * hold the nearest double to it, which prints as `0.05` — what needs rounding is the
 * product `floor(x / 0.05) * 0.05`, where the error compounds into a coordinate reading
 * `0.6000000000000001` and an axis with two labels a reader cannot tell apart.
 */
export declare function placesIn(width: number): number;
/**
 * How many pieces a width lays over a span of however many axes.
 *
 * One axis and it is bins, two and it is cells. A cell is square: two widths are two
 * applications of one ladder. A place's grain is one thing — cells three degrees tall
 * and a tenth of one wide would read as a comb.
 */
export declare function piecesIn(extents: readonly Extent[], width: number): number;
/**
 * The widths worth offering over a span, coarsest last.
 *
 * Bounded at both ends by what a mark is: one piece is not a distribution, and a piece
 * narrower than the room a reader has is a comb. `most` is the caller's — how many marks
 * fit is geometry and this module has no idea what it is drawing on. It bounds the pieces,
 * so a place gets rungs by how many cells they lay over it.
 *
 * The widest axis positions the search: what makes a rung an answer is the count, and the
 * widest span is the one that cannot leave an acceptable rung outside the decades looked
 * at. A place stretched across a continent and a degree of latitude gets rungs the wide
 * axis can use; the narrow one holds a single row of cells.
 */
export declare function widthsOver(extents: readonly Extent[], most: number): readonly number[];
/**
 * The next width up, or null where the span is already one piece.
 *
 * What `fit` climbs: the ladder is a function of the extents — the rung above 20,000 is
 * 50,000 for deal size, and 0.5 for a probability.
 */
export declare function widenedFrom(extents: readonly Extent[], width: number, most: number): number | null;
