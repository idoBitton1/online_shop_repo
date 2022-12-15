import { gql } from "@apollo/client"

export const GET_ALL_PRODUCTS = gql`
query Query {
    getAllProducts {
      id
      name
      quantity
      price
      category
      img_location
    }
  }
`;