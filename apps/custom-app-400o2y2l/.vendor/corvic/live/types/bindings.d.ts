/**
 * What is known against a source name that did not load.
 *
 * A name that never bound is absent from DuckDB's catalog, so a read of it comes
 * back as SQL that cannot resolve rather than as the source being unavailable.
 * A failure is held per name so that a read reports why its own source is
 * missing, and so that name alone can be tried again.
 */
export declare class BindFailures {
    private readonly failures;
    /** Hold `cause` against `name` until it binds. */
    record(name: string, cause: unknown): void;
    /** Forget `name`: it bound. */
    clear(name: string): void;
    /** Why `name` is not bound, or null when nothing is held against it. */
    of(name: string): unknown | null;
    /**
     * The failure behind a read of `sql`, if it names a source that did not load.
     *
     * The name is matched in the SQL the caller wrote, as a whole word and as
     * literal text, so an unbound `issues` answers for a read of `issues` and not
     * for one of `reissues`.
     */
    behind(sql: string): unknown | null;
}
