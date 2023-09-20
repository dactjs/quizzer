"use client";

import { Paper } from "@mui/material";

import { Chart, ChartOptions, ChartSeries } from "@/components";
import { translateQuizSubmissionReason } from "@/schemas";
import { QuizSubmissionReason } from "@/types";

import { QuizSubmissionWithConvocatoryAndUser } from "@/app/api/convocatories/[convocatory_id]/submissions/route";

export interface SubmissionsReasonDistributionProps {
  submissions: QuizSubmissionWithConvocatoryAndUser[];
}

export const SubmissionsReasonDistribution: React.FC<
  SubmissionsReasonDistributionProps
> = ({ submissions }) => {
  const data: Record<QuizSubmissionReason | "N/A", number> = submissions.reduce(
    (acc, current) => {
      const key = current.reason || "N/A";

      return {
        ...acc,
        [key]: acc[key] ? acc[key] + 1 : 1,
      };
    },
    {} as Record<QuizSubmissionReason | "N/A", number>
  );

  const options: ChartOptions = {
    chart: {
      id: SubmissionsReasonDistribution.name,
      toolbar: { show: true },
    },
    title: {
      text: "Distibución por motivo de entrega",
      style: {
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        fontWeight: 700,
      },
    },
    labels: Object.keys(data).map((key) =>
      translateQuizSubmissionReason(key as QuizSubmissionReason)
    ),
  };

  const series: ChartSeries = Object.values(data);

  return (
    <Paper sx={{ padding: (theme) => theme.spacing(2), height: "100%" }}>
      <Chart
        type="pie"
        width="100%"
        height="100%"
        series={series}
        options={options}
      />
    </Paper>
  );
};
