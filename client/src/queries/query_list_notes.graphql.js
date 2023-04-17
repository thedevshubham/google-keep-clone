import gql from "graphql-tag";

export const LIST_NOTES = gql`
  query notes {
    notes {
      id
      title
      content
      color
      label
    }
  }
`;
