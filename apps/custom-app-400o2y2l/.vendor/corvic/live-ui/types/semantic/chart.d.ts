/**
 * What a renderer can draw, said where the drawing is.
 *
 * Each renderer declares its own signature, once, beside itself. A page picks a
 * chart and that signature is what `fit` projects the request onto — see
 * `grammar.ts`. The signature is slots: which axis is the clock, and which kinds
 * each slot accepts.
 */
import type { Axis, Catalog, CoordinateKind, MeasureRequest, Sig, Unit } from "@corvic/live-semantic";
import type { ReactNode } from "react";
import type { Box } from "./surface";
/** One coordinate of an answer and its reading, already labelled for a reader. */
export interface Point {
    /**
     * What this point is a reading at, as a string that is one per coordinate.
     *
     * Identity, where `label` is presentation. Two coordinates can differ and print
     * the same, and a label fallback when a coordinate cannot be read is lossy.
     * Renderers key their marks by this, so distinct coordinates draw distinct marks.
     */
    readonly coordinate: string;
    /** Whether this is a source member or a coordinate introduced by the compiler. */
    readonly kind?: CoordinateKind;
    /** What a reader sees, which may be shared and may be an em dash. */
    readonly label: string;
    /**
     * Null where no reading is supported here and no prior reached it.
     *
     * Zero is a reading: a latency of zero on a day the timer was down is a claim
     * that requests were instant.
     */
    readonly value: number | null;
    /**
     * What share of this was read here, the rest being worked out or carried.
     *
     * A renderer must tell a reading from a guess. A total's parts can be read
     * separately: a stock over sixty-four offices recounted a few at a time is
     * partly carried everywhere. A mark is drawn as worked out at nought — nothing
     * here was read — and the figure says the share; ink cannot carry a fraction a
     * reader could read back off it.
     *
     * Absent where the measure is never worked out, which is every flow.
     */
    readonly read?: number;
    /**
     * How many readings this point stands on.
     *
     * A prior belongs to a measure and a sample belongs to a coordinate; what is
     * drawn is the two together. A point held up by four readings and one held up
     * by four thousand are different marks.
     */
    readonly sample?: number;
    /**
     * How far the reading could be from what it estimates, where that is
     * answerable.
     *
     * Absent on a census. Every deal in the pipeline was counted, so the total has
     * no sampling error; a band drawn around it would claim a kind of doubt the
     * number does not have.
     */
    readonly low?: number | null;
    readonly high?: number | null;
    /**
     * Where this point is, when its coordinate is a member that something located.
     *
     * The member stays the coordinate and the position rides along, as the request
     * stated it: two offices at one address are two marks. Absent on every other
     * axis, and absent on a map of cells — a cell's position is its coordinate.
     */
    readonly at?: readonly [north: number, east: number];
}
/**
 * One run of coordinates that share a scale, and what tells it from the others.
 *
 * A scalar is one trace of one point, a series is one trace, a breakdown is one
 * trace, and a compound is one trace per member of its second cut. Two measures
 * on one clock are also two traces: what makes a second line is sometimes another
 * member and sometimes another measure. The unit is per trace — that is the level
 * at which two numbers stop belonging on one axis.
 */
export interface Trace {
    /** Absent when it is the only one, and there is nothing to tell it from. */
    readonly name?: string;
    /** Identity of `name`, where its presentation is not unique. */
    readonly coordinate?: string;
    /** Whether `coordinate` is a source member or a coordinate introduced by the compiler. */
    readonly kind?: CoordinateKind;
    readonly unit: Unit;
    readonly points: readonly Point[];
}
/**
 * The interval a drawing covers, in the unit of the readings in it.
 *
 * Both ends are needed and neither is the data's. `hi` is the largest reading or
 * nought, whichever is greater, and `lo` the smallest or nought — a length is read
 * against a baseline, and a reader takes that baseline to be nought. A chart of
 * three losses whose bars all reach the right-hand edge claims the smallest loss
 * is nothing.
 */
export interface Extent {
    readonly lo: number;
    readonly hi: number;
}
/** What a panel cannot decide alone, decided for it. */
export interface Beside {
    /**
     * The interval every panel draws into, containing nought and every reading in any
     * of them.
     *
     * Both ends: a reading below nought is a negative fraction of a ceiling-only
     * scale, which a length channel clamps to a hairline and a position channel draws
     * outside the box.
     */
    readonly extent: Extent;
    /** Every member across every panel, so a colour means the same thing in each. */
    readonly order: readonly string[];
}
export interface ChartProps {
    readonly traces: readonly Trace[];
    readonly caption: string;
    /**
     * What the points are coordinates of, so a renderer can lay them out.
     *
     * Absent for a scalar, which has no axis and nothing to order. Present
     * otherwise because layout is a property of the kind on the axis: sorting by
     * reading is right for accounts, meaningless for a clock, and destroys a
     * funnel.
     */
    readonly axis?: Axis;
    /**
     * What this panel shares with the ones beside it, when it is one of several.
     *
     * Absent for a chart drawn alone, which decides everything for itself.
     *
     * Small multiples agree about two things a reader compares across them. A
     * scale: twelve charts each normalised to its own largest bar all look alike.
     * A colour: ranking rows inside one panel and colouring by position says
     * *biggest here*, which reads as identity the moment there is a panel next
     * door. Both are decided outside one panel.
     */
    readonly beside?: Beside;
    /**
     * Whether a trace's name and a point's coordinate, spelled alike, are one member.
     *
     * The answer says what it is a reading at; what index those readings range over is
     * the catalog's to know. Two cuts of an edge source's endpoints land somewhere, and
     * where they land decides whether the reader is looking at one set related to itself
     * or at two sets related to each other.
     *
     * Absent means they are not: merging two members into one mark invents a thing the
     * population does not contain.
     */
    readonly folds?: boolean;
}
/**
 * How much a renderer can put in each of its two channels, in a given box.
 *
 * `along` is the axis: bars down a table, columns across a plot, vertices on a
 * line. `apart` is what the renderer can keep separate at each of those places
 * — traces, and so measures and comparisons too. Colour does not get roomier
 * when the box does; the two channels are independent counts.
 */
export interface Channels {
    readonly along: number;
    readonly apart: number;
    /**
     * How many incommensurable quantities it can put on separate scales.
     *
     * Room and colour are about how much a reader can take in; this is about
     * whether the drawing would be true. Dollars and a count on one axis assert
     * a comparison that does not exist.
     *
     * One for anything with an axis. Two for a line chart. Prose has no scale at
     * all and so has no limit: a sentence may say `$62M across 177 accounts`
     * without claiming they are comparable.
     */
    readonly scales: number;
}
/**
 * How a mark says a reading, which is what decides whether nought is in the scale.
 *
 * A `magnitude` is read as a ratio — a length, an area, a shading — so its baseline is
 * nought: a bar drawn from 12,201 to 12,516 is a bar of 315 wearing the label 12,516.
 *
 * A `value` is read as a position against the readings beside it, so the scale spans them
 * and states where it starts: a stock that moves by a fortieth of itself is otherwise a
 * flat line along the ceiling.
 *
 * `text` prints the number: a scale of no marks.
 */
export type Encodes = "magnitude" | "value" | "text";
/** A renderer together with its signature. */
export interface Chart {
    (props: ChartProps): ReactNode;
    readonly sig: Sig;
    /** What a reading is drawn *with* here. See {@link Encodes}. */
    readonly encodes: Encodes;
    /**
     * What this can draw legibly in a box.
     *
     * A budget in pixels: a bar costs a labelled row of height and a column costs a
     * few pixels of width, so the same box holds forty of one and three hundred of
     * the other. A colour channel gives out at about eight whatever room is left —
     * the same kind of fact as a minimum bar height, measured on a reader.
     *
     * `apart` is how many the caller needs kept separate. For a colour the two
     * channels are independent; for a renderer that tiles they trade: twelve panels
     * across a box leave each panel a twelfth of the width.
     */
    capacity(box: Box, apart: number): Channels;
    /**
     * Whether the request's coordinates are what this drawing would say they are.
     *
     * A signature is about kinds. A drawing whose marks claim something about the cuts
     * themselves — a line saying *these two are related* — reads that off the catalog;
     * no arrangement of slots states it.
     *
     * Absent where the slots say everything: drawings about the coordinates they were
     * handed.
     */
    admits?(catalog: Catalog, request: MeasureRequest): boolean;
    /**
     * How many links this draws legibly, where its marks are the pairs of two cuts.
     *
     * See `Accepts.edges`: `fit` turns a link budget into a member count using the
     * source's own density, because how many lines a number of nodes comes to is a
     * fact about the relation and not about the box.
     *
     * Absent for every drawing whose marks are coordinates rather than pairs.
     */
    readonly edges?: number;
    /**
     * What a colour stands for here, so a legend can be right.
     *
     * Only the renderer knows: small multiples name their panels in the panels and
     * colour their bars by member.
     */
    readonly colours: "traces" | "points" | "none";
}
