import { useState, useEffect, useMemo, useCallback } from "react";
import { useSnackbar } from "notistack";
import { useFormContext } from "react-hook-form";
import { differenceInSeconds } from "date-fns";

import { DeleteCurrentQuizAttemptData } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { QuizSubmissionStatus, QuizSubmissionReason } from "@/types";

import { DeleteResponse } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import { useQuizConvocatoryAttemptRenderer } from "../../../../context";
import {
  QuizConvocatoryAttemptRendererFormat,
  QuizRendererFormValues,
} from "../../../../types";

import { calcTimeRemaining } from "../../utils";

export function useTimer() {
  const { format, attempt, showResults } = useQuizConvocatoryAttemptRenderer();

  const { enqueueSnackbar } = useSnackbar();

  const { getValues } = useFormContext<QuizRendererFormValues>();

  const startedAt = useMemo(
    () => new Date(attempt.submission?.startedAt || Date.now()),
    [attempt.submission]
  );

  const timer = attempt.convocatory.timer;

  const [timeElapsed, setTimeElapsed] = useState<number>(() =>
    differenceInSeconds(Date.now(), startedAt)
  );

  const [remaining, setRemaining] = useState<number>(() =>
    calcTimeRemaining(startedAt, timer || 0)
  );

  const handleVisibilityChange = useCallback(() => {
    if (document.visibilityState === "visible") {
      setTimeElapsed(differenceInSeconds(Date.now(), startedAt));

      if (timer && remaining > 0) {
        const calcRemaining = calcTimeRemaining(startedAt, timer);
        setRemaining(calcRemaining);
      }
    }
  }, [startedAt, timer, remaining]);

  useEffect(() => {
    const stopped =
      format === QuizConvocatoryAttemptRendererFormat.PDF ||
      !attempt.submission ||
      attempt.submission.status === QuizSubmissionStatus.SUBMITTED;

    if (stopped) return;

    const interval = setInterval(async () => {
      if (stopped) {
        clearInterval(interval);

        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );

        return;
      }

      setTimeElapsed((prev) => prev + 1);

      if (timer && remaining > 0) {
        setRemaining((prev) => prev - 1);
      }

      if (timer && remaining <= 0) {
        clearInterval(interval);

        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );

        const values = getValues();

        try {
          const url = new URL(
            `${ENDPOINTS.CONVOCATORIES}/${attempt.convocatory.id}/attempts/${attempt.user.email}/current`,
            ENV.NEXT_PUBLIC_SITE_URL
          );

          const data: DeleteCurrentQuizAttemptData = {
            reason: QuizSubmissionReason.TIMEOUT,
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
            method: "DELETE",
            cache: "no-cache",
            body: JSON.stringify(data),
          });

          const { data: ended, error }: DeleteResponse = await response.json();

          if (error) {
            enqueueSnackbar(error, { variant: "error" });
            return;
          }

          if (ended) showResults(ended);
        } catch (error) {
          enqueueSnackbar(
            error instanceof Error
              ? error.message
              : "Ha ocurrido un error al terminar el intento",
            { variant: "error" }
          );
        }
      }
    }, 1000);

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [
    format,
    attempt,
    startedAt,
    timer,
    remaining,
    handleVisibilityChange,
    showResults,
    getValues,
    enqueueSnackbar,
  ]);

  return {
    timeElapsed,
    remaining,
  };
}

export default useTimer;
