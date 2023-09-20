"use client";

import {
  Paper,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

import { QuizQuestion, QuizSubmissionStatus } from "@/types";

import { useQuizConvocatoryAttemptRenderer } from "../../../../context";
import { QuizRendererFormValues } from "../../../../types";

export interface QuestionReviewProps {
  question: QuizQuestion;
}

export const QuestionReview: React.FC<QuestionReviewProps> = ({ question }) => {
  const { attempt } = useQuizConvocatoryAttemptRenderer();

  const { watch } = useFormContext<QuizRendererFormValues>();

  const value = watch(question.id);

  const feedback = question.options.includes(value)
    ? `Tu respuesta: ${value}`
    : "Pregunta no respondida";

  const isCorrect = question.answer === value;

  return (
    <Paper
      elevation={4}
      sx={{
        padding: (theme) => theme.spacing(2),

        ...(attempt.submission?.status === QuizSubmissionStatus.SUBMITTED && {
          color: (theme) =>
            isCorrect
              ? `${theme.palette.success.contrastText} !important`
              : `${theme.palette.error.contrastText} !important`,

          backgroundColor: (theme) =>
            isCorrect ? theme.palette.success.light : theme.palette.error.light,
        }),
      }}
    >
      <ListItem sx={{ color: "inherit !important" }}>
        <ListItemText
          primary={`Enunciado: ${question.prompt}`}
          secondary={feedback}
          primaryTypographyProps={{ sx: { color: "inherit !important" } }}
          secondaryTypographyProps={{
            color: "inherit !important",

            ...(!question.options.includes(value) && {
              sx: {
                fontWeight: "bolder",
                color: (theme) => theme.palette.error.main,
              },
            }),
          }}
        />

        <ListItemIcon>
          <Chip
            size="small"
            label={question.category}
            color={
              attempt.submission?.status === QuizSubmissionStatus.SUBMITTED
                ? isCorrect
                  ? "success"
                  : "error"
                : "default"
            }
          />
        </ListItemIcon>
      </ListItem>
    </Paper>
  );
};
