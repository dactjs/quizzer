import { QuizSubmissionWithConvocatoryAndUser } from "@/app/api/convocatories/[convocatory_id]/submissions/route";
import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import { QuizQuestionResultData } from "@/schemas";

const initialParams: CalcSubmissionScoreParams = {
  passingScore: 70,
};

export type CalcSubmissionScoreParams = {
  passingScore: number;
};

export interface CalcSubmissionScoreReturn {
  correctAnswersCount: number;
  score: number;
  passed: boolean;
}

export type CalculableSubmission =
  | QuizSubmissionWithConvocatoryAndUser
  | QuizConvocatoryAttempt["submission"];

export function calcSubmissionScore(
  submission: CalculableSubmission,
  params = initialParams
): CalcSubmissionScoreReturn {
  const results = submission
    ? (submission.results as QuizQuestionResultData[])
    : [];

  const correctAnswers = results.filter(
    (result) => result.answer === result.question.answer
  );

  const score =
    correctAnswers.length > 0 && results.length > 0
      ? (correctAnswers.length / results.length) * 100
      : 0;

  return {
    correctAnswersCount: correctAnswers.length,
    score,
    passed: score >= params.passingScore,
  };
}

export default calcSubmissionScore;
