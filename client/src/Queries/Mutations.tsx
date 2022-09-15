import React from "react"
import { gql } from "@apollo/client"

export const MUTATION_CREATE_USER = gql`
  mutation Mutation($username: String!, $password: String!, $confirmPassword: String!) {
    createUser(username: $username, password: $password, confirm_password: $confirmPassword) {
      id
    }
  }
`;

export const MUTATION_CREATE_RECORD = gql`
  mutation Mutation($startTime: String!, $endTime: String!, $dailyBreak: Int!, $userId: String!, $jobId: String!) {
    createRecord(start_time: $startTime, end_time: $endTime, daily_break: $dailyBreak, user_id: $userId, job_id: $jobId) {
      id
      start_time,
      end_time,
      daily_break
    }
  }
`;

export const MUTATION_CREATE_SPECIAL_RECORD = gql`
  mutation Mutation($date: String!, $hoursAmount: Int!, $userId: String!, $jobId: String!, $specialRecordTypeId: String!) {
    createSpecialRecord(date: $date, hours_amount: $hoursAmount, user_id: $userId, job_id: $jobId, special_record_type_id: $specialRecordTypeId) {
      id
      date
      hours_amount
      special_record_type_id
    }
  }
`;

export const MUTATUIN_CREATE_EXTRA = gql`
  mutation Mutation($date: String!, $bonus: Boolean!, $amount: Int!, $userId: String!, $jobId: String!, $description: String) {
    createExtra(date: $date, bonus: $bonus, amount: $amount, user_id: $userId, job_id: $jobId, description: $description) {
      id
      date
      bonus
      amount
      description
    }
  }
`;

export const MUTATION_UPDATE_SALARY = gql`
  mutation Mutation($id: String!, $salaryPerHour: Int!) {
    updateSalary(id: $id, salary_per_hour: $salaryPerHour) {
      name
      type
      salary_per_hour
    }
  }
`;

export const MUTATION_LOGIN = gql`
  mutation Mutation($username: String!, $password: String!) {
    loginUser(username: $username, password: $password) {
      id
    }
  }
`;