import { zod } from "@/lib";
import { UserStatus, UserRole } from "@/types";

export type CreateUserData = zod.infer<typeof CreateUserSchema>;
export type UpdateUserData = zod.infer<typeof UpdateUserSchema>;

export const UserSchema = zod.object({
  id: zod.string().uuid(),
  name: zod.string().nonempty(),
  email: zod.string().email(),
  image: zod.string().url().nullable(),
  status: zod.enum([UserStatus.ENABLED, UserStatus.DISABLED]),
  role: zod.enum([UserRole.ADMIN, UserRole.USER]),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export const CreateUserSchema = zod.object({
  name: zod.string().nonempty(),
  email: zod.string().email(),
  role: zod.enum([UserRole.ADMIN, UserRole.USER]).default(UserRole.USER),
});

export const UpdateUserSchema = zod
  .object({
    name: zod.string().nonempty(),
    email: zod.string().email(),
    status: zod.enum([UserStatus.ENABLED, UserStatus.DISABLED]),
    role: zod.enum([UserRole.ADMIN, UserRole.USER]),
  })
  .partial();

////////////////
// Re-exports //
////////////////

export * from "./utils";
