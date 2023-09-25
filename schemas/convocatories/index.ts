import { zod } from "@/lib";
import { QuizSubmissionReason } from "@/types";

///////////////////
// Convocatories //
///////////////////

export type CreateQuizConvocatoryData = zod.infer<
  typeof CreateQuizConvocatorySchema
>;

export type UpdateQuizConvocatoryData = zod.infer<
  typeof UpdateQuizConvocatorySchema
>;

export const CreateQuizConvocatorySchema = zod.object({
  questions: zod.number().int().positive(),
  attempts: zod.number().int().positive(),
  timer: zod.number().int().positive().nullable(),
  version: zod.string().uuid(),
  users: zod.string().uuid().array(),
  startAt: zod.string().datetime(),
  endAt: zod.string().datetime(),
});

export const UpdateQuizConvocatorySchema = zod
  .object({
    questions: zod.number().int().positive(),
    attempts: zod.number().int().positive(),
    timer: zod.number().int().positive().nullable(),
    version: zod.string().uuid(),
    users: zod.string().uuid().array(),
    startAt: zod.string().datetime(),
    endAt: zod.string().datetime(),
  })
  .partial();

/////////////////
// Submissions //
/////////////////

export type CreateQuizSubmissionData = zod.infer<
  typeof CreateQuizSubmissionSchema
>;

export type QuizQuestionResultData = zod.infer<typeof QuizQuestionResultSchema>;

export const CreateQuizSubmissionSchema = zod.object({
  user: zod.string().uuid(),
});

export const QuizQuestionResultSchema = zod
  .object({
    answer: zod.string().nonempty().nullable(),
    question: zod
      .object({
        id: zod.string().uuid(),
        prompt: zod.string().nonempty(),
        description: zod.string().nullish(),
        options: zod.string().nonempty().array().min(1),
        answer: zod.string().nonempty(),
        category: zod.string().nonempty(),
      })
      .refine((data) => data.options.includes(data.answer), {
        message: "Answer must be one of the options",
        path: ["answer"],
      }),
  })
  .refine(
    (data) =>
      typeof data.answer !== "string" ||
      data.question.options.includes(data.answer),
    {
      message: "Answer must be one of the options",
      path: ["answer"],
    }
  );

//////////////
// Attempts //
//////////////

export type UpdateCurrentQuizAttemptData = zod.infer<
  typeof UpdateCurrentQuizAttemptSchema
>;

export type DeleteCurrentQuizAttemptData = zod.infer<
  typeof DeleteCurrentQuizAttemptSchema
>;

export const UpdateCurrentQuizAttemptSchema = zod.object({
  results: QuizQuestionResultSchema.array(),
});

export const DeleteCurrentQuizAttemptSchema = zod.object({
  reason: zod.enum([
    QuizSubmissionReason.SUBMITTED,
    QuizSubmissionReason.TIMEOUT,
  ]),
  results: QuizQuestionResultSchema.array(),
});

////////////////
// Re-exports //
////////////////

export * from "./utils";
