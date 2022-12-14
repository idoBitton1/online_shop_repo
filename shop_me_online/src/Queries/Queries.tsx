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

export const GET_USER_CART_PRODUCTS = gql`
query Query($userId: String!) {
  getUserCartProducts(user_id: $userId) {
    user_id
    product_id
    address
    paid
    amount
    size
    ordering_time
    transaction_id
  }
}
`;

export const GET_PRODUCT = gql`
query Query($id: String!) {
  getProduct(id: $id) {
    name
    quantity
    price
    category
  }
}
`;

export const GET_USER_WISHLIST = gql`
query Query($userId: String!) {
  getUserWishlist(user_id: $userId) {
    user_id
    product_id
  }
}
`;

export const GET_USER = gql`
query Query($userId: String!) {
  getUser(id: $userId) {
    first_name
    last_name
    password
    address
    email
    is_manager
  }
}
`;

export const CHECK_FOR_CREDIT_CARD = gql`
query Query($id: String!) {
  checkForCreditCard(id: $id)
}
`;