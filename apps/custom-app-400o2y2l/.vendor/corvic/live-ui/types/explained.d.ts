/**
 * What a walk is, independently of what is being walked.
 *
 * Two graphs answer to this shape: the data behind a number, and the design
 * decisions behind an appearance. They share the same question ("what is this,
 * what is it made of, where else does it appear").
 *
 * `kind` is a free string. Each graph owns its kinds; this module owns only the
 * fact that a node has one.
 */
export interface GraphNode {
    readonly kind: string;
    /** Prefixed by kind, unique across every graph, and all navigation carries. */
    readonly id: string;
    readonly label: string;
}
/** One named set of neighbours, in the words the question is asked in. */
export interface Relation {
    readonly title: string;
    readonly nodes: readonly GraphNode[];
}
export interface Explanation {
    readonly node: GraphNode;
    /** What this is: term and value, for reading. */
    readonly facts: readonly (readonly [string, string])[];
    readonly relations: readonly Relation[];
}
