import { useState, useMemo, useCallback } from "react";
import {
  Stack,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
  AppBar,
  Toolbar,
  Autocomplete,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  LinearProgress,
  DialogProps,
} from "@mui/material";
import {
  AddCircle as AddIcon,
  UploadFile as ImportIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { useForm } from "react-hook-form";

import {
  ControlledQuizVersionsAutocomplete,
  VersionOptionTypeSchema,
} from "@/features/ControlledQuizVersionsAutocomplete";
import { zod } from "@/lib";
import { Loader, NoData, ErrorInfo } from "@/components";
import { ENV, ENDPOINTS } from "@/constants";
import { Quiz, QuizQuestion } from "@/types";

import { DeleteResponse } from "@/app/api/quizzes/[quiz_id]/versions/[version_id]/questions/[question_id]/route";

import { useManageQuizQuestionsDialogReducer, useQuizVersion } from "./hooks";
import {
  QuizQuestionAccordion,
  AddQuizQuestionDialog,
  EditQuizQuestionDialog,
} from "./components";

type FormData = zod.infer<typeof schema>;

const schema = zod.object({
  version: VersionOptionTypeSchema.nullish(),
});

export interface ManageQuizQuestionsDialogProps extends DialogProps {
  quiz: Quiz;
  onClose: () => void;
}

export const ManageQuizQuestionsDialog: React.FC<
  ManageQuizQuestionsDialogProps
> = ({ quiz, onClose, ...rest }) => {
  const {
    formState: { isSubmitting },
    watch,
    control,
  } = useForm<FormData>({
    defaultValues: {
      version: quiz.currentVersionId
        ? {
            id: quiz.currentVersionId,
            name: "Versión actual",
          }
        : null,
    },
  });

  const selectedVersion = watch("version");

  const {
    loading,
    validating,
    data: version,
    error,
    mutate,
  } = useQuizVersion(
    selectedVersion
      ? {
          quiz: quiz.id,
          version: selectedVersion.id,
        }
      : null
  );

  const {
    isAddQuestionDialogOpen,
    openAddQuestionDialog,
    closeAddQuestionDialog,
    questionToEdit,
    isEditQuestionDialogOpen,
    openEditQuestionDialog,
    closeEditQuestionDialog,
  } = useManageQuizQuestionsDialogReducer();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const [search, setSearch] = useState("");

  const filteredQuestions = useMemo(
    () =>
      version
        ? version.questions
            .filter(
              ({ prompt, description, category }) =>
                prompt.toLowerCase().includes(search.toLowerCase()) ||
                description?.toLowerCase().includes(search.toLowerCase()) ||
                category.toLowerCase().includes(search.toLowerCase())
            )
            .toSorted((a, b) => {
              if (a.createdAt < b.createdAt) return 1;

              if (a.createdAt > b.createdAt) return -1;

              return 0;
            })
        : [],
    [version, search]
  );

  const handleEdit = useCallback(
    (question: QuizQuestion) => openEditQuestionDialog(question),
    [openEditQuestionDialog]
  );

  const handleDelete = useCallback(
    async (question: QuizQuestion) => {
      if (!version) return;

      confirm({
        title: "Eliminar pregunta",
        description: "¿Estás seguro de que quieres eliminar esta pregunta?",
      })
        .then(async () => {
          try {
            const url = new URL(
              `${ENDPOINTS.QUIZZES}/${version.quiz.id}/versions/${version.id}/questions/${question.id}`,
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

            enqueueSnackbar("Pregunta eliminada correctamente", {
              variant: "success",
            });
          } catch (error) {
            enqueueSnackbar(
              error instanceof Error
                ? error.message
                : "Ha ocurrido un error al eliminar la pregunta",
              { variant: "error" }
            );
          }
        })
        .catch(() => undefined);
    },
    [version, mutate, confirm, enqueueSnackbar]
  );

  const handleImport = useCallback(() => {
    try {
      if (!version) return;

      const input = document.createElement("input");

      input.type = "file";
      input.accept = ".json";

      input.addEventListener("change", (e) => {
        const event = e as unknown as React.ChangeEvent<HTMLInputElement>;

        const file = event.target.files && event.target.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (event) {
          if (!event.target?.result) return;

          const url = new URL(
            `${ENDPOINTS.QUIZZES}/${version.quiz.id}/versions/${version.id}/questions`,
            ENV.NEXT_PUBLIC_SITE_URL
          );

          fetch(url, {
            method: "PUT",
            cache: "no-cache",
            body: JSON.stringify(event.target.result as string),
          })
            .then((response) => response.json())
            .then(async ({ error }: DeleteResponse) => {
              if (error) {
                enqueueSnackbar(error, { variant: "error" });
                return;
              }

              await mutate();

              enqueueSnackbar("Preguntas importadas correctamente", {
                variant: "success",
              });
            });
        };

        reader.readAsText(file);
      });

      input.click();
    } catch {
      enqueueSnackbar("Error al importar las preguntas", { variant: "error" });
    }
  }, [version, mutate, enqueueSnackbar]);

  return (
    <>
      {isAddQuestionDialogOpen && version && (
        <AddQuizQuestionDialog
          fullWidth
          open={isAddQuestionDialogOpen}
          onClose={closeAddQuestionDialog}
          version={version}
        />
      )}

      {isEditQuestionDialogOpen && version && questionToEdit && (
        <EditQuizQuestionDialog
          fullWidth
          open={isEditQuestionDialogOpen}
          onClose={closeEditQuestionDialog}
          version={version}
          question={questionToEdit}
        />
      )}

      <Dialog {...rest} onClose={onClose}>
        <AppBar sx={{ position: "relative" }}>
          {validating && (
            <LinearProgress
              sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
            />
          )}

          <Toolbar
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: "center",
              gap: (theme) => theme.spacing(1),
              padding: (theme) => theme.spacing(2),
            }}
          >
            <Stack sx={{ width: { xs: 250, sm: 300, md: 350 } }}>
              <ControlledQuizVersionsAutocomplete
                quiz={quiz}
                required
                size="small"
                label="Versión"
                name="version"
                control={control}
                disabled={isSubmitting}
              />
            </Stack>

            <Stack
              direction="row"
              justifyContent={{ xs: "center", sm: "flex-end" }}
              spacing={0.5}
              sx={{ width: 225 }}
            >
              <Tooltip title="Importar preguntas">
                <span>
                  <IconButton
                    disabled={loading || validating || !version}
                    onClick={handleImport}
                  >
                    <ImportIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip title="Agregar pregunta">
                <span>
                  <IconButton
                    disabled={loading || validating || !version}
                    onClick={openAddQuestionDialog}
                  >
                    <AddIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
          </Toolbar>
        </AppBar>

        <DialogContent dividers>
          {loading ? (
            <Loader invisible message="Cargando preguntas..." />
          ) : error ? (
            <ErrorInfo error={new Error(error)} />
          ) : version && version.questions.length > 0 ? (
            <Stack
              spacing={1}
              divider={<Divider flexItem />}
              sx={{ height: "100%", overflow: "hidden" }}
            >
              <Autocomplete
                freeSolo
                size="small"
                disabled={loading || validating}
                options={version?.questions || []}
                getOptionLabel={(option) => {
                  if (typeof option === "string") return option;

                  return option.prompt;
                }}
                onInputChange={(_, value) => setSearch(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Buscar por enunciado, descripción o categoría..."
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          <SearchIcon />
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.prompt}
                  </li>
                )}
              />

              {filteredQuestions.length > 0 ? (
                <Stack sx={{ height: "100%", overflow: "auto" }}>
                  {filteredQuestions.map((question) => (
                    <QuizQuestionAccordion
                      key={question.id}
                      question={question}
                      disabled={loading || validating}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </Stack>
              ) : (
                <NoData message="Sin coincidencias de búsqueda" />
              )}
            </Stack>
          ) : (
            <NoData
              message={
                version
                  ? "Esta versión no tiene preguntas definidas"
                  : "Debe seleccionar una versión o crear una nueva para poder agregar preguntas"
              }
            />
          )}
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: (theme) => theme.spacing(1),
          }}
        >
          {version ? (
            <Stack>
              <Typography>{`${version.quiz.subject} - ${version.name}`}</Typography>

              <Typography variant="caption" color="text.secondary">
                {`${version.questions.length} preguntas totales`}
              </Typography>
            </Stack>
          ) : (
            <Typography>{quiz.subject}</Typography>
          )}

          <LoadingButton
            variant="contained"
            color="primary"
            disabled={loading || validating}
            onClick={onClose}
          >
            Finalizar
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ManageQuizQuestionsDialog;
