import gql from "graphql-tag";

export const CREATE_NOTE_MUTATION = gql`
  mutation createNote(
    $title: String!
    $content: String!
    $color: String
    $label: [String]
    $isPinned: Boolean
  ) {
    createNote(
      title: $title
      content: $content
      color: $color
      label: $label
      isPinned: $isPinned
    ) {
      id
      title
      content
      color
      label
      isPinned
    }
  }
`;
