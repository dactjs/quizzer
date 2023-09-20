import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";

import { translateUserStatus } from "@/schemas";
import { UserStatus } from "@/types";

export interface ControlledUserStatusSelectProps {
  label: string;
  name: string;
  control: Control<any>;
  required?: boolean;
  disabled?: boolean;
}

export const ControlledUserStatusSelect: React.FC<
  ControlledUserStatusSelectProps
> = ({ label, name, control, required, disabled }) => {
  const status = Object.values(UserStatus);

  return (
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
            value={value}
            onChange={(value) => onChange(value)}
          >
            {status.map((status) => (
              <MenuItem key={status} value={status}>
                {translateUserStatus(status)}
              </MenuItem>
            ))}
          </Select>

          {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default ControlledUserStatusSelect;
