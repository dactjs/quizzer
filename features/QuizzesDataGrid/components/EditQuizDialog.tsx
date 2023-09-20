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
import {
  ControlledQuizVersionsAutocomplete,
  VersionOptionTypeSchema,
} from "@/features/ControlledQuizVersionsAutocomplete";
import { UpdateQuizData } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { Quiz } from "@/types";

import { PatchResponse } from "@/app/api/quizzes/[quiz_id]/route";

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object({
    subject: zod.string().nonempty(),
    currentVersion: VersionOptionTypeSchema,
  })
  .partial();

export interface EditQuizDialogProps extends DialogProps {
  quiz: Quiz;
  onClose: () => void;
}

export const EditQuizDialog: React.FC<EditQuizDialogProps> = ({
  quiz,
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
      subject: quiz.subject,
      ...(quiz.currentVersionId && {
        currentVersion: {
          id: quiz.currentVersionId,
          name: "Versión actual",
        },
      }),
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        const url = new URL(
          `${ENDPOINTS.QUIZZES}/${quiz.id}`,
          ENV.NEXT_PUBLIC_SITE_URL
        );

        const data: UpdateQuizData = {
          subject: formData.subject,
          ...(formData.currentVersion && {
            currentVersion: formData.currentVersion.id,
          }),
        };

        const response = await fetch(url, {
          method: "PATCH",
          cache: "no-cache",
          body: JSON.stringify(data),
        });

        const { error }: PatchResponse = await response.json();

        if (error) {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }

        enqueueSnackbar("Examen editado correctamente", {
          variant: "success",
          onEnter: () => router.refresh(),
          onEntered: onClose,
        });
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al editar el examen",
          { variant: "error" }
        );
      }
    },
    [quiz.id, router, enqueueSnackbar, onClose]
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
      <DialogTitle>Editar examen</DialogTitle>

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

          <ControlledQuizVersionsAutocomplete
            quiz={quiz}
            required
            label="Versión actual"
            name="currentVersion"
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

export default EditQuizDialog;
