/**
 * The JSON a manifest holds: maps name sources, they are not yet Catalogs.
 *
 * `Declaration` is generic so a measured catalog can carry maps to catalogs.
 * Authors and Python validators never see that; they write and check this.
 */
import type { Declaration } from "./catalog";
export type AuthoredDeclaration = Declaration<string>;
