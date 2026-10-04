import type { ReactNode } from "react";
/** The attributes a control must spread onto itself to be labelled and described. */
export interface FieldAria {
    readonly id: string;
    readonly "aria-describedby": string | undefined;
    readonly "aria-invalid": true | undefined;
    readonly "aria-required": true | undefined;
}
export interface FormFieldProps {
    readonly label: string;
    /** Guidance shown before the control, and announced with it. */
    readonly description?: string;
    /** Present means invalid: there is no separate `isInvalid`. */
    readonly errorMessage?: string;
    readonly isRequired?: boolean;
    readonly children: (aria: FieldAria) => ReactNode;
}
/**
 * A label, an optional description, and an optional error message, rendered
 * around whatever control `children` returns and wired to it through
 * {@link FieldAria}.
 */
export declare function FormField({ label, description, errorMessage, isRequired, children, }: FormFieldProps): ReactNode;
