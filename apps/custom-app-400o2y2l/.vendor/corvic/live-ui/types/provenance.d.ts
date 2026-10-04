import type { DataSourceMeta } from "./contract";
/** One labelled fact about where a figure's numbers came from. */
export interface SourceFact {
    readonly term: string;
    readonly value: string;
}
/**
 * The facts a source has to offer, in reading order: what it is, how much of it
 * there is, what it covers, how fresh it is, and its status where that is
 * anything but `"fresh"`.
 */
export declare function sourceFacts(meta: DataSourceMeta, locale?: string): readonly SourceFact[];
