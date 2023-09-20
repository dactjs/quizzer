export type QuizConvocatoryAttemptRendererMode =
  keyof typeof QuizConvocatoryAttemptRendererMode;

export const QuizConvocatoryAttemptRendererMode = {
  REVIEW: "REVIEW",
  ATTEMPT: "ATTEMPT",
} as const;

export default QuizConvocatoryAttemptRendererMode;
