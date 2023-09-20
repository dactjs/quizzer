"use client";

import { useMemo } from "react";
import { Paper } from "@mui/material";

import { Chart, ChartOptions, ChartSeries } from "@/components";
import { calcSubmissionScore } from "@/schemas";

import { QuizSubmissionWithConvocatoryAndUser } from "@/app/api/convocatories/[convocatory_id]/submissions/route";

export interface PassedFailedDistributionProps {
  submissions: QuizSubmissionWithConvocatoryAndUser[];
}

export const PassedFailedDistribution: React.FC<
  PassedFailedDistributionProps
> = ({ submissions }) => {
  const data: Record<"PASSED" | "FAILED", number> = useMemo(
    () =>
      submissions.reduce((acc, current) => {
        const { passed } = calcSubmissionScore(current);

        const key = passed ? "PASSED" : "FAILED";

        return {
          ...acc,
          [key]: acc[key] ? acc[key] + 1 : 1,
        };
      }, {} as Record<"PASSED" | "FAILED", number>),
    [submissions]
  );

  const options: ChartOptions = {
    chart: {
      id: PassedFailedDistribution.name,
      toolbar: { show: true },
    },
    title: {
      text: "Intentos exitosos VS Intentos fallidos",
      style: {
        fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
        fontWeight: 700,
      },
    },
    labels: Object.keys(data).map((key) => {
      const translations = {
        PASSED: "Exitosos",
        FAILED: "Fallidos",
        "N/A": "N/A",
      };

      return translations[key as "PASSED" | "FAILED"];
    }),
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
