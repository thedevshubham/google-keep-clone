import gql from "graphql-tag";

export const UPDATE_NOTE_MUTATION = gql`
  mutation updateNote(
    $id: ID!
    $title: String
    $content: String
    $color: String
    $label: [String]
  ) {
    updateNote(
      id: $id
      title: $title
      content: $content
      color: $color
      label: $label
    ) {
      id
      title
      content
      color
      label
    }
  }
`;
