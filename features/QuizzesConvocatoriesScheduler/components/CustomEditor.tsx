import { useCallback } from "react";
import {
  Stack,
  Divider,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { renderTimeViewClock } from "@mui/x-date-pickers";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import type {
  ProcessedEvent,
  SchedulerHelpers,
} from "@aldabil/react-scheduler/types";
import { useForm, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z as zod } from "zod";

import { ControlledQuizzesVersionsAutocomplete } from "@/features/ControlledQuizzesVersionsAutocomplete";
import { ControlledUsersAutocomplete } from "@/features/ControlledUsersAutocomplete";
import { ControlledDateTimePicker, NumberField } from "@/components";
import {
  EntitySchema,
  CreateQuizConvocatoryData,
  UpdateQuizConvocatoryData,
} from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";

import { PostResponse } from "@/app/api/convocatories/route";
import { PatchResponse } from "@/app/api/convocatories/[convocatory_id]/route";

type FormData = zod.infer<typeof schema>;

const schema = zod
  .object({
    version: EntitySchema,

    users: EntitySchema.array().min(1),

    startAt: zod.date(),

    endAt: zod.date().refine((value) => value > new Date(), {
      message: "La fecha de finalización debe ser mayor a la fecha actual",
    }),

    questions: zod.number().positive().min(1).or(zod.nan()),

    attempts: zod.number().positive().min(1).or(zod.nan()),

    timer: zod.number().positive().min(1).or(zod.nan()).nullish(),
  })
  .refine((data) => data.startAt < data.endAt, {
    message: "La fecha de finalización debe ser mayor a la fecha de inicio",
    path: ["endAt"],
  });

export interface CustomEditorProps {
  scheduler: SchedulerHelpers;
}

export const CustomEditor: React.FC<CustomEditorProps> = ({ scheduler }) => {
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
      version: scheduler.edited?.data?.version,
      users: scheduler.edited?.data?.users,
      questions: scheduler.edited?.data?.questions ?? 20,
      attempts: scheduler.edited?.data?.attempts ?? 1,
      timer: scheduler.edited?.data?.timer ?? null,

      startAt: scheduler.edited?.data?.startAt
        ? new Date(scheduler.edited.data.startAt)
        : new Date(scheduler.state.start.value),

      endAt: scheduler.edited?.data?.endAt
        ? new Date(scheduler.edited?.data?.endAt)
        : new Date(scheduler.state.end.value),
    },
  });

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        scheduler.loading(true);

        const url = new URL(
          scheduler.edited
            ? `${ENDPOINTS.CONVOCATORIES}/${scheduler.edited.data.id}`
            : ENDPOINTS.CONVOCATORIES,
          ENV.NEXT_PUBLIC_SITE_URL
        );

        const data: CreateQuizConvocatoryData | UpdateQuizConvocatoryData = {
          version: formData.version.id,
          users: formData.users.map((user) => user.id),
          questions: formData.questions || 20,
          attempts: formData.attempts || 1,
          timer: formData.timer || null,
          startAt: formData.startAt.toISOString(),
          endAt: formData.endAt.toISOString(),
        };

        const response = await fetch(url, {
          method: scheduler.edited ? "PATCH" : "POST",
          cache: "no-cache",
          body: JSON.stringify(data),
        });

        const { data: convocatory, error }: PostResponse | PatchResponse =
          await response.json();

        if (error) {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }

        if (!convocatory) return;

        const event: ProcessedEvent = {
          event_id: convocatory.id,
          title: convocatory.version.quiz.subject,
          start: new Date(convocatory.startAt),
          end: new Date(convocatory.endAt),
          data: convocatory,
        };

        scheduler.onConfirm(event, scheduler.edited ? "edit" : "create");
        scheduler.close();

        enqueueSnackbar(
          scheduler.edited
            ? "Convocatoria editada exitosamente"
            : "Convocatoria agregada exitosamente",
          { variant: "success" }
        );
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : scheduler.edited
            ? "Ha ocurrido un error al editar la convocatoria"
            : "Ha ocurrido un error al agregar la convocatoria",
          { variant: "error" }
        );
      } finally {
        scheduler.loading(false);
      }
    },
    [scheduler, enqueueSnackbar]
  );

  const handleOnClose = useCallback(() => {
    if (!isDirty) {
      scheduler.close();
      return;
    }

    confirm({
      title: "Cancelar acción",
      description: "¿Estás seguro de que deseas cancelar esta acción?",
    })
      .then(() => {
        scheduler.close();
        reset();
      })
      .catch(() => undefined);
  }, [scheduler, isDirty, reset, confirm]);

  return (
    <>
      <DialogTitle>
        {scheduler.edited ? "Editar convocatoria" : "Agregar convocatoria"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          autoComplete="off"
          spacing={2}
          divider={<Divider flexItem />}
        >
          <ControlledQuizzesVersionsAutocomplete
            required
            label="Examen"
            name="version"
            control={control}
            disabled={isSubmitting}
          />

          <ControlledUsersAutocomplete
            multiple
            required
            label="Usuarios"
            name="users"
            control={control}
            disabled={isSubmitting}
          />

          <Stack direction="row" spacing={2}>
            <ControlledDateTimePicker
              label="Fecha de inicio"
              name="startAt"
              control={control}
              dateTimePickerProps={{
                disabled: isSubmitting,
                viewRenderers: {
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                },
              }}
              textFieldProps={{ fullWidth: true, required: true }}
            />

            <ControlledDateTimePicker
              label="Fecha de finalización"
              name="endAt"
              control={control as unknown as Control}
              dateTimePickerProps={{
                disabled: isSubmitting,
                viewRenderers: {
                  hours: renderTimeViewClock,
                  minutes: renderTimeViewClock,
                  seconds: renderTimeViewClock,
                },
              }}
              textFieldProps={{ fullWidth: true, required: true }}
            />
          </Stack>

          <NumberField
            fullWidth
            size="small"
            autoComplete="off"
            label="Cantidad de preguntas"
            disabled={isSubmitting}
            inputProps={register("questions", { valueAsNumber: true })}
            error={errors.questions && Boolean(errors.questions)}
            helperText={errors.questions && errors.questions?.message}
          />

          <Stack direction="row" spacing={2}>
            <NumberField
              fullWidth
              size="small"
              autoComplete="off"
              label="Cantidad de intentos"
              disabled={isSubmitting}
              inputProps={register("attempts", { valueAsNumber: true })}
              error={errors.attempts && Boolean(errors.attempts)}
              helperText={errors.attempts && errors.attempts?.message}
            />

            <NumberField
              fullWidth
              size="small"
              autoComplete="off"
              label="Tiempo límite (minutos)"
              disabled={isSubmitting}
              inputProps={register("timer", { valueAsNumber: true })}
              error={errors.timer && Boolean(errors.timer)}
              helperText={errors.timer && errors.timer?.message}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          color="error"
          disabled={isSubmitting}
          onClick={handleOnClose}
        >
          Cancelar
        </Button>

        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          loading={isSubmitting}
          disabled={!isDirty}
          onClick={handleSubmit(onSubmit)}
        >
          {scheduler.edited ? "Editar" : "Agregar"}
        </LoadingButton>
      </DialogActions>
    </>
  );
};

export default CustomEditor;
