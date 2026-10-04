/**
 * The identity a design edit attaches to when its scope is one instance.
 *
 * A per-instance appearance edit is a declaration on `[data-corvic-node="…"]`.
 * Emitting the attribute makes the narrowest of the three scopes addressable.
 *
 * `useId` is stable for the life of a component instance. It is not stable
 * across a regeneration: a selector written against one of these names a
 * different element after the tree changes shape, so a stored edit needs an
 * allocation contract this does not provide.
 */
export declare const NODE_ATTRIBUTE = "data-corvic-node";
export type NodeProps = {
    readonly [NODE_ATTRIBUTE]: string;
};
/** Spread onto the element a component roots, so the two never disagree. */
export declare function useNodeProps(): NodeProps;
