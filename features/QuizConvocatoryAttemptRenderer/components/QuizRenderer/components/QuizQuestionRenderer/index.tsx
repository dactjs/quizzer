"use client";

import { Fragment } from "react";
import {
  Box,
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
import { Masonry } from "@mui/lab";
import { Controller, useFormContext } from "react-hook-form";

import {
  QuizQuestionOptionType,
  QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR,
} from "@/schemas";
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
            userSelect: "none",
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

          <RadioGroup
            value={value}
            onChange={onChange}
            sx={{ paddingY: (theme) => theme.spacing(1.5) }}
          >
            {question.options.map((option) => (
              <Fragment key={option.id}>
                {option.type === QuizQuestionOptionType.TEXT && (
                  <FormControlLabel
                    value={option.id}
                    label={option.content}
                    control={<Radio />}
                  />
                )}

                {option.type === QuizQuestionOptionType.IMAGE && (
                  <FormControlLabel
                    value={option.id}
                    label={
                      <Masonry columns={{ xs: 2, sm: 3, md: 5 }} spacing={2}>
                        {option.content
                          .split(QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR)
                          .map((image, index) => (
                            <Box key={index}>
                              <Box
                                component="img"
                                loading="lazy"
                                alt={`Imagen ${index + 1}`}
                                src={image}
                                sx={{
                                  display: "block",
                                  width: "100%",
                                  height: "auto",
                                }}
                              />
                            </Box>
                          ))}
                      </Masonry>
                    }
                    control={<Radio />}
                  />
                )}
              </Fragment>
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
