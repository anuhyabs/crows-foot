/**
 * Putting a position somewhere on a drawing, which needs a frame and not only a
 * pair of numbers.
 *
 * Split from the renderer because there are two questions and only one of them is
 * about drawing. Where a coordinate lands is a fact about the frame the catalog
 * declared, and the projection that answers it is arithmetic a component should
 * not be carrying; what shape a cell is on the page is then whatever that
 * arithmetic says.
 */
import type * as GeoJSON from "geojson";
import type { Topology } from "topojson-specification";
/** A position as the catalog states it: northing first, as a reader says a latitude. */
export type Position = readonly [north: number, east: number];
/** The ground an answer covers, which is what a frame is fitted to. */
export interface Bounds {
    readonly south: number;
    readonly west: number;
    readonly north: number;
    readonly east: number;
}
/**
 * The outline of somewhere, ready to draw under an answer.
 *
 * A basemap is content and not code: which coastlines, at what simplification,
 * under whose name for a disputed border. The drawing takes one; an application
 * that has no opinion draws a graticule and no land.
 */
export type Land = GeoJSON.GeoJSON;
/**
 * The land every map on the page draws over, which is nothing until a page says.
 *
 * A context, as the theme is: no page picks a coastline per figure, and a
 * renderer chosen by `drawnBy` has no caller to be handed one by. Nothing is a
 * working default — a graticule and the marks — so an application adds a basemap
 * when it has one.
 */
export declare const BasemapContext: import("react").Context<Land | null>;
/** A frame's answer to where things go, in the units of the box it was fitted to. */
export interface Frame {
    /** Where a position lands, or null where the frame cannot place it. */
    readonly at: (position: Position) => readonly [number, number] | null;
    /** The outline of a ring of positions, following the frame's curvature. */
    readonly ring: (corners: readonly Position[]) => string;
    /** The land, where the frame is one a basemap can be drawn in and one was given. */
    readonly land: string;
    /** The parallels and meridians, which say which way is up and how far across. */
    readonly graticule: string;
}
/**
 * A frame fitted to the ground an answer covers, in a box of the caller's choosing.
 *
 * Fitted to the answer: a request filtered to one region fills the box with that
 * region. Fitting moves and scales and never stretches, so the shape of the
 * ground survives — and the box this is fitted to must be shown at its own aspect.
 */
export declare function frameFor(crs: string | undefined, bounds: Bounds, box: readonly [width: number, height: number], land: Land | null): Frame;
/**
 * The box to show a frame in, at the shape the ground actually is.
 *
 * A frame fits the ground into whatever box it is handed, so a box of the wrong
 * shape spends the difference on ocean. The box is derived: the longer side is
 * `long`, the shorter is whatever the projected ground's aspect makes it.
 * Measured through the projection: a degree of longitude is a different length
 * from a degree of latitude.
 */
export declare function spanBox(crs: string | undefined, bounds: Bounds, long: number): readonly [width: number, height: number];
/**
 * The land held in a topology, which is the shape a basemap is published in.
 *
 * The format is not the application's business: a page that wants a coastline
 * hands over the file it downloaded. Which object is the page's to name — a
 * topology holds land and countries and sometimes borders.
 */
export declare function landFrom(topology: Topology, object: string): Land | null;
/**
 * The ground a set of positions covers, widened by whatever they stand for.
 *
 * A cell is named by a corner, so the ground its answer covers runs one width past
 * the last of them: bounds read off the corners alone would clip the top and right
 * cells in half.
 */
export declare function boundsOf(positions: readonly Position[], width: number): Bounds;
