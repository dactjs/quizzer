"use client";

import { useMemo } from "react";
import { Box, Paper, Stack, Divider, LinearProgress } from "@mui/material";
import { useForm } from "react-hook-form";
import { startOfYear, endOfYear } from "date-fns";

import {
  Loader,
  NoData,
  ErrorInfo,
  ControlledDatePicker,
  Chart,
  ChartSeries,
  ChartOptions,
} from "@/components";

import { useQuizzesConvocatories } from "./hooks";

type FormData = {
  year: Date;
};

export const QuizzesConvocatoriesPerMonthChart: React.FC = () => {
  const { control, watch } = useForm<FormData>({
    defaultValues: { year: new Date() },
  });

  const year = watch("year") || new Date();

  const start = startOfYear(year);
  const end = endOfYear(year);

  const {
    loading,
    validating,
    data: convocatories,
    error,
  } = useQuizzesConvocatories({ start, end });

  const months = new Array(12).fill(null).map((_, month) => {
    const year = startOfYear(new Date());

    year.setMonth(month);

    return year.toLocaleString("es-do", { month: "short" });
  });

  const options: ChartOptions = useMemo(
    () => ({
      chart: {
        id: QuizzesConvocatoriesPerMonthChart.name,
        toolbar: { show: true },
      },
      title: {
        text: "Exámenes por mes",
        style: {
          fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
          fontWeight: 700,
        },
      },
      xaxis: { categories: months },
    }),
    [months]
  );

  const series: ChartSeries = useMemo(() => {
    const convocatoriesPerQuiz: Record<string, Record<number, number>> = {};

    convocatories.forEach((convocatory) => {
      const quiz = convocatory.version.quiz.id;
      const date = new Date(convocatory.startAt);
      const month = date.getMonth() + 1;

      if (convocatoriesPerQuiz[quiz]) {
        convocatoriesPerQuiz[quiz][month] = convocatoriesPerQuiz[quiz][month]
          ? convocatoriesPerQuiz[quiz][month] + 1
          : 1;
      } else {
        convocatoriesPerQuiz[quiz] = { [month]: 1 };
      }
    });

    return Object.keys(convocatoriesPerQuiz).map((quiz) => {
      const convocatory = convocatories.find(
        (convocatory) => convocatory.version.quiz.id === quiz
      );

      const data = Object.values(convocatoriesPerQuiz[quiz]);

      return {
        name: convocatory ? convocatory.version.quiz.subject : "N/A",
        data,
      };
    });
  }, [convocatories]);

  return (
    <Paper
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {loading ? (
        <Loader invisible message="Buscando entradas..." />
      ) : error ? (
        <ErrorInfo error={new Error(error)} />
      ) : (
        <>
          {validating && (
            <LinearProgress
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                borderTopLeftRadius: (theme) => theme.shape.borderRadius,
                borderTopRightRadius: (theme) => theme.shape.borderRadius,
              }}
            />
          )}

          <Stack
            spacing={1}
            divider={<Divider flexItem />}
            sx={{ height: "100%", padding: (theme) => theme.spacing(2) }}
          >
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <ControlledDatePicker
                name="year"
                label="Año"
                control={control}
                textFieldProps={{ size: "small" }}
                datePickerProps={{ views: ["year"] }}
              />
            </Stack>

            {convocatories.length > 0 ? (
              <Box sx={{ flex: 1 }}>
                <Chart
                  type="bar"
                  width="100%"
                  height="100%"
                  series={series}
                  options={options}
                />
              </Box>
            ) : (
              <NoData message="No se han encontrado entradas" />
            )}
          </Stack>
        </>
      )}
    </Paper>
  );
};
