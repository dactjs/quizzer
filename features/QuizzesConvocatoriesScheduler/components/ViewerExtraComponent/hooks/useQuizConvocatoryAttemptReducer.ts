import { useReducer } from "react";

import { QuizConvocatoryAttempt } from "@/app/api/convocatories/[convocatory_id]/attempts/[email]/current/route";

const initialContextState: ViewerExtraComponentContextState = {
  isQuizConvocatoryAttemptRendererDialogOpen: false,
  isQuizConvocatoryAttemptPDFDialogOpen: false,
  activeAttempt: null,
};
interface ViewerExtraComponentContextState {
  isQuizConvocatoryAttemptRendererDialogOpen: boolean;
  isQuizConvocatoryAttemptPDFDialogOpen: boolean;
  activeAttempt: QuizConvocatoryAttempt | null;
}

type ViewerExtraComponentContextStateAction =
  | {
      type: "OPEN_QUIZ_CONVOCATORY_ATTEMPT_RENDERER_DIALOG";
      payload: QuizConvocatoryAttempt;
    }
  | { type: "CLOSE_QUIZ_CONVOCATORY_ATTEMPT_RENDERER_DIALOG" }
  | {
      type: "OPEN_QUIZ_CONVOCATORY_ATTEMPT_PDF_DIALOG";
      payload: QuizConvocatoryAttempt;
    }
  | { type: "CLOSE_QUIZ_CONVOCATORY_ATTEMPT_PDF_DIALOG" };

function reducer(
  state: ViewerExtraComponentContextState,
  action: ViewerExtraComponentContextStateAction
): ViewerExtraComponentContextState {
  switch (action.type) {
    case "OPEN_QUIZ_CONVOCATORY_ATTEMPT_RENDERER_DIALOG":
      return {
        ...state,
        isQuizConvocatoryAttemptRendererDialogOpen: true,
        activeAttempt: action.payload,
      };

    case "CLOSE_QUIZ_CONVOCATORY_ATTEMPT_RENDERER_DIALOG":
      return {
        ...state,
        isQuizConvocatoryAttemptRendererDialogOpen: false,
        activeAttempt: null,
      };

    case "OPEN_QUIZ_CONVOCATORY_ATTEMPT_PDF_DIALOG":
      return {
        ...state,
        isQuizConvocatoryAttemptPDFDialogOpen: true,
        activeAttempt: action.payload,
      };

    case "CLOSE_QUIZ_CONVOCATORY_ATTEMPT_PDF_DIALOG":
      return {
        ...state,
        isQuizConvocatoryAttemptPDFDialogOpen: false,
        activeAttempt: null,
      };

    default:
      throw new Error("Action Not Allowed");
  }
}

export function useQuizConvocatoryAttemptReducer() {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenQuizConvocatoryAttemptRendererDialog = (
    attempt: QuizConvocatoryAttempt
  ) =>
    dispatch({
      type: "OPEN_QUIZ_CONVOCATORY_ATTEMPT_RENDERER_DIALOG",
      payload: attempt,
    });

  const handleCloseQuizConvocatoryAttemptRendererDialog = () =>
    dispatch({ type: "CLOSE_QUIZ_CONVOCATORY_ATTEMPT_RENDERER_DIALOG" });

  const handleOpenQuizConvocatoryAttemptPDFDialog = (
    attempt: QuizConvocatoryAttempt
  ) =>
    dispatch({
      type: "OPEN_QUIZ_CONVOCATORY_ATTEMPT_PDF_DIALOG",
      payload: attempt,
    });

  const handleCloseQuizConvocatoryAttemptPDFDialog = () =>
    dispatch({ type: "CLOSE_QUIZ_CONVOCATORY_ATTEMPT_PDF_DIALOG" });

  return {
    activeAttempt: state.activeAttempt,

    isQuizConvocatoryAttemptRendererDialogOpen:
      state.isQuizConvocatoryAttemptRendererDialogOpen,
    openQuizConvocatoryAttemptRendererDialog:
      handleOpenQuizConvocatoryAttemptRendererDialog,
    closeQuizConvocatoryAttemptRendererDialog:
      handleCloseQuizConvocatoryAttemptRendererDialog,

    isQuizConvocatoryAttemptPDFDialogOpen:
      state.isQuizConvocatoryAttemptPDFDialogOpen,
    openQuizConvocatoryAttemptPDFDialog:
      handleOpenQuizConvocatoryAttemptPDFDialog,
    closeQuizConvocatoryAttemptPDFDialog:
      handleCloseQuizConvocatoryAttemptPDFDialog,
  };
}

export default useQuizConvocatoryAttemptReducer;
