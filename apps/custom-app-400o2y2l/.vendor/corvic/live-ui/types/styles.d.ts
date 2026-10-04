/**
 * The one stylesheet this package injects.
 *
 * Every color, length, radius, and shadow comes from a theme token through
 * {@link ResolvedTheme.cssVar}. Every rule ships inside `@layer corvic`, so any
 * app rule outside a layer beats it whatever the selectors are.
 */
import type { ResolvedTheme } from "@corvic/live/theme";
/**
 * Inject the stylesheet into `doc` if it is not already there.
 *
 * Idempotent by document: several roots in one document share one sheet, and a
 * detached document gets its own.
 */
export declare function ensureStyles(doc: Document, theme: ResolvedTheme): void;
/** The text {@link ensureStyles} injects. */
export declare function styleSheetText(theme: ResolvedTheme): string;
