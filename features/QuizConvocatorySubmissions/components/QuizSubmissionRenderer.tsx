"use client";

import { useState } from "react";
import { Stack, Divider, Typography, Pagination } from "@mui/material";
import { formatDistance } from "date-fns";
import es from "date-fns/locale/es";

import { calcSubmissionScore } from "@/schemas";

import { QuizSubmissionWithConvocatoryAndUser } from "@/app/api/convocatories/[convocatory_id]/submissions/route";

import QuizQuestionResultRenderer from "./QuizQuestionResultRenderer";

const PAGE_SIZE = 5;

export interface QuizSubmissionRendererProps {
  submission: QuizSubmissionWithConvocatoryAndUser;
}

export const QuizSubmissionRenderer: React.FC<QuizSubmissionRendererProps> = ({
  submission,
}) => {
  const { passed, score, correctAnswersCount } =
    calcSubmissionScore(submission);

  const [page, setPage] = useState<number>(1);

  const count = Math.ceil(submission.results.length / PAGE_SIZE);

  return (
    <Stack
      spacing={2}
      divider={<Divider flexItem />}
      sx={{ position: "relative" }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent={{ xs: "center", md: "space-between" }}
        alignItems="center"
        spacing={2}
        divider={<Divider flexItem />}
        sx={{
          position: "sticky",
          top: 10,
          marginX: (theme) => `${theme.spacing(1)} !important`,
          padding: (theme) => theme.spacing(1, 1.5, 1.5),
          borderRadius: 1,
          backgroundColor: (theme) => theme.palette.background.paper,
          zIndex: (theme) => theme.zIndex.tooltip,
        }}
      >
        <Stack spacing={1} sx={{ textAlign: { xs: "center", md: "left" } }}>
          {submission.endedAt && (
            <Typography sx={{ fontSize: "1em", fontWeight: "bolder" }}>
              - Tiempo empleado:{" "}
              <Typography
                variant="caption"
                sx={{
                  fontSize: "1.25em",
                  fontWeight: "bolder",
                  letterSpacing: "0.1em",
                }}
              >
                {formatDistance(
                  new Date(submission.endedAt),
                  new Date(submission.startedAt),
                  { locale: es }
                )}
              </Typography>
            </Typography>
          )}

          <Typography sx={{ fontSize: "1em", fontWeight: "bolder" }}>
            - Puntuación obtenida:{" "}
            <Typography
              variant="caption"
              color={passed ? "success.main" : "error.main"}
              sx={{
                fontSize: "1.25em",
                fontWeight: "bolder",
                letterSpacing: "0.1em",
              }}
            >
              {score.toFixed(2)}
            </Typography>
          </Typography>

          <Typography sx={{ fontSize: "1em", fontWeight: "bolder" }}>
            - Preguntas correctas respondidas:{" "}
            <Typography
              variant="caption"
              color={passed ? "success.main" : "error.main"}
              sx={{
                fontSize: "1.25em",
                fontWeight: "bolder",
                letterSpacing: "0.1em",
              }}
            >
              {submission.results.length < submission.convocatory.questions
                ? `${correctAnswersCount} / ${submission.results.length}`
                : `${correctAnswersCount} / ${submission.convocatory.questions}`}
            </Typography>
          </Typography>
        </Stack>

        <Stack justifyContent="center" alignItems="center" spacing={1}>
          <Typography variant="h5" align="center">
            {submission.convocatory.version.quiz.subject}
          </Typography>

          <Pagination
            variant="outlined"
            shape="rounded"
            count={count}
            page={page}
            onChange={(_, page) => setPage(page)}
            sx={{ marginLeft: "auto" }}
          />
        </Stack>
      </Stack>

      <Stack spacing={1.5} divider={<Divider flexItem />}>
        {submission.results
          .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
          .map((result, index) => (
            <QuizQuestionResultRenderer
              key={`${index}.${result.question.id}`}
              result={result}
            />
          ))}
      </Stack>
    </Stack>
  );
};

export default QuizSubmissionRenderer;
