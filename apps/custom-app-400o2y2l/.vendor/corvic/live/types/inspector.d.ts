/**
 * In-iframe visual inspector for the App Builder's "point at the app to edit it"
 * mode.
 *
 * A live app renders in a cross-origin per-ledger iframe; only code inside the
 * iframe can hit-test or highlight. This module ships in `@corvic/live`, so every
 * bundle has it.
 *
 * Dormant until the parent posts `{ type: "corvic:inspect", mode }`. On hover it
 * highlights; on click it resolves the nearest spec panel (or a DOM fallback) and
 * posts `{ type: "corvic:selection", ... }`. It never mutates the app.
 *
 * Phase 1: `element` selection. `text`/`annotate` are reserved in the protocol.
 */
/** Current inspector mode. `off` is dormant. */
export type InspectMode = "off" | "element" | "text" | "annotate";
/** A click resolved to a spec panel. */
export interface PanelTarget {
    kind: "panel";
    /** Index into `app.json` `panels[]` (1:1 with render order). */
    index: number;
    /** Panel `id` if the spec set one. */
    id?: string;
    /** Panel `type` (`kpi` | `bar` | `line` | `table` | `custom`). */
    panelType?: string;
    /** Panel `title` if set. */
    title?: string;
}
/** A click with no spec panel ancestor (hand-written HTML). */
export interface DomTarget {
    kind: "dom";
    tag: string;
    id?: string;
    classes?: string;
    /** Trimmed, length-capped text content, to help the agent locate it. */
    text?: string;
    /** Short CSS-ish path from the nearest identifiable ancestor. */
    path: string;
}
export type SelectionTarget = PanelTarget | DomTarget;
/**
 * Attach the inspector's message listener. Idempotent and browser-only; safe
 * from a side-effect import. Meaningful inside an iframe only.
 *
 * Listening starts at import. The mount announces `ready` when there is an app
 * to inspect.
 */
export declare function initInspector(): void;
