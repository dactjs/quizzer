import { QuizSubmissionStatus } from "@/types";

export function translateQuizSubmissionStatus(status: string): string {
  const translations: Record<string, string> = {
    [QuizSubmissionStatus.DRAFT]: "Borrador",
    [QuizSubmissionStatus.SUBMITTED]: "Enviado",
  };

  return translations[status] || status;
}

export default translateQuizSubmissionStatus;
