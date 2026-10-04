/**
 * The panel path: a declarative spec rendered as a grid of live panels.
 *
 * One page renderer among others, not a mount. It owns the panels and the CSS
 * that draws them, and nothing outside the container it is given — the chrome,
 * the routing, and the engine belong to `mount.ts`. Charts are hand-drawn SVG so
 * the runtime carries no charting dependency and stays sandbox-safe.
 */
import type { CorvicEngine } from "./engine";
import { type LiveAppSpec } from "./spec";
/**
 * Render one spec's panels into `container`, replacing whatever it held, and
 * publish the rules that draw them.
 *
 * The whole panel path, with nothing around it: no header, no status bar, no
 * navigation.
 *
 * Rejects rather than rendering its own failure, because the caller owns the
 * surface an error belongs on.
 */
export declare function renderPanelGrid(engine: CorvicEngine, spec: LiveAppSpec, container: HTMLElement): Promise<void>;
