/**
 * What a graph build writes: the columns every memory's built tables carry.
 *
 * A pipeline produces these tables and this layer queries them, so the names are a
 * contract between the two rather than a detail of either. `check` generates
 * `corvic.skills` constants from {@link MemoryColumns}, which is why the literals are
 * here and appear nowhere else: a second statement of them is a build that writes one
 * column and a question that reads another.
 *
 * Apart from the fixtures that build such tables and the emitters that write SQL over
 * them, nothing should need these names — a declaration says which column it reads.
 */
export declare const MEMORY_COLUMNS: {
    /** The column identifying a node, which the graph build resolves edges against. */
    readonly node: "node_id";
    /** The column identifying an edge: its endpoints and type composed, stable across runs. */
    readonly edge: "__corvic_surrogate_id";
    /** The node an edge runs from. */
    readonly start: "start_id";
    /** The node an edge runs to. */
    readonly end: "end_id";
    /** How near the two ends were, in the space that measured it. */
    readonly distance: "distance";
    /**
     * Which of the `k` a neighbour was, counting from one.
     *
     * Declared as a cut because how much of an answer rests on best matches and how much
     * on tenth-best is the question a reader of a soft link has, and a neighbourhood that
     * cannot be split by it answers it by asserting the two are the same.
     */
    readonly rank: "rank";
    /**
     * Whether the row resolved to nothing, which is a coordinate and not a gap.
     *
     * A resolution that found nothing above its floor still carries whatever the row was
     * measuring. Splitting by this is how that mass is read as unassigned rather than
     * going missing, so it is declared as a cut and not filtered away.
     */
    readonly abstained: "abstained";
};
/** The names {@link MEMORY_COLUMNS} holds, as the schema `check` reads out of this package. */
export type MemoryColumns = typeof MEMORY_COLUMNS;
