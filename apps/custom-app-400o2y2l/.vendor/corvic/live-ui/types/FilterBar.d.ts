import type { ReactNode } from "react";
export interface FilterOption {
    readonly value: string;
    readonly label: string;
}
/** A filter's definition. Each kind fixes the shape of its own value. */
export type FilterDef = {
    readonly id: string;
    readonly kind: "search";
    readonly label: string;
} | {
    readonly id: string;
    readonly kind: "multi-select";
    readonly label: string;
    readonly options: readonly FilterOption[];
} | {
    readonly id: string;
    readonly kind: "number-range";
    readonly label: string;
    readonly unit?: string;
} | {
    readonly id: string;
    readonly kind: "date-range";
    readonly label: string;
};
/** What a filter currently holds, in the types a `WHERE` clause would bind. */
export type FilterValue = {
    readonly kind: "search";
    readonly text: string;
} | {
    readonly kind: "multi-select";
    readonly selected: readonly string[];
} | {
    readonly kind: "number-range";
    readonly min: number | null;
    readonly max: number | null;
} | {
    readonly kind: "date-range";
    readonly start: Date | null;
    readonly end: Date | null;
};
export type FilterState = Readonly<Record<string, FilterValue>>;
export interface FilterBarProps {
    readonly filters: readonly FilterDef[];
    readonly value: FilterState;
    readonly onChange: (next: FilterState) => void;
    /** Accessible name for the region, e.g. "Filter deals". */
    readonly label: string;
    readonly locale?: string;
}
/**
 * A labelled control per filter, above a summary of every filter currently
 * applied: a chip that clears each one, and a control that clears them all.
 */
export declare function FilterBar({ filters, value, onChange, label, locale }: FilterBarProps): ReactNode;
/** The value of a filter that narrows nothing. */
export declare function emptyFilterValue(def: FilterDef): FilterValue;
/** The starting state for a filter set, and what "Clear all" returns to. */
export declare function emptyFilterState(filters: readonly FilterDef[]): FilterState;
/** One applied filter, as the summary states it. */
export interface AppliedFilter {
    readonly id: string;
    readonly label: string;
    readonly summary: string;
}
/** Which filters are narrowing the data, and how each one reads. */
export declare function appliedFilters(filters: readonly FilterDef[], state: FilterState, locale?: string): readonly AppliedFilter[];
