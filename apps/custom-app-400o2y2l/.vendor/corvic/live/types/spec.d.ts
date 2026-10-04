/**
 * Corvic Live App spec.
 *
 * A JSON document describing which live feature views to read, what panels to
 * draw, and how to format them. Produced by the agent, a no-code editor, or a
 * template; rendered by `mountApp`. Structured so agent edits are patches.
 */
import { z } from "zod";
/**
 * A named live data source. The value is a Corvic feature-view Parquet link
 * (see {@link LiveSourceUrlSchema}). The key is the SQL table name panels select
 * from.
 *
 * Example: `{ "sales": "/table/148974:sales" }` → `SELECT ... FROM sales`.
 */
export declare const SourcesSchema: z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodString, string, string>>;
/**
 * One entry in a multi-page app's in-app navigation. `href` is a bundle-relative
 * link; `label` is the click text. The runtime renders a nav bar on every page
 * and marks the current one active.
 */
export declare const NavLinkSchema: z.ZodObject<{
    label: z.ZodString;
    href: z.ZodString;
}, "strip", z.ZodTypeAny, {
    label: string;
    href: string;
}, {
    label: string;
    href: string;
}>;
export type NavLink = z.infer<typeof NavLinkSchema>;
/** Value/number formatting vocabulary for panels. */
export declare const ValueFormatSchema: z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>;
export type ValueFormat = z.infer<typeof ValueFormatSchema>;
/**
 * Declarative binding compiled to SQL by {@link compileBinding}. A panel may
 * supply `query` instead.
 */
export declare const BindingSchema: z.ZodObject<{
    from: z.ZodString;
    x: z.ZodOptional<z.ZodString>;
    y: z.ZodOptional<z.ZodString>;
    agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
    sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
    limit: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    from: string;
    sort?: "asc" | "desc" | undefined;
    limit?: number | undefined;
    x?: string | undefined;
    y?: string | undefined;
    agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
}, {
    from: string;
    sort?: "asc" | "desc" | undefined;
    limit?: number | undefined;
    x?: string | undefined;
    y?: string | undefined;
    agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
}>;
export type Binding = z.infer<typeof BindingSchema>;
export declare const KpiPanelSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"kpi">;
    value: z.ZodString;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    sublabel: z.ZodOptional<z.ZodString>;
    /** KPI card treatment: `plain` (default), `tint`, or `bold`. */
    variant: z.ZodOptional<z.ZodEnum<["plain", "tint", "bold"]>>;
}, "strip", z.ZodTypeAny, {
    value: string;
    type: "kpi";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    sublabel?: string | undefined;
    variant?: "bold" | "plain" | "tint" | undefined;
}, {
    value: string;
    type: "kpi";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    sublabel?: string | undefined;
    variant?: "bold" | "plain" | "tint" | undefined;
}>;
export declare const BarPanelSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"bar">;
    x: z.ZodString;
    y: z.ZodString;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "bar";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}, {
    type: "bar";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}>;
export declare const LinePanelSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"line">;
    x: z.ZodString;
    y: z.ZodString;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "line";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}, {
    type: "line";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}>;
export declare const TablePanelSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"table">;
    /** Per-column display format overrides, keyed by column name. */
    columnFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    pageSize: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    type: "table";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
    pageSize?: number | undefined;
}, {
    type: "table";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
    pageSize?: number | undefined;
}>;
/**
 * Author/agent HTML + JS with access to the runtime (`ctx.query`, `ctx.el`,
 * `ctx.format`). Contained to one panel.
 */
export declare const CustomPanelSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"custom">;
    html: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    script: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "custom";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    html?: string | undefined;
    script?: string | undefined;
}, {
    type: "custom";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    html?: string | undefined;
    script?: string | undefined;
}>;
export declare const PanelSchema: z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"kpi">;
    value: z.ZodString;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    sublabel: z.ZodOptional<z.ZodString>;
    /** KPI card treatment: `plain` (default), `tint`, or `bold`. */
    variant: z.ZodOptional<z.ZodEnum<["plain", "tint", "bold"]>>;
}, "strip", z.ZodTypeAny, {
    value: string;
    type: "kpi";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    sublabel?: string | undefined;
    variant?: "bold" | "plain" | "tint" | undefined;
}, {
    value: string;
    type: "kpi";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    sublabel?: string | undefined;
    variant?: "bold" | "plain" | "tint" | undefined;
}>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"bar">;
    x: z.ZodString;
    y: z.ZodString;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "bar";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}, {
    type: "bar";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"line">;
    x: z.ZodString;
    y: z.ZodString;
    format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    color: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "line";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}, {
    type: "line";
    x: string;
    y: string;
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
    color?: string | undefined;
}>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"table">;
    /** Per-column display format overrides, keyed by column name. */
    columnFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
    pageSize: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    type: "table";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
    pageSize?: number | undefined;
}, {
    type: "table";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
    pageSize?: number | undefined;
}>, z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    title: z.ZodOptional<z.ZodString>;
    /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
    query: z.ZodOptional<z.ZodString>;
    /** Declarative binding compiled to SQL when `query` is absent. */
    bind: z.ZodOptional<z.ZodObject<{
        from: z.ZodString;
        x: z.ZodOptional<z.ZodString>;
        y: z.ZodOptional<z.ZodString>;
        agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
        sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
        limit: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }, {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    }>>;
    /** Grid width in 12-column units (1..12). */
    w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    /**
     * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
     * colored edge and tints the panel's key figure.
     */
    accent: z.ZodOptional<z.ZodString>;
} & {
    type: z.ZodLiteral<"custom">;
    html: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    script: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "custom";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    html?: string | undefined;
    script?: string | undefined;
}, {
    type: "custom";
    query?: string | undefined;
    id?: string | undefined;
    title?: string | undefined;
    bind?: {
        from: string;
        sort?: "asc" | "desc" | undefined;
        limit?: number | undefined;
        x?: string | undefined;
        y?: string | undefined;
        agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
    } | undefined;
    w?: number | undefined;
    accent?: string | undefined;
    html?: string | undefined;
    script?: string | undefined;
}>]>;
export type Panel = z.infer<typeof PanelSchema>;
/**
 * The theme an app declares: mode, token overrides, and per-kind variant
 * selections. Token space, variant space, and CSS property mapping live in
 * `theme.ts`; this schema validates what a document may say.
 */
export declare const ThemeSchema: z.ZodObject<{
    mode: z.ZodOptional<z.ZodEnum<["dark", "light"]>>;
    /**
     * Overrides for individual tokens, DTCG-shaped. A name outside the registry is
     * dropped: a document written against a newer runtime must still render on an
     * older one.
     */
    tokens: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<"$type", [z.ZodObject<{
        $type: z.ZodLiteral<"color">;
        $value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        $type: "color";
        $value: string;
    }, {
        $type: "color";
        $value: string;
    }>, z.ZodObject<{
        $type: z.ZodLiteral<"dimension">;
        $value: z.ZodObject<{
            value: z.ZodNumber;
            unit: z.ZodEnum<["px", "rem"]>;
        }, "strip", z.ZodTypeAny, {
            value: number;
            unit: "px" | "rem";
        }, {
            value: number;
            unit: "px" | "rem";
        }>;
    }, "strip", z.ZodTypeAny, {
        $type: "dimension";
        $value: {
            value: number;
            unit: "px" | "rem";
        };
    }, {
        $type: "dimension";
        $value: {
            value: number;
            unit: "px" | "rem";
        };
    }>, z.ZodObject<{
        $type: z.ZodLiteral<"fontFamily">;
        $value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        $type: "fontFamily";
        $value: string;
    }, {
        $type: "fontFamily";
        $value: string;
    }>, z.ZodObject<{
        $type: z.ZodLiteral<"fontWeight">;
        $value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        $type: "fontWeight";
        $value: number;
    }, {
        $type: "fontWeight";
        $value: number;
    }>, z.ZodObject<{
        $type: z.ZodLiteral<"number">;
        $value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        $type: "number";
        $value: number;
    }, {
        $type: "number";
        $value: number;
    }>, z.ZodObject<{
        $type: z.ZodLiteral<"shadow">;
        $value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        $type: "shadow";
        $value: string;
    }, {
        $type: "shadow";
        $value: string;
    }>]>>>;
    /**
     * Variant selection per component kind, e.g. `{ card: "elevated", density:
     * "compact" }`. An unknown kind is ignored.
     */
    variants: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    mode?: "dark" | "light" | undefined;
    tokens?: Record<string, {
        $type: "color";
        $value: string;
    } | {
        $type: "dimension";
        $value: {
            value: number;
            unit: "px" | "rem";
        };
    } | {
        $type: "fontFamily";
        $value: string;
    } | {
        $type: "fontWeight";
        $value: number;
    } | {
        $type: "number";
        $value: number;
    } | {
        $type: "shadow";
        $value: string;
    }> | undefined;
    variants?: Record<string, string> | undefined;
}, {
    mode?: "dark" | "light" | undefined;
    tokens?: Record<string, {
        $type: "color";
        $value: string;
    } | {
        $type: "dimension";
        $value: {
            value: number;
            unit: "px" | "rem";
        };
    } | {
        $type: "fontFamily";
        $value: string;
    } | {
        $type: "fontWeight";
        $value: number;
    } | {
        $type: "number";
        $value: number;
    } | {
        $type: "shadow";
        $value: string;
    }> | undefined;
    variants?: Record<string, string> | undefined;
}>;
export type Theme = z.infer<typeof ThemeSchema>;
/**
 * Overall page silhouette (same panels, same data):
 *  - `grid` (default): header + tabs on top, panels below.
 *  - `sidebar`: title + nav in a left rail, panels on the right.
 *  - `hero`: full-width banner header, panels below.
 */
export declare const LayoutSchema: z.ZodEnum<["grid", "sidebar", "hero"]>;
export type Layout = z.infer<typeof LayoutSchema>;
export declare const AppSpecSchema: z.ZodObject<{
    version: z.ZodLiteral<1>;
    title: z.ZodString;
    subtitle: z.ZodOptional<z.ZodString>;
    /**
     * Multi-page in-app navigation. When present, every listed page gets a nav
     * bar linking the others. Single-page apps omit it.
     */
    nav: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        href: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        label: string;
        href: string;
    }, {
        label: string;
        href: string;
    }>, "many">>;
    /** Overall page silhouette; see {@link LayoutSchema}. Defaults to `grid`. */
    layout: z.ZodOptional<z.ZodDefault<z.ZodEnum<["grid", "sidebar", "hero"]>>>;
    sources: z.ZodRecord<z.ZodString, z.ZodEffects<z.ZodString, string, string>>;
    /** Seconds between automatic live refreshes. 0/undefined = manual only. */
    refresh: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    theme: z.ZodOptional<z.ZodObject<{
        mode: z.ZodOptional<z.ZodEnum<["dark", "light"]>>;
        /**
         * Overrides for individual tokens, DTCG-shaped. A name outside the registry is
         * dropped: a document written against a newer runtime must still render on an
         * older one.
         */
        tokens: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodDiscriminatedUnion<"$type", [z.ZodObject<{
            $type: z.ZodLiteral<"color">;
            $value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            $type: "color";
            $value: string;
        }, {
            $type: "color";
            $value: string;
        }>, z.ZodObject<{
            $type: z.ZodLiteral<"dimension">;
            $value: z.ZodObject<{
                value: z.ZodNumber;
                unit: z.ZodEnum<["px", "rem"]>;
            }, "strip", z.ZodTypeAny, {
                value: number;
                unit: "px" | "rem";
            }, {
                value: number;
                unit: "px" | "rem";
            }>;
        }, "strip", z.ZodTypeAny, {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        }, {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        }>, z.ZodObject<{
            $type: z.ZodLiteral<"fontFamily">;
            $value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            $type: "fontFamily";
            $value: string;
        }, {
            $type: "fontFamily";
            $value: string;
        }>, z.ZodObject<{
            $type: z.ZodLiteral<"fontWeight">;
            $value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            $type: "fontWeight";
            $value: number;
        }, {
            $type: "fontWeight";
            $value: number;
        }>, z.ZodObject<{
            $type: z.ZodLiteral<"number">;
            $value: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            $type: "number";
            $value: number;
        }, {
            $type: "number";
            $value: number;
        }>, z.ZodObject<{
            $type: z.ZodLiteral<"shadow">;
            $value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            $type: "shadow";
            $value: string;
        }, {
            $type: "shadow";
            $value: string;
        }>]>>>;
        /**
         * Variant selection per component kind, e.g. `{ card: "elevated", density:
         * "compact" }`. An unknown kind is ignored.
         */
        variants: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    }, "strip", z.ZodTypeAny, {
        mode?: "dark" | "light" | undefined;
        tokens?: Record<string, {
            $type: "color";
            $value: string;
        } | {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        } | {
            $type: "fontFamily";
            $value: string;
        } | {
            $type: "fontWeight";
            $value: number;
        } | {
            $type: "number";
            $value: number;
        } | {
            $type: "shadow";
            $value: string;
        }> | undefined;
        variants?: Record<string, string> | undefined;
    }, {
        mode?: "dark" | "light" | undefined;
        tokens?: Record<string, {
            $type: "color";
            $value: string;
        } | {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        } | {
            $type: "fontFamily";
            $value: string;
        } | {
            $type: "fontWeight";
            $value: number;
        } | {
            $type: "number";
            $value: number;
        } | {
            $type: "shadow";
            $value: string;
        }> | undefined;
        variants?: Record<string, string> | undefined;
    }>>;
    panels: z.ZodArray<z.ZodDiscriminatedUnion<"type", [z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
        query: z.ZodOptional<z.ZodString>;
        /** Declarative binding compiled to SQL when `query` is absent. */
        bind: z.ZodOptional<z.ZodObject<{
            from: z.ZodString;
            x: z.ZodOptional<z.ZodString>;
            y: z.ZodOptional<z.ZodString>;
            agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
            sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }>>;
        /** Grid width in 12-column units (1..12). */
        w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        /**
         * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
         * colored edge and tints the panel's key figure.
         */
        accent: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"kpi">;
        value: z.ZodString;
        format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
        sublabel: z.ZodOptional<z.ZodString>;
        /** KPI card treatment: `plain` (default), `tint`, or `bold`. */
        variant: z.ZodOptional<z.ZodEnum<["plain", "tint", "bold"]>>;
    }, "strip", z.ZodTypeAny, {
        value: string;
        type: "kpi";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        sublabel?: string | undefined;
        variant?: "bold" | "plain" | "tint" | undefined;
    }, {
        value: string;
        type: "kpi";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        sublabel?: string | undefined;
        variant?: "bold" | "plain" | "tint" | undefined;
    }>, z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
        query: z.ZodOptional<z.ZodString>;
        /** Declarative binding compiled to SQL when `query` is absent. */
        bind: z.ZodOptional<z.ZodObject<{
            from: z.ZodString;
            x: z.ZodOptional<z.ZodString>;
            y: z.ZodOptional<z.ZodString>;
            agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
            sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }>>;
        /** Grid width in 12-column units (1..12). */
        w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        /**
         * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
         * colored edge and tints the panel's key figure.
         */
        accent: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"bar">;
        x: z.ZodString;
        y: z.ZodString;
        format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "bar";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    }, {
        type: "bar";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    }>, z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
        query: z.ZodOptional<z.ZodString>;
        /** Declarative binding compiled to SQL when `query` is absent. */
        bind: z.ZodOptional<z.ZodObject<{
            from: z.ZodString;
            x: z.ZodOptional<z.ZodString>;
            y: z.ZodOptional<z.ZodString>;
            agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
            sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }>>;
        /** Grid width in 12-column units (1..12). */
        w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        /**
         * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
         * colored edge and tints the panel's key figure.
         */
        accent: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"line">;
        x: z.ZodString;
        y: z.ZodString;
        format: z.ZodOptional<z.ZodDefault<z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
        color: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "line";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    }, {
        type: "line";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    }>, z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
        query: z.ZodOptional<z.ZodString>;
        /** Declarative binding compiled to SQL when `query` is absent. */
        bind: z.ZodOptional<z.ZodObject<{
            from: z.ZodString;
            x: z.ZodOptional<z.ZodString>;
            y: z.ZodOptional<z.ZodString>;
            agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
            sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }>>;
        /** Grid width in 12-column units (1..12). */
        w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        /**
         * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
         * colored edge and tints the panel's key figure.
         */
        accent: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"table">;
        /** Per-column display format overrides, keyed by column name. */
        columnFormats: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodEnum<["raw", "number", "compact", "usd", "percent", "date", "datetime"]>>>;
        pageSize: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        type: "table";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
        pageSize?: number | undefined;
    }, {
        type: "table";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
        pageSize?: number | undefined;
    }>, z.ZodObject<{
        id: z.ZodOptional<z.ZodString>;
        title: z.ZodOptional<z.ZodString>;
        /** Raw SQL over the registered source tables. Takes precedence over `bind`. */
        query: z.ZodOptional<z.ZodString>;
        /** Declarative binding compiled to SQL when `query` is absent. */
        bind: z.ZodOptional<z.ZodObject<{
            from: z.ZodString;
            x: z.ZodOptional<z.ZodString>;
            y: z.ZodOptional<z.ZodString>;
            agg: z.ZodOptional<z.ZodDefault<z.ZodEnum<["sum", "avg", "count", "min", "max"]>>>;
            sort: z.ZodOptional<z.ZodDefault<z.ZodEnum<["asc", "desc"]>>>;
            limit: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }, {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        }>>;
        /** Grid width in 12-column units (1..12). */
        w: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        /**
         * Per-panel accent color (safe CSS color; unsafe values dropped). Draws a
         * colored edge and tints the panel's key figure.
         */
        accent: z.ZodOptional<z.ZodString>;
    } & {
        type: z.ZodLiteral<"custom">;
        html: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        script: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "custom";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        html?: string | undefined;
        script?: string | undefined;
    }, {
        type: "custom";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        html?: string | undefined;
        script?: string | undefined;
    }>]>, "many">;
}, "strip", z.ZodTypeAny, {
    version: 1;
    title: string;
    sources: Record<string, string>;
    panels: ({
        value: string;
        type: "kpi";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        sublabel?: string | undefined;
        variant?: "bold" | "plain" | "tint" | undefined;
    } | {
        type: "bar";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "line";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "table";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
        pageSize?: number | undefined;
    } | {
        type: "custom";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        html?: string | undefined;
        script?: string | undefined;
    })[];
    subtitle?: string | undefined;
    nav?: {
        label: string;
        href: string;
    }[] | undefined;
    layout?: "grid" | "sidebar" | "hero" | undefined;
    refresh?: number | undefined;
    theme?: {
        mode?: "dark" | "light" | undefined;
        tokens?: Record<string, {
            $type: "color";
            $value: string;
        } | {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        } | {
            $type: "fontFamily";
            $value: string;
        } | {
            $type: "fontWeight";
            $value: number;
        } | {
            $type: "number";
            $value: number;
        } | {
            $type: "shadow";
            $value: string;
        }> | undefined;
        variants?: Record<string, string> | undefined;
    } | undefined;
}, {
    version: 1;
    title: string;
    sources: Record<string, string>;
    panels: ({
        value: string;
        type: "kpi";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        sublabel?: string | undefined;
        variant?: "bold" | "plain" | "tint" | undefined;
    } | {
        type: "bar";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "line";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "table";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
        pageSize?: number | undefined;
    } | {
        type: "custom";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        html?: string | undefined;
        script?: string | undefined;
    })[];
    subtitle?: string | undefined;
    nav?: {
        label: string;
        href: string;
    }[] | undefined;
    layout?: "grid" | "sidebar" | "hero" | undefined;
    refresh?: number | undefined;
    theme?: {
        mode?: "dark" | "light" | undefined;
        tokens?: Record<string, {
            $type: "color";
            $value: string;
        } | {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        } | {
            $type: "fontFamily";
            $value: string;
        } | {
            $type: "fontWeight";
            $value: number;
        } | {
            $type: "number";
            $value: number;
        } | {
            $type: "shadow";
            $value: string;
        }> | undefined;
        variants?: Record<string, string> | undefined;
    } | undefined;
}>;
export type LiveAppSpec = z.infer<typeof AppSpecSchema>;
/** Parse + validate an untrusted spec (e.g. straight from the agent). */
export declare function parseAppSpec(input: unknown): LiveAppSpec;
/** Non-throwing variant for editor/preview flows. */
export declare function safeParseAppSpec(input: unknown): z.SafeParseReturnType<{
    version: 1;
    title: string;
    sources: Record<string, string>;
    panels: ({
        value: string;
        type: "kpi";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        sublabel?: string | undefined;
        variant?: "bold" | "plain" | "tint" | undefined;
    } | {
        type: "bar";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "line";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "table";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
        pageSize?: number | undefined;
    } | {
        type: "custom";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        html?: string | undefined;
        script?: string | undefined;
    })[];
    subtitle?: string | undefined;
    nav?: {
        label: string;
        href: string;
    }[] | undefined;
    layout?: "grid" | "sidebar" | "hero" | undefined;
    refresh?: number | undefined;
    theme?: {
        mode?: "dark" | "light" | undefined;
        tokens?: Record<string, {
            $type: "color";
            $value: string;
        } | {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        } | {
            $type: "fontFamily";
            $value: string;
        } | {
            $type: "fontWeight";
            $value: number;
        } | {
            $type: "number";
            $value: number;
        } | {
            $type: "shadow";
            $value: string;
        }> | undefined;
        variants?: Record<string, string> | undefined;
    } | undefined;
}, {
    version: 1;
    title: string;
    sources: Record<string, string>;
    panels: ({
        value: string;
        type: "kpi";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        sublabel?: string | undefined;
        variant?: "bold" | "plain" | "tint" | undefined;
    } | {
        type: "bar";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "line";
        x: string;
        y: string;
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        format?: "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime" | undefined;
        color?: string | undefined;
    } | {
        type: "table";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        columnFormats?: Record<string, "number" | "raw" | "compact" | "usd" | "percent" | "date" | "datetime"> | undefined;
        pageSize?: number | undefined;
    } | {
        type: "custom";
        query?: string | undefined;
        id?: string | undefined;
        title?: string | undefined;
        bind?: {
            from: string;
            sort?: "asc" | "desc" | undefined;
            limit?: number | undefined;
            x?: string | undefined;
            y?: string | undefined;
            agg?: "sum" | "avg" | "count" | "min" | "max" | undefined;
        } | undefined;
        w?: number | undefined;
        accent?: string | undefined;
        html?: string | undefined;
        script?: string | undefined;
    })[];
    subtitle?: string | undefined;
    nav?: {
        label: string;
        href: string;
    }[] | undefined;
    layout?: "grid" | "sidebar" | "hero" | undefined;
    refresh?: number | undefined;
    theme?: {
        mode?: "dark" | "light" | undefined;
        tokens?: Record<string, {
            $type: "color";
            $value: string;
        } | {
            $type: "dimension";
            $value: {
                value: number;
                unit: "px" | "rem";
            };
        } | {
            $type: "fontFamily";
            $value: string;
        } | {
            $type: "fontWeight";
            $value: number;
        } | {
            $type: "number";
            $value: number;
        } | {
            $type: "shadow";
            $value: string;
        }> | undefined;
        variants?: Record<string, string> | undefined;
    } | undefined;
}>;
/**
 * Compile a declarative `Binding` into SQL. Always projects/aggregates in
 * DuckDB and applies a bounded LIMIT.
 */
export declare function compileBinding(bind: Binding): string;
/** Resolve the effective SQL for a panel; `query` wins over `bind`. */
export declare function panelSql(panel: Panel): string;
