"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Paper, Stack, Divider, Typography } from "@mui/material";
import { PlayCircle as PlayIcon } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";

import { ENV, ENDPOINTS, PAGES } from "@/constants";

import {
  PostResponse,
  QuizConvocatoryAttempt,
} from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

export interface QuizConvocatoryAttemptLauncherProps {
  attempt: QuizConvocatoryAttempt;
}

export const QuizConvocatoryAttemptLauncher: React.FC<
  QuizConvocatoryAttemptLauncherProps
> = ({ attempt }) => {
  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  const startAt = new Date(attempt.convocatory.startAt);
  const endAt = new Date(attempt.convocatory.endAt);

  const onTime = startAt <= new Date() && endAt >= new Date();

  const tryable = attempt.submission
    ? attempt.number <= attempt.convocatory.attempts
    : attempt.number < attempt.convocatory.attempts;

  const launchAttempt = async () => {
    try {
      setLoading(true);

      if (!onTime) {
        enqueueSnackbar(
          "La fecha programada está fuera de rango. Por favor, verifica la fecha de apertura y cierre.",
          { variant: "error" }
        );

        return;
      }

      if (!tryable) {
        enqueueSnackbar(
          "Ya has realizado el máximo de intentos permitidos para esta convocatoria.",
          { variant: "error" }
        );

        return;
      }

      if (!attempt.submission) {
        const url = new URL(
          `${ENDPOINTS.CONVOCATORIES}/${attempt.convocatory.id}/attempts/${attempt.user.email}/current`,
          ENV.NEXT_PUBLIC_SITE_URL
        );

        const response = await fetch(url, {
          method: "POST",
          cache: "no-cache",
        });

        const { error }: PostResponse = await response.json();

        if (error) {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }
      }

      const path = `${PAGES.CONVOCATORIES}/${attempt.convocatory.id}/attempts/current`;

      router.push(path);
    } catch (error) {
      enqueueSnackbar(
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error al iniciar el intento",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack
      component={Paper}
      spacing={1}
      divider={<Divider flexItem />}
      sx={{ padding: (theme) => theme.spacing(4), textAlign: "center" }}
    >
      <Stack spacing={1}>
        <Typography
          sx={{
            fontSize: "1.25em",
            fontWeight: "bolder",
            letterSpacing: "0.1em",
          }}
        >
          Tema:{" "}
          <Typography variant="caption" sx={{ fontSize: "0.75em" }}>
            {attempt.convocatory.version.quiz.subject}
          </Typography>
        </Typography>

        <Typography
          sx={{
            fontSize: "1.25em",
            fontWeight: "bolder",
            letterSpacing: "0.1em",
          }}
        >
          Fecha:{" "}
          <Typography
            variant="caption"
            color={onTime ? "success.main" : "error.main"}
            sx={{ fontSize: "0.75em" }}
          >
            {`${startAt.toLocaleString()} - ${endAt.toLocaleString()}`}
          </Typography>
        </Typography>

        {attempt.convocatory.timer && (
          <Typography
            sx={{
              fontSize: "1.25em",
              fontWeight: "bolder",
              letterSpacing: "0.1em",
            }}
          >
            Duración:{" "}
            <Typography variant="caption" sx={{ fontSize: "0.75em" }}>
              {`${attempt.convocatory.timer} minutos`}
            </Typography>
          </Typography>
        )}

        <Typography
          sx={{
            fontSize: "1.25em",
            fontWeight: "bolder",
            letterSpacing: "0.1em",
          }}
        >
          Intentos permitidos:{" "}
          <Typography
            variant="caption"
            color={tryable ? "success.main" : "error.main"}
            sx={{ fontSize: "0.75em" }}
          >
            {`${attempt.convocatory.attempts - attempt.number} / ${
              attempt.convocatory.attempts
            }`}
          </Typography>
        </Typography>
      </Stack>

      <LoadingButton
        fullWidth
        variant="contained"
        size="medium"
        loading={loading}
        disabled={!onTime || !tryable}
        endIcon={<PlayIcon />}
        onClick={launchAttempt}
      >
        {attempt.submission ? "Continuar intento" : "Iniciar intento"}
      </LoadingButton>
    </Stack>
  );
};
