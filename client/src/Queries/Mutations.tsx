import React from "react"
import { gql } from "@apollo/client"

export const MUTATION_CREATE_USER = gql`
  mutation Mutation($username: String!, $password: String!) {
    createUser(username: $username, password: $password) {
      id
    }
  }
`;