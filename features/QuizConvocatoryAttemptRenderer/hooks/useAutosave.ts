import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSnackbar } from "notistack";
import { useFormContext } from "react-hook-form";

import { UpdateCurrentQuizAttemptData } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { QuizSubmissionStatus } from "@/types";

import { PutResponse } from "@/app/api/convocatories/[convocatory_id]/attempts/current/route";

import { useQuizConvocatoryAttemptRenderer } from "../context";
import { AUTOSAVE_INTERVAL } from "../config";
import { QuizRendererFormValues } from "../types";

export function useAutosave() {
  const { data: session } = useSession();

  const { attempt } = useQuizConvocatoryAttemptRenderer();

  const { enqueueSnackbar } = useSnackbar();

  const { getValues } = useFormContext<QuizRendererFormValues>();

  useEffect(() => {
    const stopped =
      !attempt?.submission ||
      attempt.submission.status === QuizSubmissionStatus.SUBMITTED;

    if (stopped) return;

    const interval = setInterval(async () => {
      if (stopped) {
        clearInterval(interval);
        return;
      }

      const values = getValues();

      try {
        const email = session?.user?.email;

        const url = new URL(
          `${ENDPOINTS.CONVOCATORIES}/${attempt.convocatory.id}/attempts/current`,
          ENV.NEXT_PUBLIC_SITE_URL
        );

        if (email) url.searchParams.append("email", email);

        const data: UpdateCurrentQuizAttemptData = {
          results: attempt.submission
            ? attempt.submission.questions
                .filter((question) => Boolean(values[question.id]))
                .map((question) => ({
                  answer: values[question.id],
                  question: {
                    id: question.id,
                    prompt: question.prompt,
                    description: question.description,
                    options: question.options,
                    answer: question.answer,
                    category: question.category,
                  },
                }))
            : [],
        };

        const response = await fetch(url, {
          method: "PUT",
          cache: "no-cache",
          body: JSON.stringify(data),
        });

        const { error }: PutResponse = await response.json();

        if (error) {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al auto-guardar el intento",
          { variant: "error" }
        );
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [session?.user?.email, attempt, getValues, enqueueSnackbar]);
}

export default useAutosave;
