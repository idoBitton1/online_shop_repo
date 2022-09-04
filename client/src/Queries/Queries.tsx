import React from "react"
import { gql } from "@apollo/client";

//get the job id by job name
export const QUERY_GET_JOB_BY_NAME = gql`
  query Query($name: String!){
    getJobByName(name: $name){
      id
      salary_per_hour
    }
  }
`;

export const QUERY_GET_ALL_RECORDS = gql`
  query Query($userId: String!, $jobId: String!) {
    getAllRecords(user_id: $userId, job_id: $jobId) {
      start_time
      end_time
      daily_break
    }
  }
`;

export const QUERY_GET_ALL_SPECIAL_RECORDS = gql`
  query Query($userId: String!, $jobId: String!) {
    getAllSpecialRecords(user_id: $userId, job_id: $jobId) {
      date
      hours_amount
      special_record_type_id
    }
  } 
`;

export const QUERY_GET_ALL_EXTRAS = gql`
  query Query($userId: String!, $jobId: String!) {
    getAllExtras(user_id: $userId, job_id: $jobId) {
      date
      bonus
      amount
      description
    }
  }
`;