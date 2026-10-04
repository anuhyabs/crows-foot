/**
 * Every edit a drawn number admits, enumerated by the layer that knows what it survives.
 *
 * The platform enumerates and the reader picks. Anything free to write the request is free
 * to answer *show profit monthly* with an average of averages, and the number that comes
 * back looks perfectly ordinary all the way to the board pack. What is not offered is as
 * much of the design as what is.
 *
 * Which edits the semantics admit belongs here: the reason a grain is withheld is that the
 * catalog says the measure does not survive being cut up. The overlay keeps the scopes, the
 * reach and the revert; a component keeps the controls; both read this list.
 *
 * Two arguments, each with its own job. `facts` is what the reader is looking at, so a
 * move is never offered that would change nothing on screen — the fit may have coarsened a
 * month to a quarter, and *by month* on a page already showing quarters is a control that
 * does nothing. `request` is what the patch merges into, so a move is only offered where
 * the request has the thing it displaces: a comparison against the unfiltered population
 * needs a filter to lift, and the drawn facts do not say whether there is one.
 */
import { type Catalog } from "./catalog";
import { type MeasureFacts, type MeasureRequest } from "./measure";
/**
 * Which part of the request a move rewrites.
 *
 * Named, because a control groups by it and a law
 * quantifies over it: a family with no move anywhere in a population is a part of the
 * grammar nothing can reach, which is the same kind of hole `UNREACHED` catches on the
 * data side.
 */
export type MoveFamily = "measure" | "clock" | "grain" | "split" | "place" | "graph" | "top" | "compare" | "width";
export interface Move {
    /** Stable across renders, so a control can be keyed and a law can name one. */
    readonly id: string;
    readonly label: string;
    readonly family: MoveFamily;
    /** Merged over the request, never applied to the rows. */
    readonly patch: Partial<MeasureRequest>;
}
/** One offered transition in the finite graph a reader can traverse. */
export interface MoveEdge {
    readonly move: Move;
    readonly to: string;
}
/** One request reachable through the controls, with the moves offered there. */
export interface MoveState {
    readonly id: string;
    readonly request: MeasureRequest;
    readonly facts: MeasureFacts;
    readonly edges: readonly MoveEdge[];
}
/** The requests and transitions reachable from a set of starting questions. */
export interface MoveGraph {
    readonly states: readonly MoveState[];
}
/** Apply an offered move exactly as the controlled editor does. */
export declare function applyMove(request: MeasureRequest, move: Move): MeasureRequest;
/**
 * The least set of requests containing `seeds` and closed under offered moves.
 *
 * Each state is compiled afresh because offers are relative to the facts on screen. The
 * graph is finite for a measured catalog: every move chooses from finite catalog members,
 * grains, truncation rungs, comparisons, and measured width rungs.
 */
export declare function reachableThroughMoves(catalog: Catalog, seeds: readonly MeasureRequest[]): MoveGraph;
/** Stable identity for a request; record key order is not part of its meaning. */
export declare function requestKey(request: MeasureRequest): string;
export declare function movesOn(catalog: Catalog, request: MeasureRequest, facts: MeasureFacts): readonly Move[];
