import { useCallback } from "react";
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
import { useSWRConfig } from "swr";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { zod } from "@/lib";
import { CreateQuizVersionSchema } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { Quiz } from "@/types";

import { PostResponse } from "@/app/api/quizzes/[quiz_id]/versions/route";

type FormData = zod.infer<typeof schema>;

const schema = CreateQuizVersionSchema;

export interface AddQuizVersionDialogProps extends DialogProps {
  quiz: Quiz;
  onClose: () => void;
}

export const AddQuizVersionDialog: React.FC<AddQuizVersionDialogProps> = ({
  onClose,
  quiz,
  ...rest
}) => {
  const { mutate } = useSWRConfig();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        const url = new URL(
          `${ENDPOINTS.QUIZZES}/${quiz.id}/versions`,
          ENV.NEXT_PUBLIC_SITE_URL
        );

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

        const key = `${ENDPOINTS.QUIZZES}/${quiz.id}/versions`;

        await mutate(key);

        enqueueSnackbar("Versión agregada correctamente", {
          variant: "success",
          onEntered: onClose,
        });
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al agregar la versión",
          { variant: "error" }
        );
      }
    },
    [quiz.id, mutate, enqueueSnackbar, onClose]
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
      <DialogTitle>Agregar versión</DialogTitle>

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

export default AddQuizVersionDialog;
