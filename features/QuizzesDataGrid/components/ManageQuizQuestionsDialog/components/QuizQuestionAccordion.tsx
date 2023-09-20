import {
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
}) => (
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
          <Typography variant="body1" fontWeight="bolder">
            {question.prompt}
          </Typography>

          {question.description && (
            <Typography variant="caption" color="text.secondary">
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
          <ListItem key={`${index}.${option}`} disablePadding>
            <ListItemText>{`${index + 1}. ${option}`}</ListItemText>
          </ListItem>
        ))}
      </List>

      <Typography
        fontWeight="bolder"
        color="orange"
        sx={{ marginTop: (theme) => theme.spacing(2) }}
      >
        {`Respuesta correcta: ${question.answer}`}
      </Typography>
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

export default QuizQuestionAccordion;
