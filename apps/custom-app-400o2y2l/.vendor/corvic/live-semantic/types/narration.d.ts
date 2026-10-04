/**
 * Prose as the last rung of the ladder.
 *
 * Below one number is one sentence. An email hosts "pipeline is $62.8M and APAC
 * leads" — the same four facts in a quarter of the space. Prose is a
 * representation: raw table, email, and presentation are one page rendered at
 * three budgets.
 *
 * A narration never contains a number. It names measures, and the runtime
 * substitutes values from the result it actually drew, so the sentence and the
 * chart beside it name the same figures. The app cannot reach a model at runtime
 * (`connect-src 'self'`), so a template authored ahead of time and filled at
 * render is the shape this takes.
 *
 * A narration is itself projected. Clauses are ordered by what matters, each
 * declares the shape it needs, and a surface keeps the ones it can support —
 * the same operation that fits a request to a component, applied to sentences.
 */
import { type Shape } from "./measure";
/**
 * One statement, and what it needs to be true.
 *
 * `text` may reference `{total}`, `{top}`, and `{topValue}` — the same three
 * names the generator in `corvic.skills` is held to. A reference the runtime
 * cannot fill drops the whole clause: half a sentence about a number is worse
 * than silence about it.
 */
export interface Clause {
    readonly text: string;
    /** The shape the clause's references require the result to have. */
    readonly needs: Shape;
}
export interface Narration {
    /** The measure every clause is about. */
    readonly measure: string;
    /** The dimension `{top}` ranks by, when a clause asks for one. */
    readonly by?: string;
    /** Most important first: a smaller surface keeps a prefix of these. */
    readonly clauses: readonly Clause[];
}
/** The values a narration may refer to, gathered from results already drawn. */
export interface Filling {
    readonly total: string | null;
    readonly top: string | null;
    readonly topValue: string | null;
}
/**
 * The clauses this surface can carry, filled in, in order.
 *
 * Filling and selecting are one pass. A clause that survives the shape test can
 * still be unfillable — the breakdown returned no rows — and both outcomes mean
 * the same thing to a reader, so they take the same exit.
 */
export declare function narrate(narration: Narration, marks: number, filling: Filling): readonly string[];
