import { zod } from "@/lib";

export const EntitySchema = zod.object({ id: zod.string().uuid() });

////////////////
// Re-exports //
////////////////

export * from "./utils";
export * from "./types";
