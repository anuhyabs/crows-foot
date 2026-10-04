/**
 * Writing a page against these components without a build step.
 *
 * A page module is served to the browser exactly as it was written: no bundler,
 * so no JSX and no transform. This module supplies the two things a plain module
 * needs for that syntax — a way to write an element tree, and a way to put one
 * on the page.
 *
 * `html` is a tagged template bound to `createElement`.
 */
import { type ReactNode } from "react";
import type { PageContext } from "./contract";
/**
 * JSX-shaped markup in a plain module.
 *
 * ```js
 * html`<${Metric} label="Pipeline" unit="USD" value=${total} />`
 * ```
 *
 * A component goes in the tag position as `<${Name}>`, and `<//>` closes it. A
 * value interpolated into an attribute keeps its type, so `value=${total}`
 * passes a number.
 */
export declare const html: (strings: TemplateStringsArray, ...values: any[]) => ReactNode | ReactNode[];
/**
 * Render `Page` into the region the router gave this route.
 *
 * Everything a page needs is on `ctx`, so `Page` takes it as its one prop and
 * calls hooks — `useQuery`, `useState` — the way any component does. Returning
 * this from a page module is the whole contract: the value is the cleanup the
 * router awaits before it renders the next route.
 *
 * ```js
 * import { html, mount, Metric, useQuery } from "@corvic/live-ui";
 *
 * export default (ctx) => mount(ctx, Overview);
 *
 * function Overview({ ctx }) {
 *   const { state } = useQuery(ctx.db, "select sum(amount) as total from deals");
 *   return html`<${Metric} label="Pipeline" unit="USD" value=${state.data?.[0].total} />`;
 * }
 * ```
 */
export declare function mount(ctx: PageContext, Page: (props: {
    readonly ctx: PageContext;
}) => ReactNode): () => void;
