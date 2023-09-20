"use client";

import {
  PaginationItem as MuiPaginationItem,
  PaginationRenderItemParams as MuiPaginationRenderItemParams,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

import { QuizSubmissionStatus } from "@/types";

import { useQuizConvocatoryAttemptRenderer } from "../../../../context";
import { PAGE_SIZE } from "../../../../config";

export interface PaginationItemProps {
  params: MuiPaginationRenderItemParams;
}

export const PaginationItem: React.FC<PaginationItemProps> = ({ params }) => {
  const { attempt } = useQuizConvocatoryAttemptRenderer();

  const {
    formState: { errors },
  } = useFormContext();

  const questions = params.page
    ? attempt.submission?.questions.slice(
        (params.page - 1) * PAGE_SIZE,
        params.page * PAGE_SIZE
      )
    : [];

  const incompleted = questions?.some((question) =>
    Boolean(errors[question.id])
  );

  return (
    <MuiPaginationItem
      {...params}
      sx={{
        ...(incompleted &&
          attempt.submission?.status !== QuizSubmissionStatus.SUBMITTED && {
            color: (theme) => theme.palette.error.contrastText,
            backgroundColor: (theme) => theme.palette.error.light,
          }),
      }}
    />
  );
};
