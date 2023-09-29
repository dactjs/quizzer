import { useState, useCallback } from "react";
import {
  Stack,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  List,
  ListSubheader,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  TextField,
  Typography,
  IconButton,
  Popover,
  DialogProps,
} from "@mui/material";
import {
  AddCircle as AddIcon,
  WrapText as TextIcon,
  Image as ImageIcon,
  RemoveCircle as RemoveIcon,
  ArrowDropUp as ArrowUpIcon,
  ArrowDropDown as ArrowDownIcon,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel, LoadingButton } from "@mui/lab";
import { useSWRConfig } from "swr";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { zod } from "@/lib";
import { NoData, ControlledFilesDropzone } from "@/components";
import { isEqual } from "@/utils";
import {
  UpdateQuizQuestionSchema,
  QuizQuestionOptionType,
  QuizQuestionOptionData,
} from "@/schemas";
import { ENV, ENDPOINTS } from "@/constants";
import { QuizQuestion } from "@/types";

import { QuizVersionWithQuizAndQuestions } from "@/app/api/quizzes/[quiz_id]/versions/[version_id]/route";
import { PostResponse } from "@/app/api/quizzes/[quiz_id]/versions/[version_id]/questions/route";

import ControlledQuizQuestionOptionsAutocomplete from "./ControlledQuizQuestionOptionsAutocomplete";
import ControlledQuizQuestionsCategoriesAutocomplete from "./ControlledQuizQuestionsCategoriesAutocomplete";
import ControlledImagesDropzone from "./ControlledImagesDropzone";

type FormData = zod.infer<typeof schema>;

const schema = UpdateQuizQuestionSchema;

export interface EditQuizQuestionDialogProps extends DialogProps {
  version: QuizVersionWithQuizAndQuestions;
  question: QuizQuestion;
  onClose: () => void;
}

export const EditQuizQuestionDialog: React.FC<EditQuizQuestionDialogProps> = ({
  version,
  question,
  onClose,
  ...rest
}) => {
  const { mutate } = useSWRConfig();

  const { enqueueSnackbar } = useSnackbar();

  const confirm = useConfirm();

  const {
    formState: { isDirty, isSubmitting, errors },
    watch,
    register,
    control,
    getValues,
    setValue,
    reset,
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt: question.prompt,
      description: question.description,
      options: question.options,
      answer: question.answer,
      category: question.category,
    },
  });

  const {
    fields: options,
    append,
    swap,
    remove,
  } = useFieldArray({ control, name: "options" });

  const TABS = {
    INFO: "INFO",
    OPTIONS: "OPTIONS",
  } as const;

  const [tab, setTab] = useState<keyof typeof TABS>(TABS.INFO);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const onSubmit = useCallback(
    async (formData: FormData) => {
      try {
        const url = new URL(
          `${ENDPOINTS.QUIZZES}/${version.quiz.id}/versions/${version.id}/questions/${question.id}`,
          ENV.NEXT_PUBLIC_SITE_URL
        );

        const response = await fetch(url, {
          method: "PATCH",
          cache: "no-cache",
          body: JSON.stringify(formData),
        });

        const { error }: PostResponse = await response.json();

        if (error) {
          enqueueSnackbar(error, { variant: "error" });
          return;
        }

        const key = `${ENDPOINTS.QUIZZES}/${version.quiz.id}/versions/${version.id}`;

        await mutate(key);

        enqueueSnackbar("Pregunta editada correctamente", {
          variant: "success",
          onEntered: onClose,
        });
      } catch (error) {
        enqueueSnackbar(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error al editar la pregunta",
          { variant: "error" }
        );
      }
    },
    [version, question.id, mutate, enqueueSnackbar, onClose]
  );

  const handleAdd = useCallback(
    (type: QuizQuestionOptionType) => {
      append({ type, id: window.crypto.randomUUID(), content: "" });
      setAnchorEl(null);
    },
    [append]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const option = getValues(`options.${index}`);
      const answer = getValues("answer");

      if (isEqual(option, answer)) {
        setValue("answer", null as unknown as QuizQuestionOptionData);
      }

      remove(index);
    },
    [getValues, setValue, remove]
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
    <>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
        transformOrigin={{ horizontal: "center", vertical: "top" }}
      >
        <Stack
          direction="row"
          divider={<Divider flexItem orientation="vertical" />}
        >
          <IconButton
            size="small"
            onClick={() => handleAdd(QuizQuestionOptionType.TEXT)}
            sx={{ padding: (theme) => theme.spacing(1) }}
          >
            <TextIcon />
          </IconButton>

          <IconButton
            size="small"
            onClick={() => handleAdd(QuizQuestionOptionType.IMAGE)}
            sx={{ padding: (theme) => theme.spacing(1) }}
          >
            <ImageIcon />
          </IconButton>
        </Stack>
      </Popover>

      <Dialog {...rest} onClose={handleOnClose}>
        <DialogTitle>Editar pregunta</DialogTitle>

        <DialogContent dividers sx={{ padding: 0 }}>
          <Stack component="form" autoComplete="off">
            <TabContext value={tab}>
              <TabList
                variant="fullWidth"
                onChange={(_, value) => setTab(value)}
                sx={{
                  backgroundColor: (theme) => theme.palette.background.paper,
                }}
              >
                <Tab label="Información" value={TABS.INFO} />
                <Tab label="Opciones" value={TABS.OPTIONS} />
              </TabList>

              <TabPanel value={TABS.INFO}>
                <Stack spacing={2}>
                  <TextField
                    multiline
                    required
                    autoComplete="off"
                    label="Enunciado"
                    disabled={isSubmitting}
                    inputProps={register("prompt")}
                    error={Boolean(errors.prompt)}
                    helperText={errors.prompt?.message}
                  />

                  <TextField
                    multiline
                    autoComplete="off"
                    label="Descripción"
                    disabled={isSubmitting}
                    inputProps={register("description")}
                    error={Boolean(errors.description)}
                    helperText={errors.description?.message}
                  />

                  <ControlledQuizQuestionsCategoriesAutocomplete
                    questions={version.questions}
                    required
                    label="Categoría"
                    name="category"
                    control={control}
                    disabled={isSubmitting}
                  />
                </Stack>
              </TabPanel>

              <TabPanel value={TABS.OPTIONS}>
                <Stack spacing={1} divider={<Divider flexItem />}>
                  <ControlledQuizQuestionOptionsAutocomplete
                    options={watch("options") || []}
                    required
                    label="Respuesta correcta"
                    name="answer"
                    control={control}
                    disabled={isSubmitting}
                  />

                  <List
                    disablePadding
                    sx={{
                      position: "relative",
                      maxHeight: 300,
                      borderRadius: 1,
                      backgroundColor: (theme) =>
                        theme.palette.background.paper,
                      overflow: "auto",
                      ...(errors.options && {
                        border: (theme) =>
                          `1px solid ${theme.palette.error.main}`,
                      }),
                    }}
                  >
                    <ListSubheader
                      sx={{
                        zIndex: (theme) => theme.zIndex.tooltip,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: (theme) => theme.spacing(1),
                        padding: (theme) => theme.spacing(1, 2),
                        borderBottom: (theme) =>
                          `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      <Typography variant="caption" fontWeight="bolder">
                        Opciones
                      </Typography>

                      <IconButton
                        size="small"
                        disabled={isSubmitting}
                        onClick={(event) => setAnchorEl(event.currentTarget)}
                      >
                        <AddIcon />
                      </IconButton>
                    </ListSubheader>

                    {options.length > 0 ? (
                      options.map((option, index) => {
                        const errs = errors.options;

                        const isFirstOption = index === 0;
                        const isLastOption = options.length - 1 === index;

                        return (
                          <ListItem key={option.id} divider>
                            <ListItemIcon
                              sx={{
                                gap: (theme) => theme.spacing(0.5),
                                paddingRight: (theme) => theme.spacing(2.5),
                              }}
                            >
                              <IconButton
                                edge="end"
                                size="small"
                                disabled={isSubmitting || isFirstOption}
                                onClick={() => swap(index, index - 1)}
                              >
                                <ArrowUpIcon fontSize="small" />
                              </IconButton>

                              <IconButton
                                edge="start"
                                size="small"
                                disabled={isSubmitting || isLastOption}
                                onClick={() => swap(index, index + 1)}
                              >
                                <ArrowDownIcon fontSize="small" />
                              </IconButton>
                            </ListItemIcon>

                            {option.type === QuizQuestionOptionType.TEXT && (
                              <TextField
                                multiline
                                required
                                fullWidth
                                size="small"
                                margin="dense"
                                autoComplete="off"
                                label={`Opción ${index + 1}`}
                                disabled={isSubmitting}
                                inputProps={register(
                                  `options.${index}.content`
                                )}
                                error={errs && Boolean(errs[index]?.content)}
                                helperText={
                                  errs && errs[index]?.content?.message
                                }
                              />
                            )}

                            {option.type === QuizQuestionOptionType.IMAGE && (
                              <ControlledImagesDropzone
                                size="small"
                                multiple
                                required
                                name={`options.${index}.content`}
                                control={control}
                                disabled={isSubmitting}
                              />
                            )}

                            <ListItemSecondaryAction>
                              <IconButton
                                edge="end"
                                size="small"
                                color="error"
                                disabled={isSubmitting}
                                onClick={() => handleDelete(index)}
                              >
                                <RemoveIcon fontSize="small" />
                              </IconButton>
                            </ListItemSecondaryAction>
                          </ListItem>
                        );
                      })
                    ) : (
                      <NoData message="Debe ingresar al menos una opción" />
                    )}
                  </List>
                </Stack>
              </TabPanel>
            </TabContext>
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
    </>
  );
};

export default EditQuizQuestionDialog;
