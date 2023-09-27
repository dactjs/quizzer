import {
  Stack,
  Divider,
  Dialog,
  AppBar,
  Toolbar,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  IconButton,
  LinearProgress,
  DialogProps,
} from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";

import { Loader, NoData, ErrorInfo } from "@/components";

import { QuizConvocatoryWithVersionAndUsers } from "@/app/api/convocatories/[convocatory_id]/route";

import { useQuizConvocatoryAttempts } from "../hooks";

import { QuizConvocatoryAttempt } from "./QuizConvocatoryAttempt";

export interface ManageQuizConvocatoryAttemptsDialogProps extends DialogProps {
  convocatory: QuizConvocatoryWithVersionAndUsers;
  onClose: () => void;
}

export const ManageQuizConvocatoryAttemptsDialog: React.FC<
  ManageQuizConvocatoryAttemptsDialogProps
> = ({ convocatory, onClose, ...rest }) => {
  const {
    loading,
    validating,
    data: attempts,
    error,
    mutate,
  } = useQuizConvocatoryAttempts({ convocatory: convocatory.id });

  return (
    <Dialog {...rest} onClose={onClose}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: (theme) => theme.spacing(1),
          }}
        >
          <Typography fontWeight="bolder">Gestión manual</Typography>

          <IconButton color="inherit" onClick={mutate}>
            <RefreshIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <DialogContent dividers>
        {validating && (
          <LinearProgress
            sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
          />
        )}

        {loading ? (
          <Loader invisible message="Cargando datos..." />
        ) : error ? (
          <ErrorInfo error={new Error(error)} />
        ) : attempts && attempts.length > 0 ? (
          <Stack spacing={1} divider={<Divider flexItem />}>
            {attempts.map(({ attempt, certificate }) => (
              <QuizConvocatoryAttempt
                key={attempt.user.id}
                attempt={attempt}
                certificate={certificate}
                mutate={mutate}
              />
            ))}
          </Stack>
        ) : (
          <NoData message="Usuarios convocados no encontrados" />
        )}
      </DialogContent>

      <DialogActions>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          onClick={onClose}
        >
          Finalizar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageQuizConvocatoryAttemptsDialog;
