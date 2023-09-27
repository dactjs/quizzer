"use client";

import { Paper, Stack, Button } from "@mui/material";
import {
  SkipPrevious as BackIcon,
  SkipNext as NextIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { useFormContext } from "react-hook-form";

import { DeleteCurrentQuizAttemptData } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { QuizSubmissionStatus, QuizSubmissionReason } from "@/types";

import { DeleteResponse } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import { useQuizConvocatoryAttemptRenderer } from "../../context";
import { PAGE_SIZE } from "../../config";
import {
  QuizRendererFormValues,
  QuizConvocatoryAttemptRendererMode,
} from "../../types";

export const Footer: React.FC = () => {
  const { attempt, mode, page, changePage, showResults } =
    useQuizConvocatoryAttemptRenderer();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useFormContext();

  const pagesCount = attempt.submission
    ? Math.ceil(attempt.submission.questions.length / PAGE_SIZE)
    : 0;

  const onSubmit = (values: QuizRendererFormValues) => {
    confirm({
      title: "Terminar intento",
      description:
        "¿Estás seguro de que quieres terminar el intento y enviar tus respuestas actuales?",
    })
      .then(async () => {
        try {
          const url = new URL(
            `${ENDPOINTS.CONVOCATORIES}/${attempt.convocatory.id}/attempts/${attempt.user.email}/current`,
            ENV.NEXT_PUBLIC_SITE_URL
          );

          const data: DeleteCurrentQuizAttemptData = {
            reason: QuizSubmissionReason.SUBMITTED,
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
      })
      .catch(() => undefined);
  };

  return (
    <Stack
      component={Paper}
      direction="row"
      justifyContent="flex-end"
      alignItems="center"
      spacing={1}
      sx={{ padding: (theme) => theme.spacing(1) }}
    >
      {page > 1 && (
        <Button
          variant="contained"
          size="small"
          endIcon={<BackIcon />}
          disabled={isSubmitting}
          onClick={() => changePage(page - 1)}
        >
          Anterior
        </Button>
      )}

      {page < pagesCount && (
        <Button
          variant="contained"
          size="small"
          endIcon={<NextIcon />}
          disabled={isSubmitting}
          onClick={() => changePage(page + 1)}
        >
          Siguiente
        </Button>
      )}

      {page === pagesCount && (
        <LoadingButton
          type="submit"
          variant="contained"
          size="small"
          color="warning"
          loading={isSubmitting}
          disabled={
            attempt.submission?.status === QuizSubmissionStatus.SUBMITTED ||
            mode === QuizConvocatoryAttemptRendererMode.REVIEW
          }
          endIcon={<SendIcon fontSize="small" />}
          onClick={handleSubmit(onSubmit)}
        >
          Terminar intento
        </LoadingButton>
      )}
    </Stack>
  );
};
