import {
  SET_DRAWER_STATE,
  SET_LIST_VIEW_STATE,
  SET_SELECTED_NOTES,
  SET_SIDE_LINK_DATA,
} from "../../config/contextConstants";

export const notesAction = (state, action) => {
  switch (action?.type) {
    case SET_DRAWER_STATE:
      return {
        ...state,
        isDrawerClicked: action.isDrawerClicked,
      };
    case SET_LIST_VIEW_STATE:
      return {
        ...state,
        isGridView: action.isGridView,
      };
    case SET_SIDE_LINK_DATA:
      return {
        ...state,
        sideLinkData: {
          ...state.sideLinkData,
          [action.key]: action.value,
        },
      };
    case SET_SELECTED_NOTES:
      return {
        ...state,
        selectedNotes: action.selectedNotes,
      };
    default:
      return state;
  }
};
