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
import { CreateQuizSchema } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";

import { PostResponse } from "@/app/api/quizzes/route";

type FormData = zod.infer<typeof schema>;

const schema = CreateQuizSchema;

export interface AddQuizDialogProps extends DialogProps {
  onClose: () => void;
}

export const AddQuizDialog: React.FC<AddQuizDialogProps> = ({
  onClose,
  ...rest
}) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstVersionName: "Primera versión" },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        const url = new URL(ENDPOINTS.QUIZZES, ENV.NEXT_PUBLIC_SITE_URL);

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

        enqueueSnackbar("Examen agregado correctamente", {
          variant: "success",
          onEnter: () => router.refresh(),
          onEntered: onClose,
        });
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al agregar el examen",
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
      <DialogTitle>Agregar examen</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" autoComplete="off" spacing={2}>
          <TextField
            required
            autoComplete="off"
            label="Tema"
            disabled={isSubmitting}
            inputProps={register("subject")}
            error={Boolean(errors.subject)}
            helperText={errors.subject?.message}
          />

          <TextField
            required
            autoComplete="off"
            label="Nombre de la primera versión"
            disabled={isSubmitting}
            inputProps={register("firstVersionName")}
            error={Boolean(errors.firstVersionName)}
            helperText={errors.firstVersionName?.message}
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

export default AddQuizDialog;
