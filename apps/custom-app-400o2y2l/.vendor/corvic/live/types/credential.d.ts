/**
 * The credential this origin's requests carry, and getting a fresh one.
 *
 * An app is served from a per-ledger origin and authenticates by a host-locked
 * cookie the embedding page owns and renews on its own schedule. The frame can
 * neither read that cookie nor renew it, so it learns the cookie has lapsed only
 * by being refused: a lazily imported page module, a query on a source not read
 * until now.
 *
 * A refusal is therefore evidence rather than a failure. It is reported to the
 * page that owns the cookie, and the request is retried once the cookie has
 * actually been replaced.
 */
/** The credential requests are being made under. */
export declare function credentialEpoch(): number;
/**
 * A credential in place newer than `since`, or `false`.
 *
 * `true` without asking when somebody else has already renewed since `since`, so
 * however many requests one expiry refused, one renewal is earned between them.
 */
export declare function renewCredentialSince(since: number): Promise<boolean>;
/** Forget what this module learned. For tests, which mount more than one app. */
export declare function resetCredentialState(): void;
