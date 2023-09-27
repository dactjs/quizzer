import { zod } from "@/lib";

export type CreateCertificateData = zod.infer<typeof CreateCertificateSchema>;

export const CreateCertificateSchema = zod.object({
  user: zod.string().uuid(),
});
