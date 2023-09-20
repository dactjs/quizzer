"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  AddCircle as AddIcon,
  Edit as EditIcon,
  Quiz as QuestionsIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";

import { EnhancedDataGrid } from "@/components";
import { getShortUUID } from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { Quiz } from "@/types";

import { DeleteResponse } from "@/app/api/quizzes/[quiz_id]/route";

import { useQuizzesDataGridReducer } from "./hooks";
import {
  AddQuizDialog,
  EditQuizDialog,
  ManageQuizQuestionsDialog,
} from "./components";

export interface QuizzesDataGridProps {
  title: string;
  quizzes: Quiz[];
}

export const QuizzesDataGrid: React.FC<QuizzesDataGridProps> = ({
  title,
  quizzes,
}) => {
  const router = useRouter();

  const {
    isAddQuizDialogOpen,
    openAddQuizDialog,
    closeAddQuizDialog,
    quizToEdit,
    isEditQuizDialogOpen,
    openEditQuizDialog,
    closeEditQuizDialog,
    isManageQuizQuestionsDialogOpen,
    openManageQuizQuestionsDialog,
    closeManageQuizQuestionsDialog,
  } = useQuizzesDataGridReducer();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const handleDelete = useCallback(
    async (id: string) => {
      confirm({
        title: "Eliminar examen",
        description: "¿Estás seguro de que quieres eliminar este examen?",
      })
        .then(async () => {
          try {
            const url = new URL(
              `${ENDPOINTS.QUIZZES}/${id}`,
              ENV.NEXT_PUBLIC_SITE_URL
            );

            const response = await fetch(url, {
              method: "DELETE",
              cache: "no-cache",
            });

            const { error }: DeleteResponse = await response.json();

            if (error) {
              enqueueSnackbar(error, { variant: "error" });
              return;
            }

            enqueueSnackbar("Examen eliminado correctamente", {
              variant: "success",
              onEntered: () => router.refresh(),
            });
          } catch (error) {
            enqueueSnackbar(
              error instanceof Error
                ? error.message
                : "Ha ocurrido un error al eliminar el examen",
              { variant: "error" }
            );
          }
        })
        .catch(() => undefined);
    },
    [router, confirm, enqueueSnackbar]
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "actions",
        headerName: "Acciones",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 150,
        renderCell: ({ id, row }) => (
          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={() => openEditQuizDialog(row as Quiz)}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Administrar banco de preguntas">
              <IconButton
                size="small"
                onClick={() => openManageQuizQuestionsDialog(row as Quiz)}
              >
                <QuestionsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Borrar" onClick={() => handleDelete(id as string)}>
              <IconButton size="small" color="error">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
      {
        field: "id",
        headerName: "ID",
        headerAlign: "left",
        align: "left",
        width: 100,
        valueFormatter: ({ value }) => getShortUUID(value),
      },
      {
        field: "subject",
        headerName: "Tema",
        headerAlign: "center",
        align: "center",
        minWidth: 250,
        flex: 1,
      },
      {
        field: "updatedAt",
        headerName: "Última modificación",
        headerAlign: "right",
        align: "right",
        minWidth: 175,
        valueFormatter: ({ value }) => new Date(value).toLocaleDateString(),
      },
    ],
    [openEditQuizDialog, openManageQuizQuestionsDialog, handleDelete]
  );

  return (
    <>
      {isAddQuizDialogOpen && (
        <AddQuizDialog
          fullWidth
          open={isAddQuizDialogOpen}
          onClose={closeAddQuizDialog}
        />
      )}

      {isEditQuizDialogOpen && quizToEdit && (
        <EditQuizDialog
          fullWidth
          open={isEditQuizDialogOpen}
          onClose={closeEditQuizDialog}
          quiz={quizToEdit}
        />
      )}

      {isManageQuizQuestionsDialogOpen && quizToEdit && (
        <ManageQuizQuestionsDialog
          fullScreen
          open={isManageQuizQuestionsDialogOpen}
          onClose={closeManageQuizQuestionsDialog}
          quiz={quizToEdit}
        />
      )}

      <Box component={Paper} sx={{ height: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            height: 75,
            paddingX: (theme) => theme.spacing(2),
            borderBottom: (theme) => `1px dashed ${theme.palette.divider}`,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
              lineClamp: 1,
              textOverflow: "ellipsis",
              overflow: "hidden",
              wordBreak: "break-word",
            }}
          >
            {title}
          </Typography>

          <Stack direction="row" spacing={0.25}>
            <IconButton size="small" onClick={() => router.refresh()}>
              <RefreshIcon />
            </IconButton>

            <IconButton size="small" onClick={openAddQuizDialog}>
              <AddIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Box sx={{ height: "calc(100% - 75px)" }}>
          <EnhancedDataGrid
            columns={columns}
            rows={quizzes}
            disableColumnMenu
            disableRowSelectionOnClick
            sx={{ border: "none" }}
          />
        </Box>
      </Box>
    </>
  );
};
