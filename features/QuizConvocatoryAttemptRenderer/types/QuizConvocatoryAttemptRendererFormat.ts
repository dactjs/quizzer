export type QuizConvocatoryAttemptRendererFormat =
  keyof typeof QuizConvocatoryAttemptRendererFormat;

export const QuizConvocatoryAttemptRendererFormat = {
  DIGITAL: "DIGITAL",
  PDF: "PDF",
} as const;

export default QuizConvocatoryAttemptRendererFormat;
