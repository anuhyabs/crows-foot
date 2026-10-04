/**
 * The governed path back out: what a reader's browser may add to the room.
 *
 * The mirror of the engine. A source is declared in `app.yaml` `data[]` and read
 * with SQL; a target is declared in `writes[]` and written through here. Neither
 * is a URL a page assembles, and for the same reason: the link is the governed
 * part, so it belongs to the manifest rather than to whichever page happened to
 * need it.
 *
 * Why this is a module and not four lines of `fetch` in each app: every one of the
 * following is a failure a hand-rolled POST gets wrong, silently, in a reader's
 * browser where nobody is watching.
 *
 * - **The token expires while the app is open.** The user-content cookie a reader
 *   carries lives five minutes and the embedder re-mints it on a half-life timer.
 *   A write that lands in the gap gets a 401 that means "reload", not "failed".
 * - **Appends contend.** Two readers filing at once make the server answer 429
 *   `please retry`; it is telling the truth, and the second attempt succeeds.
 *   {@link fetchRetrying} already spends a jittered budget on exactly that.
 * - **Rows are NDJSON, not JSON.** The server reads the body with `scan_ndjson`
 *   against the target's declared schema. A JSON array is a schema error, and the
 *   message names polars rather than anything the author wrote.
 * - **A path may not leave its target.** The cookie is scoped to the whole ledger,
 *   so the server would accept `../../` into somebody else's artifact. What keeps
 *   an app inside what it declared is this resolution, here.
 */
/** What a target accepts, decided by the root it addresses. */
export type WriteKind = "files" | "rows";
/** One manifest write target, as the host inlined it. */
export interface WriteDeclaration {
    name: string;
    url: string;
    kind: WriteKind;
}
/** A declared target, as a page sees it. */
export interface WriteBinding {
    readonly name: string;
    readonly url: string;
    readonly kind: WriteKind;
}
/**
 * Bytes a page can hand to {@link WriteClient.file}.
 *
 * A view is pinned to a plain `ArrayBuffer` because that is what `fetch` takes: a
 * `SharedArrayBuffer` view is not a `BodyInit`, and no app has one — the sandbox
 * serves nothing cross-origin-isolated.
 */
export type FileBody = Blob | ArrayBuffer | ArrayBufferView<ArrayBuffer> | string;
/** One row of an append: a flat mapping matching the target's declared schema. */
export type WriteRow = Readonly<Record<string, unknown>>;
export interface WriteOptions {
    /** Pass `ctx.signal` so a navigation abandons the request. */
    signal?: AbortSignal;
}
export interface FileWriteOptions extends WriteOptions {
    /**
     * The file's media type, stored beside it and used when it is served back.
     * Defaults to a `Blob`/`File`'s own `type`, then `application/octet-stream`.
     */
    contentType?: string;
}
/** The governed path to writing. A declared target is the whole interface. */
export interface WriteClient {
    /**
     * Put `body` at `path` under the files target `target`.
     *
     * `path` is relative to what the manifest declared and may name directories
     * (`"2026/alice/receipt-01.pdf"`). Writing a path that already holds a file
     * replaces it.
     */
    file(target: string, path: string, body: FileBody, options?: FileWriteOptions): Promise<void>;
    /**
     * Append `rows` to the rows target `target`.
     *
     * Append-only, and every row must match the target's declared schema. An empty
     * list is not an error and sends nothing.
     */
    rows(target: string, rows: readonly WriteRow[], options?: WriteOptions): Promise<void>;
    /** Delete the file at `path` under the files target `target`. */
    remove(target: string, path: string, options?: WriteOptions): Promise<void>;
    /** The targets the manifest declared, and the URL and kind of each. */
    targets(): readonly WriteBinding[];
}
/**
 * Build the client for one app session over what the manifest declared.
 *
 * Called by `mountApp`; a page receives the result as `ctx.write`.
 */
export declare function writeClient(declared: readonly WriteDeclaration[]): WriteClient;
