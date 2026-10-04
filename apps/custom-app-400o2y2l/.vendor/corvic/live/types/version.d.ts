/**
 * The runtime's own version, read from the package manifest so there is one place
 * a release is recorded.
 *
 * `@corvic/live` versions independently of the component packages built on it: a
 * bundle vendors a runtime copy, and the version it vendored is what the host↔app
 * `ready` event reports.
 */
export declare const VERSION: string;
