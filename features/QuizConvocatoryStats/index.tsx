import { Box, Paper, Unstable_Grid2 } from "@mui/material";

import { QuizSubmissionWithConvocatoryAndUser } from "@/app/api/convocatories/[convocatory_id]/submissions/route";

import { Widget, NoData } from "@/components";

import {
  ScoreAverage,
  PassedFailedDistribution,
  SubmissionsReasonDistribution,
} from "./components";

export interface QuizConvocatoryStatsProps {
  submissions: QuizSubmissionWithConvocatoryAndUser[];
}

export const QuizConvocatoryStats: React.FC<QuizConvocatoryStatsProps> = ({
  submissions,
}) => (
  <Box
    component={submissions.length > 0 ? "div" : Paper}
    sx={{
      position: "relative",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
    }}
  >
    {submissions.length > 0 ? (
      <Unstable_Grid2
        container
        justifyContent="center"
        alignItems="center"
        spacing={1}
      >
        <Unstable_Grid2 xs={12}>
          <Widget height={300}>
            <ScoreAverage submissions={submissions} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={6}>
          <Widget height={300}>
            <PassedFailedDistribution submissions={submissions} />
          </Widget>
        </Unstable_Grid2>

        <Unstable_Grid2 xs={12} md={6}>
          <Widget height={300}>
            <SubmissionsReasonDistribution submissions={submissions} />
          </Widget>
        </Unstable_Grid2>
      </Unstable_Grid2>
    ) : (
      <NoData message="Aún no se han recibido suficientes respuestas para generar reportes" />
    )}
  </Box>
);
