"use client";

import { Fragment } from "react";
import {
  Box,
  Paper,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio,
} from "@mui/material";
import { Masonry } from "@mui/lab";

import { isEqual } from "@/utils";
import {
  QuizQuestionResultData,
  QuizQuestionOptionType,
  QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR,
} from "@/schemas";

export interface QuizQuestionResultRendererProps {
  result: QuizQuestionResultData;
}

export const QuizQuestionResultRenderer: React.FC<
  QuizQuestionResultRendererProps
> = ({ result }) => {
  const isCorrect =
    result.answer && isEqual(result.answer, result.question.answer);

  const correctAnswerIndex = result.question.options.findIndex((option) =>
    isEqual(option, result.question.answer)
  );

  return (
    <FormControl
      component={Paper}
      required
      disabled
      sx={{
        padding: (theme) => theme.spacing(4),

        color: (theme) =>
          isCorrect
            ? `${theme.palette.success.contrastText} !important`
            : `${theme.palette.error.contrastText} !important`,

        backgroundColor: (theme) =>
          isCorrect ? theme.palette.success.light : theme.palette.error.light,
      }}
    >
      <FormLabel sx={{ color: "inherit !important" }}>
        {result.question.prompt}
      </FormLabel>

      <RadioGroup
        defaultValue={result.answer && result.answer.id}
        sx={{ paddingY: (theme) => theme.spacing(1.5) }}
      >
        {result.question.options.map((option) => (
          <Fragment key={option.id}>
            {option.type === QuizQuestionOptionType.TEXT && (
              <FormControlLabel
                value={option.id}
                label={option.content}
                control={<Radio sx={{ color: "inherit !important" }} />}
                slotProps={{ typography: { color: "inherit !important" } }}
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

      {correctAnswerIndex >= 0 && (
        <FormHelperText
          sx={{
            marginX: 0,
            fontWeight: "bold",
            color: "inherit !important",
          }}
        >
          {`Respuesta correcta: ${correctAnswerIndex + 1}`}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default QuizQuestionResultRenderer;
