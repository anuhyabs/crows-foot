/**
 * The shape of tabular data: what this layer assumes.
 *
 * Three names, all about data: what one cell can hold, what a row is, and what an app can
 * say about a column. Compiling a request needs nothing else about the world.
 *
 * Declared here so this package depends on no other live package for types. These packages
 * resolve to each other's TypeScript sources; a type import pulls the runtime's module
 * graph into this program and typechecks it under this package's compiler options. A `lib`
 * with no DOM makes `document` a compile error here.
 *
 * Two declarations of one shape can drift; a law in `@corvic/live-ui` holds them together,
 * as the package that has both in scope and passes the runtime's rows into these functions.
 */
/**
 * What a column means, separate from how the engine stores it.
 *
 * Open: membership grows additively, so a consumer must have a default branch. A catalog
 * that threw on an unrecognized role would break on the next runtime version.
 */
export type ColumnRole = "measure" | "dimension" | "time" | "identifier" | "url" | (string & {});
/**
 * Which of the two things a temporal column can hold.
 *
 * A day is the same day in every zone; an instant is a different clock reading in each. Both
 * arrive as a count of milliseconds, so this is the distinction a reader of a value cannot
 * recover and a describer of a column can.
 */
export type Clock = "day" | "instant";
/** What an app can say about a column that the file cannot. */
export interface ColumnMeta {
    readonly role?: ColumnRole;
    /** For a temporal column, whether it holds a day or an instant. */
    readonly clock?: Clock;
    /** Free-form unit, e.g. "USD", "ms", "count". Formatters interpret it. */
    readonly unit?: string;
    readonly label?: string;
}
/** One row of an answer, keyed by column name. */
export type Row = Record<string, unknown>;
/** What one cell of an answer can hold, and what a parameter can be bound to. */
export type SqlValue = string | number | bigint | boolean | null;
