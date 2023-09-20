"use client";

import { Pagination as MuiPagination } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { useQuizConvocatoryAttemptRenderer } from "../../context";
import { PAGE_SIZE } from "../../config";

import { PaginationItem } from "./components";

export const Pagination: React.FC = () => {
  const { attempt, page, changePage } = useQuizConvocatoryAttemptRenderer();

  const {
    formState: { isSubmitting },
  } = useFormContext();

  const count = attempt.submission
    ? Math.ceil(attempt.submission.questions.length / PAGE_SIZE)
    : 0;

  return (
    <MuiPagination
      variant="outlined"
      shape="rounded"
      hidePrevButton
      hideNextButton
      disabled={isSubmitting}
      count={count}
      boundaryCount={count}
      page={page}
      onChange={(_, page) => changePage(page)}
      renderItem={(params) => <PaginationItem params={params} />}
      sx={{
        overflow: { md: "auto" },

        ".MuiPagination-ul": {
          justifyContent: "center",
          alignItems: "center",
          gap: (theme) => theme.spacing(0.5),
          padding: 0,
          paddingBottom: (theme) => theme.spacing(1),
        },

        ".MuiPaginationItem-root": { margin: 0 },
      }}
    />
  );
};
