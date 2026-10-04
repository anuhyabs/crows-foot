/**
 * Built-in schema-loose dashboard styles.
 *
 * Each entry is a pre-canned *style*, not a fixed schema: the panels bind to
 * whatever columns the chosen feature view has (see `resolveTemplate`). They
 * differ mainly in layout emphasis, titling, and theme, giving users a few
 * one-click starting points before they customise with the agent.
 */
import type { LooseTemplate } from "./template";
export declare const BUILTIN_TEMPLATES: LooseTemplate[];
export declare function findTemplate(id: string): LooseTemplate | undefined;
