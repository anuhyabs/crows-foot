/**
 * The coordinates a request ranges over, and how one the answer never reached
 * gets a value.
 *
 * The half of a compiled request that belongs to no source. An index set exists
 * on its own — a day nothing happened on is a day, a region that sold nothing is
 * a region — so the domain is built from the objects a request names and each
 * source's aggregate is projected onto it. That is also what makes two facts
 * answerable on one axis: they never meet each other, they each meet the domain.
 */
import type { Catalog, Enumeration, Place, Prior, TimeGrain } from "./catalog";
import { type Bound, type Restriction } from "./sql";
/**
 * What a comparison moved out of the cut, as the domain needs to see it.
 *
 * Narrower than the comparison machinery's own view of itself: the domain reads
 * two fields, and depending on the whole of it would make the index sets depend
 * on the arithmetic done over them. Wrong direction, and a cycle.
 */
export interface Climbed {
    readonly climbedFrom: string | null;
    readonly grouped: readonly Grouped[];
}
/** A column the result is grouped by, kept as an expression a window can reuse. */
export interface Grouped {
    readonly expr: string;
    readonly dimension: string;
    /** The authored column where `expr` is a direct column reference. */
    readonly column?: string;
}
/** A grouping the request asked for, with what it takes to enumerate its coordinates. */
export interface Cut extends Grouped {
    /** What the declaration calls it, which is what an extent's `beside` is keyed by. */
    readonly column: string;
    /**
     * What SQL calls it here, which is the same thing unless it was pulled.
     *
     * A pulled column arrives renamed, scoped to the parent it came from, because two
     * parents may hold a column of one name — which is what a self edge is. The two
     * spellings are separate because they answer different questions: one is what a
     * declaration said, the other is what is in scope.
     */
    readonly read: string;
    /** The parent it was pulled from, or null where it is this source's own. */
    readonly from: string | null;
    readonly grain: TimeGrain | null;
    /**
     * How wide a bin is, where it is a quantity split into them.
     *
     * `grain`'s counterpart, and it does the same job here: it says the coordinates are
     * generated. A bin nothing falls in is a coordinate for the same
     * reason a day nothing happened on is one — the gap in a distribution is the shape of
     * it — and a domain read with `SELECT DISTINCT` cannot produce a bin no row reaches.
     */
    readonly width: number | null;
    /**
     * Where its two readings are, when the coordinate is a cell of the plane.
     *
     * Beside `width`, because it is what says the coordinates
     * are observed after all. A generated domain exists to make a *gap* a coordinate — the
     * day nothing happened, the bin nothing fell in — and a gap is a hole in an order. A
     * place has none, which `ordering` already says, so there is no between for a missing
     * cell to be in and an unoccupied square is an area. Generating
     * them would cross the extent with itself to draw a grid over the sea.
     */
    readonly place: Place | null;
    /**
     * The span the source holding it claims to have watched, carried like `extent`.
     *
     * A warehouse keeps its calendar in a table of its own, so the source that says
     * what a clock covers need not be the source being compiled. Looking it up here
     * by column would find the fact's claim about a column the fact does not have.
     */
    readonly span: {
        readonly from: string;
        readonly to: string;
    } | undefined;
    /**
     * Whether rows can reach it with no member at all.
     *
     * A coordinate of its own, and for a clock one the grain cannot generate: a
     * sale with no date is not late or early, it is nowhere on the line. So the
     * generated series is short exactly one point, and without it those rows have
     * nothing to join to and leave with their money.
     */
    readonly unnamed: boolean;
    /**
     * The index set its members are declared in, carried.
     *
     * Carried because a cut is not always the compiled source's to name: a fact
     * cut by an attribute of a source it maps into holds neither the dimension nor
     * its extent, and a lookup by name here would silently find nothing and read
     * the fact instead — which is `R110`'s deflation arriving by a different door.
     */
    readonly extent: Enumeration | undefined;
    /**
     * How many members it kept, where it was truncated.
     *
     * Carried beside the expression that already encodes it, because a
     * truncated cut determines nothing: its residual is one coordinate holding
     * members from every parent, and the domain has to know that before it can
     * decide which cuts to enumerate together.
     */
    readonly keep: number | undefined;
    /** The cut its ranking restarts in, when it is a nested truncation. */
    readonly within: string | undefined;
    /**
     * The map it is an end of a link along, or null where it is not one: an entity a row of
     * this source maps out to, named by its key, whether this source declares the column or
     * pulls the key along the map.
     */
    readonly end: string | null;
}
/**
 * The end of a link each filter selects links by, keyed by the filter's dimension.
 *
 * A filter naming an attribute of what a link touches, reached along the map to it. One
 * on the link's own columns selects by no end, and is absent.
 */
export type Seeding = Readonly<Record<string, string>>;
/**
 * The coordinates the request ranges over: a product across its cuts, except
 * where two of them cannot vary separately.
 *
 * Cuts that determine one another are enumerated together, as the pairs that
 * occur, and the groups cross. Crossing them all would fill a chart split by
 * city and by region with forty-eight coordinates no row can reach — Toronto in
 * APAC, at zero, drawn as an answer. `membersOf` has always done this for the
 * one parent a climbed cut carries; this is that, for every cut that has one.
 *
 * Null when nothing is cut: a single number is its own domain.
 */
export declare function domainOf(catalog: Catalog, from: string, cut: readonly Cut[], filters: readonly Restriction[], displaced: Climbed, seeding?: Seeding): Bound | null;
/**
 * An end of a link: the column here, and the source its members are enumerated in.
 *
 * Both halves, because two questions turn on this and neither answers the other. Whether
 * a pair of coordinates *is* a link is the column: cut at two endpoints and each row is
 * one pair. Whether a name on both sides is one thing or two is the source: two ends
 * landing in one index fold together, and two ends landing in different ones never do,
 * however alike the names read.
 */
export interface Endpoint {
    readonly column: string;
    readonly source: string;
}
/**
 * The columns a source maps out through, whose pairs are observed.
 *
 * Cut at two of them at once and the coordinates are the pairs a row of this source
 * *is* — which is the same rule as Toronto in APAC, arriving by the other door. An
 * account and a rep with no deal between them is not a pair with nought in it: the
 * product of two endpoint index sets is the relationships there could be, and no row
 * says any of them happened. So crossing them would draw a complete graph, and every
 * cell of it would look like an answer.
 *
 * Exported because it is also the question *is this request an adjacency*, which a
 * drawing of a graph has to ask before it lays one out. Same notion, so the same
 * function: two readings of which columns are endpoints could disagree, and the one
 * that decided what to draw would be the one nobody had tested against a corpus.
 */
export declare function endpoints(catalog: Catalog): readonly Endpoint[];
/**
 * Where a coordinate the answer does not cover gets its value.
 *
 * The prior says which of these it is; this only writes it down. Two of the
 * four read other coordinates to do it, and those are the ones a reader has to
 * be told about — see `INFERRED`.
 */
export declare function under(prior: Prior, column: string, ordered: Ordering | null, covered: string | null): string;
/**
 * Where this request's coordinates fall inside what the source covers.
 *
 * Null when nothing bounds them, which is both the case where no span is declared
 * and the case where every cut is a category — a category is covered by having
 * been looked at, and every row was.
 *
 * Written against the coordinate: that is what a
 * fill reads: by the time a prior runs, the rows are gone and a day is whatever
 * the bucket made of it. Which is also the one inexactness here — a coordinate
 * coarser than the span's ends straddles them, and a month whose first day is
 * outside the span counts as uncovered even where most of it is inside. It costs
 * a fill and never a reading, since `under` only consults this where a coordinate
 * has none: a straddling bucket with rows keeps them and a straddling bucket
 * without says nothing, which is the truthful half of the
 * error to make.
 *
 * Spelled by the caller, because a coordinate is `day` where the answer stands
 * alone and `domain.day` where it has been projected onto one, and both spellings
 * name the same column.
 */
export declare function covering(cut: readonly Pick<Cut, "dimension" | "span">[], held?: (name: string) => string): string | null;
/** The order a neighbour-reading prior reads along, and the series it stays inside. */
export interface Ordering {
    readonly by: string;
    readonly within: string;
}
/**
 * The priors that invent a reading from other readings.
 *
 * `nothing` is not one of them. A flow of zero where no events happened is not
 * a guess about the missing rows, it is what their absence means, and marking
 * every gap in every bar chart would spend the reader's attention saying so.
 * These two are different: they put a number on the chart that no row supports,
 * and a drawn point that looks measured and is not is the same defect as an
 * omission a figure does not state.
 */
export declare const INFERRED: readonly Prior[];
