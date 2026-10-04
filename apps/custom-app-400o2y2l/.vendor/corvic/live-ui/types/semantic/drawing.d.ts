/**
 * Which renderer draws a request: the signature relation, read the other way.
 *
 * `Chart.sig` says which kinds a renderer accepts. `use-measure` holds a chart
 * already and asks `bind` whether that chart takes this request. This module
 * asks which charts accept a kind, so a missing renderer surfaces as an absence.
 *
 * Reading it backwards needs a registry. `CHARTS` is a second list beside the
 * exports, and a chart missing from it is a chart nothing will choose — so the
 * law over it is that every entry is reachable.
 */
import { type Catalog, type MeasureRequest } from "@corvic/live-semantic";
import type { Chart } from "./chart";
/**
 * The tiled renderer, named so it can be asserted against.
 *
 * `faceted` returns a fresh component per call, so a variant that exists only
 * inside the registry below has no identity a caller or a law can hold. Not
 * re-exported by the package: a caller wanting panels calls `faceted` with the
 * renderer it wants tiled.
 */
export declare const PANELS: Chart;
export declare const CHARTS: readonly Chart[];
/** The registry name of a renderer, independent of JavaScript function minification. */
export declare function chartName(chart: Chart): string;
/**
 * The renderer that draws this request, or null where none does.
 *
 * Null is a real answer: it is what a kind with no renderer looks like.
 *
 * Where several bind, the tightest signature that can hold the request wins.
 * Holding is about the part of the demand `fit` cannot reduce: the measure count
 * and the scale count. `fit` reduces members by ranking to the leaders and drops
 * a comparison before a number, so choosing stays blind to those — a split by
 * twelve models is a line `fit` ranks to eight. It never drops a measure and
 * cannot reconcile dollars with a count: a bar holds one series, a table has no
 * scale limit.
 *
 * A renderer whose marks claim something about the cuts themselves is asked via
 * `Chart.admits`: kinds cannot say whether a pair of coordinates is a link, so a
 * drawing that means *these two are related* is chosen only where the catalog's
 * maps say a row is that relation.
 *
 * Tightness among holders: the renderer that admits least among those that can
 * hold the request is the one built for the shape. One clock is columns; a clock
 * and a member is a stack where the measure adds and a line where it does not;
 * two members are panels; many measures by one cut are a table.
 */
export declare function drawnBy(catalog: Catalog, request: MeasureRequest): Chart | null;
