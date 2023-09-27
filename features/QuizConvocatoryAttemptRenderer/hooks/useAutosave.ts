import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useFormContext } from "react-hook-form";

import { UpdateCurrentQuizAttemptData } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { QuizSubmissionStatus } from "@/types";

import { PutResponse } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import { useQuizConvocatoryAttemptRenderer } from "../context";
import { AUTOSAVE_INTERVAL } from "../config";
import {
  QuizConvocatoryAttemptRendererFormat,
  QuizRendererFormValues,
} from "../types";

export function useAutosave() {
  const { format, attempt } = useQuizConvocatoryAttemptRenderer();

  const { enqueueSnackbar } = useSnackbar();

  const { getValues } = useFormContext<QuizRendererFormValues>();

  useEffect(() => {
    const stopped =
      format === QuizConvocatoryAttemptRendererFormat.PDF ||
      !attempt.submission ||
      attempt.submission.status === QuizSubmissionStatus.SUBMITTED;

    if (stopped) return;

    const interval = setInterval(async () => {
      if (stopped) {
        clearInterval(interval);
        return;
      }

      if (document.visibilityState === "hidden") return;

      const values = getValues();

      try {
        const url = new URL(
          `${ENDPOINTS.CONVOCATORIES}/${attempt.convocatory.id}/attempts/${attempt.user.email}/current`,
          ENV.NEXT_PUBLIC_SITE_URL
        );

        const data: UpdateCurrentQuizAttemptData = {
          results: attempt.submission
            ? attempt.submission.questions.map((question) => ({
                answer: values[question.id] || null,
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
  }, [format, attempt, getValues, enqueueSnackbar]);
}

export default useAutosave;
