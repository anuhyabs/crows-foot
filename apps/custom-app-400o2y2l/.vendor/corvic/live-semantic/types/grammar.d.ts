/**
 * What a renderer can hold, said in slots.
 *
 * A slot is one place a renderer will put an axis, and it says which kinds go
 * there, how many at once, and whether the drawing means anything with it
 * empty. A signature is the slots. Binding a request against a signature either
 * finds a home for every axis or names what went wrong: a scalar is the empty
 * binding.
 *
 * Arity alone is not a signature: it cannot say which axis is which, so a line
 * chart that meant *a clock, and optionally a series per member* spelled as
 * `series | compound` also accepted a nominal cut crossed with a nominal cut.
 *
 * The visual language falls out here too. Whether a bar chart sorts by size or
 * by the order the dimension declares is a property of the kind bound to the
 * axis, so `ordering` is a total function of one and every renderer gets the
 * same answer.
 */
import type { Catalog, DimensionDef, Kind } from "./catalog";
import { type MeasureRequest } from "./measure";
/** One place a renderer will put an axis. */
export interface Slot {
    readonly name: string;
    readonly accepts: readonly Kind[];
    /**
     * How many axes it will take at once.
     *
     * More than one is a slot that stacks: a panel row taking two nominal cuts
     * is a grid, and nothing here does that yet.
     */
    readonly arity: number;
    /**
     * Whether the drawing means nothing with this empty.
     *
     * How a chart refuses a scalar, and the honest form of the guard that was
     * `accepts: ["breakdown"]`. A bar chart with no axis is not a small bar
     * chart, it is a number with a rectangle drawn next to it. A card is the
     * other case: its sparkline slot is real and empty is fine, because a card
     * with no clock is a card.
     */
    readonly required: boolean;
    /**
     * Whether marks in this slot are read as parts of one whole.
     *
     * A stack claims its segments sum, so the measure bound across it has to be
     * one that sums — `G3`, and the reason this is a property of the slot
     * of the measure: the same chart can compose along one axis
     * and merely separate along another.
     */
    readonly composes: boolean;
    /**
     * Whether a mark here covers the piece its coordinate names, or sits at a point in it.
     *
     * The same kind of claim as `composes` and the second one a slot makes about the
     * measure. A column covers its month, so it says *over this month, this*, and a
     * reading that is not a property of an interval must not be drawn that way: a
     * headcount is taken on a day, and twenty-two columns give a day's count a month's
     * width each. A vertex claims nothing but its coordinate, which is why a stock is
     * drawn as a line everywhere it is drawn well.
     *
     * It is also what makes the picture legible. A run of
     * carried readings is one flat stretch to a line and a filled mark per period to a
     * column, so the ink a level costs goes with the number of periods, not with
     * the number of readings — twenty hatched columns to say nobody recounted.
     */
    readonly fills: boolean;
}
/** What a renderer accepts: its slots, and nothing else. */
export type Sig = readonly Slot[];
/**
 * One axis of a request, with what the catalog says it is.
 *
 * The carrier the grammar was missing. A renderer that has this needs no rule
 * of its own about ordering, about labels, or about whether the gaps between
 * its marks mean anything.
 */
export interface Axis {
    readonly dimension: string;
    readonly kind: Kind;
    /** Its members in declared order, where the kind is `ordinal`. */
    readonly order: readonly string[] | undefined;
    /**
     * How wide one coordinate is, where the kind is a continuum cut into pieces.
     *
     * `order` for the other end of the vocabulary: a layout a renderer cannot derive from
     * the coordinates it was handed. A bar's width is the slot's and a band needs nothing
     * said, but a cell is a rectangle whose size is the reader's evidence of how coarse the
     * map is, and two occupied cells with a gap between them do not say how wide either is.
     */
    readonly width: number | undefined;
    /**
     * The frame the coordinates are read in, where the kind is `geo`.
     *
     * A pair of numbers is not a position until something says what they measure from:
     * `-122` is a longitude under `EPSG:4326` and 122 metres west of nothing under a
     * national grid, and a renderer that guessed would put a coastline under numbers that
     * were never degrees. Carried on the axis,
     * because the catalog is the semantic layer's to read and a drawing's input is the
     * answer plus the shape of it.
     */
    readonly crs: string | undefined;
}
export declare function axisOf(catalog: Catalog, dimension: string, width?: number, at?: DimensionDef): Axis;
/**
 * Where a cut's members are, when another cut in the same request says.
 *
 * The other half of `determines` pointed at position. A key fixes everything else about its
 * row, so a request for offices and where they are is a request for one coordinate with a
 * position attached — not a plane crossed with the offices on it, and not a second series
 * with one member per office. Which makes the located axis a different *kind*,
 * the same kind with an extra column, because what a renderer may do with it changed: a
 * mark can go where its member is.
 *
 * Untruncated is enforced upstream, in the compiler: a residual stands for members from
 * everywhere and has no one position, so a truncated key does not determine a place and
 * this finds nothing to place.
 */
/**
 * The place a dimension could be shown at, which is what a request may ask for beside it.
 *
 * `locating` asked of the whole catalog: what a reader may still
 * ask, where the other says what they already did. Two functions because the two answers
 * differ for the same catalog — a page offering a control needs the first and a renderer
 * reading an answer needs the second, and one of them taking the request would have to be
 * handed a fake one.
 */
export declare function placing(catalog: Catalog, dimension: string): DimensionDef | undefined;
export declare function locating(catalog: Catalog, cuts: readonly string[], dimension: string): DimensionDef | undefined;
/**
 * What a request varies over, in the order it asked.
 *
 * Cuts that cannot vary separately are one axis: a detail row is a key and its
 * attributes, and counting them separately is what made a labelled list look
 * like a cube. `ranging` is the algebra's answer to that and the grammar reads
 * the same one, because there is only one question being asked.
 */
export declare function axesOf(catalog: Catalog, request: MeasureRequest): readonly Axis[];
/** An axis, and where it went. */
export interface Placed extends Axis {
    readonly slot: string;
}
/**
 * A witness that a signature can hold a request: every axis, somewhere.
 *
 * Empty for a scalar, which is a binding and not a failure to have one — the
 * distinction `Shape` spent a constructor on.
 */
export type Bind = readonly Placed[];
/**
 * Why a signature cannot hold a request, in the terms of the thing that failed.
 *
 * A cause. The message a reader sees is one rendering of
 * this and not the only one: the same value tells design mode which axis to
 * offer to remove, and a sentence cannot be asked that.
 */
export type Mismatch = {
    /** No slot with room takes this kind. */
    readonly cause: "unbound";
    readonly dimension: string;
    readonly kind: Kind;
} | {
    /** A slot the drawing needs, with nothing that can go in it. */
    readonly cause: "empty";
    readonly slot: string;
    readonly accepts: readonly Kind[];
} | {
    /** A mark covering an interval of time, and a reading taken at an instant. */
    readonly cause: "filled";
    readonly slot: string;
    readonly measure: string;
    readonly dimension: string;
} | {
    /** A mark whose parts sum, and a reading whose parts do not. */
    readonly cause: "composed";
    readonly slot: string;
    readonly measure: string;
    readonly dimension: string;
};
export declare function bound(against: Bind | Mismatch): against is Bind;
/**
 * Where each of a request's axes goes in a signature, or why one cannot.
 *
 * Searched: a slot's kinds
 * decide what may go in it and a greedy pass gets `faceted(bars)` wrong: two
 * nominal cuts and two slots that both take nominal have an assignment, and
 * which one is found first depends on the order the axes arrived in.
 */
export declare function bind(catalog: Catalog, request: MeasureRequest, sig: Sig): Bind | Mismatch;
/**
 * How a kind's coordinates are laid out, which is not the renderer's to decide.
 *
 * `ranked` is informative and was applied to everything: a bar chart sorted its
 * rows by reading, which is right for accounts and destroys a funnel. `given`
 * is a clock, where the query's order is the only order and re-sorting it draws
 * a line through time backwards. `declared` is the case that had nowhere to
 * live, because there was no `ordinal` for it to be the layout of.
 *
 * `none` is the case a `default` had been swallowing. A layout in one dimension
 * is a total order on the coordinates, so an index carrying no total order has
 * no such layout — not an unspecified one, and not the query's. Saying `given`
 * for geography named a permutation of latitudes as though reading them in
 * arrival order were a map.
 */
export type Ordering = "declared" | "ranked" | "given" | "none";
/**
 * The layout a kind's structure admits, for every kind there is.
 *
 * Exhaustive, so a new kind is a type error here instead
 * of silently inheriting the layout of a clock.
 */
export declare function ordering(kind: Kind): Ordering;
/**
 * Coordinates in the order an axis reads them, given how each one measured.
 *
 * The whole of what `ordering` buys, in one place so that two renderers cannot
 * disagree about it. `weight` is how the caller gets its own marks ranked
 * without this having to know what a mark is.
 *
 * Total on every axis a slot can hold, and undefined on the one it cannot: an
 * index with no total order has no sequence to be put in, so being asked for
 * one is a signature that accepted a kind it has no layout for. Refusing here
 * is how that stays a bug in the signature,
 * page.
 */
export declare function laidOut<T>(items: readonly T[], axis: Axis, label: (item: T) => string, weight: (item: T) => number): readonly T[];
