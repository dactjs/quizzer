import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogProps,
} from "@mui/material";

import { QuizConvocatoryAttemptRenderer } from "@/features/QuizConvocatoryAttemptRenderer";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

export interface QuizConvocatoryAttemptRendererDialogProps extends DialogProps {
  attempt: QuizConvocatoryAttempt;
  onClose: () => void;
}

export const QuizConvocatoryAttemptRendererDialog: React.FC<
  QuizConvocatoryAttemptRendererDialogProps
> = ({ attempt, onClose, ...rest }) => (
  <Dialog {...rest} onClose={onClose}>
    <DialogTitle></DialogTitle>

    <DialogContent dividers>
      <QuizConvocatoryAttemptRenderer format="PDF" attempt={attempt} />
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

export default QuizConvocatoryAttemptRendererDialog;
