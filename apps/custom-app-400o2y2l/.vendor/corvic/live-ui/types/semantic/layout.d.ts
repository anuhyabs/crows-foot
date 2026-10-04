/**
 * Where the nodes of a node-link drawing go.
 *
 * Split from the renderer as `geo.ts` is: a position here is decided by the
 * edges, so the arithmetic that decides it is not a component's to carry. What
 * the renderer then draws is whatever this says.
 *
 * Two layouts, for the two shapes a graph comes in. {@link placed} spreads one
 * set of nodes over the plane by force, adjacency pulling neighbours together.
 * {@link sided} puts each set of a bipartite graph down a column of its own.
 *
 * Neither says anything with distance — no weight, no count, no similarity — so
 * a drawing that means to say how heavy an edge is says it in ink, and a force
 * layout is scaled uniformly into the box so relative closeness survives the fit.
 */
import type { Box } from "./surface";
/** An edge, named by the node identities the caller placed. */
export type Pair = readonly [from: string, to: string];
/** Where a node sits, in the units of the box it was laid out in. */
export interface Spot {
    readonly x: number;
    readonly y: number;
}
/**
 * The nodes laid out in a box, adjacency drawing them together.
 *
 * Settled before it returns: a layout still in motion is a figure whose marks
 * are elsewhere by the time a reader looks at it. A pair naming a node the
 * caller did not give is not an edge of this drawing and is dropped.
 *
 * Every node is somewhere, including one with no edges: a member the cut reached
 * is in the figure.
 */
export declare function placed(nodes: readonly string[], pairs: readonly Pair[], box: Box): ReadonlyMap<string, Spot>;
/**
 * A bipartite graph in two columns, one set down each side.
 *
 * The two sets are disjoint, and the drawing says so: which side a node is on is
 * which set it belongs to, read off its position before anything else. A force
 * layout has no way to state that — it mixes the sets wherever the edges pull —
 * so the arrangement is the part of the answer the reader gets for free.
 *
 * Within a column, order decides how many edges cross, and crossings are what a
 * reader of a graph pays for. Both columns are swept until neighbours sit
 * opposite each other; see {@link opposite}.
 *
 * A pair naming a node the caller did not give is not an edge of this drawing.
 * Every node is somewhere, including one with no edges.
 */
export declare function sided(from: readonly string[], to: readonly string[], pairs: readonly Pair[], box: Box): ReadonlyMap<string, Spot>;
