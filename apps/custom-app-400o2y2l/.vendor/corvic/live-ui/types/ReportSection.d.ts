import type { ReactNode } from "react";
import type { DataSourceMeta } from "./contract";
/** Where a section may break across pages. */
export type PageBreak = "auto" | "avoid" | "before" | "after";
export interface ReportSectionProps {
    readonly title: string;
    /** The section title's heading level. */
    readonly level?: 2 | 3 | 4;
    readonly description?: string;
    readonly pageBreak?: PageBreak;
    readonly children: ReactNode;
}
/** A `<section>` named by its own heading, carrying its page-break policy. */
export declare function ReportSection({ title, level, description, pageBreak, children, }: ReportSectionProps): ReactNode;
export interface SourceNoteProps {
    readonly source: DataSourceMeta;
    /** A caveat this particular use of the source needs. */
    readonly note?: string;
}
/** Where a figure's numbers came from, stated beside the figure. */
export declare function SourceNote({ source, note }: SourceNoteProps): ReactNode;
export interface FootnoteProps {
    /** The marker that refers to this note from the figure it qualifies. */
    readonly marker: string | number;
    readonly children: ReactNode;
}
/** A caveat, carrying the marker that points back at what it qualifies. */
export declare function Footnote({ marker, children }: FootnoteProps): ReactNode;
