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
mutation Mutation($userId: String!, $productId: String!, $size: String!, $amount: Int!, $address: String!, $paid: Boolean!, $orderingTime: String!) {
  addProductToCart(user_id: $userId, product_id: $productId, size: $size, amount: $amount, address: $address, paid: $paid, ordering_time: $orderingTime) {
    user_id
    product_id
  }
}
`;