/**
 * Clicks that ask for a browsing context, handed to the host.
 *
 * A sandboxed document without `allow-popups` cannot create one, so
 * `target="_blank"` and a modifier-click produce no navigation, no error, and no
 * console entry. Listening in the capture phase is the only seam the platform
 * leaves: unlike routing, which the Navigation API reports, there is no event for
 * a popup the browser declined to open.
 */
/**
 * Ask the host to open `url` in a new top-level context.
 *
 * `true` once the message is sent, which is as much as this side can know: the
 * host's `window.open` needs the activation from the click that caused this, and
 * awaiting an acknowledgement spends the task that activation lives in. `false`
 * means nobody was asked — a scheme outside {@link OPENABLE_PROTOCOLS}, or a
 * host that did not advertise `corvic:open-external`.
 */
export declare function openExternal(url: string): boolean;
/**
 * Hand outbound clicks under `root` to the host.
 *
 * A destination inside `root` opened in the current context is the router's, and
 * is left alone. Everything else either leaves the bundle or asks for a new
 * context, and both are the host's. A click the host will not take keeps the
 * default the browser gave it.
 */
export declare function installLinkBroker(root: string): () => void;
