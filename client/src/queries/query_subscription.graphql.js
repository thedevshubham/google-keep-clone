import { gql } from "@apollo/client";

export const NOTE_CREATED = gql`
  subscription NoteCreated {
    noteCreated {
      id
      title
      content
      color
      label
    }
  }
`;

export const NOTE_UPDATED = gql`
  subscription NoteUpdated {
    noteUpdated {
      id
      title
      content
      color
      label
    }
  }
`;

export const NEW_LABEL_ADDED = gql`
  subscription LabelAdded {
    labelAdded
  }
`;
