import { useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogProps,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { zod } from "@/lib";
import { CreateUserSchema } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { UserRole } from "@/types";

import { PostResponse } from "@/app/api/users/route";

import ControlledUserRoleSelect from "./ControlledUserRoleSelect";

type FormData = zod.infer<typeof schema>;

const schema = CreateUserSchema;

export interface AddUserDialogProps extends DialogProps {
  onClose: () => void;
}

export const AddUserDialog: React.FC<AddUserDialogProps> = ({
  onClose,
  ...rest
}) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    control,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: UserRole.USER },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        const url = new URL(ENDPOINTS.USERS, ENV.NEXT_PUBLIC_SITE_URL);

        const response = await fetch(url, {
          method: "POST",
          cache: "no-cache",
          body: JSON.stringify(formData),
        });

        const { error }: PostResponse = await response.json();

        if (error) {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }

        enqueueSnackbar("Usuario agregado correctamente", {
          variant: "success",
          onEnter: () => router.refresh(),
          onEntered: onClose,
        });
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al agregar el usuario",
          { variant: "error" }
        );
      }
    },
    [router, enqueueSnackbar, onClose]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      onClose();
      return;
    }

    confirm({
      title: "Cancelar acción",
      description: "¿Estás seguro de que deseas cancelar esta acción?",
    })
      .then(() => {
        onClose();
        reset();
      })
      .catch(() => undefined);
  }, [onClose, isDirty, reset, confirm]);

  return (
    <Dialog {...rest} onClose={handleOnClose}>
      <DialogTitle>Agregar usuario</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TextField
            required
            autoComplete="off"
            label="Nombre"
            disabled={isSubmitting}
            inputProps={register("name")}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
          />

          <TextField
            required
            type="email"
            autoComplete="off"
            label="Correo electrónico"
            disabled={isSubmitting}
            inputProps={register("email")}
            error={Boolean(errors.email)}
            helperText={errors.email?.message}
          />

          <ControlledUserRoleSelect
            required
            label="Rol"
            name="role"
            control={control}
            disabled={isSubmitting}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          disabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        >
          Agregar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
