/**
 * Numbers a component can be re-aimed at.
 *
 * A component that asks `@corvic/live-semantic` for a named measure holds a
 * request, and a request is a thing an edit can rewrite — "show this monthly" is
 * a change of state.
 *
 * The override store is the seam design mode writes through. It is outside
 * React: an edit arrives from an overlay that is not in the tree, may be
 * reverted the moment a pointer leaves a menu item, and must reach every
 * component displaying the measure when its breadth says so.
 */
import type { DataClient, Row } from "@corvic/live";
import type { Catalog } from "@corvic/live-semantic";
import { type Accepts, type Gathered, type MeasureFacts, type MeasureRequest, type Sig } from "@corvic/live-semantic";
import { type DataLoad } from "../use-query";
import type { Channels } from "./chart";
import { type Box, type Reading } from "./surface";
/**
 * Rows and the statement of what they are, kept together.
 *
 * They have to arrive as one value. A load keeps the previous rows on screen
 * while the next query runs, but the request has already moved on — so facts
 * read from the pending request describe data that is not there yet. A city
 * split rolled up to regions draws sixteen city rows labelled with a region
 * column none of them have.
 */
interface Answered {
    /**
     * The statement these rows answer, which is what makes them these rows.
     *
     * An answer arrives after the request that asked for it, so a reader who moves
     * a figure has, for one paint, the previous rows beside the renderer the new
     * request chose. Carrying the statement makes *stale* a fact about the answer.
     */
    readonly of: string;
    readonly rows: readonly Row[];
    readonly left: readonly string[];
    readonly gathered: readonly Gathered[];
    readonly facts: Readonly<Record<string, MeasureFacts>> | null;
    readonly periodColumn: string | null;
    readonly showing: string;
}
/** A live result, and enough about it to say what it is. */
export interface MeasureLoad {
    /**
     * Where the answer to the statement now being asked has got to.
     *
     * Not the raw load: `DataLoad` keeps the last successful data across a
     * reload, and for a figure that data answers a statement nobody is asking
     * any more. A component holding one of those is between two answers and has
     * nothing of its own to show, so this reports it as loading rather than as
     * ready with somebody else's rows.
     */
    readonly load: DataLoad<Answered>;
    /** The rows in hand, which the facts beside them describe. */
    readonly rows: readonly Row[];
    /** What the answer left out of the population, counted under its filters. */
    readonly left: readonly string[];
    /**
     * What each residual mark stands for, where a truncation produced one.
     *
     * Beside `left`: the two are different claims. `left` is what no budget can
     * recover — rows with no date are nowhere on the axis at any size. A residual
     * gathers everything it holds under one mark; what a reader needs is what that
     * mark is made of.
     */
    readonly gathered: readonly Gathered[];
    /** The identity a per-instance edit attaches to. */
    readonly result: string;
    readonly facts: Readonly<Record<string, MeasureFacts>> | null;
    /** Set when the request cannot be compiled — a refusal, not a failure. */
    readonly refused: string | null;
    readonly periodColumn: string | null;
    /** The measure now shown, which an override may have changed. */
    readonly showing: string;
    /** What was given up to fit the component and the surface, if anything. */
    readonly gave: readonly string[];
    /** What a reader could do about the reduction, when there is anything. */
    readonly asking: Offered | null;
}
/**
 * The three answers to "then show me all of it".
 *
 * Only the first is an exception: taking it costs nothing in truth — the same
 * numbers, smaller. The other two are refusals that no dial reaches.
 */
export type Offered = 
/** Room, which was estimated, and the estimate can be corrected. */
{
    readonly kind: "reading";
    readonly reading: Reading;
}
/** A channel that does not widen: eight colours is eight colours. */
 | {
    readonly kind: "beyond";
}
/** A picture that would be incomplete and would not look it. */
 | {
    readonly kind: "shape";
};
/**
 * What a result is going into, as far as this hook needs to know.
 *
 * A `Chart` is one; so is a card, which draws a single number and is not a
 * chart. Both answer the same two questions, which is what makes this the
 * seam's type — shared by charts and cards.
 */
export interface Renderer {
    readonly sig: Sig;
    capacity(box: Box, apart: number): Channels;
    /** See `Accepts.ranked`: how few ranked members are worth handing this one. */
    readonly ranked?: number;
    /** See `Accepts.edges`: how many pairs this draws, where its marks are pairs. */
    readonly edges?: number;
}
/**
 * What will take a result: the slots and geometry the component declares,
 * measured against the room the layout gave it.
 */
export declare function acceptsFor(renders: Renderer, box: Box): Accepts;
/**
 * Run a measure request, with whatever design mode has overridden on it.
 *
 * `request` may be null, which runs nothing: a comparison a card does not show
 * should not cost a query, and hooks cannot be called conditionally.
 */
export declare function useMeasure(db: DataClient, catalog: Catalog, request: MeasureRequest | null, renders: Renderer): MeasureLoad;
/** What design mode needs to enumerate an edit against a rendered number. */
export interface Registered {
    readonly catalog: Catalog;
    readonly request: MeasureRequest;
    readonly facts: Readonly<Record<string, MeasureFacts>> | null;
    /** The measure the component asked for, before any override. */
    readonly binding: string;
    /**
     * What this mount will accept: the component's slots, and its surface's room.
     *
     * Registered so an edit can be told its own reach from the same data that will
     * decide its effect.
     */
    readonly accepts: Accepts;
}
export declare function registeredResult(result: string): Registered | undefined;
/**
 * Which mounted results a broad patch would change whole, and which would only
 * take part of it.
 *
 * The same projection the override itself performs, asked ahead of time. A place
 * that gives something up to fit is reported apart from one that takes the edit
 * as written.
 */
export declare function reachOf(measure: string, patch: Partial<MeasureRequest>): {
    readonly taking: readonly string[];
    readonly partly: readonly string[];
};
/**
 * Every result currently on screen.
 *
 * From a measure back to the places showing it is a scan of what is mounted —
 * the extent of what a running app knows. Uses on a route nobody has visited
 * need the bundle read statically.
 */
export declare function registeredResults(): readonly (readonly [string, Registered])[];
/**
 * Breadth, on the data axis.
 *
 * `instance` re-aims the one card that was clicked. `everywhere` re-aims every
 * component showing that measure — what someone means by "show profit monthly".
 */
export type MeasureScope = "everywhere" | "instance";
export declare function override(scope: MeasureScope, key: string, patch: Partial<MeasureRequest> | null): void;
export {};
