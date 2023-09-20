"use client";

import { Stack, List, Divider } from "@mui/material";

import { useQuizConvocatoryAttemptRenderer } from "../../context";
import { PAGE_SIZE } from "../../config";

import { QuestionReview } from "./components";

export const Review: React.FC = () => {
  const { attempt, page } = useQuizConvocatoryAttemptRenderer();

  return (
    <Stack component={List} spacing={1} divider={<Divider flexItem />}>
      {attempt.submission?.questions
        .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
        .map((question) => (
          <QuestionReview key={question.id} question={question} />
        ))}
    </Stack>
  );
};
