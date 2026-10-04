/**
 * The page, said out loud.
 *
 * Two requests: the total comes from a scalar request and the leader from a
 * breakdown request, each compiled from source. Summing the breakdown's rows in
 * JavaScript would re-aggregate a number whose additivity nobody checked — and
 * the wrong total looks like a total.
 *
 * Both requests go through `useMeasure`, so both are fitted to the surface and
 * both refuse on the same terms as everything else. At a surface that cannot
 * host a breakdown, the second request refuses, its clause finds no `{top}` to
 * fill, and the sentence about the leader simply is not said.
 */
import type { DataClient } from "@corvic/live";
import type { Catalog, MeasureRequest } from "@corvic/live-semantic";
import { type Narration } from "@corvic/live-semantic";
import type { ReactNode } from "react";
export interface NarrativeProps {
    readonly db: DataClient;
    readonly catalog: Catalog;
    readonly narration: Narration;
    /** The app's filter state, so the prose is about what the page is about. */
    readonly request: Omit<MeasureRequest, "measures" | "by" | "over">;
}
export declare function Narrative({ db, catalog, narration, request }: NarrativeProps): ReactNode;
