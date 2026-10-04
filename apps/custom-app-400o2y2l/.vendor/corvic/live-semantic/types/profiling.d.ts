/**
 * Measure a source, producing the `SourceProfile` a catalog is read with.
 *
 * The other half of `profile.ts`: that module says what a profile is, and this one
 * says how to get one. Both are here, in the package that owns the type, so a
 * profiler reads a catalog directly.
 *
 * No engine here, for the same reason `compile` has none: this emits the SQL and
 * the caller runs it. `ask` is that caller, which keeps the dependency pointing the
 * way every other module in this package points and lets a law drive the whole
 * thing from a fixture.
 *
 * Three rounds, because each depends on the last: which columns exist decides what
 * to measure, and the range a quantity's readings cover decides which widths there
 * are to lay over it.
 */
import { type Declaration } from "./catalog";
import type { Demand } from "./demand";
import type { SourceProfile, Space, SpaceProfile } from "./profile";
/** One named statement to run. The name is what the fold asks for afterwards. */
export interface Probe {
    readonly name: string;
    readonly sql: string;
}
/**
 * Run these and hand back the rows, keyed by probe name.
 *
 * Rows: that is all a profile reads, and the narrower this is the more things can
 * be one — a test harness, a live connection, or a fixture that answers from a
 * table written by hand.
 */
export type Ask = (probes: readonly Probe[]) => Promise<Readonly<Record<string, readonly (readonly unknown[])[]>>>;
/**
 * How large this source's domains are: the sizes a fit check reads.
 *
 * The cheap half, and the half a page cannot draw without. `demandOf` multiplies a
 * width per cut to decide whether a request will go in the room it was given, and every
 * width here is one aggregate over one column — a count, a min and a max, a date span.
 * On nine hundred thousand events it is about a second.
 *
 * `retention` is empty, which is what {@link retentionOf} fills. A profile with no
 * retention prices no rung, so a request that does not fit reduces by whichever step the
 * arithmetic reaches first.
 *
 * A declaration and not a catalog, because a catalog is what this is half of: the
 * signature used to demand the measurement in order to produce it, and read every field
 * except that one.
 */
export declare function sizesOf(catalog: Declaration<unknown>, ask: Ask): Promise<SourceProfile>;
/**
 * What each reduction of each measure would leave visible: the shape, with rungs priced.
 *
 * The expensive half, and the one nothing needs until a request does not fit. Every
 * figure here is a fraction of variance a grouping keeps, so it costs a grouping: one
 * per measure per rung, which on nine hundred thousand events is nine seconds for five
 * measures. A page shows one measure at a time, so most of that prices a rung the reader
 * is not looking at — the cut that belongs to the reader's measure alone is Stage E's.
 *
 * Takes the shape, because the widths worth pricing are
 * laid over the extents it already found.
 */
export declare function retentionOf(catalog: Declaration<unknown>, shape: SourceProfile, ask: Ask): Promise<SourceProfile>;
/**
 * Both halves, for a caller with nothing to draw until it has all of it.
 *
 * Which is every caller that is not a running page: a suite states a law about a whole
 * profile, and a page renders what it can with what has arrived.
 */
export declare function profiling(catalog: Declaration<unknown>, ask: Ask): Promise<SourceProfile>;
/**
 * Price the curves a fit asked for, and nothing else.
 *
 * {@link retentionOf} prices the cube: every rung of every column for every measure. A
 * page reads a row of it — the measure it is drawing, by the cuts it is drawing it by, and
 * only where a request did not fit — so this takes the demands a fit noted and asks the
 * probes those need. On `events` the cube is a hundred and fifteen probes and nine
 * seconds; a figure that needs pricing at all needs a handful.
 *
 * Merged into the profile it was given, because pricing arrives a
 * demand at a time and a curve already measured is not measured again.
 */
export declare function pricing(catalog: Declaration<unknown>, profile: SourceProfile, demands: readonly Demand[], ask: Ask): Promise<SourceProfile>;
/**
 * Measure a space: how many vectors, how wide, whether unit, and what it does by chance.
 *
 * Everything a threshold and a `k` are chosen against, and none of it authorable.
 * The two chance distributions are the point. Cosine is a dot product only over
 * unit vectors, so `normalised` is measured first and everything below it is read
 * in the light of it.
 *
 * The maximum costs `ASKING x AGAINST` similarities and the background costs
 * `PAIRS`, so profiling a space is linear in neither the corpus nor its square.
 */
export declare function spaceOf(space: Space, ask: Ask): Promise<SpaceProfile>;
/** How much of the range above chance a floor has left to move in. */
export declare function headroom(profile: SpaceProfile): number;
/**
 * Whether the space separates anything at all.
 *
 * A space whose background sits near one puts everything close to everything, so
 * there is no similarity a floor could take that chance does not also reach. It
 * is reported rather than refused, because the answer to a degenerate space is a
 * different space and not a different threshold.
 */
export declare function degenerate(profile: SpaceProfile): boolean;
/** A floor, asked for as the chance of a match a person will tolerate. */
export interface Floor {
    /** The share of resolutions that may be chance. */
    readonly rate: number;
    /** How many candidates each resolution searches, which the rate is per. */
    readonly candidates: number;
}
/**
 * The similarity a match has to beat for at most `rate` of resolutions to be chance.
 *
 * Read off the measured maximum and corrected from the candidate count it was
 * measured at to the one it will be used at. A maximum over `n` is a maximum over
 * `n / against` blocks of `against`, so the tail wanted at the measured count is
 * `1 - (1 - rate)^(against / n)` — which is stricter than `rate` whenever there
 * are more candidates than were measured, as it must be.
 *
 * That correction assumes candidates are independent, which is false in a space
 * whose purpose is that they are not. Starting from a measured maximum rather
 * than a measured pair is what keeps the extrapolation to a factor of
 * `n / against` instead of `n`, and the assumption is the reason a floor is
 * reported with the count it was derived for.
 */
export declare function floorOf(profile: SpaceProfile, want: Floor): number;
