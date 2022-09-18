import { createContext, useContext, useReducer } from "react";
import { notesAction } from "./action";
import { notesInitialState } from "./state";

export const NotesContext = createContext();

export const NotesProvider = (props) => {
  const reducer = props.reducer || notesAction;
  const initialState = props.initialState || notesInitialState;

  return (
    <NotesContext.Provider value={useReducer(reducer, initialState)}>
      {props.children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => useContext(NotesContext);
