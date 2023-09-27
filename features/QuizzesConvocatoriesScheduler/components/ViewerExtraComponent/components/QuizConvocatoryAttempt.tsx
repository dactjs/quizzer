import { useState, useCallback } from "react";
import { Stack, Typography, IconButton, Tooltip } from "@mui/material";
import {
  Print as PrintIcon,
  Upload as UploadAnswersIcon,
  CardMembership as GrantCertificate,
  Redeem as RevokeCertificate,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { KeyedMutator } from "swr";

import { CreateCertificateData } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { Certificate } from "@/types";

import { QuizConvocatoryAttempt as Attempt } from "@/app/api/convocatories/[convocatory_id]/attempts/current/route";
import { PostResponse } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import { PostResponse as CertificatesPostResponse } from "@/app/api/convocatories/[convocatory_id]/certificates/route";
import { DeleteResponse as CertificateDeleteResponse } from "@/app/api/certificates/[certificate_id]/route";

import { useQuizConvocatoryAttemptReducer } from "../hooks";

import { QuizConvocatoryAttemptRendererDialog } from "./QuizConvocatoryAttemptRendererDialog";
import { QuizConvocatoryAttemptPDFDialog } from "./QuizConvocatoryAttemptPDFDialog";

type FORMAT = keyof typeof FORMAT;

const FORMAT = {
  DIGITAL: "DIGITAL",
  PDF: "PDF",
} as const;

export interface QuizConvocatoryAttemptProps {
  attempt: Attempt;
  certificate: Certificate | null;
  mutate: KeyedMutator<any>;
}

export const QuizConvocatoryAttempt: React.FC<QuizConvocatoryAttemptProps> = ({
  attempt,
  certificate,
  mutate,
}) => {
  const startAt = new Date(attempt.convocatory.startAt);
  const endAt = new Date(attempt.convocatory.endAt);

  const onTime = startAt <= new Date() && endAt >= new Date();

  const tryable = attempt.submission
    ? attempt.number <= attempt.convocatory.attempts
    : attempt.number < attempt.convocatory.attempts;

  const {
    activeAttempt,
    isQuizConvocatoryAttemptRendererDialogOpen,
    isQuizConvocatoryAttemptPDFDialogOpen,
    openQuizConvocatoryAttemptRendererDialog,
    openQuizConvocatoryAttemptPDFDialog,
    closeQuizConvocatoryAttemptRendererDialog,
    closeQuizConvocatoryAttemptPDFDialog,
  } = useQuizConvocatoryAttemptReducer();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const [loading, setLoading] = useState(false);

  const handleLaunchAttempt = useCallback(
    async (format: FORMAT) => {
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

          const { data: started, error }: PostResponse = await response.json();

          if (error) {
            enqueueSnackbar(error, { variant: "error" });
            return;
          }

          await mutate();

          if (format === FORMAT.DIGITAL) {
            openQuizConvocatoryAttemptRendererDialog(started || attempt);
          } else {
            openQuizConvocatoryAttemptPDFDialog(started || attempt);
          }

          return;
        }

        if (format === FORMAT.DIGITAL) {
          openQuizConvocatoryAttemptRendererDialog(attempt);
        } else {
          openQuizConvocatoryAttemptPDFDialog(attempt);
        }
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
    },
    [
      attempt,
      onTime,
      tryable,
      mutate,
      enqueueSnackbar,
      openQuizConvocatoryAttemptRendererDialog,
      openQuizConvocatoryAttemptPDFDialog,
    ]
  );

  const handleToggleCertificate = useCallback(async () => {
    confirm({
      title: certificate ? "Revocar certificado" : "Otorgar certificado",
      description: certificate
        ? "¿Estás seguro de revocar el certificado?"
        : "¿Estás seguro de otorgar el certificado?",
    })
      .then(async () => {
        try {
          setLoading(true);

          const url = new URL(
            certificate
              ? `${ENDPOINTS.CERTIFICATES}/${certificate.id}`
              : `${ENDPOINTS.CONVOCATORIES}/${attempt.convocatory.id}/certificates`,
            ENV.NEXT_PUBLIC_SITE_URL
          );

          const data: CreateCertificateData = {
            user: attempt.user.id,
          };

          const response = await fetch(url, {
            method: certificate ? "DELETE" : "POST",
            cache: "no-cache",
            ...(!certificate && { body: JSON.stringify(data) }),
          });

          const {
            error,
          }: CertificatesPostResponse | CertificateDeleteResponse =
            await response.json();

          if (error) {
            enqueueSnackbar(error, { variant: "error" });
            return;
          }

          await mutate();

          enqueueSnackbar(
            certificate
              ? "El certificado ha sido revocado exitosamente"
              : "El certificado ha sido otorgado exitosamente",
            { variant: "success" }
          );
        } catch (error) {
          enqueueSnackbar(
            error instanceof Error
              ? error.message
              : certificate
              ? "Ha ocurrido un error al revocar el certificado"
              : "Ha ocurrido un error al otorgar el certificado",
            { variant: "error" }
          );
        } finally {
          setLoading(false);
        }
      })
      .catch(() => undefined);
  }, [attempt, certificate, mutate, enqueueSnackbar, confirm]);

  return (
    <>
      {isQuizConvocatoryAttemptRendererDialogOpen && activeAttempt && (
        <QuizConvocatoryAttemptRendererDialog
          fullScreen
          maxWidth="md"
          open={isQuizConvocatoryAttemptRendererDialogOpen}
          onClose={closeQuizConvocatoryAttemptRendererDialog}
          attempt={activeAttempt}
        />
      )}

      {isQuizConvocatoryAttemptPDFDialogOpen && activeAttempt && (
        <QuizConvocatoryAttemptPDFDialog
          fullScreen
          maxWidth="md"
          open={isQuizConvocatoryAttemptPDFDialogOpen}
          onClose={closeQuizConvocatoryAttemptPDFDialog}
          attempt={activeAttempt}
        />
      )}

      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        <Stack>
          <Typography
            fontWeight="bolder"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              lineClamp: 3,
              textOverflow: "ellipsis",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {`${attempt.user.name} (${attempt.user.email})`}
          </Typography>

          <Typography
            variant="caption"
            color="textSecondary"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 3,
              lineClamp: 3,
              textOverflow: "ellipsis",
              overflow: "hidden",
              wordBreak: "break-word",
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

        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Generar examen en formato PDF">
            <span>
              <IconButton
                disabled={loading || !tryable}
                onClick={() => handleLaunchAttempt(FORMAT.PDF)}
              >
                <PrintIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip title="Cargar respuestas manualmente">
            <span>
              <IconButton
                disabled={loading || !tryable}
                onClick={() => handleLaunchAttempt(FORMAT.DIGITAL)}
              >
                <UploadAnswersIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Tooltip
            title={certificate ? "Revocar certificado" : "Otorgar certificado"}
          >
            <span>
              <IconButton
                disabled={loading || attempt.number < 1}
                onClick={handleToggleCertificate}
              >
                {certificate ? (
                  <RevokeCertificate color="error" />
                ) : (
                  <GrantCertificate />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>
    </>
  );
};

export default QuizConvocatoryAttempt;
