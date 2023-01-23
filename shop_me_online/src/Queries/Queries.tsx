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
query Query($user_id: String!, $transaction_id: String!) {
  getUserCartProducts(user_id: $user_id, transaction_id: $transaction_id) {
    item_id
    product_id
    transaction_id
    amount
    size
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
    img_location
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

export const GET_TRANSACTION_ID = gql`
query Query($user_id: String!) {
  getTransactionId(user_id: $user_id)
}
`;

export const GET_TRANSACTION = gql`
query Query($id: String!) {
  getTransaction(id: $id) {
    paid
  }
}
`;