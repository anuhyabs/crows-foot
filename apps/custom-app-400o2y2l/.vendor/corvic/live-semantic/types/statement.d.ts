/**
 * One statement, answered: what a caller outside a page asks for, and the SQL it becomes.
 *
 * Finds the declaration, measures it (and its map dependencies), then compiles. The SQL is
 * a function of the declarations and the statement; the engine is consulted only for the
 * profile (rows, columns, members).
 *
 * Four kinds: `measure` → `compile`, `simple` → `simplified`, `adjusted` → `adjusted`,
 * `route` → `compileRoute`. A bounded step from nodes is the two-ended measure returned by
 * `step`; relationships walked one after another from a start are a route.
 */
import { type Declaration } from "./catalog";
import type { SqlValue } from "./contract";
import { type Simplification } from "./edges";
import { type FittableMeasureRequest } from "./fit";
import { type Coverage, type MeasureFacts } from "./measure";
import { type Ask } from "./profiling";
import { type Adjustment } from "./quality";
import { type GraphRoute } from "./route";
/**
 * A question against one declared source, in the layer's own terms.
 *
 * Tagged by `kind` so a wrong shape is refused as that statement, not reinterpreted as another.
 */
export type Statement = {
    readonly kind: "measure";
    readonly of: string;
    readonly request: FittableMeasureRequest;
    /**
     * How many pairs the destination can draw.
     *
     * With this present, a nested `top` may state only `{ within }`; the
     * measured catalog supplies its initial extent and `fit` chooses `keep`.
     */
    readonly edgeBudget?: number;
} | {
    readonly kind: "simple";
    readonly of: string;
    readonly want: Simplification;
} | {
    readonly kind: "adjusted";
    readonly of: string;
    readonly want: Adjustment;
} | ({
    readonly kind: "route";
} & GraphRoute);
/**
 * What every statement produces: a query, and what it does not cover.
 *
 * For `adjusted`, `coverage` and `facts` are empty: a correction scales raw rows it does not report.
 */
export interface Answer {
    readonly sql: string;
    readonly params: readonly SqlValue[];
    /** A second one-row statement counting what the answer left out, where anything is. */
    readonly coverage: Coverage | null;
    /** Keyed by measure name: what the numbers mean, for a caller that will show them. */
    readonly facts: Readonly<Record<string, MeasureFacts>>;
    /** What a figure of this is captioned, where the statement renamed the number. */
    readonly label: string | null;
}
/**
 * Answer one statement against these declarations.
 *
 * Refusals come from the layer's own compilers (`compile`, `simplified`, `adjusted`) and are not restated here.
 */
export declare function asked(model: readonly Declaration[], statement: Statement, ask: Ask): Promise<Answer>;
/**
 * Answer several statements at once, in order.
 *
 * Given a link budget, the measure statements with a nested `top` share it, divided among
 * them alone. Every other statement is answered as {@link asked} answers it on its own.
 */
export declare function askedStatements(model: readonly Declaration[], statements: readonly Statement[], edgeBudget: number | null, ask: Ask): Promise<readonly Answer[]>;
