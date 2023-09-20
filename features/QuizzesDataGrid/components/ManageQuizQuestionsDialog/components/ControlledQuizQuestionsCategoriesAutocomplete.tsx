import { useMemo, useCallback } from "react";
import {
  Autocomplete,
  TextField,
  createFilterOptions,
  FilterOptionsState,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";

import { QuizQuestion } from "@/types";

type CategoryOptionType = {
  name: string;
  inputValue?: string;
};

export interface ControlledQuizQuestionsCategoriesAutocompleteProps {
  questions: QuizQuestion[];
  label: string;
  name: string;
  control: Control<any>;
  required?: boolean;
  disabled?: boolean;
}

export const ControlledQuizQuestionsCategoriesAutocomplete: React.FC<
  ControlledQuizQuestionsCategoriesAutocompleteProps
> = ({ questions, label, name, control, required, disabled }) => {
  const options = useMemo<CategoryOptionType[]>(() => {
    const set = new Set(questions.map(({ category }) => category));

    return Array.from(set)
      .map((category) => ({ name: category }))
      .toSorted((a, b) => a.name.localeCompare(b.name));
  }, [questions]);

  const getOptionLabel = useCallback((option: CategoryOptionType | string) => {
    if (typeof option === "string") return option;

    if (option.inputValue) return option.inputValue;

    return option.name;
  }, []);

  const filterOptions = useCallback(
    (
      options: CategoryOptionType[],
      params: FilterOptionsState<CategoryOptionType>
    ) => {
      const filter = createFilterOptions<CategoryOptionType>();

      const filtered = filter(options, params);

      const { inputValue } = params;

      const isExisting = options.some((option) => option.name === inputValue);

      if (inputValue !== "" && !isExisting) {
        filtered.push({
          inputValue,
          name: `${inputValue} (Nueva Categoría)`,
        });
      }

      return filtered;
    },
    []
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <Autocomplete
          freeSolo
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          disabled={disabled}
          options={options}
          value={value ?? null}
          onChange={(_, value) => {
            if (typeof value === "string") return onChange(value);

            if (value && value.inputValue) return onChange(value.inputValue);

            return onChange(value ? value.name : null);
          }}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={getOptionLabel}
          filterOptions={filterOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              label={label}
              error={Boolean(error)}
              helperText={error?.message}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.name}>
              {option.name}
            </li>
          )}
        />
      )}
    />
  );
};

export default ControlledQuizQuestionsCategoriesAutocomplete;
