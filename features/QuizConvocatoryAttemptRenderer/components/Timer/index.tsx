"use client";

import { Typography } from "@mui/material";

import { useQuizConvocatoryAttemptRenderer } from "../../context";
import { QuizConvocatoryAttemptRendererFormat } from "../../types";

import { useTimer } from "./hooks";

export const Timer: React.FC = () => {
  const { format, attempt } = useQuizConvocatoryAttemptRenderer();

  const { timeElapsed, remaining } = useTimer();

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600)
      .toString()
      .padStart(2, "0");

    const minutes = Math.floor((time % 3600) / 60)
      .toString()
      .padStart(2, "0");

    const seconds = (time % 60).toString().padStart(2, "0");

    return time > 0 ? `${hours}:${minutes}:${seconds}` : "00:00:00";
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
        {format === QuizConvocatoryAttemptRendererFormat.DIGITAL
          ? attempt.convocatory.timer
            ? remaining > 0
              ? formatTime(remaining)
              : "Tiempo agotado"
            : formatTime(timeElapsed)
          : "Subida manual"}
      </Typography>
    </>
  );
};
