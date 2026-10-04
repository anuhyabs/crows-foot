/**
 * @corvic/live — public API.
 *
 * Live-data web apps over feature-view Parquet, queried in-browser with
 * DuckDB-WASM. `mountApp` is the entry point: the host document calls it once
 * with the manifest's routes; it owns the engine, the router, and the theme for
 * the session. An app supplies page modules; `panelPage` renders a declarative
 * spec.
 */
import "./inspector";
export type { Clock, Column, ColumnMeta, ColumnRole, ResultTable, Row, SourceBinding, SqlValue, } from "./engine";
export { clockOf, ENGINE_VERSION, toRows } from "./engine";
export { CorvicError, FormNotHandledError, FormsBlockedError, QueryAbortedError, QueryError, SourceTooLargeError, SourceUnavailableError, WriteRefusedError, WriteRejectedError, WriteSessionExpiredError, } from "./errors";
export { esc, formatValue, linkTo, toNumber } from "./format";
export type { InspectMode, PanelTarget, SelectionTarget } from "./inspector";
export { failed, idle, isStale, type LoadState, loaded, loading } from "./load-state";
export type { AppHandle, DataClient, EngineAssets, MountOptions, PageCleanup, PageContext, PageModule, PageRender, Route, RouteMatch, } from "./mount";
export { mountApp, panelPage } from "./mount";
export { renderPanelGrid } from "./render";
export type { Binding, Layout, LiveAppSpec, Panel, Theme, ValueFormat, } from "./spec";
export { AppSpecSchema, compileBinding, LayoutSchema, panelSql, parseAppSpec, safeParseAppSpec, } from "./spec";
export type { LooseSection, LooseTemplate } from "./template";
export { resolveTemplate, resolveTemplateLive } from "./template";
export { BUILTIN_TEMPLATES, findTemplate } from "./templates";
export { VERSION } from "./version";
export type { FileBody, FileWriteOptions, WriteBinding, WriteClient, WriteDeclaration, WriteKind, WriteOptions, WriteRow, } from "./write";
