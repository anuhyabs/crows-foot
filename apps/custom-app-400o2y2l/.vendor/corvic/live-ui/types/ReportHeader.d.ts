import type { ReactNode } from "react";
import { type DateRange } from "./format";
export interface ReportOwner {
    readonly name: string;
    readonly email?: string;
}
export interface ReportHeaderProps {
    readonly title: string;
    readonly subtitle?: string;
    /** The period the report covers. */
    readonly reportingPeriod?: DateRange;
    readonly owner?: ReportOwner;
    readonly generatedAt?: Date;
    /** Controls that act on the whole report: a refresh, a filter reset. */
    readonly actions?: ReactNode;
}
/**
 * A report's `<h1>` and the facts that make it citable: what it covers, who
 * owns it, and when it was generated, the last as a machine-readable `<time>`.
 * A fact it was not given is omitted.
 */
export declare function ReportHeader({ title, subtitle, reportingPeriod, owner, generatedAt, actions, }: ReportHeaderProps): ReactNode;
