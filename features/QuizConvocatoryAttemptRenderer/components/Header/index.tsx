"use client";

import { Paper, Stack, Divider, Typography } from "@mui/material";

import { useQuizConvocatoryAttemptRenderer } from "../../context";

export const Header: React.FC = () => {
  const { attempt } = useQuizConvocatoryAttemptRenderer();

  return (
    <Stack
      component={Paper}
      direction={{ xs: "column", md: "row" }}
      justifyContent={{ xs: "center", md: "space-between" }}
      alignItems="center"
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(2) }}
    >
      <Stack>
        <Typography
          variant="h6"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            lineClamp: 3,
            textOverflow: "ellipsis",
            overflow: "hidden",
            wordBreak: "break-word",
          }}
        >
          {attempt.convocatory.version.quiz.subject}
        </Typography>

        {attempt.submission && (
          <Typography
            variant="caption"
            fontWeight="bolder"
            color="textSecondary"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              lineClamp: 3,
              textOverflow: "ellipsis",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {attempt.submission.user.name}
          </Typography>
        )}
      </Stack>

      <Typography
        sx={{
          fontSize: "1.25em",
          fontWeight: "bolder",
          letterSpacing: "0.1em",
        }}
      >
        Intento:{" "}
        <Typography variant="caption" sx={{ fontSize: "0.75em" }}>
          {`${attempt.number} / ${attempt.convocatory.attempts}`}
        </Typography>
      </Typography>
    </Stack>
  );
};
