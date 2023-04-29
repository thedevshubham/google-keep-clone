import gql from "graphql-tag";

export const SEARCH_NOTES = gql`
  query SearchNotes($term: String!, $isTrash: Boolean) {
    searchNotes(term: $term, isTrash: $isTrash) {
      id
      title
      content
      color
      label
      isPinned
    }
  }
`;
