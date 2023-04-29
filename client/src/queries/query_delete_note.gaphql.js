import gql from "graphql-tag";

export const DELETE_NOTE = gql`
  mutation deleteNote($id: ID!) {
    deleteNote(id: $id) {
      id
      title
      content
      color
      label
      isPinned
    }
  }
`;
