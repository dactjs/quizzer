"use client";

import { Box, Paper, Stack, Divider } from "@mui/material";
import { TabPanel } from "@mui/lab";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import {
  QuizConvocatoryAttemptRendererProvider,
  useQuizConvocatoryAttemptRenderer,
} from "./context";
import {
  Header,
  Timer,
  Pagination,
  ModeSwitch,
  QuizRenderer,
  Review,
  Footer,
  QuizResultsDialog,
} from "./components";
import { useAutosave } from "./hooks";
import {
  QuizConvocatoryAttemptRendererFormat,
  QuizConvocatoryAttemptRendererMode,
} from "./types";

export interface QuizConvocatoryAttemptRendererProps {
  format: QuizConvocatoryAttemptRendererFormat;
  attempt: QuizConvocatoryAttempt;
}

const QuizConvocatoryAttemptRenderer: React.FC = () => {
  const { contentRef, attempt, isShowingResults } =
    useQuizConvocatoryAttemptRenderer();

  useAutosave();

  return (
    <>
      {isShowingResults && <QuizResultsDialog />}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { md: "1fr 3fr" },
          gridTemplateRows: { md: "auto 1fr auto" },
          gridTemplateAreas: {
            md:
              attempt.submission && attempt.submission.questions.length > 0
                ? `
                    'header header'
                    'drawer content'
                    'drawer footer'
                  `
                : `
                    'header header'
                    'drawer content'
                    'drawer content'
                  `,
          },
          gap: (theme) => theme.spacing(1),
          height: { md: "100%" },
          paddingY: (theme) => theme.spacing(2),
          overflow: { md: "hidden" },
        }}
      >
        <Paper sx={{ gridArea: { md: "header" } }}>
          <Header />
        </Paper>

        <Paper
          component={Stack}
          justifyContent="space-between"
          alignItems="center"
          sx={{
            gridArea: { md: "drawer" },
            padding: (theme) => theme.spacing(2),
          }}
        >
          <Stack
            spacing={1}
            divider={<Divider flexItem />}
            sx={{ width: "100%", overflow: { md: "hidden" } }}
          >
            <Timer />
            <Pagination />
          </Stack>

          <Stack
            justifyContent="center"
            alignItems="center"
            sx={{
              width: "100%",
              paddingTop: (theme) => theme.spacing(1),
              borderTop: (theme) => `1px dashed ${theme.palette.divider}`,
            }}
          >
            <ModeSwitch />
          </Stack>
        </Paper>

        <Paper
          ref={contentRef}
          sx={{
            display: { md: "grid" },
            gridArea: { md: "content" },
            overflow: { md: "auto" },
          }}
        >
          <TabPanel
            value={QuizConvocatoryAttemptRendererMode.ATTEMPT}
            sx={{ width: "100%", margin: "auto" }}
          >
            <QuizRenderer />
          </TabPanel>

          <TabPanel
            value={QuizConvocatoryAttemptRendererMode.REVIEW}
            sx={{ width: "100%", margin: "auto" }}
          >
            <Review />
          </TabPanel>
        </Paper>

        <Paper sx={{ gridArea: { md: "footer" } }}>
          <Footer />
        </Paper>
      </Box>
    </>
  );
};

const QuizConvocatoryAttemptRendererWrapper: React.FC<
  QuizConvocatoryAttemptRendererProps
> = ({ format, attempt }) => (
  <QuizConvocatoryAttemptRendererProvider format={format} attempt={attempt}>
    <QuizConvocatoryAttemptRenderer />
  </QuizConvocatoryAttemptRendererProvider>
);

export { QuizConvocatoryAttemptRendererWrapper as QuizConvocatoryAttemptRenderer };
