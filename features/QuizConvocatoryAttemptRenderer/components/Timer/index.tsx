"use client";

import { Typography } from "@mui/material";

import { useQuizConvocatoryAttemptRenderer } from "../../context";

import { useTimer } from "./hooks";

export const Timer: React.FC = () => {
  const { attempt } = useQuizConvocatoryAttemptRenderer();

  const { timeElapsed, remaining } = useTimer();

  const format = (time: number) => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");

    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (time % 60).toString().padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          letterSpacing: 1,
          fontFamily: "monospace",
          fontWeight: "bolder",
          color: (theme) =>
            attempt.convocatory.timer && remaining <= 0
              ? theme.palette.error.main
              : theme.palette.text.secondary,
        }}
      >
        {attempt.convocatory.timer
          ? remaining > 0
            ? format(remaining)
            : "Tiempo agotado"
          : format(timeElapsed)}
      </Typography>
    </>
  );
};
