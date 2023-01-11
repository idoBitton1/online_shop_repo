import { gql } from "@apollo/client"

export const CREATE_USER = gql`
mutation Mutation($firstName: String!, $lastName: String!, $password: String!, $address: String!, $email: String!, $isManager: Boolean!) {
    createUser(first_name: $firstName, last_name: $lastName, password: $password, address: $address, email: $email, is_manager: $isManager) {
      id
      token
    }
  }
`;

export const LOGIN_USER = gql`
mutation Mutation($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      id
      token
    }
  }
`;

export const UPDATE_PRODUCT_QUANTITY = gql`
mutation Mutation($id: String!, $newQuantity: Int!) {
  updateProductQuantity(id: $id, new_quantity: $newQuantity) {
    id
  }
}
`;

export const ADD_PRODUCT_TO_CART = gql`
mutation Mutation($userId: String!, $productId: String!, $size: String!, $amount: Int!, $address: String!, $paid: Boolean!, $orderingTime: String!, $transactionId: String!) {
  addProductToCart(user_id: $userId, product_id: $productId, size: $size, amount: $amount, address: $address, paid: $paid, ordering_time: $orderingTime, transaction_id: $transactionId) {
    user_id
    product_id
  }
}
`;

export const DELETE_PRODUCT_FROM_CART = gql`
mutation Mutation($transactionId: String!) {
  deleteProductFromCart(transaction_id: $transactionId) {
    transaction_id
  }
}
`;

export const SET_PRODUCT_AS_PAID = gql`
mutation Mutation($transactionId: String!) {
  setProductAsPaid(transaction_id: $transactionId) {
    paid
  }
}
`;

export const ADD_TO_WISHLIST = gql`
mutation Mutation($userId: String!, $productId: String!) {
  addToWishlist(user_id: $userId, product_id: $productId) {
    product_id
  }
}
`;

export const DELETE_PRODUCT_FROM_WISHLIST = gql`
mutation Mutation($userId: String!, $productId: String!) {
  deleteProductFromWishlist(user_id: $userId, product_id: $productId) {
    user_id
  }
}
`;

export const UPDATE_CART_PRODUCT_AMOUNT = gql`
mutation Mutation($transactionId: String!, $newQuantity: Int!) {
  updateCartProductAmount(transaction_id: $transactionId, new_quantity: $newQuantity) {
    amount
  }
}
`;

export const UPDATE_CART_PRODUCT_SIZE = gql`
mutation Mutation($transactionId: String!, $newSize: String!) {
  updateCartProductSize(transaction_id: $transactionId, new_size: $newSize) {
    size
  }
}
`;

export const UPDATE_USER_INFORMATION = gql`
mutation Mutation($id: String!, $firstName: String!, $lastName: String!, $password: String!, $address: String!, $email: String!, $isManager: Boolean!) {
  updateUserInformation(id: $id, first_name: $firstName, last_name: $lastName, password: $password, address: $address, email: $email, is_manager: $isManager) {
    id
  }
}
`;

export const ADD_CREDIT_CARD = gql`
mutation Mutation($id: String!, $creditCardNumber: String!) {
  addCreditCard(id: $id, credit_card_number: $creditCardNumber) {
    id
  }
}
`;

export const REMOVE_CREDIT_CARD = gql`
mutation Mutation($id: String!) {
  removeCreditCard(id: $id) {
    id
  }
}
`;