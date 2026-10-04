/**
 * Where an extractor's output goes: into an index somebody declared.
 *
 * An extractor reads text and emits records. Their fields are whatever a model or
 * a parser found worth naming. A declaration is the target: {@link landing} says
 * what a declaration demands — its columns, its key, the sources its endpoints
 * land in — and {@link landed} places records into that, one row per record it can
 * place. What it cannot place becomes a {@link Proposal}: an unmatched field, a
 * record with no identity, two records with one identity that disagree, an
 * endpoint naming something the index does not contain. A proposal is output for
 * a person to read and possibly to act on; it is never absorbed.
 *
 * Two absences that look alike and are not. An endpoint a record leaves empty is
 * a fact about the world — a deal nobody has been assigned — and lands as a null,
 * because the layer already counts those as their own coordinate. An endpoint a
 * record names and the index does not contain is a fact about the extraction, and
 * it does not land at all: turning it into a null would make an unresolved mention
 * indistinguishable from an unassigned rep, and every count over the difference
 * would be quietly wrong.
 *
 * No model here, and no prompt. What extraction owes is a property of the
 * declaration, which is why it can be stated in the package that owns
 * declarations; who calls a model and how is the caller's, exactly as `compile`
 * emits SQL and runs none.
 */
import { type Declaration } from "./catalog";
/** A record an extractor emitted, in whatever fields it chose to name. */
export type Emitted = Readonly<Record<string, unknown>>;
/** One placed row, holding the declared columns and nothing else. */
export type Placed = Readonly<Record<string, unknown>>;
/**
 * What a declaration demands of whatever fills it.
 *
 * Derived from the declaration: every field of it is already said somewhere in
 * one. A second statement of which columns a source has could disagree with the
 * one the compiler reads.
 */
export interface Landing {
    readonly source: string;
    /** What one row is one of, for a sentence a person reads. */
    readonly entity: string;
    /** The column identifying a row: a node's name, or an edge instance's own id. */
    readonly key: string;
    /** Every column the declaration names, in a stable order. */
    readonly columns: readonly string[];
    /** The columns holding another source's key, and the source each lands in. */
    readonly endpoints: readonly {
        readonly column: string;
        readonly to: string;
    }[];
}
/**
 * The columns a declaration names, gathered from everywhere it names one.
 *
 * `of` is not the answer on its own: it says what a column *means*, and a source can
 * declare a key, a map's column and a dimension without saying anything more about them
 * than that they exist. Every place a column can be mentioned is folded in here, so a
 * column extraction is expected to fill is one the compiler could read.
 */
export declare function landing(said: Declaration): Landing;
/** Something an extractor emitted that no declaration can hold, and why. */
export interface Proposal {
    /** The record it came out of, as the extractor emitted it. */
    readonly from: Emitted;
    /** What could not be placed, written for a person to act on. */
    readonly why: string;
}
/** What an extraction run produced: the rows, and everything else it found. */
export interface Landed {
    readonly rows: readonly Placed[];
    readonly proposals: readonly Proposal[];
}
/**
 * These records, placed into that declaration.
 *
 * `among` is the members of each source this one maps into: an edge whose endpoint
 * index is not enumerated cannot be checked against anything, so it is refused
 * here.
 */
export declare function landed(said: Declaration, emitted: readonly Emitted[], among?: Readonly<Record<string, ReadonlySet<string>>>): Landed;
/**
 * The members a landed table enumerates: what the next extraction resolves against.
 *
 * A node table is an index, so the set of its keys is what an edge extraction needs
 * from it. Reading it off what landed makes the order of the stages matter: nodes
 * first, then the edges between the nodes there are.
 */
export declare function enumerated(said: Declaration, of: Landed): ReadonlySet<string>;
