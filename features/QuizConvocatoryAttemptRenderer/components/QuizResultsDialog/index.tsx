"use client";

import {
  Stack,
  Divider,
  Dialog,
  DialogContent,
  Typography,
} from "@mui/material";
import {
  Celebration as CelebrationIcon,
  SentimentVeryDissatisfied as SadIcon,
} from "@mui/icons-material";

import { calcSubmissionScore } from "@/schemas";

import { useQuizConvocatoryAttemptRenderer } from "../../context";

export const QuizResultsDialog: React.FC = () => {
  const { attempt, isShowingResults, hideResults } =
    useQuizConvocatoryAttemptRenderer();

  if (!attempt.submission) return null;

  const { passed, score } = calcSubmissionScore(attempt.submission);

  return (
    <Dialog open={isShowingResults} onClose={hideResults}>
      <DialogContent>
        <Stack
          justifyContent="center"
          alignItems="center"
          spacing={2}
          divider={<Divider flexItem />}
          sx={{
            padding: passed
              ? (theme) => theme.spacing(0.5)
              : (theme) => theme.spacing(2),
          }}
        >
          <Stack justifyContent="center" alignItems="center" spacing={1}>
            {passed ? (
              <CelebrationIcon sx={{ width: 75, height: "auto" }} />
            ) : (
              <SadIcon sx={{ width: 75, height: "auto" }} />
            )}

            <Typography variant="h5" align="center">
              {passed ? "¡Felicidades!" : "¡Sigue intentando!"}
            </Typography>

            <Typography variant="body1" align="center">
              Tu puntuación es:
            </Typography>

            <Typography
              align="center"
              variant="h5"
              sx={{
                fontFamily: "monospace",
                fontWeight: "bolder",
                letterSpacing: 2,
              }}
            >
              {score.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};
