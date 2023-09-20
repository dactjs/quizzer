import { prisma } from "@/lib";
import { QuizQuestion } from "@/types";

type Params = {
  version: string;
  quantity: number;
};

export async function getQuestions(params: Params): Promise<QuizQuestion[]> {
  const questions = await prisma.quizQuestion.findMany({
    where: { version: { id: params.version } },
  });

  const categories = Array.from(
    new Set(questions.map((question) => question.category))
  );

  const maxQuestionsPerCategory = Math.floor(
    params.quantity / categories.length
  );

  const questionsByCategory = categories.reduce((acc, category) => {
    acc[category] = questions
      .filter((question) => question.category === category)
      .sort(() => Math.random() - 0.5)
      .slice(0, maxQuestionsPerCategory);

    return acc;
  }, {} as Record<string, QuizQuestion[]>);

  const questionsToReturn = Object.values(questionsByCategory).flat();

  if (questionsToReturn.length < params.quantity) {
    const questionsNotIncluded = questions.filter(
      (question) => !questionsToReturn.includes(question)
    );

    const questionsToComplete = questionsNotIncluded
      .sort(() => Math.random() - 0.5)
      .slice(0, params.quantity - questionsToReturn.length);

    return questionsToReturn.concat(questionsToComplete);
  }

  return questionsToReturn.slice(0, params.quantity);
}
