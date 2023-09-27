import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  DialogProps,
} from "@mui/material";

import { QuizConvocatoryAttemptPDF } from "@/features/QuizConvocatoryAttemptPDF";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

export interface QuizConvocatoryAttemptPDFDialogProps extends DialogProps {
  attempt: QuizConvocatoryAttempt;
  onClose: () => void;
}

export const QuizConvocatoryAttemptPDFDialog: React.FC<
  QuizConvocatoryAttemptPDFDialogProps
> = ({ attempt, onClose, ...rest }) => (
  <Dialog {...rest} onClose={onClose}>
    <DialogTitle></DialogTitle>

    <DialogContent dividers>
      <QuizConvocatoryAttemptPDF attempt={attempt} />
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

export default QuizConvocatoryAttemptPDFDialog;
