/**
 * `@corvic/live-ui` — typed analytical components for a Corvic Live app.
 *
 * Two rules hold across the whole surface. Semantic inputs are typed and
 * required; presentation comes from theme tokens and variants, so no component
 * takes a `color` or a `fontSize`. Data reaches these components as values —
 * an Arrow `Table` from `ctx.db.query`, or typed rows.
 *
 * A page module reaches all of it through `mount` and `html` (see `authoring`),
 * which are what make these components usable from a file with no build step.
 */
export { html, mount } from "./authoring";
export type { Column, ColumnMeta, ColumnRole, DataClient, DataSourceMeta, PageContext, SourceBinding, SqlValue, } from "./contract";
export { DataBoundary, type DataBoundaryProps } from "./DataBoundary";
export { type Asked, type DataColumn, DataTable, type DataTableProps, type Window, } from "./DataTable";
export { describeError, type ErrorPresentation } from "./diagnostics";
export type { Explanation, GraphNode, Relation } from "./explained";
export { Figure, type FigureProps, type LegendItem } from "./Figure";
export { type AppliedFilter, appliedFilters, emptyFilterState, emptyFilterValue, FilterBar, type FilterBarProps, type FilterDef, type FilterOption, type FilterState, type FilterValue, } from "./FilterBar";
export { type FieldAria, FormField, type FormFieldProps } from "./FormField";
export { type CellValue, type DatePrecision, type DateRange, type Delta, type Direction, type Favorability, type FormatOptions, favorability, formatCell, formatDate, formatDateRange, formatDelta, formatNumber, isoDateTime, MISSING_LABEL, MISSING_TEXT, } from "./format";
export { Metric, type MetricProps, type MetricSample } from "./Metric";
export { type SourceFact, sourceFacts } from "./provenance";
export { ReportHeader, type ReportHeaderProps, type ReportOwner } from "./ReportHeader";
export { Footnote, type FootnoteProps, type PageBreak, ReportSection, type ReportSectionProps, SourceNote, type SourceNoteProps, } from "./ReportSection";
export type { Beside, Channels, Chart, ChartProps, Point, } from "./semantic/chart";
export { BarChart, ColumnChart, faceted, LineChart, MapChart, NodeLinkChart, ReadingChart, StackedColumnChart, TableChart, } from "./semantic/charts";
export { CHARTS, chartName, drawnBy } from "./semantic/drawing";
export { BasemapContext, type Land, landFrom } from "./semantic/geo";
export { explain, resultsFor, valueNodeId } from "./semantic/graph";
export { MeasureFigure, type MeasureFigureProps } from "./semantic/MeasureFigure";
export { MeasureMetric, type MeasureMetricProps } from "./semantic/MeasureMetric";
export { Narrative, type NarrativeProps } from "./semantic/Narrative";
export { RequestEditor, type RequestEditorProps } from "./semantic/RequestEditor";
export type { Box, Reading, Surface } from "./semantic/surface";
export { BudgetContext, COMFORTABLE, describeReading, describeSurface, divided, ReadingContext, SetReadingContext, SURFACES, SurfaceContext, useBudget, useReading, useSetReading, useSurface, } from "./semantic/surface";
export { forgetCatalogs, priceOn, useCatalog } from "./semantic/use-catalog";
export type { MeasureScope, Registered, Renderer } from "./semantic/use-measure";
export { acceptsFor, override, reachOf, registeredResult, registeredResults, } from "./semantic/use-measure";
export { ensureStyles, styleSheetText } from "./styles";
export { seriesToken, ThemeProvider, tokenText, useTheme, useVariant } from "./theme";
export { type DataLoad, useDataLoad, useQuery } from "./use-query";
export { VERSION } from "./version";
