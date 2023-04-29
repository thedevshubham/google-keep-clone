import { gql } from "@apollo/client";

export const NOTE_CREATED = gql`
  subscription NoteCreated {
    noteCreated {
      id
      title
      content
      color
      label
      isPinned
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
      isPinned
    }
  }
`;

export const NOTE_DELETED = gql`
  subscription NoteDeleted {
    noteDeleted {
      id
      title
      content
      color
      label
      isPinned
    }
  }
`;

export const TRASH_NOTE_UPDATED = gql`
  subscription TrashUpdated {
    trashUpdated {
      id
      title
      content
      color
      label
      isPinned
    }
  }
`;

export const NEW_LABEL_ADDED = gql`
  subscription LabelAdded {
    labelAdded
  }
`;
