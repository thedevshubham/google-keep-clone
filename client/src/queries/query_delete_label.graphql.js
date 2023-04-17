import gql from "graphql-tag";

export const DELETE_LABEL = gql`
  mutation deleteLabel($id: ID!, $label: String) {
    deleteLabel(id: $id, label: $label) {
      id
      title
      content
      color
      label
    }
  }
`;
