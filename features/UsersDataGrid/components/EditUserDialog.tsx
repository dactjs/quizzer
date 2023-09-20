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
import { UpdateUserSchema } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { User } from "@/types";

import { PatchResponse } from "@/app/api/users/[user_id]/route";

import ControlledUserStatusSelect from "./ControlledUserStatusSelect";
import ControlledUserRoleSelect from "./ControlledUserRoleSelect";

type FormData = zod.infer<typeof schema>;

const schema = UpdateUserSchema;

export interface EditUserDialogProps extends DialogProps {
  user: User;
  onClose: () => void;
}

export const EditUserDialog: React.FC<EditUserDialogProps> = ({
  user,
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
    defaultValues: {
      name: user.name,
      email: user.email,
      status: user.status,
      role: user.role,
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        const url = new URL(
          `${ENDPOINTS.USERS}/${user.id}`,
          ENV.NEXT_PUBLIC_SITE_URL
        );

        const response = await fetch(url, {
          method: "PATCH",
          cache: "no-cache",
          body: JSON.stringify(formData),
        });

        const { error }: PatchResponse = await response.json();

        if (error) {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }

        enqueueSnackbar("Usuario editado correctamente", {
          variant: "success",
          onEnter: () => router.refresh(),
          onEntered: onClose,
        });
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al editar el usuario",
          { variant: "error" }
        );
      }
    },
    [user.id, router, enqueueSnackbar, onClose]
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
      <DialogTitle>Editar usuario</DialogTitle>

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

          <ControlledUserStatusSelect
            required
            label="Estado"
            name="status"
            control={control}
            disabled={isSubmitting}
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
          Editar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default EditUserDialog;
