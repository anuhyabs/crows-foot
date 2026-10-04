/**
 * Declarations as the app's manifest holds them.
 *
 * A declaration is authored: what a column means, what a number is measured in, which
 * source a key reaches. The app stores them in `app.yaml` beside the bindings they
 * describe. The schema is the manifest's own (`corvic.skills._live_app_semantic`), which
 * validates on write.
 *
 * Parsed and trusted here. What a manifest cannot get wrong by construction is refused
 * where it is written; a measure over a column the data does not have is met against the
 * source in `profiling`.
 */
import type { Declaration } from "./catalog";
/**
 * As much of a parsed manifest as the layer reads.
 *
 * The whole manifest is the runtime's; most of it is about documents. This is the shape a
 * caller must have, so a page holding a boot payload and a test holding a YAML file are
 * the same caller.
 */
export interface Declaring {
    readonly catalogs?: readonly unknown[];
}
/**
 * The declarations a manifest holds, in the order it declares them.
 *
 * Order is `ordered`'s input and a tab strip's: a model is a list, and a manifest that
 * lists its node tables before the facts mapping into them reads the way it is measured.
 */
export declare function declared(manifest: Declaring): readonly Declaration[];
