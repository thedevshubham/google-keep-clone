import gql from "graphql-tag";

export const LIST_TRASH_NOTES = gql`
  query trashNotes {
    trashNotes {
      id
      title
      content
      color
      label
      isPinned
    }
  }
`;
