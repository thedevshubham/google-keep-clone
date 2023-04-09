import gql from "graphql-tag";

export const CREATE_NOTE_MUTATION = gql`
  mutation createNote($title: String!, $content: String!, $color: String) {
    createNote(title: $title, content: $content, color: $color) {
      id
      title
      content
      color
    }
  }
`;
