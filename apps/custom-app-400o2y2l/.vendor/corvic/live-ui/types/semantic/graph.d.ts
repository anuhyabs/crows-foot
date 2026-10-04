/**
 * The data behind a number, as something you can walk.
 *
 * A rendered figure is a leaf. Above it is the measure it shows, above that the
 * expression, the columns, and the source; beside it are the other measures
 * reading the same columns and the other places on the page showing the same
 * measure. Those are the questions people ask of a number they do not trust —
 * how is this calculated, what else moves when it moves, where else does this
 * appear — and none of them are edits.
 *
 * A graph: `amount_usd` is read by four measures and `pipeline` is shown in
 * several places, so the interesting queries are reachability, and the same node
 * is arrived at by more than one route.
 *
 * Every edge here is derived: downward from the catalog, sideways from the
 * registry of mounted results. Nothing in the DOM is consulted except to turn a
 * click into a starting node.
 */
import type { Catalog, MeasureDef } from "@corvic/live-semantic";
import type { Explanation, GraphNode } from "../explained";
/** The kinds this graph owns. A component graph owns a disjoint set. */
export type NodeKind = "value" | "measure" | "column" | "source" | "dimension" | "time";
export declare function valueNodeId(result: string, measure: string): string;
export declare function measureNodeId(name: string): string;
/**
 * Answer the three questions about a node: what it is, what it is made of, and
 * where else it appears.
 */
export declare function explain(catalog: Catalog, id: string): Explanation | null;
/**
 * The columns a measure reads.
 *
 * Read off the term. A term cannot be wrong about which columns a measure
 * touches.
 */
export declare function columnsRead(catalog: Catalog, measure: MeasureDef): readonly string[];
/** Every column the catalog names, in any role. */
export declare function knownColumns(catalog: Catalog): readonly string[];
/** The mounted places showing a measure, as value nodes. */
export declare function shownBy(measure: string): readonly GraphNode[];
/** The result ids a node stands for, which is how a walk highlights the page. */
export declare function resultsFor(node: GraphNode): readonly string[];
