"use client";

import { Autocomplete, TextField, Chip } from "@mui/material";
import { Controller, Control } from "react-hook-form";

import { useUsers } from "./hooks";

export interface ControlledUsersAutocompleteProps {
  label: string;
  name: string;
  control: Control<any>;
  multiple?: boolean;
  required?: boolean;
  disabled?: boolean;
  size?: "small" | "medium";
}

export const ControlledUsersAutocomplete: React.FC<
  ControlledUsersAutocompleteProps
> = ({ label, name, control, multiple, required, disabled, size }) => {
  const { loading, validating, data: users, error: serviceError } = useUsers();

  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({
        field: { value, onChange },
        fieldState: { error: fieldError },
      }) => (
        <Autocomplete
          size={size}
          multiple={multiple}
          loading={loading || validating}
          disabled={disabled}
          options={users}
          value={multiple ? value ?? [] : value ?? null}
          onChange={(_, value) => onChange(value)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          getOptionLabel={(option) => `${option.name} (${option.email})`}
          renderInput={(params) => (
            <TextField
              {...params}
              required={required}
              label={label}
              error={Boolean(serviceError) || Boolean(fieldError)}
              helperText={serviceError || fieldError?.message}
            />
          )}
          renderOption={(props, option) => (
            <li {...props} key={option.id}>
              {`${option.name} (${option.email})`}
            </li>
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.id}
                label={`${option.name} (${option.email})`}
              />
            ))
          }
        />
      )}
    />
  );
};
