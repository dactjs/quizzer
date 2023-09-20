import { useReducer } from "react";

import { User } from "@/types";

const initialContextState: UsersDataGridContextState = {
  isAddUserDialogOpen: false,
  isEditUserDialogOpen: false,
  userToEdit: null,
};

interface UsersDataGridContextState {
  isAddUserDialogOpen: boolean;
  isEditUserDialogOpen: boolean;
  userToEdit: User | null;
}

type UsersDataGridContextStateAction =
  | { type: "OPEN_ADD_USER_DIALOG" }
  | { type: "CLOSE_ADD_USER_DIALOG" }
  | { type: "OPEN_EDIT_USER_DIALOG"; payload: User }
  | { type: "CLOSE_EDIT_USER_DIALOG" };

function reducer(
  state: UsersDataGridContextState,
  action: UsersDataGridContextStateAction
): UsersDataGridContextState {
  switch (action.type) {
    case "OPEN_ADD_USER_DIALOG":
      return {
        ...state,
        isAddUserDialogOpen: true,
      };

    case "CLOSE_ADD_USER_DIALOG":
      return {
        ...state,
        isAddUserDialogOpen: false,
      };

    case "OPEN_EDIT_USER_DIALOG":
      return {
        ...state,
        isEditUserDialogOpen: true,
        userToEdit: action.payload,
      };

    case "CLOSE_EDIT_USER_DIALOG":
      return {
        ...state,
        isEditUserDialogOpen: false,
        userToEdit: null,
      };

    default:
      throw new Error("Action Not Allowed");
  }
}

export function useUsersDataGridReducer() {
  const [state, dispatch] = useReducer(reducer, initialContextState);

  const handleOpenAddUserDialog = () =>
    dispatch({ type: "OPEN_ADD_USER_DIALOG" });

  const handleCloseAddUserDialog = () =>
    dispatch({ type: "CLOSE_ADD_USER_DIALOG" });

  const handleOpenEditUserDialog = (user: User) =>
    dispatch({ type: "OPEN_EDIT_USER_DIALOG", payload: user });

  const handleCloseEditUserDialog = () =>
    dispatch({ type: "CLOSE_EDIT_USER_DIALOG" });

  return {
    isAddUserDialogOpen: state.isAddUserDialogOpen,
    openAddUserDialog: handleOpenAddUserDialog,
    closeAddUserDialog: handleCloseAddUserDialog,

    userToEdit: state.userToEdit,
    isEditUserDialogOpen: state.isEditUserDialogOpen,
    openEditUserDialog: handleOpenEditUserDialog,
    closeEditUserDialog: handleCloseEditUserDialog,
  };
}

export default useUsersDataGridReducer;
