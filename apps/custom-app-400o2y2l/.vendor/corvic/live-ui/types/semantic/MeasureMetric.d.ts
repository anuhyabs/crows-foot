/**
 * A KPI that knows what it is showing.
 *
 * Its number arrives with facts attached, so pointing at it reaches a measure
 * and a grain, and an edit to either re-runs the query.
 *
 * A grain turns one number into a series, and the card shows the latest bucket
 * with the rest behind it as a sparkline. That is what a monthly reading of a
 * KPI is.
 */
import type { DataClient } from "@corvic/live";
import type { Catalog } from "@corvic/live-semantic";
import { type MeasureRequest } from "@corvic/live-semantic";
import type { ReactNode } from "react";
export interface MeasureMetricProps {
    readonly db: DataClient;
    readonly catalog: Catalog;
    readonly label: string;
    readonly measure: string;
    readonly request: MeasureRequest;
}
export declare function MeasureMetric({ db, catalog, label, measure, request, }: MeasureMetricProps): ReactNode;
