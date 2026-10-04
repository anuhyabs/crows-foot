/**
 * Loading a page's module, retried once on a renewed credential.
 *
 * Module loading is not the fetch API, so `fetchRetrying` never sees it and the
 * credential retry there does not cover it. An `import()` also reports no status
 * — only that it failed — so the status is recovered by asking for the same URL
 * through a request that does report one.
 */
import type { PageModule } from "./mount";
/**
 * Load a route's module, once more on a fresh credential if that is why it failed.
 *
 * `module` is the bundle-relative path the host document named. The failure is
 * the answer whenever a second load could not differ: no `module` to re-request,
 * a URL the origin serves without a credential, or a host that will not renew.
 */
export declare function loadPageModule(load: () => Promise<PageModule>, module: string | undefined): Promise<PageModule>;
