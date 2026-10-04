/**
 * How much of a column's variation a way of grouping it keeps.
 *
 * The arithmetic behind `Retention`, and all of it pure: a grouping is judged by
 * numbers a query already returned, so nothing here needs an engine. A statistic
 * no substrate can reach is a statistic no law can state.
 *
 * What a figure means: 1 is lossless and 0 says the grouping draws a flat line
 * where the column had structure. `fit` reads them to order the rungs of its
 * ladder, so the direction to be wrong in is downwards — a grouping judged worse
 * than it is keeps detail nobody needed, and a grouping judged better than it is
 * throws away the chart.
 */
import type { Aggregation } from "./catalog";
/** Sum of squares about the mean, which is what a grouping divides up. */
export declare function spread(values: readonly number[]): number;
/**
 * How much of a coordinate's spread was never information.
 *
 * A coordinate holding `n` rows of a summed value `x` varies by about
 * `n * E[x^2]` for no reason at all — the rows that happened to land there, and
 * how much each was worth. For a count `x` is one and that reduces to `n`, which
 * is the Poisson variance a count carries by being a count. An average over `n`
 * rows varies the other way, by `Var(x) / n`.
 *
 * `moment` is the reading that cannot be derived: `E[x^2]` for a sum, `Var(x)`
 * for an average, and unread for everything else.
 *
 * Zero for the aggregates with no easy model — distinct counts and percentiles.
 * That understates the noise and so overstates the signal, and a grouping is then
 * judged to lose more than it does — the direction to be wrong in while nobody
 * has measured the right figure.
 */
export declare function noise(agg: Aggregation, rows: number, of: number, moment: number): number;
/**
 * The share of a column's signal a grouping leaves visible.
 *
 * The plain share of variance would be a lie in the direction that never
 * coarsens. Deals open about three a day, so the day-by-day count is almost
 * entirely Poisson noise, and grouping it into months keeps 2.7 per cent of its
 * variance — a figure that says "coarsening destroys this series" about a series
 * with nothing in it to destroy.
 *
 * Counts carry their own noise model: for a Poisson count the variance equals the
 * mean, so the mean is how much of the spread was never information. What is left
 * over after subtracting it is the signal, and what a grouping is judged on is how
 * much of that it keeps. A column whose whole spread is accounted for by its mean
 * has no signal to lose, and every grouping of it keeps all of nothing — which is
 * what lets a noisy clock coarsen freely and a bursty one refuse to.
 */
export declare function kept(within: number, total: number, groups: number, of: number, noised: number): number;
/**
 * A curve made monotone, coarsest first, because refinement cannot lose.
 *
 * Keeping six leaders shows everything keeping five showed and one thing more, so
 * no ordering of these may say otherwise. The plain share of variance has that
 * property already and the correction for noise does not: it divides by a floor
 * that rises with the number of groups, which is right about how much structure a
 * grouping demonstrates and wrong as an order on groupings. Repairing it here
 * keeps the repair next to the statistic that needs it.
 */
export declare function refining(keeps: readonly number[]): readonly number[];
/**
 * What share of the total the first `cap` of them hold, cumulatively, leaders first.
 *
 * A share, not a retention. `kept` asks how much of a column's *signal* a grouping
 * keeps; this asks how much of the *population* its named members account for. The
 * two agree on a skewed column and come apart exactly where a truncation is at its
 * worst: sixteen near-equal counts hold no information to lose, so every truncation
 * of them retains everything, while naming two of them accounts for an eighth of
 * the people and gathers the rest into one mark.
 *
 * Monotone by construction: a cumulative sum of non-negative parts cannot fall —
 * which is also why this needs no `refining`.
 */
export declare function leading(counts: readonly number[], cap: number): readonly number[];
