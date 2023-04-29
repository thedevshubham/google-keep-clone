import gql from "graphql-tag";

export const PIN_NOTES = gql`
  mutation pinNotes($id: [ID]) {
    pinNotes(id: $id) {
      id
      title
      content
      isPinned
    }
  }
`;
