/**
 * Projecting a request onto what its destination will accept.
 *
 * One operation with several names. Narrowing a broad edit is this, where the
 * destination is a component and the thing it will not accept is a shape it
 * cannot draw. Reducing a page for a smaller surface is this, where the
 * destination is a medium and the thing it will not accept is a number of
 * facts. A pivot is a person doing it by hand, in either direction.
 *
 * The ladder is monotone toward safety for a flow: every rung sheds facts and
 * every request is compiled fresh from the source, so coarsening toward the
 * total only removes the non-additive series the catalog already refuses.
 *
 * It is not monotone for a level. Coarsening a grain merges periods, and a stock
 * summed over the periods it was counted in is a wrong number the finer request
 * did not have — so a rung here can reach an answer that needs a different
 * aggregation. Nothing below consults additivity, which is only correct once
 * `compile` aggregates a semi-additive measure along time as a level; until then
 * see the failing law in `measure.test.ts`.
 */
import type { Catalog } from "./catalog";
import { type Sig } from "./grammar";
import { type MeasureRequest, type Truncation } from "./measure";
import { type StepFrom } from "./step";
/**
 * What a destination will take: which axes, and how many facts in each channel.
 *
 * Two numbers: the two channels run out for unrelated reasons and a product
 * cannot say so. A line chart in a slide has room for a hundred and sixty points
 * and for eight lines; multiplied that is a budget of thirteen hundred, which a
 * hundred and seventy-seven accounts over six months fits inside — and it drew a
 * hundred and seventy-seven lines. Colour does not get roomier when the box does.
 *
 * `along` is the axis and `apart` is what the second channel keeps separate,
 * which is the second cut together with every measure and any comparison: those
 * are all series in the same channel, and a renderer that can hold one of them
 * cannot hold three by calling them different things.
 */
export interface Accepts {
    /**
     * The slots the destination has, which is what it can hold at all.
     *
     * Separate from the three numbers below and prior to them, because they
     * answer different questions. A signature says whether the drawing would
     * *mean* what the request asks — a clock in a slot that takes categories is
     * wrong at any size — and the numbers say whether it would fit. No amount
     * of room fixes the first and no reduction of the request fixes it either,
     * which is why a mismatch here is a refusal and not a rung.
     */
    readonly sig: Sig;
    readonly along: number;
    readonly apart: number;
    readonly scales: number;
    /**
     * The fewest ranked members a truncation must keep to be worth handing here.
     *
     * `LEAST_RANK` for anything that draws, and the default: a chart whose two marks
     * are the leader and everybody else says no more than the total it replaced.
     *
     * One for prose, which names the leader and never renders the residual at all —
     * there the ranking *is* the sentence, so keeping a single member is the whole
     * appetite. The judgement belongs to the
     * destination because it is about what the destination does with the answer, and
     * a constant that suits charts silently refuses every sentence.
     */
    readonly ranked?: number;
    /**
     * Room along the axis when `apart` of them are kept separate.
     *
     * Absent for every renderer that overlays, which is all of them but one:
     * eight lines fit in the width one line fits in, so `along` does not depend
     * on `apart` and the two channels are independent. A renderer that tiles is
     * the exception — twelve panels across a box leave each a twelfth of it —
     * and the model would be lying if it could not say so.
     */
    readonly trading?: (apart: number) => number;
    /**
     * How many links the destination can draw, where its marks are the pairs.
     *
     * A drawing of a relation runs out of room in a unit its channels cannot
     * count. Two channels of twenty nodes are four hundred possible lines
     * between them, and whether that is a graph or a smear is a fact about the
     * data: the same twenty a side is legible at three links each and illegible
     * at twenty. So a destination that draws pairs says how many pairs it draws,
     * and how many members that leaves room for is measured off the profile —
     * see `linked`.
     *
     * Absent for every destination whose marks are coordinates rather than pairs,
     * which is all of them but the graph.
     */
    readonly edges?: number;
}
export interface Fitted {
    readonly request: MeasureRequest;
    /** What was given up to make it fit, in the words a caller can print. */
    readonly gave: readonly string[];
}
/** A nested `top` that leaves its `keep` to an edge budget. */
export interface UnkeptNestedTop {
    readonly within: string;
}
export type FittableMeasureRequest = Omit<MeasureRequest, "top"> & {
    readonly top?: Readonly<Record<string, Truncation | UnkeptNestedTop>>;
};
/**
 * The most informative version of `request` the destination will accept, and
 * the least of those when several are equally informative.
 *
 * The first rung that fits, and the rungs are ordered by what they cost. There
 * is no second rule preferring a cheaper rung that loses as little, and the
 * two reasons it was tried and dropped are worth keeping:
 *
 * **Whether to reduce is a question about pixels.** A request the destination
 * accepts comes back as asked, even where a coarser grain carries the same
 * signal for fewer marks. Retention decides *what* to give up once room has run
 * out; a hundred and fifty-seven columns that fit are a claim about how wide a
 * column can be, and belong to `capacity`. Spending the measurement on a
 * request nobody refused is second-guessing the author with a statistic.
 *
 * **An insignificant difference is still an answer.** The four regions hold
 * pipeline within noise of each other, which the profile now measures
 * correctly, and four equal bars say *these are the same* where a total cannot.
 * A rule reading equal retention as permission to drop the cut would answer a
 * question nobody asked. Ties therefore go to the finer rung: retention of one
 * usually means *below the noise floor*, and the humble
 * reading of a tie is to keep what was asked for.
 *
 * `subject` is the request the component asked for before anything was done to
 * it, and marks the cuts that are the point. A chart of
 * pipeline by region asked for the region split; if something later adds a time
 * grain and the result no longer fits, the grain goes and the split stays. Two
 * cuts are always droppable in some order and only the caller knows which one
 * was the subject, so it says.
 *
 * Null means nothing fits, which is a refusal.
 */
export declare function fit(catalog: Catalog, request: MeasureRequest, accepts: Accepts, subject?: MeasureRequest): Fitted | null;
/** Fit one bounded step to a destination's total link budget. */
export declare function fitEdges(catalog: Catalog, request: FittableMeasureRequest, edges: number): Fitted | null;
/** Fit several bounded steps to disjoint shares of one link budget. */
export declare function fitSteps(catalogs: readonly Catalog[], requests: readonly FittableMeasureRequest[], edges: number): readonly Fitted[];
/**
 * Fit one bounded step per edge source sharing a destination's link budget.
 */
export declare function steps(catalogs: readonly Catalog[], from: StepFrom, accepts: Accepts): readonly Fitted[];
/**
 * How many facts a request would put on the page, before running it.
 *
 * This is the size of the request's domain: the set of coordinates the answer
 * covers, one product over every cut whether it is a clock or a category.
 */
export declare function marksOf(catalog: Catalog, request: MeasureRequest): number;
/**
 * What a request costs, said per channel.
 *
 * The axis takes the first cut and everything else is a series: the second cut,
 * each measure, and a comparison, which are three ways of drawing another line
 * and one channel to draw them in.
 */
export declare function demandOf(catalog: Catalog, request: MeasureRequest): {
    readonly along: number;
    readonly apart: number;
    readonly scales: number;
};
export declare function accepted(catalog: Catalog, request: MeasureRequest, accepts: Accepts): boolean;
