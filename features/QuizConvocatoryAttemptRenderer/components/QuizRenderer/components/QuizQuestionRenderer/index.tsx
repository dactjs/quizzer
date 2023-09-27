"use client";

import {
  Paper,
  Stack,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Chip,
} from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

import { QuizQuestion } from "@/types";

import { useQuizConvocatoryAttemptRenderer } from "../../../../context";
import { QuizConvocatoryAttemptRendererMode } from "../../../../types";

export interface QuizQuestionRendererProps {
  question: QuizQuestion;
  visible?: boolean;
}

export const QuizQuestionRenderer: React.FC<QuizQuestionRendererProps> = ({
  question,
  visible,
}) => {
  const { mode } = useQuizConvocatoryAttemptRenderer();

  const {
    formState: { isSubmitting },
    control,
  } = useFormContext();

  const disabled =
    mode === QuizConvocatoryAttemptRendererMode.REVIEW || isSubmitting;

  return (
    <Controller
      name={question.id}
      control={control}
      defaultValue={null}
      rules={{
        required: {
          value: true,
          message: "Debe responder esta pregunta",
        },
      }}
      render={({ fieldState: { error }, field: { value, onChange } }) => (
        <FormControl
          component={Paper}
          elevation={4}
          required
          disabled={disabled}
          error={Boolean(error)}
          sx={{
            padding: (theme) => theme.spacing(4),
            ...(!visible && { display: "none" }),
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <FormLabel sx={{ fontWeight: "bold" }}>{question.prompt}</FormLabel>

            <Chip size="small" label={question.category} />
          </Stack>

          <RadioGroup value={value} onChange={onChange}>
            {question.options.map((option) => (
              <FormControlLabel
                key={option}
                value={option}
                label={option}
                control={<Radio />}
              />
            ))}
          </RadioGroup>

          {(error || question.description) && (
            <FormHelperText
              sx={{
                marginX: 0,
                fontWeight: "bolder",
                color: "text.secondary",
              }}
            >
              {error?.message || question.description}
            </FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};
