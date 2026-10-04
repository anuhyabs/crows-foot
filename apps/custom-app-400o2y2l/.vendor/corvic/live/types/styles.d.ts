/**
 * How the runtime publishes CSS, and the only rules every app gets.
 *
 * Everything goes into `@layer corvic`, which places all of it below any app
 * rule outside a layer regardless of selector strength. An app overrides the
 * platform look with plain CSS.
 *
 * The base sheet is what the mount region needs to look like a page. Rules that
 * draw a particular kind of content ship with the code that renders it.
 */
export declare function injectLayerStyles(root: HTMLElement, id: string, css: string): void;
export declare const BASE_STYLE_ID = "corvic-live-base";
/** The token declarations, kept in their own sheet so the base rules can read them. */
export declare const THEME_STYLE_ID = "corvic-live-theme";
export declare const BASE_CSS = "\n*{scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--corvic-color-muted) 45%,transparent) transparent}\n*::-webkit-scrollbar{width:8px;height:8px}\n*::-webkit-scrollbar-track{background:transparent}\n*::-webkit-scrollbar-thumb{background:color-mix(in srgb,var(--corvic-color-muted) 40%,transparent);border-radius:999px}\n*::-webkit-scrollbar-thumb:hover{background:color-mix(in srgb,var(--corvic-color-muted) 65%,transparent)}\n.corvic-app{background:var(--corvic-color-bg);color:var(--corvic-color-text);\n\tfont-family:var(--corvic-font-body,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,system-ui,sans-serif);\n\tpadding:var(--corvic-space-page,28px);min-height:100vh;line-height:var(--corvic-leading-body,1.5);letter-spacing:-.005em;\n\t-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}\n.corvic-not-found{color:var(--corvic-color-muted);font-size:var(--corvic-text-md,.875rem)}\n.corvic-page-error{color:var(--corvic-color-error-fg);font-size:var(--corvic-text-md,.875rem)}\n.corvic-uncaught{color:var(--corvic-color-error-fg);font-size:var(--corvic-text-md,.875rem);\n\tborder:1px solid var(--corvic-color-error-fg);border-radius:var(--corvic-radius-md,6px);\n\tpadding:var(--corvic-space-sm,8px);margin-bottom:var(--corvic-space-md,16px)}\n";
