"use client";

import { useMemo, useCallback } from "react";
import { Stack, Autocomplete, TextField, IconButton } from "@mui/material";
import {
  createFilterOptions,
  FilterOptionsState,
} from "@mui/material/useAutocomplete";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { Controller, Control } from "react-hook-form";

import { zod } from "@/lib";
import { ENV, ENDPOINTS } from "@/constants";
import { Quiz } from "@/types";

import { DeleteResponse } from "@/app/api/quizzes/[quiz_id]/versions/[version_id]/route";

import {
  useControlledQuizVersionsAutocompleteReducer,
  useQuizVersions,
} from "./hooks";
import { AddQuizVersionDialog, EditQuizVersionDialog } from "./components";

export type VersionOptionType = zod.infer<typeof VersionOptionTypeSchema>;

export const VersionOptionTypeSchema = zod.object({
  id: zod.string().uuid(),
  name: zod.string().nonempty(),
  inputValue: zod.string().optional(),
});

export interface ControlledQuizVersionsAutocompleteProps {
  quiz: Quiz;
  label: string;
  name: string;
  control: Control<any>;
  required?: boolean;
  disabled?: boolean;
  size?: "small" | "medium";
}

export const ControlledQuizVersionsAutocomplete: React.FC<
  ControlledQuizVersionsAutocompleteProps
> = ({ quiz, label, name, control, required, disabled, size }) => {
  const {
    loading,
    validating,
    data: versions,
    error: serviceError,
    mutate,
  } = useQuizVersions({ quiz: quiz.id });

  const {
    isAddVersionDialogOpen,
    openAddVersionDialog,
    closeAddVersionDialog,
    versionToEdit,
    isEditVersionDialogOpen,
    openEditVersionDialog,
    closeEditVersionDialog,
  } = useControlledQuizVersionsAutocompleteReducer();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const options = useMemo<VersionOptionType[]>(() => {
    return versions
      .toSorted((a, b) => {
        if (a.createdAt < b.createdAt) return 1;

        if (a.createdAt > b.createdAt) return -1;

        return 0;
      })
      .map(({ id, name }) => ({ id, name }));
  }, [versions]);

  const getOptionLabel = useCallback((option: VersionOptionType | string) => {
    if (typeof option === "string") return option;

    if (option.inputValue) return option.inputValue;

    return option.name;
  }, []);

  const filterOptions = useCallback(
    (
      options: VersionOptionType[],
      params: FilterOptionsState<VersionOptionType>
    ) => {
      const filter = createFilterOptions<VersionOptionType>();

      const filtered = filter(options, params);

      const { inputValue } = params;

      const isExisting = options.some((option) => option.name === inputValue);

      if (inputValue !== "" && !isExisting) {
        filtered.push({
          inputValue,
          id: crypto.randomUUID(),
          name: `${inputValue} (Nueva Versión)`,
        });
      }

      return filtered;
    },
    []
  );

  const handleEdit = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      version: VersionOptionType
    ) => {
      event.stopPropagation();

      openEditVersionDialog(version);
    },
    [openEditVersionDialog]
  );

  const handleDelete = useCallback(
    (
      event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      version: VersionOptionType
    ) => {
      event.stopPropagation();

      confirm({
        title: "Eliminar versión",
        description: "¿Estás seguro de que quieres eliminar esta versión?",
      })
        .then(async () => {
          try {
            const url = new URL(
              `${ENDPOINTS.QUIZZES}/${quiz.id}/versions/${version.id}`,
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

            await mutate();

            enqueueSnackbar("Versión eliminada correctamente", {
              variant: "success",
            });
          } catch (error) {
            enqueueSnackbar(
              error instanceof Error
                ? error.message
                : "Ha ocurrido un error al eliminar la versión",
              { variant: "error" }
            );
          }
        })
        .catch(() => undefined);
    },
    [quiz.id, mutate, confirm, enqueueSnackbar]
  );

  return (
    <>
      {isAddVersionDialogOpen && (
        <AddQuizVersionDialog
          fullWidth
          open={isAddVersionDialogOpen}
          onClose={closeAddVersionDialog}
          quiz={quiz}
        />
      )}

      {isEditVersionDialogOpen && versionToEdit && (
        <EditQuizVersionDialog
          fullWidth
          open={isEditVersionDialogOpen}
          onClose={closeEditVersionDialog}
          quiz={quiz}
          version={versionToEdit}
        />
      )}

      <Controller
        name={name}
        control={control}
        rules={{ required }}
        render={({
          field: { value, onChange },
          fieldState: { error: fieldError },
        }) => (
          <Autocomplete
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            size={size}
            loading={loading || validating}
            disabled={disabled}
            options={options}
            value={value ?? null}
            onChange={(_, newValue) => {
              if (typeof newValue === "string") return openAddVersionDialog();

              if (newValue && newValue.inputValue)
                return openAddVersionDialog();

              return onChange(newValue);
            }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            getOptionLabel={getOptionLabel}
            filterOptions={filterOptions}
            renderInput={(params) => (
              <TextField
                {...params}
                required={required}
                label={label}
                error={Boolean(serviceError) || Boolean(fieldError)}
                helperText={serviceError || fieldError?.message}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  sx={{ width: "100%" }}
                >
                  {option.name}

                  {!option.inputValue && (
                    <Stack direction="row" spacing={0.5}>
                      <IconButton
                        size="small"
                        onClick={(event) => handleEdit(event, option)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={(event) => handleDelete(event, option)}
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>
              </li>
            )}
          />
        )}
      />
    </>
  );
};
