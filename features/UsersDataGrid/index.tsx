"use client";

import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  ChipProps,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  AddCircle as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { GridColDef } from "@mui/x-data-grid";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";

import { EnhancedDataGrid } from "@/components";
import {
  getShortUUID,
  translateUserStatus,
  translateUserRole,
} from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { User, UserStatus, UserRole } from "@/types";

import { DeleteResponse } from "@/app/api/users/[user_id]/route";

import { useUsersDataGridReducer } from "./hooks";
import { AddUserDialog, EditUserDialog } from "./components";

export interface UsersDataGridProps {
  title: string;
  users: User[];
}

export const UsersDataGrid: React.FC<UsersDataGridProps> = ({
  title,
  users,
}) => {
  const router = useRouter();

  const {
    isAddUserDialogOpen,
    openAddUserDialog,
    closeAddUserDialog,
    userToEdit,
    isEditUserDialogOpen,
    openEditUserDialog,
    closeEditUserDialog,
  } = useUsersDataGridReducer();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const handleDelete = useCallback(
    async (id: string) => {
      confirm({
        title: "Eliminar usuario",
        description: "¿Estás seguro de que quieres eliminar este usuario?",
      })
        .then(async () => {
          try {
            const url = new URL(
              `${ENDPOINTS.USERS}/${id}`,
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

            enqueueSnackbar("Usuario eliminado correctamente", {
              variant: "success",
              onEntered: () => router.refresh(),
            });
          } catch (error) {
            enqueueSnackbar(
              error instanceof Error
                ? error.message
                : "Ha ocurrido un error al eliminar el usuario",
              { variant: "error" }
            );
          }
        })
        .catch(() => undefined);
    },
    [router, confirm, enqueueSnackbar]
  );

  const statusColors: Record<UserStatus, ChipProps["color"]> = useMemo(
    () => ({
      ENABLED: "success",
      DISABLED: "error",
    }),
    []
  );

  const rolesColors: Record<UserRole, ChipProps["color"]> = useMemo(
    () => ({
      ADMIN: "warning",
      USER: "success",
    }),
    []
  );

  const columns = useMemo<GridColDef[]>(
    () => [
      {
        field: "actions",
        headerName: "Acciones",
        headerAlign: "center",
        align: "center",
        sortable: false,
        width: 120,
        renderCell: ({ id, row }) => (
          <Stack direction="row" spacing={0.25}>
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={() => openEditUserDialog(row as User)}
              >
                <EditIcon />
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
        field: "name",
        headerName: "Nombre",
        headerAlign: "center",
        align: "center",
        minWidth: 250,
        flex: 1,
      },
      {
        field: "email",
        headerName: "Correo electrónico",
        headerAlign: "center",
        align: "center",
        minWidth: 250,
        flex: 1,
      },
      {
        field: "status",
        headerName: "Estado",
        headerAlign: "center",
        align: "center",
        minWidth: 175,
        valueGetter: ({ value }) => translateUserStatus(value),
        renderCell: ({ value, row }) => (
          <Chip
            size="small"
            label={value}
            color={statusColors[row.status as UserStatus] ?? "default"}
          />
        ),
      },
      {
        field: "role",
        headerName: "Rol",
        headerAlign: "center",
        align: "center",
        minWidth: 175,
        valueGetter: ({ value }) => translateUserRole(value),
        renderCell: ({ value, row }) => (
          <Chip
            size="small"
            label={value}
            color={rolesColors[row.role as UserRole] ?? "default"}
          />
        ),
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
    [statusColors, rolesColors, openEditUserDialog, handleDelete]
  );

  return (
    <>
      {isAddUserDialogOpen && (
        <AddUserDialog
          fullWidth
          open={isAddUserDialogOpen}
          onClose={closeAddUserDialog}
        />
      )}

      {isEditUserDialogOpen && userToEdit && (
        <EditUserDialog
          fullWidth
          open={isEditUserDialogOpen}
          onClose={closeEditUserDialog}
          user={userToEdit}
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

            <IconButton size="small" onClick={openAddUserDialog}>
              <AddIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Box sx={{ height: "calc(100% - 75px)" }}>
          <EnhancedDataGrid
            columns={columns}
            rows={users}
            disableColumnMenu
            disableRowSelectionOnClick
            sx={{ border: "none" }}
          />
        </Box>
      </Box>
    </>
  );
};
