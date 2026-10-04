/**
 * The SQL that materializes a declared walk, emitted rather than authored.
 *
 * A walk composes two or more declared relationships into one edge list. It is a join,
 * its legs are already tables, and everything about the result is said in the
 * declaration: which legs, in which order, and how each carried property composes along
 * them. So the SQL is a function of the declaration, and this is that function. Nothing
 * here runs it, exactly as `compile` emits a statement and runs none.
 *
 * Emitted here because this layer is what queries the table afterwards. A walk whose SQL
 * is written somewhere else is two statements of one shape, and the one that reads it is
 * this one.
 */
/**
 * How a property carried by every leg becomes one property of the walk.
 *
 * The four do not agree, so a property is carried only where the declaration says which
 * of them applies: a distance that was summed and a distance that was multiplied are
 * different numbers, and neither is the property of any one leg.
 */
export type Composition = "sum" | "product" | "min" | "max";
/**
 * One leg of a walk: the table its edges are in, and the properties they carry.
 *
 * What it carries is part of the leg and not of the walk, because the legs of one walk
 * need not agree: a relationship declaring a property and a relationship declaring none
 * compose along each other, and the terms come from whichever legs have the property.
 */
export interface Leg {
    /** The ref of the table holding this leg's edges. */
    readonly ref: string;
    /** The properties its rows carry, by the names its declaration gives them. */
    readonly of: readonly string[];
}
/** A walk as its declaration gives it: what it lands, what it traverses, what it carries. */
export interface Walk {
    /** The relationship type it lands, which every edge it writes is named after. */
    readonly type: string;
    /** Its legs, in the order it traverses them. Two or more, or it is a leg. */
    readonly legs: readonly Leg[];
    /** Each property carried through, and the operator composing it along the walk. */
    readonly composes: Readonly<Record<string, Composition>>;
    /** The most rows the join may produce before it refuses rather than writing a table. */
    readonly budget: number;
}
/**
 * The statement that writes one walk's edges, or a thrown refusal of a walk that is none.
 *
 * The budget is a count taken before the rows are written, not a limit applied while
 * writing them: a two-hop join over a graph with any hub in it is quadratic in that hub's
 * degree, and truncating it would produce a table that loads, answers, and is short by
 * whatever fell off the end.
 */
export declare function walkSql(walk: Walk): string;
