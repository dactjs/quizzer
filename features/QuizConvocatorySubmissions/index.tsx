"use client";

import { useState } from "react";
import { Paper, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { NoData } from "@/components";

import { QuizSubmissionWithConvocatoryAndUser } from "@/app/api/convocatories/[convocatory_id]/submissions/route";

import { QuizSubmissionRenderer } from "./components";

export interface QuizConvocatorySubmissionsProps {
  submissions: QuizSubmissionWithConvocatoryAndUser[];
}

export const QuizConvocatorySubmissions: React.FC<
  QuizConvocatorySubmissionsProps
> = ({ submissions }) => {
  const [first] = submissions;

  const [tab, setTab] = useState<string | null>(first ? first.id : null);

  return (
    <Paper
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {submissions.length > 0 ? (
        <TabContext value={tab || first.id}>
          <TabList
            variant="scrollable"
            scrollButtons="auto"
            onChange={(_, value) => setTab(value)}
            sx={{
              borderBottom: (theme) => `1px dashed ${theme.palette.divider} `,
              backgroundColor: (theme) => theme.palette.background.paper,
            }}
          >
            {submissions.map((submission) => {
              const date = new Date(submission.startedAt);

              return (
                <Tab
                  key={submission.id}
                  label={`${submission.user.name} (${date.toLocaleString()})`}
                  value={submission.id}
                />
              );
            })}
          </TabList>

          {submissions.map((submission) => (
            <TabPanel key={submission.id} value={submission.id}>
              <QuizSubmissionRenderer submission={submission} />
            </TabPanel>
          ))}
        </TabContext>
      ) : (
        <NoData message="Aún no se han recibido respuestas" />
      )}
    </Paper>
  );
};
