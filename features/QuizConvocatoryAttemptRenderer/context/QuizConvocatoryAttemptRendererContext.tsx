import { useReducer, useContext, useRef, createContext, Reducer } from "react";
import { TabContext } from "@mui/lab";
import { FormProvider, useForm } from "react-hook-form";
import confetti from "canvas-confetti";

import { isEqual } from "@/utils";
import { calcSubmissionScore } from "@/schemas";
import { Certificate } from "@/types";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

import {
  QuizConvocatoryAttemptRendererFormat,
  QuizConvocatoryAttemptRendererMode,
  QuizRendererFormValues,
} from "../types";

///////////
// State //
///////////

type State = {
  attempt: QuizConvocatoryAttempt | null;
  certificate: Certificate | null;
  mode: QuizConvocatoryAttemptRendererMode;
  page: number;
  isShowingResults: boolean;
};

type Action =
  | {
      type: "CHANGE_MODE";
      payload: QuizConvocatoryAttemptRendererMode;
    }
  | {
      type: "CHANGE_PAGE";
      payload: number;
    }
  | {
      type: "SHOW_RESULTS";
      payload: {
        attempt: QuizConvocatoryAttempt;
        certificate: Certificate | null;
      };
    }
  | { type: "HIDE_RESULTS" };

const reducer: Reducer<State, Action> = (state, action): State => {
  switch (action.type) {
    case "CHANGE_MODE": {
      return {
        ...state,
        mode: action.payload,
      };
    }

    case "CHANGE_PAGE": {
      return {
        ...state,
        page: action.payload,
      };
    }

    case "SHOW_RESULTS": {
      if (action.payload.attempt.submission) {
        const { passed } = calcSubmissionScore(
          action.payload.attempt.submission
        );

        if (passed) {
          confetti({
            zIndex: 1500 + 1, // Above the modal
            particleCount: 100,
            origin: { y: 0.5 },
          });
        }
      }

      return {
        ...state,
        mode: QuizConvocatoryAttemptRendererMode.REVIEW,
        attempt: action.payload.attempt,
        certificate: action.payload.certificate,
        isShowingResults: true,
      };
    }

    case "HIDE_RESULTS": {
      return {
        ...state,
        isShowingResults: false,
      };
    }
  }
};

const initialState: State = {
  attempt: null,
  certificate: null,
  mode: QuizConvocatoryAttemptRendererMode.ATTEMPT,
  page: 1,
  isShowingResults: false,
};

/////////////
// Context //
/////////////

export type QuizConvocatoryAttemptRendererContextValue = {
  contentRef: React.MutableRefObject<HTMLDivElement | null>;

  format: QuizConvocatoryAttemptRendererFormat;
  attempt: QuizConvocatoryAttempt;
  certificate: Certificate | null;

  mode: QuizConvocatoryAttemptRendererMode;
  changeMode: (mode: QuizConvocatoryAttemptRendererMode) => void;

  page: number;
  changePage: (page: number) => void;

  isShowingResults: boolean;

  showResults: (payload: {
    attempt: QuizConvocatoryAttempt;
    certificate: Certificate | null;
  }) => void;

  hideResults: () => void;
};

const QuizConvocatoryAttemptRendererContext =
  createContext<QuizConvocatoryAttemptRendererContextValue>(
    null as unknown as QuizConvocatoryAttemptRendererContextValue
  );

export interface QuizConvocatoryAttemptRendererProviderProps {
  format: QuizConvocatoryAttemptRendererFormat;
  attempt: QuizConvocatoryAttempt;
}

export const QuizConvocatoryAttemptRendererProvider: React.FC<
  React.PropsWithChildren<QuizConvocatoryAttemptRendererProviderProps>
> = ({ format, attempt, children }) => {
  const results = attempt.submission ? attempt.submission.results : [];

  const methods = useForm({
    defaultValues: results
      .filter(
        ({ answer, question }) =>
          answer && question.options.some((option) => isEqual(option, answer))
      )
      .reduce((acc, { answer, question }) => {
        if (answer) acc[question.id] = answer.id;

        return acc;
      }, {} as QuizRendererFormValues),
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const handleModeChange = (mode: QuizConvocatoryAttemptRendererMode) =>
    dispatch({ type: "CHANGE_MODE", payload: mode });

  const handlePageChange = (page: number) => {
    if (contentRef.current) contentRef.current.scrollTo({ top: 0 });

    dispatch({ type: "CHANGE_PAGE", payload: page });
  };

  const handleShowResults = (payload: {
    attempt: QuizConvocatoryAttempt;
    certificate: Certificate | null;
  }) => dispatch({ type: "SHOW_RESULTS", payload });

  const handleHideResults = () => dispatch({ type: "HIDE_RESULTS" });

  return (
    <QuizConvocatoryAttemptRendererContext.Provider
      value={{
        contentRef,
        format,
        attempt: state.attempt || attempt,
        certificate: state.certificate,

        mode: state.mode,
        changeMode: handleModeChange,

        page: state.page,
        changePage: handlePageChange,

        isShowingResults: state.isShowingResults,
        showResults: handleShowResults,
        hideResults: handleHideResults,
      }}
    >
      <TabContext value={state.mode}>
        <FormProvider {...methods}>{children}</FormProvider>
      </TabContext>
    </QuizConvocatoryAttemptRendererContext.Provider>
  );
};

export default QuizConvocatoryAttemptRendererProvider;

export const useQuizConvocatoryAttemptRenderer = () =>
  useContext(QuizConvocatoryAttemptRendererContext);
