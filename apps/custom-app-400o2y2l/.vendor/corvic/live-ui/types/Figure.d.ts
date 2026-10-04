import type { TokenName } from "@corvic/live/theme";
import type { ReactNode } from "react";
import type { DataSourceMeta } from "./contract";
import { type DateRange } from "./format";
/** A legend entry. Its swatch takes the next categorical token where none is named. */
export interface LegendItem {
    readonly label: string;
    readonly token?: TokenName;
}
export interface FigureProps {
    readonly title: string;
    readonly description?: string;
    /** The unit of the figure's measure, e.g. "USD" or "ms". */
    readonly units?: string;
    readonly legend?: readonly LegendItem[];
    readonly source?: DataSourceMeta;
    /** The period the figure is about, in typed dates. */
    readonly timeRange?: DateRange;
    /** How the numbers were derived. */
    readonly methodology?: string;
    /**
     * The compiled result the figure draws, and which of its measures. Present
     * only where the numbers came through the measure layer.
     */
    readonly result?: string;
    readonly measure?: string;
    readonly children: ReactNode;
}
/**
 * A `<figure>` named by its title, with its legend and its provenance stated
 * beneath as structured terms.
 */
export declare function Figure({ title, description, units, legend, source, timeRange, methodology, result, measure, children, }: FigureProps): ReactNode;
