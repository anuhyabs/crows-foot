import { type LoadState } from "@corvic/live/load-state";
import type { ReactNode } from "react";
export interface DataBoundaryProps<T> {
    readonly state: LoadState<T>;
    /** What is loading, named for the status and error messages: "revenue by region". */
    readonly label: string;
    readonly children: (data: T) => ReactNode;
    /** Whether a successful result has nothing to show. */
    readonly isEmpty?: (data: T) => boolean;
    readonly emptyMessage?: string;
    /** Offered on every failure. Omit only where a reload cannot help. */
    readonly onRetry?: () => void;
}
/**
 * Renders `state` as exactly one of a loading skeleton, an error panel, an
 * empty message, or `children(data)`.
 *
 * Data that has loaded once stays on screen through a reload and through a
 * failure, marked stale and accompanied by what went wrong.
 */
export declare function DataBoundary<T>({ state, label, children, isEmpty, emptyMessage, onRetry, }: DataBoundaryProps<T>): ReactNode;
