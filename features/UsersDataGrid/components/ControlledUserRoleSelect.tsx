import {
  FormControl,
  FormHelperText,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Controller, Control } from "react-hook-form";

import { translateUserRole } from "@/schemas";
import { UserRole } from "@/types";

export interface ControlledUserRoleSelectProps {
  label: string;
  name: string;
  control: Control<any>;
  required?: boolean;
  disabled?: boolean;
}

export const ControlledUserRoleSelect: React.FC<
  ControlledUserRoleSelectProps
> = ({ label, name, control, required, disabled }) => {
  const roles = Object.values(UserRole);

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
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {translateUserRole(role)}
              </MenuItem>
            ))}
          </Select>

          {error?.message && <FormHelperText>{error?.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export default ControlledUserRoleSelect;
