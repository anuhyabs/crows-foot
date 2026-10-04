/**
 * One edge per pair: a coarsening of an edge store.
 *
 * A source whose rows are edges is a multiedge store by construction: the rows are edge
 * *instances*, each with the key its declaration names, and several of them can join the
 * same pair. What an embedding consumes is one edge per pair, carrying a weight. Collapsing
 * to a pair grain is climbing a grain: a measure at a coarser grain has to equal the
 * reduction of its parts, which is what `gluingOf` says and what it refuses for a mean or
 * a percentile. A projection here is a `MeasureRequest` cut at the endpoints, and the
 * reduction is each measure's own declared operator — so the property `build_graph`'s
 * `.unique()` violates holds by construction.
 *
 * What cannot be said yet is what to do with an edge one of whose endpoints is absent. The
 * absent member is a coordinate in a split, but no filter operator asks whether a
 * dimension has a member at all, so a population that excludes the nameless rows is not
 * expressible and `drop` is not offered here. `owner <> 'Unknown'` would exclude them by
 * three-valued logic, and would also exclude a rep somebody had named Unknown.
 */
import { type Aggregation, type Catalog } from "./catalog";
import { type Compiled } from "./measure";
/** What a simple graph asks of a multiedge store. */
export interface Simplification {
    /**
     * The pair grain: both endpoint cuts, and any dimension carried beside them.
     *
     * Both: a grain that names one endpoint is a measure per node — an ordinary split.
     * A dimension carried beside them makes the pair finer: a graph per role.
     */
    readonly by: readonly string[];
    /** The measures reduced along it, of which the first is what a weight usually means. */
    readonly measures: readonly string[];
    /**
     * An operator for a measure whose own does not survive a grain change.
     *
     * A mean of the edges between a pair is computable and is not a reduction: it cannot be
     * recovered from the means of its parts, so a weight that is one cannot be recombined by
     * whatever reads the projection. Naming a replacement says which quantity is wanted at
     * the pair grain; it is a different measure from the one it replaces.
     */
    readonly instead?: Readonly<Record<string, Aggregation>>;
    /**
     * What an edge with an endpoint missing is.
     *
     * `refuse` is the default: an edge with one end has no pair, so a simple graph of it
     * does not exist until somebody says what those rows are. `keep` gathers them under the
     * absent member, which makes one node out of every unknown — for an embedding that is a
     * hub the data does not have.
     */
    readonly nameless: "refuse" | "keep";
}
/**
 * The coarsened edge list, as a statement.
 *
 * Compiled against the same catalog, so the pairs, the filling, the domain and the
 * coverage are what every other request gets.
 */
export declare function simplified(edge: Catalog, want: Simplification): Compiled;
