/**
 * A count over an extracted index is classify-and-count.
 *
 * Counting the rows an extractor produced inherits the extractor's bias: a type it is
 * generous about inflates every total over it, a type it is cautious about deflates one, and
 * no amount of care in the SQL notices either. The literature names the estimator Classify
 * and Count, and names its corrections. The correction is declared here; the cut it may be
 * asked at is the gold set's strata.
 *
 * The correction is **Adjusted Count**: `(observed − fpr · n) / (tpr − fpr)`, clipped to
 * the feasible range. It is affine in the observed and total counts. Summing corrected
 * counts over cells equals correcting the summed counts exactly when `tpr` and `fpr` are
 * the same on every cell. They usually are not — extraction is worse on the long
 * tail, on one language, on scanned pages — so rates are per stratum, and a gold set with
 * no stratum to speak of is refused.
 *
 * Distinct from `spread`. `spread` is the sampling error of a mean: it corrects nothing,
 * and it assumes readings drawn from a population. An adjusted count corrects a bias in
 * **index membership** — in which things are there at all — and it is a different estimator
 * of a different quantity. The raw count keeps its own name and stays available unchanged.
 *
 * A statement, following `edges.ts`: a corrected count is asked for by naming the count and
 * the strata, and the answer is compiled from the same request the page would otherwise
 * have shown, so the corrected figure is a correction of that number.
 */
import { type Catalog, type Declaration } from "./catalog";
import type { SqlValue } from "./contract";
import type { Quality } from "./profile";
import type { Ask } from "./profiling";
/**
 * One row of a judgements table: something the extractor was shown, and what it is.
 *
 * The shape an extraction run owes an evaluation beyond its output. A finished index holds
 * the rows the extractor *accepted*; a false-positive rate is a rate over the ones it
 * declined, and neither those nor their labels are recoverable from what landed. So the run
 * reports its decisions and a person labels some of them, and the two arrive as one row per
 * candidate.
 *
 * One table: a label for something the run never classified has no row to be written in.
 * That is capture–recapture — how much an extractor never found — and it is not answerable
 * from a gold set drawn out of what it did.
 *
 * `stratum` is read off what the extractor could see, never off the label. A stratum
 * computed from the truth is one no run could compute at the time it mattered, and the
 * correction would then be a number nobody can reproduce outside the evaluation.
 */
export interface Judgement {
    readonly name: string;
    readonly stratum: string;
    /** Whether the extractor placed it in the index. */
    readonly chosen: boolean;
    /** Whether it truly belongs there, or nothing where nobody said. */
    readonly member: boolean | null;
}
/**
 * The claim a judgements table is read under, which is what makes it checkable.
 *
 * `covers` is authored and is the load-bearing judgement: it says which strata this
 * gold set claims to support rates for, and therefore which cuts an adjusted count over this
 * source may be asked at. It is reviewed like any other declaration, and `rating` refuses a
 * claim the rows cannot support.
 */
export interface Gold {
    /** The source whose index these judgements are about. */
    readonly of: string;
    /** The dimension the strata are cut on, named in both sources. */
    readonly by: string;
    readonly covers: readonly string[];
    /** The judgements source's column holding the extractor's decision. */
    readonly chosen: string;
    /** Its column holding what the thing actually is, empty where nobody said. */
    readonly member: string;
}
/**
 * The evaluation run: the rates a judgements table supports, per stratum it claims to cover.
 *
 * Measured through the engine. An extractor that ran last week in somebody else's pipeline
 * has left tables behind and nothing else, so rates are read off a table exactly as a
 * profile is read off a source — and the same code serves a run that happens to be
 * in the room.
 *
 * Every refusal is about the coverage claim. A stratum with no labelled members has no
 * true-positive rate and one with no labelled non-members has no false-positive rate; each
 * would return a number if you let it, and the number would be an artefact of the
 * arithmetic. The run check is the other kind: rates describe one extractor over one corpus,
 * and applied to a later rematerialization they correct confidently in the wrong direction.
 */
export declare function rating(gold: Gold, facts: Declaration<unknown>, labels: Declaration<unknown>, ask: Ask): Promise<Quality>;
/** What a corrected count is asked for by. */
export interface Adjustment {
    /** The count being corrected, by measure name. */
    readonly of: string;
    /**
     * The cut asked for: the gold set's stratum, or empty for the whole.
     *
     * Empty means the sum of the corrected strata. That differs from correcting the summed
     * count wherever the rates differ; this is the side that is right on every cell.
     */
    readonly by?: readonly string[];
}
/**
 * A corrected count, which is its own quantity and says so.
 *
 * Holds a statement the way {@link Compiled} does, but not a `Compiled`: a `Compiled`
 * carries the coverage count and the facts of the measures it was asked for, and both of
 * those are claims about the raw count — how many rows were empty, what unit it is on, how
 * it glues. Handing them back beside a corrected number would attach a description of one
 * quantity to another.
 */
export interface Corrected {
    readonly sql: string;
    readonly params: readonly SqlValue[];
    /** Its own name, distinct from the raw count's: both are available, and they differ. */
    readonly name: string;
    /** What a figure of it is captioned, naming what corrected it. */
    readonly label: string;
}
/**
 * The corrected count, as a statement.
 *
 * The observed count comes from `compile` over the raw measure, so what is corrected is the
 * same number the page would otherwise draw, under the same filters and the same filling.
 * The rates arrive as a table beside it and the arithmetic is one affine expression: a
 * reader of the SQL can see the two rates, the population they scale, and the clipping.
 */
export declare function adjusted(catalog: Catalog, want: Adjustment): Corrected;
