import { zod } from "@/lib";

/////////////
// Quizzes //
/////////////

export type CreateQuizData = zod.infer<typeof CreateQuizSchema>;
export type UpdateQuizData = zod.infer<typeof UpdateQuizSchema>;

export const CreateQuizSchema = zod.object({
  subject: zod.string().nonempty(),
  firstVersionName: zod.string().nonempty(),
});

export const UpdateQuizSchema = zod
  .object({
    subject: zod.string().nonempty(),
    currentVersion: zod.string().uuid(),
  })
  .partial();

//////////////
// Versions //
//////////////

export type CreateQuizVersionData = zod.infer<typeof CreateQuizVersionSchema>;
export type UpdateQuizVersionData = zod.infer<typeof UpdateQuizVersionSchema>;

export const CreateQuizVersionSchema = zod.object({
  name: zod.string().nonempty(),
});

export const UpdateQuizVersionSchema = zod
  .object({
    name: zod.string().nonempty(),
  })
  .partial();

///////////////
// Questions //
///////////////

export type CreateQuizQuestionData = zod.infer<typeof CreateQuizQuestionSchema>;
export type UpdateQuizQuestionData = zod.infer<typeof UpdateQuizQuestionSchema>;

export type UpsertQuizVersionQuestionsData = zod.infer<
  typeof UpsertQuizVersionQuestionsSchema
>;

export const CreateQuizQuestionSchema = zod.object({
  prompt: zod.string().nonempty(),
  description: zod.string().nullish(),
  options: zod.string().nonempty().array().min(1),
  answer: zod.string().nonempty(),
  category: zod.string().nonempty(),
});

export const UpdateQuizQuestionSchema = zod
  .object({
    prompt: zod.string().nonempty(),
    description: zod.string().nullish(),
    options: zod.string().nonempty().array().min(1),
    answer: zod.string().nonempty(),
    category: zod.string().nonempty(),
  })
  .partial();

export const UpsertQuizVersionQuestionsSchema =
  CreateQuizQuestionSchema.array();
