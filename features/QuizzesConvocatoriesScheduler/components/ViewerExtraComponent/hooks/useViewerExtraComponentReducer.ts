import { useReducer } from "react";

const initialContextState: ViewerExtraComponentContextState = {
  isManageQuizConvocatoryAttemptsDialogOpen: false,
};
interface ViewerExtraComponentContextState {
  isManageQuizConvocatoryAttemptsDialogOpen: boolean;
}

type ViewerExtraComponentContextStateAction =
  | { type: "OPEN_MANAGE_QUIZ_CONVOCATORY_ATTEMPTS_DIALOG" }
  | { type: "CLOSE_MANAGE_QUIZ_CONVOCATORY_ATTEMPTS_DIALOG" };

function reducer(
  state: ViewerExtraComponentContextState,
  action: ViewerExtraComponentContextStateAction
): ViewerExtraComponentContextState {
  switch (action.type) {
    case "OPEN_MANAGE_QUIZ_CONVOCATORY_ATTEMPTS_DIALOG":
      return {
        ...state,
        isManageQuizConvocatoryAttemptsDialogOpen: true,
      };

    case "CLOSE_MANAGE_QUIZ_CONVOCATORY_ATTEMPTS_DIALOG":
      return {
        ...state,
        isManageQuizConvocatoryAttemptsDialogOpen: false,
      };

    default:
      throw new Error("Action Not Allowed");
  }
}

export function useViewerExtraComponentReducer() {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenManageQuizConvocatoryAttemptsDialog = () =>
    dispatch({ type: "OPEN_MANAGE_QUIZ_CONVOCATORY_ATTEMPTS_DIALOG" });

  const handleCloseManageQuizConvocatoryAttemptsDialog = () =>
    dispatch({ type: "CLOSE_MANAGE_QUIZ_CONVOCATORY_ATTEMPTS_DIALOG" });

  return {
    isManageQuizConvocatoryAttemptsDialogOpen:
      state.isManageQuizConvocatoryAttemptsDialogOpen,
    openManageQuizConvocatoryAttemptsDialog:
      handleOpenManageQuizConvocatoryAttemptsDialog,
    closeManageQuizConvocatoryAttemptsDialog:
      handleCloseManageQuizConvocatoryAttemptsDialog,
  };
}

export default useViewerExtraComponentReducer;
