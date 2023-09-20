import { useReducer } from "react";

import { QuizQuestion } from "@/types";

const initialContextState: ManageQuizQuestionsDialogContextState = {
  isAddQuestionDialogOpen: false,
  isEditQuestionDialogOpen: false,
  questionToEdit: null,
};

interface ManageQuizQuestionsDialogContextState {
  isAddQuestionDialogOpen: boolean;
  isEditQuestionDialogOpen: boolean;
  questionToEdit: QuizQuestion | null;
}

type ManageQuizQuestionsDialogContextStateAction =
  | { type: "OPEN_ADD_QUESTION_DIALOG" }
  | { type: "CLOSE_ADD_QUESTION_DIALOG" }
  | { type: "OPEN_EDIT_QUESTION_DIALOG"; payload: QuizQuestion }
  | { type: "CLOSE_EDIT_QUESTION_DIALOG" };

function reducer(
  state: ManageQuizQuestionsDialogContextState,
  action: ManageQuizQuestionsDialogContextStateAction
): ManageQuizQuestionsDialogContextState {
  switch (action.type) {
    case "OPEN_ADD_QUESTION_DIALOG":
      return {
        ...state,
        isAddQuestionDialogOpen: true,
      };

    case "CLOSE_ADD_QUESTION_DIALOG":
      return {
        ...state,
        isAddQuestionDialogOpen: false,
      };

    case "OPEN_EDIT_QUESTION_DIALOG":
      return {
        ...state,
        isEditQuestionDialogOpen: true,
        questionToEdit: action.payload,
      };

    case "CLOSE_EDIT_QUESTION_DIALOG":
      return {
        ...state,
        isEditQuestionDialogOpen: false,
        questionToEdit: null,
      };

    default:
      throw new Error("Action Not Allowed");
  }
}

export function useManageQuizQuestionsDialogReducer() {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenAddQuestionDialog = () =>
    dispatch({ type: "OPEN_ADD_QUESTION_DIALOG" });

  const handleCloseAddQuestionDialog = () =>
    dispatch({ type: "CLOSE_ADD_QUESTION_DIALOG" });

  const handleOpenEditQuestionDialog = (question: QuizQuestion) =>
    dispatch({ type: "OPEN_EDIT_QUESTION_DIALOG", payload: question });

  const handleCloseEditQuestionDialog = () =>
    dispatch({ type: "CLOSE_EDIT_QUESTION_DIALOG" });

  return {
    isAddQuestionDialogOpen: state.isAddQuestionDialogOpen,
    openAddQuestionDialog: handleOpenAddQuestionDialog,
    closeAddQuestionDialog: handleCloseAddQuestionDialog,

    questionToEdit: state.questionToEdit,
    isEditQuestionDialogOpen: state.isEditQuestionDialogOpen,
    openEditQuestionDialog: handleOpenEditQuestionDialog,
    closeEditQuestionDialog: handleCloseEditQuestionDialog,
  };
}

export default useManageQuizQuestionsDialogReducer;
