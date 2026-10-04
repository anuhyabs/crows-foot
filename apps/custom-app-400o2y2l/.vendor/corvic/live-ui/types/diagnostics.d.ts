/**
 * Turning a `@corvic/live` rejection into something a reader can act on.
 *
 * Branching is on the `kind` property alone: an error that crossed the worker
 * boundary arrives as a structured clone with no prototype, and bundlers mangle
 * class names, so neither `instanceof` nor a constructor name survives.
 */
/** A failure as the boundary renders it. */
export interface ErrorPresentation {
    /** The discriminant, or `"unknown"` for anything that did not carry one. */
    readonly kind: string;
    readonly title: string;
    /** What to do about it, when the kind implies an action. */
    readonly remedy: string | undefined;
    /** The evidence: the failing SQL, the unreachable URL, the sizes. */
    readonly detail: string | undefined;
}
/**
 * Describe any thrown value. A `kind` this bundle does not recognize is
 * presented with its own message.
 */
export declare function describeError(error: unknown): ErrorPresentation;
