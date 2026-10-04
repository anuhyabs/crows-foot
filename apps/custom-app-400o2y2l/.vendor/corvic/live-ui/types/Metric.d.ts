import type { ReactNode } from "react";
import { type Delta, type Direction } from "./format";
/** One point of a metric's recent history, in typed time and typed value. */
export interface MetricSample {
    readonly at: Date;
    readonly value: number;
}
export interface MetricProps {
    readonly label: string;
    /** The measure itself. `null` renders as missing. */
    readonly value: number | bigint | null;
    readonly unit?: string;
    readonly delta?: Delta;
    /** What the delta is against: "vs. last quarter". Required whenever `delta` is. */
    readonly comparisonLabel?: string;
    /** Which way is good. Defaults to neutral, which colors nothing. */
    readonly direction?: Direction;
    /** Recent history. Drawn only where there are at least two samples. */
    readonly sparkline?: readonly MetricSample[];
    /**
     * The compiled result this number came from, and which of its measures this
     * card shows. Present only when the value came through the measure layer.
     */
    readonly result?: string;
    readonly measure?: string;
}
/**
 * A labelled KPI: its value in its own unit, its delta read through
 * `direction`, and optionally the recent history behind it.
 *
 * Always compact: a card is a space-constrained readout, and the magnitude is
 * what a KPI is for. Exact digits stay on `formatCell` without `compact`.
 */
export declare function Metric({ label, value, unit, delta, comparisonLabel, direction, sparkline, result, measure, }: MetricProps): ReactNode;
