"use client";

import { FormControlLabel, Switch } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { QuizSubmissionStatus } from "@/types";

import { useQuizConvocatoryAttemptRenderer } from "../../context";
import { QuizConvocatoryAttemptRendererMode } from "../../types";

export const ModeSwitch: React.FC = () => {
  const { attempt, mode, changeMode } = useQuizConvocatoryAttemptRenderer();

  const {
    formState: { isSubmitting },
  } = useFormContext();

  const label =
    mode === QuizConvocatoryAttemptRendererMode.ATTEMPT
      ? "Activar revisión"
      : "Desactivar revisión";

  const disabled =
    !attempt.submission ||
    attempt.submission.questions.length === 0 ||
    attempt.submission.status === QuizSubmissionStatus.SUBMITTED ||
    isSubmitting;

  const handleChange = () =>
    mode === QuizConvocatoryAttemptRendererMode.ATTEMPT
      ? changeMode(QuizConvocatoryAttemptRendererMode.REVIEW)
      : changeMode(QuizConvocatoryAttemptRendererMode.ATTEMPT);

  return (
    <FormControlLabel
      control={<Switch />}
      checked={mode === QuizConvocatoryAttemptRendererMode.REVIEW}
      label={label}
      disabled={disabled}
      onChange={handleChange}
    />
  );
};
