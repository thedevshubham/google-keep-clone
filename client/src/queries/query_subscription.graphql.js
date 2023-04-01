import gql from "graphql-tag";

export const NOTES_SUBSCRIPTION = gql`
  subscription {
    noteCreated {
      id
      title
      content
    }
  }
`;
