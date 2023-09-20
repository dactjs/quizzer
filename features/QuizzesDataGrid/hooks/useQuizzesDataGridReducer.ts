import { useReducer } from "react";

import { Quiz } from "@/types";

const initialContextState: QuizzesDataGridContextState = {
  isAddQuizDialogOpen: false,
  isEditQuizDialogOpen: false,
  isManageQuizQuestionsDialogOpen: false,
  quizToEdit: null,
};

interface QuizzesDataGridContextState {
  isAddQuizDialogOpen: boolean;
  isEditQuizDialogOpen: boolean;
  isManageQuizQuestionsDialogOpen: boolean;
  quizToEdit: Quiz | null;
}

type QuizzesDataGridContextStateAction =
  | { type: "OPEN_ADD_QUIZ_DIALOG" }
  | { type: "CLOSE_ADD_QUIZ_DIALOG" }
  | { type: "OPEN_EDIT_QUIZ_DIALOG"; payload: Quiz }
  | { type: "CLOSE_EDIT_QUIZ_DIALOG" }
  | { type: "OPEN_MANAGE_QUIZ_QUESTIONS_DIALOG"; payload: Quiz }
  | { type: "CLOSE_MANAGE_QUIZ_QUESTIONS_DIALOG" };

function reducer(
  state: QuizzesDataGridContextState,
  action: QuizzesDataGridContextStateAction
): QuizzesDataGridContextState {
  switch (action.type) {
    case "OPEN_ADD_QUIZ_DIALOG":
      return {
        ...state,
        isAddQuizDialogOpen: true,
      };

    case "CLOSE_ADD_QUIZ_DIALOG":
      return {
        ...state,
        isAddQuizDialogOpen: false,
      };

    case "OPEN_EDIT_QUIZ_DIALOG":
      return {
        ...state,
        isEditQuizDialogOpen: true,
        quizToEdit: action.payload,
      };

    case "CLOSE_EDIT_QUIZ_DIALOG":
      return {
        ...state,
        isEditQuizDialogOpen: false,
        quizToEdit: null,
      };

    case "OPEN_MANAGE_QUIZ_QUESTIONS_DIALOG":
      return {
        ...state,
        isManageQuizQuestionsDialogOpen: true,
        quizToEdit: action.payload,
      };

    case "CLOSE_MANAGE_QUIZ_QUESTIONS_DIALOG":
      return {
        ...state,
        isManageQuizQuestionsDialogOpen: false,
        quizToEdit: null,
      };

    default:
      throw new Error("Action Not Allowed");
  }
}

export function useQuizzesDataGridReducer() {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenAddQuizDialog = () =>
    dispatch({ type: "OPEN_ADD_QUIZ_DIALOG" });

  const handleCloseAddQuizDialog = () =>
    dispatch({ type: "CLOSE_ADD_QUIZ_DIALOG" });

  const handleOpenEditQuizDialog = (quiz: Quiz) =>
    dispatch({ type: "OPEN_EDIT_QUIZ_DIALOG", payload: quiz });

  const handleCloseEditQuizDialog = () =>
    dispatch({ type: "CLOSE_EDIT_QUIZ_DIALOG" });

  const handleOpenManageQuizQuestionsDialog = (quiz: Quiz) =>
    dispatch({ type: "OPEN_MANAGE_QUIZ_QUESTIONS_DIALOG", payload: quiz });

  const handleCloseManageQuizQuestionsDialog = () =>
    dispatch({ type: "CLOSE_MANAGE_QUIZ_QUESTIONS_DIALOG" });

  return {
    isAddQuizDialogOpen: state.isAddQuizDialogOpen,
    openAddQuizDialog: handleOpenAddQuizDialog,
    closeAddQuizDialog: handleCloseAddQuizDialog,

    quizToEdit: state.quizToEdit,
    isEditQuizDialogOpen: state.isEditQuizDialogOpen,
    openEditQuizDialog: handleOpenEditQuizDialog,
    closeEditQuizDialog: handleCloseEditQuizDialog,

    isManageQuizQuestionsDialogOpen: state.isManageQuizQuestionsDialogOpen,
    openManageQuizQuestionsDialog: handleOpenManageQuizQuestionsDialog,
    closeManageQuizQuestionsDialog: handleCloseManageQuizQuestionsDialog,
  };
}

export default useQuizzesDataGridReducer;
