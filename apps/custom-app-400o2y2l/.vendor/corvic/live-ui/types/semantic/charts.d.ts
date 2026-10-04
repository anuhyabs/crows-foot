/**
 * The charts, which are the implementations of the contract in `chart.ts`.
 *
 * Several renderers, one stack, a table, and one combinator; what separates them
 * is what the position of a mark means. `Bars` puts names down the page and length
 * carries the reading; `Tables` prints many measures beside the same members;
 * `Columns` puts a clock across it and position carries the order; `StackedColumns`
 * claims the parts of a column sum; `Lines` joins vertices and admits a second
 * scale. `faceted` takes any of them and tiles it.
 *
 * Each declares its own signature beside itself, so `fit` projects a request onto
 * that signature.
 */
import type { Chart } from "./chart";
export declare const BarChart: Chart;
export declare const TableChart: Chart;
export declare const ColumnChart: Chart;
export declare const StackedColumnChart: Chart;
export declare const MapChart: Chart;
export declare const NodeLinkChart: Chart;
export declare const LineChart: Chart;
/**
 * The same chart once per member of a second cut, sharing one scale.
 *
 * A compound is a breakdown per member of something, and a renderer that can
 * draw a breakdown can draw a row of them. `toTraces` already returns one trace
 * per member of the second cut, and the panels are those traces, one each.
 *
 * The scale is computed here across every panel and handed down: small multiples
 * with independent axes all look alike. Both ends of it — a panel of losses
 * beside a panel of gains needs the panels to agree about where nought is.
 */
export declare function faceted(inner: Chart, along?: "down" | "across"): Chart;
export declare const ReadingChart: Chart;
