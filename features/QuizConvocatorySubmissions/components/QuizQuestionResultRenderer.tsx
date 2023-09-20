"use client";

import {
  Paper,
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio,
} from "@mui/material";

import { QuizQuestionResultData } from "@/schemas";

export interface QuizQuestionResultRendererProps {
  result: QuizQuestionResultData;
}

export const QuizQuestionResultRenderer: React.FC<
  QuizQuestionResultRendererProps
> = ({ result }) => {
  const isCorrect = result.answer === result.question.answer;

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

      <RadioGroup defaultValue={result.answer}>
        {result.question.options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            label={option}
            control={<Radio sx={{ color: "inherit !important" }} />}
            slotProps={{ typography: { color: "inherit !important" } }}
          />
        ))}
      </RadioGroup>

      <FormHelperText
        sx={{
          marginX: 0,
          fontWeight: "bold",
          color: "inherit !important",
        }}
      >
        {`Respuesta correcta: ${result.question.answer}`}
      </FormHelperText>
    </FormControl>
  );
};

export default QuizQuestionResultRenderer;
