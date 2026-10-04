import { type Catalog, type MeasureDef } from "./catalog";
import type { Row } from "./contract";
import { type MeasureRequest } from "./measure";
/** What a step over a source is ranked by: its first measure that adds. */
export declare function leadingMeasure(catalog: Catalog): MeasureDef;
export interface StepFrom {
    readonly dimension: string;
    readonly members: readonly string[];
}
/** One bounded step from named members along an edge catalog. */
export declare function step(catalog: Catalog, from: StepFrom, keep: number): MeasureRequest;
/** Named members returned at one coordinate, in first-seen order. */
export declare function keptMembers(rows: readonly Row[], dimension: string): readonly string[];
/** Increase the count retained by one truncated dimension. */
export declare function widen(request: MeasureRequest, dimension: string, by?: number): MeasureRequest;
