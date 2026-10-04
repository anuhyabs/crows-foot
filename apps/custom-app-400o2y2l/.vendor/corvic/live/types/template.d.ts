/**
 * Schema-loose dashboard templates.
 *
 * A template is a *pre-authored layout intent* — "show KPIs, a breakdown, a
 * trend, and a detail table" — NOT a fixed set of column names. At load time we
 * introspect the bound feature view's real schema, classify its columns, and
 * bind each section to whatever columns actually exist. One template therefore
 * renders against anyone's data with no column-mapping step; the trade-off is
 * that the result is heuristic (best-effort) rather than pixel-perfect.
 *
 * The output is a fully-concrete `LiveAppSpec`, so everything downstream (rendering,
 * live refresh, agent formatting patches) is unchanged.
 */
import type { Column, CorvicEngine } from "./engine";
import type { LiveAppSpec, Theme } from "./spec";
/** Sections a template can request; each maps to one or more concrete panels. */
export type LooseSection = "kpis" | "bar" | "line" | "table";
/**
 * A pre-canned dashboard style. Panels adapt to the bound source's columns, so
 * the template only expresses layout intent plus light styling/emphasis.
 */
export interface LooseTemplate {
    id: string;
    /** Grouping shown in the gallery, e.g. "Marketing" or "Finance". */
    category: string;
    title: string;
    subtitle?: string;
    theme?: Theme;
    /** Seconds between live refreshes (0/undefined = manual). */
    refresh?: number;
    /**
     * Optional case-insensitive substrings used to bias column selection toward
     * the metrics/dimension that matter for this style. Falls back to schema
     * order when a hint matches nothing.
     */
    emphasize?: {
        measures?: string[];
        dimension?: string[];
    };
    /** Sections to render, in order. Defaults to all four. */
    sections?: LooseSection[];
    /** Max KPI tiles to emit. Default 4. */
    maxKpis?: number;
}
/**
 * Resolve a schema-loose template against a source's real columns, producing a
 * concrete, renderable `LiveAppSpec`. Pure — no I/O — so it is trivially testable.
 */
export declare function resolveTemplate(template: LooseTemplate, source: {
    name: string;
    url: string;
}, columns: readonly Column[]): LiveAppSpec;
/**
 * Fetch + introspect the source, then resolve the template. Accepts the minimal
 * engine surface so it stays easy to test with a fake.
 */
export declare function resolveTemplateLive(engine: Pick<CorvicEngine, "source" | "describe">, template: LooseTemplate, source: {
    name: string;
    url: string;
}): Promise<LiveAppSpec>;
