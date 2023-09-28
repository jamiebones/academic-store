import { gql } from "@apollo/client";

export const Get_Document_Uploaded_By_APP = gql`
  query getDocumentUploadedbyApp($tags: [TagFilter!]) {
    transactions(tags: $tags) {
      edges {
        node {
          timestamp
          address
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

export const GetDocumentByTransactionID = gql`
  query getDocumentByTransactionID($ids: [String!]) {
    transactions(ids: $ids) {
      edges {
        node {
          address
          timestamp
          id
          tags {
            name
            value
          }
        }
      }
    }
  }
`;

export const GetPaperComments = gql`
  query getPaperComments($tags: [TagFilter!], $order: SortOrder) {
    transactions(tags: $tags, order: $order) {
      edges {
        node {
          timestamp
          address
          tags {
            name
            value
          }
        }
      }
    }
  }
`;
