"use client";

import NextLink from "next/link";
import { Stack, Button } from "@mui/material";
import {
  ContentCopy as CopyIcon,
  QuestionAnswer as SubmissionsIcon,
  PieChart as ReportsIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";

import { QuizConvocatoryWithVersionAndUsers } from "@/app/api/convocatories/[convocatory_id]/route";

import { ENV, PAGES } from "@/constants";

export interface ViewerExtraComponentProps {
  convocatory: QuizConvocatoryWithVersionAndUsers;
}

export const ViewerExtraComponent: React.FC<ViewerExtraComponentProps> = ({
  convocatory,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const handleCopyToClipboard = async () => {
    try {
      const url = new URL(
        `${PAGES.CONVOCATORIES}/${convocatory.id}`,
        ENV.NEXT_PUBLIC_SITE_URL
      );

      await navigator.clipboard.writeText(url.toString());

      enqueueSnackbar("Enlace copiado", {
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    } catch {
      enqueueSnackbar("Error al copiar el enlace", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "center",
        },
      });
    }
  };

  return (
    <Stack spacing={1} sx={{ marginTop: (theme) => theme.spacing(2) }}>
      <Button
        variant="contained"
        size="small"
        color="info"
        endIcon={<CopyIcon />}
        onClick={handleCopyToClipboard}
      >
        Copiar enlace
      </Button>

      <Stack
        direction="row"
        justifyContent="flex-end"
        alignItems="center"
        spacing={1}
        sx={{
          marginTop: (theme) => theme.spacing(1),
          paddingY: (theme) => theme.spacing(1),
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          LinkComponent={NextLink}
          href={`${PAGES.ADMIN_AGENDA}/convocatories/${convocatory.id}`}
          target="_blank"
          variant="contained"
          fullWidth
          size="small"
          color="primary"
          endIcon={<SubmissionsIcon />}
          sx={{ display: "flex" }}
        >
          Ver respuestas
        </Button>

        <Button
          LinkComponent={NextLink}
          href={`${PAGES.ADMIN_REPORTS}/convocatories/${convocatory.id}`}
          target="_blank"
          variant="contained"
          fullWidth
          size="small"
          color="primary"
          endIcon={<ReportsIcon />}
          sx={{ display: "flex" }}
        >
          Reportes
        </Button>
      </Stack>
    </Stack>
  );
};

export default ViewerExtraComponent;
