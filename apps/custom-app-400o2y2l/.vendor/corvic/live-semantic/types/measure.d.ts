/**
 * A request for numbers, and the SQL that answers it.
 *
 * Compiling produces a result that arrives with a statement of what it is —
 * measure, unit, aggregation, additivity, grain, filters, and the text that
 * produced it. A number a component received as a bare float can be displayed
 * and nothing else; a number that knows it is a monthly sum of `amount_usd` in
 * USD can be pointed at, described, and re-aimed, which is every operation
 * design mode performs on the data axis.
 *
 * Refusal is a result. A grain change on a non-additive measure is not a
 * rounding difference, it is a different and wrong number, so it is not offered
 * and not compiled.
 */
import { type Additivity, type Aggregation, type Catalog, type Declaration, type MeasureDef, type TimeGrain, type Unit } from "./catalog";
import type { Row, SqlValue } from "./contract";
import { type Bound } from "./sql";
/**
 * A truncation ranked separately inside each member of a cut above it.
 *
 * *Top five regions, and within each the top three accounts.* An answer is
 * readings over coordinates; what changes is **which** coordinates. A cut that
 * cannot vary freely of another is enumerated with it, and a nested
 * truncation is exactly such a cut. Nesting is a parameter on a truncation:
 * where the ranking is taken, globally or within.
 */
export interface Nested {
    readonly keep: number;
    /** The dimension whose members the ranking restarts in. */
    readonly within: string;
}
/**
 * A truncation stated as a share of the whole.
 *
 * *The accounts holding more than a hundredth of the pipeline*, which turns out
 * to be six of 2,303, where *the top eleven* is always eleven. A share can name
 * nobody: no deal of 50,000 holds a hundredth, and the honest answer to
 * *pipeline by deal* is that no deal stands out and a typical one is $17.9K.
 * A count draws eleven bars indistinguishable from the axis beside a residual
 * holding 99.4% — arithmetic that reconciles and answers nothing.
 *
 * A share: a quantile or a fence cannot say *nobody* — a p99 rule names a
 * hundredth of the members by construction, and a Tukey fence built for a
 * symmetric distribution flags a sixth of a log-normal one. What makes a member
 * worth naming is holding a material part of the whole; the threshold is the
 * reader's, offered at a few sizes the way a count is.
 *
 * How many it names is bounded without asking the source: at most `1/share`
 * members can each hold more than `share` of a total they sum to. That lets a
 * room budget marks for a truncation whose size only the query knows.
 */
export interface Standing {
    readonly share: number;
}
/**
 * How a cut is truncated: to a count, to a count per member of another cut, or
 * to those holding a share.
 */
export type Truncation = number | Nested | Standing;
/** Every cut a request truncates, named by the dimension. */
export type Truncations = Readonly<Record<string, Truncation>>;
/** What share a truncation names by, where it is stated as one. */
export declare function shareOf(top: Truncation | undefined): number | undefined;
/**
 * How many a truncation keeps, at most.
 *
 * Exact for a count, and a bound for a share — see `Standing`. A bound answers
 * whether the cut is truncated at all. The ladder needs the number itself and
 * measures it off the profiled leading-share curve, since a bound of a hundred
 * makes every room too small for a threshold of a hundredth.
 */
export declare function keptBy(top: Truncation | undefined): number | undefined;
/** The cut a truncation's ranking restarts in, when it has one. */
export declare function withinOf(top: Truncation | undefined): string | undefined;
/**
 * What a request leaves out of the population, and how many rows that is.
 *
 * Two kinds of absence. A deal with no owner still exists and is still
 * pipeline, so a split by owner that omits it is not a partition of anything,
 * and it gets an `unknown` coordinate. A deal with no close date **has not
 * closed** — it is not at an unknown time, and there is no point on a close-date
 * axis where it belongs. Those rows genuinely leave, and the only honest
 * treatment is to say how many: an omission a figure does not state is
 * indistinguishable from data that was never there.
 *
 * Counted inside the request. A count off the profile is a fact about the
 * Parquet: filter to `Closed Won` and it went on reporting *303 of 480*, which
 * is a confident false number.
 */
export interface Absence {
    readonly alias: string;
    /** The column that is sometimes empty. */
    readonly column: string;
    /** Off an axis it has no place on, or out of an aggregate that skipped it. */
    readonly kind: "axis" | "measure";
    readonly label: string;
}
/**
 * A truncated dimension, and the alias counting how many members it has.
 *
 * Counted so that a residual can say what it stands for. `Other` beside eleven
 * named deals is a mark holding 99.4% of the pipeline, and a reader who cannot
 * tell whether it gathers twelve deals or fifty thousand has been shown a
 * number that reconciles and answers nothing. The count is what turns it from a
 * leftover into a summary.
 *
 * Under the request's own filters, and for the same reason `Absence` is: the
 * profile's count is a fact about the Parquet, and a figure filtered to one
 * region would report the members of all of them.
 */
export interface Population {
    readonly alias: string;
    readonly dimension: string;
    readonly column: string;
}
/** Turn the counted absences into what a figure prints. */
export declare function describeAbsence(absent: readonly Absence[], counts: Row | undefined, measures: number): readonly string[];
/**
 * What a truncation's residual stands for, read off the answer and the count.
 *
 * A residual is a mark like any other and carries a reading like any other, so
 * it reads as one member of the split. What it needs beside its number is its
 * size: *Other* holding 99.4% of the pipeline is a fact about the truncation
 * and not about the domain, and it says something once a reader can see that it
 * gathers 49,989 of 50,000 deals and that a typical one is $17.9K.
 *
 * `typical` only where the measure adds. The mean of a member's reading is the
 * total over the count, and a total is only the sum of its parts for a measure
 * that sums — dividing a median by a member count is arithmetic on a number
 * that was never a sum of anything.
 *
 * Members with a reading, both counts: a declared member that trades nothing
 * gets a mark of nought in a full split and falls into the residual in a
 * truncated one. Counting it would make `typical` the average over a divisor
 * larger than the number of members that contributed — two regions in the
 * residual holding 200 between them, one of which trades, is *typically 200*
 * and not *typically 100*.
 */
export interface Gathered {
    readonly dimension: string;
    /** Members with a reading that the split did not name. */
    readonly members: number;
    /** Members with a reading, the named and the gathered together. */
    readonly measured: number;
    /** What the residual holds, and what one of its members holds on average. */
    readonly reading: number | null;
    readonly typical: number | null;
}
/**
 * Read every residual in an answer, given the population statement's row.
 *
 * Empty where the request truncated nothing, where the count has not arrived,
 * and where nobody fell outside — a truncation keeping more members than the
 * split has produces no residual at all, and a sentence about one would be
 * describing a mark that is not on the page.
 */
export declare function gatheredIn(coverage: Coverage | null, counts: Row | undefined, facts: MeasureFacts | undefined, rows: readonly Row[]): readonly Gathered[];
/** A clock, cut at a size: `event` at `week`. */
export interface TimeCut {
    readonly dimension: string;
    readonly grain: TimeGrain;
}
export type FilterOp = "eq" | "ne" | "in" | "gte" | "lte" | "contains";
/**
 * A restriction, named by the dimension it restricts.
 *
 * This was a string of SQL, and the string is why several things could not be
 * said. Whether a filter narrows a cut's domain, which filters a comparison
 * lifts, and whether a filter is reachable from another source are all
 * questions about *which dimension* a restriction touches, and an opaque
 * predicate has no answer to any of them. Naming the dimension is the whole
 * content of this type; the operators are the small closed set the catalog's
 * kinds can support.
 */
export interface MeasureFilter {
    readonly dimension: string;
    readonly op: FilterOp;
    readonly value: SqlValue | readonly SqlValue[];
}
/**
 * A restriction of a dimension to the members another compiled statement names.
 *
 * It carries SQL, so only a compiler composing statements it compiled makes one, and it is
 * passed beside a request rather than in it.
 */
export interface Seed {
    readonly dimension: string;
    /** A statement of one column, the members. */
    readonly among: Bound;
}
/**
 * Where the second number comes from.
 *
 * One request and a displacement of its population; the displacement names the
 * comparison. Three kinds: `parent` climbs a cut the request is already split
 * by, `prior` steps back along a clock it is already bucketed on, and
 * `unfiltered` removes the filter it already carries. A displacement of
 * something the request does not have is refused.
 */
export type Displacement = 
/** The level containing a cut: its `rollsUpTo`, or the total. */
{
    readonly kind: "parent";
    readonly of: string;
}
/** The coordinate one or more steps earlier on a clock the request cuts by. */
 | {
    readonly kind: "prior";
    readonly of: string;
    readonly steps?: number;
}
/**
 * The same population with the request's own filters lifted.
 *
 * `of` names which ones, so "against all regions, holding stage fixed" is
 * expressible; omitting it lifts every filter, which is the total.
 */
 | {
    readonly kind: "unfiltered";
    readonly of?: readonly string[];
};
/**
 * Two relations, not four.
 *
 * "Percent change" is `ratio` presented as a percentage and "share of total" is
 * `ratio` against `parent` — both compositions. A `difference` keeps the
 * measure's unit and a `ratio` is dimensionless, which decides whether two
 * comparisons may be set side by side.
 */
export interface Comparison {
    readonly against: Displacement;
    readonly as: "difference" | "ratio";
}
/** What a comparison turned out to be, travelling with the number. */
export interface CompareFacts {
    readonly kind: Displacement["kind"];
    readonly as: "difference" | "ratio";
    /** The column holding the compared value. */
    readonly column: string;
    /** How it reads, so a description can name what was compared against what. */
    readonly label: string;
    readonly unit: Unit;
}
/** The suffix a compared value is returned under. */
export interface MeasureRequest {
    readonly measures: readonly string[];
    /** Dimension names to break the result out by. */
    readonly by?: readonly string[];
    /**
     * Clocks to bucket by. Empty means one total over the whole population.
     *
     * Plural, and separate from `by`. Plural because two of them is a cohort —
     * signups by month against activity by month — which a single grain cannot
     * express at all. Separate because "show this by month" is an edit that must
     * reach a chart without also telling it what to be split by, and a patch
     * over one flat list of cuts could only replace them all.
     */
    readonly over?: readonly TimeCut[];
    /** Set a second number beside each one: the same measure, displaced. */
    readonly compare?: Comparison;
    /** Restrictions on the population. Bound, never interpolated. */
    readonly filters?: readonly MeasureFilter[];
    /**
     * How many members of a dimension to keep, ranked by the first measure.
     *
     * The rest are not discarded, they are gathered: the coordinate `Other`
     * holds the measure over everyone who did not make the cut, evaluated from
     * the rows, so it is the right number
     * for a median as well as for a sum. Keeping the residual is what lets a
     * truncated split still be a partition of the population, which every law
     * about the domain depends on and a bare `LIMIT` quietly breaks.
     */
    readonly top?: Truncations;
    /**
     * How wide a piece is, for each dimension being split into them.
     *
     * What `grain` is to a clock: an index that is a continuum is not splittable raw,
     * because one group per distinct reading is a list of rows, and it is splittable once
     * somebody says how wide. So a name in `by` that is a quantity or a place is a refusal
     * unless it has a width here.
     *
     * One number whichever it is, and the dimension says what the number means: on a
     * quantity a width is a band, and on a place it is a cell square in the frame the
     * place declared. Two maps would claim the two are different parameters, when the
     * only difference is how many axes it applies to.
     *
     * Beside `by`, like `top`, because `by` is a flat list of names
     * shared with the categories and a per-cut parameter has nowhere to sit in one. A
     * clock pairs its grain in `over` because a clock is nothing else.
     */
    readonly widths?: Readonly<Record<string, number>>;
    /**
     * Which map to carry a cut along, where several reach it.
     *
     * The column each map reads, since a `Mapping` has no name of its own and the
     * column stays its identity when the model gains another map. A cut several
     * maps reach is refused until one of them is named here, and a request naming
     * a map nothing needs is answered as though it had not.
     */
    readonly via?: readonly string[];
    /**
     * Attributes carried beside an identity cut, never ranged as axes.
     *
     * Each is a dimension of a source whose key some cut in `by` is, reached along the same
     * maps, so one identity names one value and the column adds no coordinate. It is read
     * after the answer is ranked and projected: `top`, the residual and the domain never see
     * it, and a coordinate that is not one member — a residual, a nameless key — shows null.
     */
    readonly show?: readonly string[];
    readonly limit?: number;
}
/** A categorical coordinate produced by the compiler rather than read from a source. */
export type SpecialCoordinate = {
    readonly kind: "member";
    readonly value: string;
} | {
    readonly kind: "unknown";
    readonly value: null;
} | {
    readonly kind: "residual";
    readonly value: null;
};
export type CoordinateKind = SpecialCoordinate["kind"];
/** Whether `cell` is a member, an absent member, or the residual of a truncation. */
export declare function coordinateKind(cell: unknown): CoordinateKind;
/** The source value carried by a member coordinate. */
export declare function coordinateValue(cell: unknown): unknown;
/** Stable identity for a coordinate, including compiler-produced coordinates. */
export declare function coordinateKey(cell: unknown): string;
/** A categorical coordinate as a reader sees it. */
export declare function coordinateLabel(cell: unknown): string;
/**
 * How many ways a result is cut, which is the only thing a component can draw.
 *
 * A card draws one number, or one number over time. A bar chart draws one
 * number across one dimension. Neither can draw both cuts at once — and when a
 * request acquires a second cut, the component does not fail, it silently draws
 * something else: four regions become two hundred bars labelled with four
 * region names. Naming the shape is what lets that be refused instead.
 */
export type Shape = "scalar" | "series" | "breakdown" | "compound";
/**
 * The fewest facts a shape can be drawn or spoken in.
 *
 * A property of the shape and not of any surface, so what a room decides is
 * whether it has this many marks. A surface that instead named the shapes it
 * hosts would be a list to keep in step with every shape that exists.
 */
export declare function leastMarks(shape: Shape): number;
export declare function shapeOf(catalog: Catalog, request: MeasureRequest): Shape;
/** What a number is, travelling with the number. */
export interface MeasureFacts {
    readonly measure: string;
    readonly label: string;
    readonly unit: Unit;
    /** Absent for a rate, which combines two aggregates. */
    readonly agg: Aggregation | undefined;
    readonly additivity: Additivity;
    /**
     * The clocks this was bucketed on, and how each reads.
     *
     * The label is carried, not just the name. A source with two clocks answers
     * "events by week" two ways and the numbers differ, so a description that
     * omits which clock makes the two answers indistinguishable on the page —
     * which is the confusion itself.
     */
    readonly over: readonly (TimeCut & {
        readonly label: string;
    })[];
    readonly by: readonly string[];
    /**
     * The width each cut continuum was split at, where any was.
     *
     * Carried for the reason `over` carries a grain: a coordinate is read at the cut that
     * produced it, and 50,000 off a band of fifty thousand is a bin.
     * A reader given the number alone cannot tell which, and neither can a renderer —
     * which for a place is the difference between a point and the cell it stands for, and
     * so the difference between a dot and a rectangle a renderer has to draw.
     */
    readonly widths: Readonly<Record<string, number>>;
    /**
     * The cut the others were ranked inside, when one of them was nested.
     *
     * The algebra decides this and the grammar has to obey it: leaders chosen
     * within a region are comparable to each other and to nobody else, so the
     * region is the panel. Spread the regions along an axis instead and the
     * chart invites the one comparison the ranking does not support.
     */
    readonly within: string | null;
    readonly compare: CompareFacts | null;
    readonly sql: string;
}
export interface Compiled {
    readonly sql: string;
    readonly params: readonly SqlValue[];
    /**
     * A second statement, one row wide, counting what the request left out.
     *
     * Separate from the answer, so that the
     * result table a chart reads keeps exactly the columns it had. Null when
     * nothing the request touches is ever empty.
     */
    readonly coverage: Coverage | null;
    /** Keyed by measure name; one result may carry several. */
    readonly facts: Readonly<Record<string, MeasureFacts>>;
    /** The column holding the bucket, when the request asked for one. */
    readonly periodColumn: string | null;
}
export interface Coverage {
    readonly sql: string;
    readonly params: readonly SqlValue[];
    readonly absent: readonly Absence[];
    /** The truncated dimensions, so a residual can be read against its whole. */
    readonly populations: readonly Population[];
}
export declare class MeasureError extends Error {
}
/**
 * Compile a request against one source.
 *
 * A request naming something the catalog does not define is an error: the caller
 * asked for a number that has no meaning, and returning nothing would let it
 * render as a blank instead of a mistake.
 */
/**
 * The catalogs a request may draw on, which cannot be derived from any one of
 * them.
 *
 * Two facts sharing an axis need not be related, so neither can discover the
 * other by following anything: `into` reaches a parent and nothing reaches
 * sideways. The set has to be given, which is the whole of what a project buys
 * dbt and the reason a single catalog got us this far and no further.
 */
export type Model = readonly Catalog[];
/**
 * One request, answered from as many sources as its measures live in.
 *
 * Each source is reduced on its own and the answers meet the coordinates. That
 * is what makes the chasm a non-event: two facts joined
 * together would report revenue once per visit, and two answers joined to a
 * shared axis cannot, because each already holds one row per coordinate. The
 * property is structural — a join between relations that are one-to-one on their
 * key is one-to-one — so nothing here has to be careful.
 *
 * `FULL OUTER`, so no coordinate is lost from either side. The same argument as
 * `R110`: a join on the path to an answer must not be able to remove a row.
 *
 * The coordinates have to come from a declared extent when more than one source
 * answers. Otherwise each source's domain is read off its own fact and the two
 * agree only by coincidence — which is exactly the difference between one index
 * object and two whose members happen to coincide, and it is a judgement nothing
 * can measure its way to.
 */
export declare function compileAcross(model: Model, request: MeasureRequest): Compiled;
/**
 * A statement for every way the request's cuts can be reached, each one pinned.
 *
 * One answer where the model is unambiguous, and where it is not, one per
 * combination of maps — because the answers differ and no rule outside the
 * reader's intent picks between them. The pins are in each request's `via`, so a
 * reader can say which of them they meant and ask again for that one alone.
 */
export declare function compileEachRoute(catalog: Catalog, request: MeasureRequest): readonly Compiled[];
/**
 * The one statement answering a request, refusing a request with more than one.
 *
 * A cut that several maps reach is several questions, and this answers one, so
 * such a request is refused until `via` names the map to carry the cut along.
 * {@link compileEachRoute} is the caller who wants them all.
 */
export declare function compile(catalog: Catalog, request: MeasureRequest, seeds?: readonly Seed[]): Compiled;
/**
 * The filters as one condition, for a caller writing its own statement.
 *
 * Exported so that the row-level queries beside the measures restrict their
 * population the same way the measures do. Two spellings of one filter is how
 * a table and the total above it come to disagree.
 */
export declare function whereOf(catalog: Catalog, filters: readonly MeasureFilter[], via?: readonly string[]): Bound | null;
/** How a number reads when design mode says what it is doing to it. */
export declare function describeFacts(facts: MeasureFacts): string;
export declare function aggregate(catalog: Declaration<unknown>, measure: MeasureDef, over?: string): string;
