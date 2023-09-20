import { QuizSubmissionReason } from "@/types";

export function translateQuizSubmissionReason(reason: string): string {
  const translations: Record<string, string> = {
    [QuizSubmissionReason.SUBMITTED]: "Enviado por el usuario",
    [QuizSubmissionReason.TIMEOUT]: "Tiempo agotado",
  };

  return translations[reason] || reason;
}

export default translateQuizSubmissionReason;
