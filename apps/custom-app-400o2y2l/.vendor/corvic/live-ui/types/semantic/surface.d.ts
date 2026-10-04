/**
 * What the thing being read can carry.
 *
 * Two budgets. Space says how many facts fit; interaction says whether detail
 * may be deferred behind a gesture or has to be on the face. A printed report
 * has an enormous space budget and no interaction; a phone has the reverse.
 *
 * A component asks the surface it is in, the way a container query asks its
 * container: a component does not know where it has been placed, and a threshold
 * written against the window is wrong the moment it is placed somewhere else.
 */
/**
 * A rectangle of reading, in CSS pixels.
 *
 * The height is how far the medium goes, not how tall its window is: a report
 * that scrolls for six thousand pixels has a height of six thousand. Nothing is
 * unbounded. Saying how far in the same unit as everything else is what lets a
 * reader disagree with the figure.
 */
export interface Box {
    readonly width: number;
    readonly height: number;
}
export interface Surface {
    readonly name: string;
    /**
     * How much room the page has.
     *
     * In pixels: a desktop is a size, and whether a request fits one is then
     * arithmetic. The height includes scrolling, so `report` is tall and `slide`
     * is exactly what is projected.
     */
    readonly extent: Box;
    /** Whether detail may be deferred behind a gesture, or must be summarised. */
    readonly interactive: boolean;
}
/**
 * The surfaces this app knows how to be.
 *
 * Read the two budgets against each other. `report` is the tallest and has no
 * interaction, so everything it says must be said outright; `mobile` is the
 * narrowest and can defer, so it says less and lets the reader ask.
 *
 * The sizes are the media: a slide is a projected 16:9 at arm's length, an email
 * column is what clients render without reflowing, a phone is a phone and then
 * some scrolling. What any of them can hold is the renderer's geometry against
 * these numbers; what a particular reader will put up with is `Reading` on top
 * of both.
 */
export declare const SURFACES: Readonly<Record<string, Surface>>;
/**
 * A surface in words, derived from its fields.
 *
 * Reading the fields means the sentence is wrong only if the surface is.
 */
export declare function describeSurface(surface: Surface): string;
/**
 * A reader disagreeing with what was assumed about them.
 *
 * Everything the anatomy refuses on grounds of room is refused against
 * estimates: a legible row is twenty-two pixels, a colour channel gives out at
 * eight, a reader will scroll this far. Those are guesses about a person, and
 * the person can say otherwise — a hundred and seventy-seven bars is cramped and
 * it is not *wrong*.
 *
 * There is no flag that skips a check; these are corrections to the numbers the
 * check reads, so every law stays live. Asking for denser marks is not the same
 * act as asking for a wrong number, and the second has no dial in this file.
 */
export interface Reading {
    /** Marks per pixel, against the renderer's own idea of legible. */
    readonly density: number;
    /** How much further than the medium's own extent this reader will scroll. */
    readonly length: number;
}
export declare const COMFORTABLE: Reading;
/**
 * The room a reading claims, out of the room the layout gave.
 *
 * Density scales both axes because a smaller mark is smaller in both; length
 * scales only the height, because scrolling is downward.
 */
export declare function claimed(box: Box, reading: Reading): Box;
export declare const ReadingContext: import("react").Context<Reading>;
export declare function useReading(): Reading;
/** Kept apart from the value so that reading one does not mean owning it. */
export declare const SetReadingContext: import("react").Context<(reading: Reading) => void>;
export declare function useSetReading(): (reading: Reading) => void;
/** A reading in words, for a control that would otherwise show two numbers. */
export declare function describeReading({ density, length }: Reading): string;
export declare const SurfaceContext: import("react").Context<Surface>;
export declare function useSurface(): Surface;
/**
 * What is left of the budget where this component stands.
 *
 * Null means nobody has divided it, so the whole surface is one region and a
 * component may spend all of it. A page that has not said which of its parts
 * compete has not been laid out, and this is the carrier it would say it with.
 */
export declare const BudgetContext: import("react").Context<Box | null>;
export declare function useBudget(): Box;
/**
 * One competitor's share of a box, split along the axis they compete on.
 *
 * Stacked parts divide the height and take the full width; parts side by side
 * do the reverse. A report that scrolls does not run out by having more sections
 * in it.
 */
export declare function divided(box: Box, among: number, along: "down" | "across"): Box;
