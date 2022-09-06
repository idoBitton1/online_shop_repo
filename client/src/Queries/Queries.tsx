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
      id
      start_time
      end_time
      daily_break
    }
  }
`;

export const QUERY_GET_ALL_SPECIAL_RECORDS = gql`
  query Query($userId: String!, $jobId: String!) {
    getAllSpecialRecords(user_id: $userId, job_id: $jobId) {
      id
      date
      hours_amount
      special_record_type_id
    }
  } 
`;

export const QUERY_GET_ALL_EXTRAS = gql`
  query Query($userId: String!, $jobId: String!) {
    getAllExtras(user_id: $userId, job_id: $jobId) {
      id
      date
      bonus
      amount
      description
    }
  }
`;

export const QUERY_SPECIAL_RECORD_TYPE_BY_TYPE = gql`
  query Query($type: String!) {
    getSpecialRecordTypeByType(type: $type) {
      id
    }
  }
`;

export const QUERY_SPECIAL_RECORD_TYPE_BY_ID = gql`
  query Query($getSpecialRecordTypeByIdId: String!) {
    getSpecialRecordTypeById(id: $getSpecialRecordTypeByIdId) {
      type
      percentage
    }
  }
`;