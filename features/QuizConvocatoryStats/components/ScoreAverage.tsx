"use client";

import { Paper, Stack, Divider, Typography, Avatar } from "@mui/material";

import { calcSubmissionScore } from "@/schemas";

import { QuizSubmissionWithConvocatoryAndUser } from "@/app/api/convocatories/[convocatory_id]/submissions/route";

export interface ScoreAverageProps {
  submissions: QuizSubmissionWithConvocatoryAndUser[];
}

export const ScoreAverage: React.FC<ScoreAverageProps> = ({ submissions }) => {
  const highestSubmissionByScore =
    submissions.reduce<QuizSubmissionWithConvocatoryAndUser | null>(
      (prev, current) => {
        if (!prev) return current;

        const { score: prevScore } = calcSubmissionScore(prev);
        const { score: currentScore } = calcSubmissionScore(current);

        return prevScore > currentScore ? prev : current;
      },
      null
    );

  const highestScore = highestSubmissionByScore
    ? calcSubmissionScore(highestSubmissionByScore)
    : null;

  const average =
    submissions.length > 0
      ? submissions.reduce((acc, current) => {
          const { score } = calcSubmissionScore(current);

          return acc + score;
        }, 0) / submissions.length
      : 0;

  return (
    <Stack
      component={Paper}
      justifyContent="center"
      alignItems="center"
      spacing={2}
      divider={<Divider flexItem />}
      sx={{
        padding: (theme) => theme.spacing(2),
        height: "100%",
        textAlign: "center",
        overflow: "auto",
      }}
    >
      {highestSubmissionByScore && (
        <Stack justifyContent="center" alignItems="center" spacing={0.5}>
          <Avatar
            src={highestSubmissionByScore.user.image as string}
            alt={highestSubmissionByScore.user.name}
            sx={{
              marginBottom: (theme) => theme.spacing(1),
              width: 50,
              height: 50,
            }}
          />

          <Typography sx={{ fontSize: "1.10em", fontWeight: "bolder" }}>
            Mayor puntaje obtenido:{" "}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                fontSize: "0.75em",
                fontWeight: "bolder",
                letterSpacing: "0.1em",
              }}
            >
              {highestSubmissionByScore.user.name}
            </Typography>
          </Typography>

          <Typography sx={{ fontSize: "1.10em", fontWeight: "bolder" }}>
            Puntuación obtenida:{" "}
            <Typography
              variant="caption"
              color={highestScore?.passed ? "success.main" : "error.main"}
              sx={{
                fontSize: "0.75em",
                fontWeight: "bolder",
                letterSpacing: "0.1em",
              }}
            >
              {highestScore ? highestScore.score.toFixed(2) : "N/A"}
            </Typography>
          </Typography>
        </Stack>
      )}

      <Stack justifyContent="center" alignItems="center">
        <Typography
          sx={{
            fontSize: "1.25em",
            fontWeight: "bolder",
            letterSpacing: "0.1em",
          }}
        >
          Puntuación promedio
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: "1em", letterSpacing: "0.1em" }}
        >
          {typeof average === "number" ? average.toFixed(2) : "N/A"}
        </Typography>
      </Stack>
    </Stack>
  );
};
