import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";

export interface ControlledQuizQuestionOptionsSelectProps {
  options: string[];
  label: string;
  name: string;
  control: Control<any>;
  required?: boolean;
  disabled?: boolean;
}

export const ControlledQuizQuestionOptionsSelect: React.FC<
  ControlledQuizQuestionOptionsSelectProps
> = ({ options, label, name, control, required, disabled }) => (
  <Controller
    name={name}
    control={control}
    rules={{ required }}
    render={({ field: { value, onChange }, fieldState: { error } }) => (
      <FormControl
        required={required}
        disabled={disabled}
        error={Boolean(error)}
      >
        <InputLabel>{label}</InputLabel>

        <Select
          label={label}
          value={value ?? ""}
          onChange={(value) => onChange(value)}
        >
          <MenuItem value="">
            <em>--</em>
          </MenuItem>

          {options.map((option, index) => (
            <MenuItem key={`${index}.${option}`} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        {error?.message && <FormHelperText>{error.message}</FormHelperText>}
      </FormControl>
    )}
  />
);

export default ControlledQuizQuestionOptionsSelect;
