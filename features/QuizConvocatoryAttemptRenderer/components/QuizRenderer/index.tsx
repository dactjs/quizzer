"use client";

import { Stack } from "@mui/material";

import { NoData } from "@/components";

import { useQuizConvocatoryAttemptRenderer } from "../../context";
import { PAGE_SIZE } from "../../config";

import { QuizQuestionRenderer } from "./components";

export const QuizRenderer: React.FC = () => {
  const { attempt, page } = useQuizConvocatoryAttemptRenderer();

  return attempt.submission && attempt.submission.questions.length > 0 ? (
    <Stack
      component="form"
      noValidate
      sx={{ gap: (theme) => theme.spacing(1) }}
    >
      {attempt.submission.questions.map((question, index) => {
        const visible =
          index >= (page - 1) * PAGE_SIZE && index < page * PAGE_SIZE;

        return (
          <QuizQuestionRenderer
            key={question.id}
            question={question}
            visible={visible}
          />
        );
      })}
    </Stack>
  ) : (
    <NoData message="Este examen no contiene preguntas definidas" />
  );
};
