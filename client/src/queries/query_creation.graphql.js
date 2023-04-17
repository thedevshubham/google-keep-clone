import gql from "graphql-tag";

export const CREATE_NOTE_MUTATION = gql`
  mutation createNote(
    $title: String!
    $content: String!
    $color: String
    $label: [String]
  ) {
    createNote(title: $title, content: $content, color: $color, label: $label) {
      id
      title
      content
      color
      label
    }
  }
`;
