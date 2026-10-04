import type { ResolvedTheme, TokenName } from "@corvic/live/theme";
import { type ReactNode } from "react";
/** Carries `ctx.theme` to every component below it and installs the stylesheet. */
export declare function ThemeProvider({ theme, children, }: {
    readonly theme: ResolvedTheme;
    readonly children: ReactNode;
}): ReactNode;
/**
 * The app's resolved theme.
 *
 * Throws when there is no {@link ThemeProvider} above.
 */
export declare function useTheme(): ResolvedTheme;
/**
 * The variant the app selected for `kind`, or `fallback` where the selection
 * names a treatment outside `allowed`.
 */
export declare function useVariant<T extends string>(kind: string, allowed: readonly T[], fallback: T): T;
/** The token a series takes from the categorical cycle, by position. */
export declare function seriesToken(index: number): TokenName;
/**
 * A token's resolved value as CSS text, for canvas and SVG attributes that
 * cannot hold a `var()`.
 *
 * `index.js` is served globally by semver while the runtime is vendored per app,
 * so this reads the DTCG value envelope itself: sharing runtime code across that
 * boundary would put two copies of one module in a document.
 */
export declare function tokenText(theme: ResolvedTheme, token: TokenName): string;
