/**
 * The moves a reader can make on a drawn number, as controls.
 *
 * The list is `movesOn`'s and this file does not add to it: a control that could
 * invent a move could ask for an average of averages, and the reason a grain is
 * withheld from a median is a fact about the catalog. What is here is
 * presentation — a heading per family and a press per move.
 *
 * Controlled, so the page owns the request. A reader turning a dial on the
 * figure in front of them keeps state where the page can see and reset it.
 */
import { type Catalog, type MeasureFacts, type MeasureRequest } from "@corvic/live-semantic";
import type { ReactNode } from "react";
export interface RequestEditorProps {
    readonly catalog: Catalog;
    /** What the patch merges into, which is what the figure asked for. */
    readonly request: MeasureRequest;
    /** What the reader is looking at, so a control that would change nothing is absent. */
    readonly facts: MeasureFacts;
    readonly onRequest: (next: MeasureRequest) => void;
}
export declare function RequestEditor({ catalog, request, facts, onRequest, }: RequestEditorProps): ReactNode;
