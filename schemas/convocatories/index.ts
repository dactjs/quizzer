import { zod } from "@/lib";
import { isEqual } from "@/utils";
import { QuizSubmissionStatus, QuizSubmissionReason } from "@/types";

import { QuizQuestionOptionSchema } from "../quizzes";

///////////////////
// Convocatories //
///////////////////

export type CreateQuizConvocatoryData = zod.infer<
  typeof CreateQuizConvocatorySchema
>;

export type UpdateQuizConvocatoryData = zod.infer<
  typeof UpdateQuizConvocatorySchema
>;

export const QuizConvocatorySchema = zod.object({
  id: zod.string().uuid(),
  questions: zod.number().int().positive(),
  attempts: zod.number().int().positive(),
  timer: zod.number().int().positive().nullable(),
  versionId: zod.string().uuid(),
  startAt: zod.date(),
  endAt: zod.date(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

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

export type QuizQuestionResultData = zod.infer<typeof QuizQuestionResultSchema>;

export type CreateQuizSubmissionData = zod.infer<
  typeof CreateQuizSubmissionSchema
>;

export const QuizQuestionResultSchema = zod
  .object({
    answer: QuizQuestionOptionSchema.nullable(),
    question: zod
      .object({
        id: zod.string().uuid(),
        prompt: zod.string().nonempty(),
        description: zod.string().nullish(),
        options: QuizQuestionOptionSchema.array().min(1),
        answer: QuizQuestionOptionSchema,
        category: zod.string().nonempty(),
      })
      .refine(
        ({ options, answer }) =>
          options.some((option) => isEqual(option, answer)),
        {
          message: "Answer must be one of the options",
          path: ["answer"],
        }
      ),
  })
  .refine(
    ({ answer, question }) =>
      !answer || question.options.some((option) => isEqual(option, answer)),
    {
      message: "Answer must be one of the options",
      path: ["answer"],
    }
  );

export const QuizSubmissionSchema = zod.object({
  id: zod.string().uuid(),
  status: zod.enum([
    QuizSubmissionStatus.DRAFT,
    QuizSubmissionStatus.SUBMITTED,
  ]),
  reason: zod
    .enum([QuizSubmissionReason.SUBMITTED, QuizSubmissionReason.TIMEOUT])
    .nullable(),
  results: QuizQuestionResultSchema.array(),
  userId: zod.string().uuid(),
  convocatoryId: zod.string().uuid(),
  startedAt: zod.date(),
  endedAt: zod.date().nullable(),
  createdAt: zod.date(),
  updatedAt: zod.date(),
});

export const CreateQuizSubmissionSchema = zod.object({
  user: zod.string().uuid(),
});

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
