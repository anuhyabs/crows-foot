/**
 * A route through a graph, compiled: declared relationships walked one after another.
 *
 * Each leg is a statement over one relationship, restricted at the end it is entered by to
 * the members the leg before it reached. The restriction is a semi-join, so a leg reads its
 * relationship once whatever it was handed, and what passes to the next is a set of members
 * of one type — never the paths that reached them. That is what separates this from a walk:
 * a walk's rows are the composed pairs, which grow as the product of the degrees along it
 * and are materialized against a budget at build (`walk.ts`); a route's intermediate is a
 * frontier, bounded by the type it is a set of.
 *
 * The answer is the last leg's: the arrived-at type, by how many of its links the frontier
 * reaches. Nothing between the legs leaves the engine.
 */
import type { Catalog } from "./catalog";
import { type Compiled, type MeasureFilter, type Truncation } from "./measure";
/** One leg: the relationship walked, and the end it is entered by. */
export interface RouteLeg {
    /** The relationship source. */
    readonly of: string;
    /**
     * The endpoint source it is entered by: on a relationship between two of one type,
     * which of its two ends of that type.
     */
    readonly enter: string;
}
/** A route as a statement gives it. */
export interface GraphRoute {
    /** In the order they are walked. Each enters the type the one before it arrived at. */
    readonly legs: readonly RouteLeg[];
    /** Restrictions on the first leg's `enter` source, in that source's dimensions. */
    readonly filters?: readonly MeasureFilter[];
    /** How many of the arrived-at type to keep. */
    readonly top?: Truncation;
    /** Attributes of the arrived-at type, carried beside it. */
    readonly show?: readonly string[];
}
/**
 * The statement answering a route, given each leg's catalog in order.
 *
 * Refuses a leg entering a type other than the one the leg before it arrived at: the
 * members handed across are keys of that type, and a key of another means nothing there.
 */
export declare function compileRoute(catalogs: readonly Catalog[], route: GraphRoute): Compiled;
