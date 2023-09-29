import {
  Box,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { Masonry } from "@mui/lab";

import { isEqual } from "@/utils";
import {
  QuizQuestionOptionType,
  QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR,
} from "@/schemas";
import { QuizQuestion } from "@/types";

export interface QuizQuestionAccordionProps {
  question: QuizQuestion;
  disabled?: boolean;
  onEdit: (question: QuizQuestion) => void;
  onDelete: (question: QuizQuestion) => void;
}

export const QuizQuestionAccordion: React.FC<QuizQuestionAccordionProps> = ({
  question,
  disabled,
  onEdit,
  onDelete,
}) => {
  const correctAnswerIndex = question.options.findIndex((option) =>
    isEqual(option, question.answer)
  );

  return (
    <Accordion>
      <AccordionSummary>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ width: "100%" }}
        >
          <Stack>
            <Typography
              component="pre"
              variant="body1"
              fontWeight="bolder"
              sx={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {question.prompt}
            </Typography>

            {question.description && (
              <Typography
                component="pre"
                variant="caption"
                color="text.secondary"
                sx={{
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {question.description}
              </Typography>
            )}
          </Stack>

          <Chip label={question.category} />
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <List disablePadding>
          {question.options.map((option, index) => (
            <ListItem key={option.id} divider>
              {option.type === QuizQuestionOptionType.TEXT && (
                <ListItemText>{`${index + 1}. ${option.content}`}</ListItemText>
              )}

              {option.type === QuizQuestionOptionType.IMAGE && (
                <>
                  <ListItemText>{`${index + 1}.`}</ListItemText>

                  <Masonry columns={{ xs: 2, sm: 3, md: 5 }} spacing={2}>
                    {option.content
                      .split(QUIZ_QUESTION_IMAGE_OPTION_SEPARATOR)
                      .map((image, index) => (
                        <Box key={index}>
                          <Box
                            component="img"
                            loading="lazy"
                            alt={`Imagen ${index + 1}`}
                            src={image}
                            sx={{
                              display: "block",
                              width: "100%",
                              height: "auto",
                            }}
                          />
                        </Box>
                      ))}
                  </Masonry>
                </>
              )}
            </ListItem>
          ))}
        </List>

        {correctAnswerIndex >= 0 && (
          <Typography
            fontWeight="bolder"
            color="orange"
            sx={{ marginTop: (theme) => theme.spacing(2) }}
          >
            {`Respuesta correcta: ${correctAnswerIndex + 1}`}
          </Typography>
        )}
      </AccordionDetails>

      <AccordionActions>
        <Button
          variant="contained"
          size="small"
          color="error"
          endIcon={<DeleteIcon />}
          disabled={disabled}
          onClick={() => onDelete(question)}
        >
          Borrar
        </Button>

        <Button
          variant="contained"
          size="small"
          endIcon={<EditIcon />}
          disabled={disabled}
          onClick={() => onEdit(question)}
        >
          Editar
        </Button>
      </AccordionActions>
    </Accordion>
  );
};

export default QuizQuestionAccordion;
