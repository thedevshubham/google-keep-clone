import gql from "graphql-tag";

export const CREATE_NOTE_MUTATION = gql`
  mutation createNote($title: String!, $content: String!) {
    createNote(title: $title, content: $content) {
      id
      title
      content
    }
  }
`;
