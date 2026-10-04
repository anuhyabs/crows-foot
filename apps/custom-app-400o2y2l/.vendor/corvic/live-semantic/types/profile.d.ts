/**
 * How large a source's domains are, as a catalog carries them.
 *
 * The shape of a measurement, where the catalog holds what a person declares. A
 * size is measured off the source and a label is authored beside it: there is
 * one answer to how many regions there are, and it is counted.
 *
 * Carried on the catalog, so a page has everything it needs to decide what will
 * fit, and a law can ask what `fit` does at a size by handing it one.
 */
import type { Clock } from "./contract";
/**
 * The range a quantity's readings cover, which its bands are laid over.
 *
 * Both ends: a band is anchored at multiples of itself, so where the readings
 * start decides which bins they fall in and a span alone cannot say.
 */
export interface Extent {
    readonly lo: number;
    readonly hi: number;
}
/**
 * How well an extractor filled an index, in one stratum of it.
 *
 * Measured here: a rate is read off a gold set by an evaluation run exactly as a
 * size is read off the source by a profiler. A declared precision would go stale
 * the first time the extractor changed without anybody editing it.
 *
 * All five figures. `tpr` and `fpr` are what an adjusted count is computed from;
 * precision and recall are what a person reads to decide whether the extractor is
 * worth correcting at all — over- and under-extraction have different costs
 * downstream.
 */
export interface Rates {
    /** How much of what is truly in the index the extractor placed there. */
    readonly tpr: number;
    /** How much of what is truly not in it the extractor placed there anyway. */
    readonly fpr: number;
    readonly precision: number;
    readonly recall: number;
    readonly f1: number;
    /** How many labelled candidates these were estimated on, which bounds their worth. */
    readonly labelled: number;
    /**
     * How many candidates the run classified in this stratum, labelled or not.
     *
     * The population the correction is over: a rate estimated on a sample is
     * applied to everything the extractor was shown.
     */
    readonly considered: number;
}
/**
 * What an evaluation run measured about an extracted source, per stratum.
 *
 * Beside the profile and with the same standing: measured, and not
 * persisted. What is authored is the gold set it was estimated on, because which
 * strata a gold set claims to cover is the judgement the refusal in `adjusted`
 * turns on.
 */
export interface Quality {
    /** The source whose index was filled, as the declaration names it. */
    readonly of: string;
    /** The dimension the strata are cut on, by name. */
    readonly by: string;
    /** The rates per stratum, whose keys are the strata that are covered at all. */
    readonly rates: Readonly<Record<string, Rates>>;
}
/** Coordinate counts, keyed by the column they were measured on. */
export interface SourceProfile {
    readonly rows: number;
    /**
     * Which columns are ever empty, and how often across the whole source.
     *
     * Read as a *whether*, not as a *how many*. A count taken here is a fact
     * about the Parquet; reporting it against a filtered request would be a
     * confident false number. The size a figure states is counted under the
     * request's own filters, beside the answer. What this is for is knowing
     * which columns are worth counting at all: a column that is never empty in
     * the source is never empty in any part of it.
     */
    readonly absent: Readonly<Record<string, number>>;
    /** For a clock, how many buckets it spans at each grain, densely. */
    readonly spans: Readonly<Record<string, Readonly<Record<string, number>>>>;
    /**
     * For a clock, whether it holds a day or an instant.
     *
     * Measured because the physical type is the only place it survives: both come
     * back as a count of milliseconds, and a day encoded as midnight UTC read in
     * any zone west of it is the evening before. A fact about the source;
     * `catalogued` hands it to the drawing along with the label and the unit.
     */
    readonly clocks: Readonly<Record<string, Clock>>;
    /**
     * How many distinct values a column takes, for a category or a clock.
     *
     * For a category it is the coordinates a split would make, so it decides
     * whether one fits. For a clock the coordinates come from the grain, and this
     * says how many of them the readings could possibly reach: a source holding
     * eight quarterly counts cannot resolve a day however many days its span
     * covers.
     */
    readonly members: Readonly<Record<string, number>>;
    /**
     * For a quantity, the range its readings cover.
     *
     * What `members` is for a category and `spans` is for a clock: the measurement
     * a page needs before it runs a query. How many bins a width lays over a
     * quantity is a fact about the data. A clock's is already counted per grain;
     * a quantity's widths depend on where the readings are.
     */
    readonly extents: Readonly<Record<string, Extent>>;
    /**
     * How much of a column's variation each way of grouping it keeps.
     *
     * The other half of what a mark is denominated in. Pixels say how many
     * marks fit; this says which marks are worth the room, and it is the only
     * one of the two that can tell a smooth series from a spiky one. Every
     * figure is the fraction of variance a grouping leaves visible, so 1 is
     * lossless and 0 says the grouping shows a flat line where the column had
     * structure.
     *
     * Keyed by measure, because the answer is. Deals are spread evenly across
     * the four regions and money is not, so one figure for the pair would be
     * true of `deals` and false of `pipeline` — and `pipeline` is the chart the
     * page draws.
     */
    readonly retention: Readonly<Record<string, Retention>>;
}
export interface Retention {
    /** Per clock, what each grain keeps of the finest one. */
    readonly spans: Readonly<Record<string, Readonly<Record<string, number>>>>;
    /**
     * Per continuum, what each width keeps of the narrowest one, keyed by width.
     *
     * `spans` one type over. Widening a band or enlarging a cell is the same move
     * as coarsening a grain and needs the same thing said about it before a page
     * can decide it is worth making: whether the finer pieces held any shape the
     * coarser ones lose. A distribution with one mode reads the same at five bins
     * as at fifty, and a bimodal one becomes a lie; a country whose sites sit in
     * two cities reads as one blob.
     *
     * Keyed by the width written out: the widths are not a fixed list — the ladder
     * is laid over `extents`, so which rungs exist is a fact about the data.
     *
     * A place is keyed by the name of its coordinate: it has two and the cells are
     * over both.
     */
    readonly widths: Readonly<Record<string, Readonly<Record<string, number>>>>;
    /**
     * Per category, what keeping the top k and lumping the rest keeps, by k.
     *
     * Indexed by k, so `[0]` is the total and the last entry is as far as a
     * truncation was measured. Beyond it, read the last entry: a longer keep
     * retains at least as much, so it is a bound in the direction that refuses.
     */
    readonly ranked: Readonly<Record<string, readonly number[]>>;
    /**
     * Per category, what share of the total the top k members hold, by k.
     *
     * Beside `ranked`: the two answer different questions and a truncation is
     * judged on both. `ranked` says how much of the column's *signal* survives
     * naming k of them; this says how much of the *population* those k account
     * for, and `1` less it is what the residual gathers into one mark.
     *
     * Signal runs out first. Sixteen near-equal counts hold no more information
     * than three, so every truncation of them retains everything and `ranked` is
     * right to say so — and a reader handed two named cities beside an `Other`
     * holding 82% of the people has still been told nothing. Where retention
     * cannot separate two rungs, this can.
     *
     * Indexed like `ranked`: `[0]` names nobody and holds nothing, and past the
     * last entry read the last entry.
     */
    readonly leading: Readonly<Record<string, readonly number[]>>;
    /**
     * Per pair of categories, what grouping the first by the second keeps.
     *
     * Which pairs are hierarchies is the catalog's to say and which are
     * informative is not; a roll-up from city to region keeps whatever the
     * cities inside each region happen to have in common, and only the data
     * knows that.
     */
    readonly rollups: Readonly<Record<string, Readonly<Record<string, number>>>>;
}
/**
 * Where a space's vectors are, which is the authored half of measuring one.
 *
 * A space is not a source with columns and a profile of one is not a
 * `SourceProfile`, so what identifies it is said separately: the relation, the
 * column naming what each vector stands for, the column holding it, and where
 * the things that ought to have one are enumerated.
 */
export interface Space {
    readonly source: string;
    readonly key: string;
    readonly vector: string;
    /** Absent where nothing enumerates the members, which makes coverage unknowable. */
    readonly extent?: {
        readonly source: string;
        readonly column: string;
    };
}
/**
 * A similarity, and how often a space produces one that high by accident.
 *
 * The pair a floor is chosen from: a person says how much chance they will
 * tolerate and reads off the number that buys it.
 */
export interface Tail {
    /** The share of draws that came out above `similarity`. */
    readonly rate: number;
    readonly similarity: number;
}
/**
 * What similarity looks like where there is nothing to find.
 *
 * Estimated from draws, so how many were drawn bounds how far into the tail it
 * can be read: a floor finer than the sample can resolve is refused rather than
 * extrapolated.
 */
export interface Chance {
    readonly drawn: number;
    /** Generous to strict, so the last entry is as far as the tail was measured. */
    readonly tails: readonly Tail[];
}
/**
 * The same, for the statistic a resolution actually thresholds.
 *
 * A resolution takes the best of every candidate and thresholds *that*, so the
 * distribution a floor is read against is the distribution of a maximum. The two
 * differ by the candidate count and not marginally: a per-pair rate `p` against
 * `n` candidates is a per-resolution rate near `n · p`, so a pair's tail is no
 * bound at all on a corpus of any size.
 *
 * `against` is how many candidates the maximum was taken over, and it is
 * recorded because a floor is only transferable to another candidate count
 * through it.
 */
export interface Best extends Chance {
    readonly against: number;
}
/** How much of what should hold a vector does. */
export interface Covers {
    /** How many members the space's extent enumerates. */
    readonly declared: number;
    /** How many of them a vector was built for. */
    readonly held: number;
}
/**
 * What a threshold and a `k` are chosen against, none of which can be authored.
 *
 * `SourceProfile` one kind over. A space is not a relation with columns; it is a
 * cloud with a shape, and the shape decides whether anything built on it
 * separates anything.
 */
export interface SpaceProfile {
    readonly vectors: number;
    /** The width they share, or nothing where they do not share one. */
    readonly dims: number | null;
    /**
     * Whether every vector is unit length.
     *
     * What makes a similarity a dot product. Where it is false the numbers below
     * are magnitudes wearing a similarity's name, and a floor over a magnitude
     * means nothing.
     */
    readonly normalised: boolean;
    readonly covers: Covers;
    /**
     * Two rows drawn at random, which is the space's background level.
     *
     * A diagnostic and never a floor. Where it sits near one, everything is close
     * to everything and nothing built on the space will separate anything.
     */
    readonly background: Chance;
    /**
     * The best of `against` candidates, drawn at random. What a floor is read off.
     *
     * Absent where nobody measured it, which is what makes an unprofiled space
     * refuse to be thresholded rather than be thresholded at a guess.
     */
    readonly best?: Best;
}
