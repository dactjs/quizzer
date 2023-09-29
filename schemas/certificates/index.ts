import { zod } from "@/lib";

export type CreateCertificateData = zod.infer<typeof CreateCertificateSchema>;

export const CertificateSchema = zod.object({
  id: zod.string().uuid(),
  userId: zod.string().uuid(),
  convocatoryId: zod.string().uuid(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export const CreateCertificateSchema = zod.object({
  user: zod.string().uuid(),
});
