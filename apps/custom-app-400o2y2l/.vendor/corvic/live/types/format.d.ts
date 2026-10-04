/**
 * Value formatting + safety helpers shared by every panel renderer.
 *
 * Two jobs live here that repeatedly broke in per-artifact dashboards:
 *  1. BigInt handling — DuckDB/Arrow return INT64 as BigInt; JSON/`toLocaleString`
 *     choke on it. `toNumber` normalises once, centrally.
 *  2. XSS — all data flows through `esc` before touching innerHTML.
 */
import type { ValueFormat } from "./spec";
/** Escape a string for safe insertion into innerHTML. */
export declare function esc(value: unknown): string;
/**
 * An anchor for a value that is a web address, and an em dash for one that is not.
 *
 * A row's own value reaches `href` and the sandbox allows inline script, so a
 * `javascript:` scheme in that column runs on click. Escaping does not reach it —
 * the scheme is the problem rather than the quoting — so this decides whether
 * there is a link at all.
 */
export declare function linkTo(value: unknown, label: unknown, className?: string): string;
/** Coerce Arrow/DuckDB scalar (incl. BigInt) to a JS number, or null. */
export declare function toNumber(value: unknown): number | null;
/** Format a single value according to a declarative `ValueFormat`. */
export declare function formatValue(value: unknown, fmt?: ValueFormat): string;
/** Human-readable byte size for the size-gate messaging. */
export declare function formatBytes(bytes: number): string;
