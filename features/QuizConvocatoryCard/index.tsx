import { Paper, List, ListItem, ListItemText } from "@mui/material";

import { QuizConvocatoryWithVersionAndUsers } from "@/app/api/convocatories/[convocatory_id]/route";

export interface QuizConvocatoryCardProps {
  convocatory: QuizConvocatoryWithVersionAndUsers;
}

export const QuizConvocatoryCard: React.FC<QuizConvocatoryCardProps> = ({
  convocatory,
}) => (
  <Paper
    sx={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    }}
  >
    <List
      disablePadding
      sx={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
      }}
    >
      <ListItem dense sx={{ width: "fit-content" }}>
        <ListItemText
          primary="Examen"
          secondary={convocatory.version.quiz.subject}
        />
      </ListItem>

      <ListItem dense sx={{ width: "fit-content" }}>
        <ListItemText
          primary="Intentos permitidos"
          secondary={convocatory.attempts}
        />
      </ListItem>

      <ListItem dense sx={{ width: "fit-content" }}>
        <ListItemText
          primary="Duración máxima (minutos)"
          secondary={convocatory.timer ?? "N/A"}
        />
      </ListItem>

      <ListItem dense sx={{ width: "fit-content" }}>
        <ListItemText
          primary="Fecha de inicio"
          secondary={new Date(convocatory.startAt).toLocaleString()}
        />
      </ListItem>

      <ListItem dense sx={{ width: "fit-content" }}>
        <ListItemText
          primary="Fecha de finalización"
          secondary={new Date(convocatory.endAt).toLocaleString()}
        />
      </ListItem>
    </List>
  </Paper>
);
