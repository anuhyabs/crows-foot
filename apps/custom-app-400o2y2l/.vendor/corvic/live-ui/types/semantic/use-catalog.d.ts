/**
 * Measure a source in the browser, so a declaration becomes a catalog.
 *
 * A catalog is a declaration plus what the source measures. The page measures its
 * own source: a build-time profile is stale the moment the bytes move.
 *
 * Counted first, then priced on demand. The sizes decide whether a request fits
 * in the room it was given, and no figure can draw without them. What a reduction
 * costs is a grouping per measure per rung — and a figure reads one row of it,
 * only where its request did not fit. A fit says what it could not find and this
 * prices that (`priceOn`); a page of figures that fit runs no groupings.
 *
 * Cached per source name for the life of the document: every figure on a page
 * asks for the same catalog.
 */
import type { DataClient } from "@corvic/live";
import { type Catalog, type Declaration, type Demand } from "@corvic/live-semantic";
/**
 * The catalog for a declaration, once its source has been measured.
 *
 * Null while the sizes are in flight: a loading state. A caller draws a boundary,
 * because nothing is known yet about what would fit. What comes back first has no
 * retention, and the same catalog arrives again with it.
 *
 * `among` is where the maps are resolved from, and it is required even for a
 * source with none: a declaration names its targets, so somebody has to say which
 * declarations those names are of.
 */
export declare function useCatalog(db: DataClient, declaration: Declaration, among: readonly Declaration[]): Catalog | null;
/**
 * Price what a fit could not find, once, and hand the page a catalog that knows it.
 *
 * Batched to the end of the turn: a page mounts its figures together and they are
 * mostly asking about the same measure over the same columns. Attempted demands
 * are remembered whether or not they came back with anything, so a fit that asks
 * again for something the source cannot answer does not re-ask on every render.
 *
 * Named by source: the declaration a second round re-measures is the one this
 * module kept.
 */
export declare function priceOn(db: DataClient, source: string, demands: readonly Demand[]): void;
/**
 * Forget what was measured, so a suite can measure again.
 *
 * The cache is a module-level fact about a document; a file of tests that mounts
 * many needs it cleared between cases.
 */
export declare function forgetCatalogs(): void;
