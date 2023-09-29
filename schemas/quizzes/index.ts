import { zod } from "@/lib";
import { isEqual } from "@/utils";

/////////////
// Quizzes //
/////////////

export type CreateQuizData = zod.infer<typeof CreateQuizSchema>;
export type UpdateQuizData = zod.infer<typeof UpdateQuizSchema>;

export const QuizSchema = zod.object({
  id: zod.string().uuid(),
  subject: zod.string().nonempty(),
  currentVersionId: zod.string().uuid().nullable(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

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

export const QuizVersionSchema = zod.object({
  id: zod.string().uuid(),
  name: zod.string().nonempty(),
  quizId: zod.string().uuid(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export const CreateQuizVersionSchema = zod.object({
  name: zod.string().nonempty(),
});

export const UpdateQuizVersionSchema = zod
  .object({
    name: zod.string().nonempty(),
  })
  .partial();

///////////////////////
// Questions Options //
///////////////////////

export const QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR = ":::";

export type QuizQuestionOptionData = zod.infer<typeof QuizQuestionOptionSchema>;

export type QuizQuestionOptionType = keyof typeof QuizQuestionOptionType;

export const QuizQuestionOptionType = {
  TEXT: "TEXT",
  IMAGE: "IMAGE",
} as const;

export const QuizQuestionOptionSchema = zod
  .object({
    id: zod.string().uuid(),
    type: zod.enum([QuizQuestionOptionType.TEXT, QuizQuestionOptionType.IMAGE]),
    content: zod.string().nonempty(),
  })
  .refine(
    ({ type, content }) =>
      type === QuizQuestionOptionType.TEXT || content.startsWith("data:image"),
    {
      message: "Content must be a valid image data URL",
      path: ["content"],
    }
  );

///////////////
// Questions //
///////////////

export type CreateQuizQuestionData = zod.infer<typeof CreateQuizQuestionSchema>;
export type UpdateQuizQuestionData = zod.infer<typeof UpdateQuizQuestionSchema>;

export type UpsertQuizVersionQuestionsData = zod.infer<
  typeof UpsertQuizVersionQuestionsSchema
>;

export const QuizQuestionSchema = zod.object({
  id: zod.string().uuid(),
  prompt: zod.string().nonempty(),
  description: zod.string().nullable(),
  options: QuizQuestionOptionSchema.array().min(1),
  answer: QuizQuestionOptionSchema,
  category: zod.string().nonempty(),
  versionId: zod.string().uuid(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export const CreateQuizQuestionSchema = zod
  .object({
    prompt: zod.string().nonempty(),
    description: zod.string().nullish(),
    options: QuizQuestionOptionSchema.array().min(1),
    answer: QuizQuestionOptionSchema,
    category: zod.string().nonempty(),
  })
  .refine(
    ({ options, answer }) => options.some((option) => isEqual(option, answer)),
    {
      message: "Answer must be one of the options",
      path: ["answer"],
    }
  );

export const UpdateQuizQuestionSchema = zod
  .object({
    prompt: zod.string().nonempty().optional(),
    description: zod.string().nullish(),
    options: QuizQuestionOptionSchema.array().min(1),
    answer: QuizQuestionOptionSchema,
    category: zod.string().nonempty().optional(),
  })
  .refine(
    ({ options, answer }) => options.some((option) => isEqual(option, answer)),
    {
      message: "Answer must be one of the options",
      path: ["answer"],
    }
  );

export const UpsertQuizVersionQuestionsSchema =
  CreateQuizQuestionSchema.array();
