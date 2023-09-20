import { useReducer } from "react";

import { VersionOptionType } from "../index";

const initialContextState: ControlledQuizVersionsAutocompleteContextState = {
  isAddVersionDialogOpen: false,
  isEditVersionDialogOpen: false,
  versionToEdit: null,
};

interface ControlledQuizVersionsAutocompleteContextState {
  isAddVersionDialogOpen: boolean;
  isEditVersionDialogOpen: boolean;
  versionToEdit: VersionOptionType | null;
}

type ControlledQuizVersionsAutocompleteContextStateAction =
  | { type: "OPEN_ADD_VERSION_DIALOG" }
  | { type: "CLOSE_ADD_VERSION_DIALOG" }
  | { type: "OPEN_EDIT_VERSION_DIALOG"; payload: VersionOptionType }
  | { type: "CLOSE_EDIT_VERSION_DIALOG" };

function reducer(
  state: ControlledQuizVersionsAutocompleteContextState,
  action: ControlledQuizVersionsAutocompleteContextStateAction
): ControlledQuizVersionsAutocompleteContextState {
  switch (action.type) {
    case "OPEN_ADD_VERSION_DIALOG":
      return {
        ...state,
        isAddVersionDialogOpen: true,
      };

    case "CLOSE_ADD_VERSION_DIALOG":
      return {
        ...state,
        isAddVersionDialogOpen: false,
      };

    case "OPEN_EDIT_VERSION_DIALOG":
      return {
        ...state,
        isEditVersionDialogOpen: true,
        versionToEdit: action.payload,
      };

    case "CLOSE_EDIT_VERSION_DIALOG":
      return {
        ...state,
        isEditVersionDialogOpen: false,
        versionToEdit: null,
      };

    default:
      throw new Error("Action Not Allowed");
  }
}

export function useControlledQuizVersionsAutocompleteReducer() {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenAddVersionDialog = () =>
    dispatch({ type: "OPEN_ADD_VERSION_DIALOG" });

  const handleCloseAddVersionDialog = () =>
    dispatch({ type: "CLOSE_ADD_VERSION_DIALOG" });

  const handleOpenEditVersionDialog = (version: VersionOptionType) =>
    dispatch({ type: "OPEN_EDIT_VERSION_DIALOG", payload: version });

  const handleCloseEditVersionDialog = () =>
    dispatch({ type: "CLOSE_EDIT_VERSION_DIALOG" });

  return {
    isAddVersionDialogOpen: state.isAddVersionDialogOpen,
    openAddVersionDialog: handleOpenAddVersionDialog,
    closeAddVersionDialog: handleCloseAddVersionDialog,

    versionToEdit: state.versionToEdit,
    isEditVersionDialogOpen: state.isEditVersionDialogOpen,
    openEditVersionDialog: handleOpenEditVersionDialog,
    closeEditVersionDialog: handleCloseEditVersionDialog,
  };
}

export default useControlledQuizVersionsAutocompleteReducer;
