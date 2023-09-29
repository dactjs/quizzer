import { Box, Autocomplete, TextField, Chip } from "@mui/material";
import { Masonry } from "@mui/lab";
import { Controller, Control } from "react-hook-form";

import { isEqual } from "@/utils";
import {
  QuizQuestionOptionType,
  QuizQuestionOptionData,
  QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR,
} from "@/schemas";

export interface ControlledQuizQuestionOptionsAutocompleteProps {
  options: QuizQuestionOptionData[];
  label: string;
  name: string;
  control: Control<any>;
  required?: boolean;
  disabled?: boolean;
}

export const ControlledQuizQuestionOptionsAutocomplete: React.FC<
  ControlledQuizQuestionOptionsAutocompleteProps
> = ({ options, label, name, control, required, disabled }) => {
  const optionsWithIndex = options.map((option, index) => ({ index, option }));

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Autocomplete
          disabled={disabled}
          options={optionsWithIndex}
          value={value ? value.option : null}
          onChange={(_, value) => onChange(value ? value.option : null)}
          isOptionEqualToValue={({ option }, { option: value }) =>
            isEqual(option, value)
          }
          getOptionLabel={(option) => `Opción ${option.index + 1}`}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              label={label}
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
          renderOption={(props, { option }) => (
            <li {...props} key={option.id}>
              {option.type === QuizQuestionOptionType.TEXT && option.content}

              {option.type === QuizQuestionOptionType.IMAGE && (
                <Masonry columns={3} spacing={2}>
                  {(option.content as string)
                    .split(QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR)
                    .map((image, index) => (
                      <Box key={`${option.id}.${index}`}>
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
              )}
            </li>
          )}
          renderTags={(values, getTagProps) =>
            values.map((value, index) => (
              <Chip
                {...getTagProps({ index })}
                key={value.option.id}
                label={`Opción ${value.index + 1}`}
              />
            ))
          }
        />
      )}
    />
  );
};

export default ControlledQuizQuestionOptionsAutocomplete;
