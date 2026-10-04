/**
 * @corvic/live-semantic — what a number means, and what will fit.
 *
 * A catalog declares a source's columns, the cuts through it and the measures
 * over it; `compile` turns a request against one into SQL and into the facts a
 * caption needs; `fit` answers what a request costs and what to ask instead when
 * the room is smaller than the answer. Nothing here draws anything, reaches for a
 * document, or knows what a chart is — `@corvic/live-ui` binds this to pixels,
 * and the same request compiles the same way with no page at all.
 *
 * The catalogs are the app's: a declaration about data is authored beside the
 * data. The fixture these laws are stated over is not exported: a library that
 * ships its test population invites a page to draw it.
 */
export type { AuthoredDeclaration } from "./authored";
export type { Additivity, Aggregation, Askable, Catalog, ColumnDef, Declaration, DimensionDef, Expr, Kind, Mapping, MeasureDef, Prior, TimeGrain, Unit, Unreachable, } from "./catalog";
export { additivityOf, aggOf, cancelled, catalogued, clocks, containing, describes, dimensionNamed, enumerating, KINDS, kindOf, measureNamed, ordered, priorOf, readsOf, routeSpace, spansOf, spell, sqlOf, TIME_GRAINS, unitOf, unitsOf, } from "./catalog";
export { type Aside, absent, aside, derived, KEPT } from "./columns";
export type { ColumnMeta, ColumnRole, Row, SqlValue } from "./contract";
export type { Demand } from "./demand";
export { keptAt, keptInto, keptKeeping, keptOver, leadingIn, noted, spellDemand } from "./demand";
export type { Endpoint } from "./domain";
export { endpoints } from "./domain";
export type { Simplification } from "./edges";
export { simplified } from "./edges";
export type { Accepts, FittableMeasureRequest, Fitted, UnkeptNestedTop } from "./fit";
export { accepted, demandOf, fit, fitEdges, fitSteps, marksOf, steps } from "./fit";
export type { Axis, Bind, Mismatch, Sig, Slot } from "./grammar";
export { axesOf, axisOf, bind, bound, laidOut, locating, placing } from "./grammar";
export { binsIn, PIECES, placesIn, widenedFrom, widthsOver } from "./ladder";
export type { Emitted, Landed, Landing, Placed, Proposal } from "./landing";
export { enumerated, landed, landing } from "./landing";
export type { Declaring } from "./manifest";
export { declared } from "./manifest";
export type { Absence, Comparison, Compiled, CoordinateKind, Coverage, Displacement, Gathered, MeasureFacts, MeasureFilter, MeasureRequest, Shape, SpecialCoordinate, Standing, Truncation, Truncations, } from "./measure";
export { aggregate, compile, compileAcross, compileEachRoute, coordinateKey, coordinateKind, coordinateLabel, coordinateValue, describeAbsence, describeFacts, gatheredIn, MeasureError, shapeOf, whereOf, } from "./measure";
export { applyMove, type Move, type MoveEdge, type MoveFamily, type MoveGraph, type MoveState, movesOn, reachableThroughMoves, requestKey, } from "./moves";
export type { Clause, Narration } from "./narration";
export { narrate } from "./narration";
export type { Best, Chance, Covers, Extent, Quality, Rates, Retention, SourceProfile, Space, SpaceProfile, Tail, } from "./profile";
export { type Ask, degenerate, type Floor, floorOf, headroom, type Probe, pricing, profiling, retentionOf, sizesOf, spaceOf, } from "./profiling";
export type { Adjustment, Corrected, Gold, Judgement } from "./quality";
export { adjusted, rating } from "./quality";
export { kept, noise, refining, spread } from "./retention";
export type { GraphRoute, RouteLeg } from "./route";
export { identifier as sqlIdentifier } from "./sql";
export type { Answer, Statement } from "./statement";
export { asked, askedStatements } from "./statement";
export type { StepFrom } from "./step";
export { keptMembers, step, widen } from "./step";
export type { Composition, Leg, Walk } from "./walk";
export { walkSql } from "./walk";
