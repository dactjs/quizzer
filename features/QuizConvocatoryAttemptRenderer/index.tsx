"use client";

import { Box, Paper, Stack, Divider } from "@mui/material";
import { TabPanel } from "@mui/lab";

import { LAYOUT_SIZES } from "@/components";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/current/route";

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
import { QuizConvocatoryAttemptRendererMode } from "./types";

export interface QuizConvocatoryAttemptRendererProps {
  attempt: QuizConvocatoryAttempt;
}

const QuizConvocatoryAttemptRenderer: React.FC<
  QuizConvocatoryAttemptRendererProps
> = () => {
  const { attempt, isShowingResults } = useQuizConvocatoryAttemptRenderer();

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
          height: { md: `calc(100vh - ${LAYOUT_SIZES.HEADER_HEIGHT})` },
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

        <Paper sx={{ gridArea: { md: "content" }, overflow: { md: "auto" } }}>
          <TabPanel
            value={QuizConvocatoryAttemptRendererMode.ATTEMPT}
            sx={{ height: "100%" }}
          >
            <QuizRenderer />
          </TabPanel>

          <TabPanel
            value={QuizConvocatoryAttemptRendererMode.REVIEW}
            sx={{ height: "100%" }}
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
> = ({ attempt }) => (
  <QuizConvocatoryAttemptRendererProvider attempt={attempt}>
    <QuizConvocatoryAttemptRenderer attempt={attempt} />
  </QuizConvocatoryAttemptRendererProvider>
);

export { QuizConvocatoryAttemptRendererWrapper as QuizConvocatoryAttemptRenderer };
