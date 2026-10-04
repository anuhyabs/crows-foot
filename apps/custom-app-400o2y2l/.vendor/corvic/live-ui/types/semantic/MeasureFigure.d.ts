/**
 * A figure whose bars know what they are.
 *
 * A measure broken out by a dimension: the chart takes labels and values, and
 * those numbers arrive from the catalog. That binding puts the figure in the
 * data graph.
 */
import type { DataClient } from "@corvic/live";
import type { Catalog } from "@corvic/live-semantic";
import { type MeasureRequest } from "@corvic/live-semantic";
import type { ReactNode } from "react";
import type { Chart } from "./chart";
export interface MeasureFigureProps {
    readonly db: DataClient;
    readonly catalog: Catalog;
    readonly title: string;
    readonly measure: string;
    /** The cut the coordinates are, which the request must also cut by. */
    readonly by: string;
    readonly request: MeasureRequest;
    readonly chart: Chart;
    /**
     * Given, the figure carries the controls for its own request.
     *
     * Moves are offered against what the reader is looking at — the fit may have
     * coarsened a month to a quarter — and this component is the one that knows
     * that answer. A page holding one editor for several figures is a different
     * component.
     */
    readonly onRequest?: (next: MeasureRequest) => void;
}
export declare function MeasureFigure({ db, catalog, title, measure, by, request, chart: Draw, onRequest, }: MeasureFigureProps): ReactNode;
