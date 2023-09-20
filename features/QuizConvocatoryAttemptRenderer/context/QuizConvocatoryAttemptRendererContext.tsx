import { useReducer, useContext, createContext, Reducer } from "react";
import { TabContext } from "@mui/lab";
import { FormProvider, useForm } from "react-hook-form";
import confetti from "canvas-confetti";

import { calcSubmissionScore, QuizQuestionResultData } from "@/schemas";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/current/route";

import {
  QuizConvocatoryAttemptRendererMode,
  QuizRendererFormValues,
} from "../types";

///////////
// State //
///////////

type State = {
  attempt: QuizConvocatoryAttempt | null;
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
      payload: QuizConvocatoryAttempt;
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
      if (action.payload.submission) {
        const { passed } = calcSubmissionScore(action.payload.submission);

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
        attempt: action.payload,
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
  mode: QuizConvocatoryAttemptRendererMode.ATTEMPT,
  page: 1,
  isShowingResults: false,
};

/////////////
// Context //
/////////////

export type QuizConvocatoryAttemptRendererContextValue = {
  attempt: QuizConvocatoryAttempt;

  mode: QuizConvocatoryAttemptRendererMode;
  changeMode: (mode: QuizConvocatoryAttemptRendererMode) => void;

  page: number;
  changePage: (page: number) => void;

  isShowingResults: boolean;
  showResults: (attempt: QuizConvocatoryAttempt) => void;
  hideResults: () => void;
};

const QuizConvocatoryAttemptRendererContext =
  createContext<QuizConvocatoryAttemptRendererContextValue>(
    null as unknown as QuizConvocatoryAttemptRendererContextValue
  );

export interface QuizConvocatoryAttemptRendererProviderProps {
  attempt: QuizConvocatoryAttempt;
}

export const QuizConvocatoryAttemptRendererProvider: React.FC<
  React.PropsWithChildren<QuizConvocatoryAttemptRendererProviderProps>
> = ({ attempt, children }) => {
  const results = attempt.submission
    ? (attempt.submission.results as QuizQuestionResultData[])
    : [];

  const methods = useForm({
    defaultValues: results
      .filter((result) => result.question.options.includes(result.answer))
      .reduce((acc, result) => {
        acc[result.question.id] = result.answer;

        return acc;
      }, {} as QuizRendererFormValues),
  });

  const [state, dispatch] = useReducer(reducer, initialState);

  const handleModeChange = (mode: QuizConvocatoryAttemptRendererMode) =>
    dispatch({ type: "CHANGE_MODE", payload: mode });

  const handlePageChange = (page: number) =>
    dispatch({ type: "CHANGE_PAGE", payload: page });

  const handleShowResults = (attempt: QuizConvocatoryAttempt) =>
    dispatch({ type: "SHOW_RESULTS", payload: attempt });

  const handleHideResults = () => dispatch({ type: "HIDE_RESULTS" });

  return (
    <QuizConvocatoryAttemptRendererContext.Provider
      value={{
        attempt: state.attempt || attempt,

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
