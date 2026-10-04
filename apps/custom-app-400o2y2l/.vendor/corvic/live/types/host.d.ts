/**
 * The channel between an app document and the page embedding it.
 *
 * An app renders in an iframe on a ledger origin; everything the two say to each
 * other goes through `postMessage`. This module owns delivery, the target origin,
 * and which sender is answered. Message shapes belong to their senders.
 *
 * Both sides are frozen relative to each other, in opposite directions: a bundle
 * carries the runtime bytes vendored when it was written and never replaces them,
 * while the host deploys continuously. So neither may infer what the other
 * understands, and each announces it — the app in `corvic:ready`, the host in
 * `corvic:host`. An unknown type is ignored on both sides.
 *
 * Vocabulary from the app: `corvic:ready`, `corvic:navigate`, `corvic:error`,
 * `corvic:selection`, `corvic:cancelled`, `corvic:renew-credential`, and
 * `corvic:open-external`. From the host: `corvic:host`, `corvic:credential`, and
 * `corvic:inspect`. The host half is implemented by the embedding application,
 * which is deployed separately from any bundle it renders.
 */
/** Anything addressed to either party. The prefix is what marks it as ours. */
export interface HostMessage {
    readonly type: `corvic:${string}`;
}
/** What this runtime tells the host it speaks, in `corvic:ready`. */
export declare const APP_CAPABILITIES: readonly ["corvic:navigate", "corvic:error", "corvic:selection"];
/**
 * Remember where the host is, so later messages go there.
 *
 * Learned from a message the host sent: the parent is cross-origin, so its
 * location is unreadable. An opaque origin (`"null"`) matches every sandboxed
 * frame; targeting it is equivalent to broadcasting.
 */
export declare function rememberHostOrigin(origin: string): void;
/**
 * Whether the host said it answers `type`, as of now.
 *
 * `false` until the host has answered `corvic:ready`, and for a frame with no
 * host. For callers that can await the answer, {@link hostWillAnswer} reports it
 * once the handshake has settled; this is for the ones inside a user gesture,
 * whose activation an await would spend.
 */
export declare function hostAnswers(type: string): boolean;
/**
 * Whether the host answers `type`, once it has had its say.
 *
 * What a caller wants before deciding a capability is unavailable: the host's
 * answer to `corvic:ready` races everything the app does on boot, so asking
 * synchronously during a first render reads "no" from a host that was about to
 * say yes.
 */
export declare function hostWillAnswer(type: string): Promise<boolean>;
/**
 * Send one message to the embedding page, if there is one.
 *
 * Targeted once anything has arrived from the host. Until then it broadcasts:
 * `ready` is what tells the host an app exists, so it cannot wait for the host
 * to speak first. Nothing sent before then is a secret — the host learns which
 * page is showing and whether it failed, both of which it can see.
 */
export declare function postToHost<M extends HostMessage>(message: M): void;
type Handler = (message: {
    type: string;
} & Record<string, unknown>) => void;
/**
 * Handle `type` when the host sends it.
 *
 * Handlers see only messages the parent sent: one listener for the whole
 * document makes that check once, where no reader can skip it. Registering
 * `type` twice replaces the first — a handler is the runtime's single answer to
 * a type, not a subscription list.
 */
export declare function onHostMessage(type: string, handler: Handler): void;
/**
 * Start listening for the host, before there is anything to handle.
 *
 * `corvic:host` answers `corvic:ready`, so the answer can arrive before any
 * feature that wants a capability has registered for one.
 */
export declare function initHostChannel(): void;
/** Forget what this module learned. For tests, which mount more than one app. */
export declare function resetHostChannel(): void;
export {};
