/**
 * The theming space: an enumerated token registry, its DTCG values, and the
 * resolution an app reads.
 *
 * **Tokens** name design values (color, length, shadow) and resolve to CSS
 * custom properties. **Variants** select a look (`card: "elevated"`, `density:
 * "compact"`): they pick token values or a class the stylesheet styles, and do
 * not enter the token namespace.
 *
 * Token-to-property mapping: dots become dashes under a `--corvic-` prefix, so
 * `color.accent` is always `var(--corvic-color-accent)`. Hand-written and
 * vendored app CSS depends on that name directly and is never rewritten.
 */
/** DTCG-shaped token values. `$type` decides how a value resolves to CSS. */
export type TokenValue = {
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
};
/**
 * The `$type`s a token value may carry, for the schema that validates a manifest
 * before this runtime ever sees it. Derived from {@link TokenValue} so the sets
 * stay in lockstep.
 */
export declare const TOKEN_VALUE_TYPES: readonly TokenValue["$type"][];
/**
 * Every token, with the value it takes in each mode.
 *
 * Membership grows additively: a new token adds a custom property. Tokens are
 * not removed or renamed.
 */
declare const REGISTRY: {
    readonly "color.bg": {
        readonly dark: "#0b0e15";
        readonly light: "#f6f7f9";
    };
    readonly "color.surface": {
        readonly dark: "#151a24";
        readonly light: "#ffffff";
    };
    readonly "color.border": {
        readonly dark: "#242b3a";
        readonly light: "#e7e9f0";
    };
    readonly "color.text": {
        readonly dark: "#e8eaf3";
        readonly light: "#141824";
    };
    readonly "color.muted": {
        readonly dark: "#8a90a6";
        readonly light: "#667085";
    };
    readonly "color.accent": {
        readonly dark: "#6d8bff";
        readonly light: "#3f52d6";
    };
    readonly "color.accent2": {
        readonly dark: "#31d0c0";
        readonly light: "#0f8f83";
    };
    readonly "color.ok.bg": {
        readonly dark: "#12331f";
        readonly light: "#e6f6ee";
    };
    readonly "color.ok.fg": {
        readonly dark: "#43c98a";
        readonly light: "#146b45";
    };
    readonly "color.warn.bg": {
        readonly dark: "#332a12";
        readonly light: "#fdf3e2";
    };
    readonly "color.warn.fg": {
        readonly dark: "#f0b355";
        readonly light: "#8a5410";
    };
    readonly "color.error.bg": {
        readonly dark: "#331616";
        readonly light: "#fdeaea";
    };
    readonly "color.error.fg": {
        readonly dark: "#f0716f";
        readonly light: "#c0392b";
    };
    readonly "color.error.border": {
        readonly dark: "#5a2a2a";
        readonly light: "#f0c2c2";
    };
    readonly "color.chart.1": {
        readonly dark: "#6d8bff";
        readonly light: "#3f52d6";
    };
    readonly "color.chart.2": {
        readonly dark: "#31d0c0";
        readonly light: "#0f8f83";
    };
    readonly "color.chart.3": {
        readonly dark: "#f0b355";
        readonly light: "#b3701a";
    };
    readonly "color.chart.4": {
        readonly dark: "#c98ae8";
        readonly light: "#8b52c4";
    };
    readonly "color.chart.5": {
        readonly dark: "#f0716f";
        readonly light: "#c0392b";
    };
    readonly "color.chart.6": {
        readonly dark: "#7fc4f5";
        readonly light: "#2c7cb0";
    };
    readonly "font.body": {
        readonly both: string;
    };
    readonly "font.mono": {
        readonly both: "ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
    };
    readonly "text.xs": {
        readonly both: "0.75rem";
    };
    readonly "text.sm": {
        readonly both: "0.8125rem";
    };
    readonly "text.md": {
        readonly both: "0.875rem";
    };
    readonly "text.lg": {
        readonly both: "1rem";
    };
    readonly "text.xl": {
        readonly both: "1.25rem";
    };
    readonly "text.2xl": {
        readonly both: "1.75rem";
    };
    readonly "text.3xl": {
        readonly both: "2rem";
    };
    readonly "weight.normal": {
        readonly both: "400";
    };
    readonly "weight.medium": {
        readonly both: "600";
    };
    readonly "weight.strong": {
        readonly both: "700";
    };
    readonly "leading.tight": {
        readonly both: "1.2";
    };
    readonly "leading.body": {
        readonly both: "1.5";
    };
    readonly "space.pad": {
        readonly both: "20px";
    };
    readonly "space.gap": {
        readonly both: "18px";
    };
    readonly "space.page": {
        readonly both: "28px";
    };
    readonly "radius.card": {
        readonly both: "12px";
    };
    readonly "shadow.card": {
        readonly dark: "0 1px 2px rgba(0,0,0,.30),0 1px 3px rgba(0,0,0,.20)";
        readonly light: "0 1px 2px rgba(16,24,40,.06),0 1px 3px rgba(16,24,40,.10)";
    };
};
/** One property per token; an unknown token name is a type error. */
export type Tokens = {
    readonly [K in keyof typeof REGISTRY]: TokenValue;
};
export type TokenName = keyof Tokens & string;
export type ThemeMode = "light" | "dark";
/**
 * The variant space: one selection per component kind. Open: an unknown kind or
 * an unknown name for a known kind is ignored.
 */
declare const VARIANTS: {
    readonly density: readonly ["comfortable", "compact"];
    readonly radius: readonly ["none", "sm", "md", "lg", "xl"];
    readonly shadow: readonly ["none", "sm", "md", "lg"];
    readonly card: readonly ["flat", "bordered", "elevated", "glass"];
    readonly header: readonly ["plain", "banner", "centered"];
};
export type VariantKind = keyof typeof VARIANTS & string;
/** What a manifest or spec may say about the theme. */
export interface ThemeOverride {
    mode?: ThemeMode;
    /** Overrides for individual tokens; unset tokens follow `mode` and `variants`. */
    tokens?: Partial<Record<TokenName, TokenValue>>;
    /** Per-kind variant selection, e.g. `{ card: "elevated", density: "compact" }`. */
    variants?: Readonly<Record<string, string>>;
}
/** The theme as app code and components read it. */
export interface ResolvedTheme {
    readonly mode: ThemeMode;
    /**
     * The CSS custom property reference for a token: dots become dashes under a
     * `--corvic-` prefix (`color.accent` → `var(--corvic-color-accent)`). Stable;
     * app CSS depends on it.
     */
    cssVar(token: TokenName): string;
    /** The resolved value, for canvas/SVG drawing that cannot use a variable. */
    value(token: TokenName): TokenValue;
    /**
     * The selected variant for a component kind, or undefined when unset. A
     * component must tolerate a name it does not recognize.
     */
    variant(kind: string): string | undefined;
}
/** Token names in registry order, which is also the chart cycle's order. */
export declare const TOKEN_NAMES: readonly TokenName[];
/** The variant names each known kind offers, for schema generation and docs. */
export declare const VARIANT_NAMES: Readonly<Record<VariantKind, readonly string[]>>;
/** The custom property name a token maps to. The `var()` form is {@link ResolvedTheme.cssVar}. */
export declare function cssPropertyName(token: string): string;
/**
 * Resolve an override into the theme app code reads: mode defaults, then variant
 * selections, then explicit token overrides (highest precedence).
 */
export declare function resolveTheme(override?: ThemeOverride): ResolvedTheme;
/**
 * Every resolved token declared once as a `:root` rule, which is how the
 * stylesheet, hand-written app CSS, and components all read one theme.
 *
 * Element-level custom properties beat inheritance at any specificity; tokens on
 * the mount would make a document-level edit reach nothing.
 */
export declare function themeRule(theme: ResolvedTheme, selector?: string): string;
/** The CSS text for a token value, by its `$type`. */
export declare function cssValue(token: TokenValue): string;
export {};
