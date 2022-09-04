import React, { useState, useEffect } from 'react';
import './App.css';
import { useQuery, useLazyQuery, gql } from "@apollo/client"
import { Footer } from './Components/Footer/Footer';
import { MainContent } from './Components/MainContent/MainContent';
import { Header } from './Components/Header/Header';
import {QUERY_GET_JOB_BY_NAME,
        QUERY_GET_ALL_RECORDS,
        QUERY_GET_ALL_SPECIAL_RECORDS,
        QUERY_GET_ALL_EXTRAS} from "./Queries/Queries"

export interface Record{

  start_time: string,
  end_time: string,
  daily_break: number
}

export interface SpecialRecord{

  date: string,
  hours_amount: number,
  special_record_type_id: string
}

export interface Extra{

  date: string,
  bonus: boolean,
  amount: number,
  description?: string
}

function App() {

  const [user_id, setUserId] = useState<string>("");
  const [salary_per_hour, setSalaryPerHour] = useState<number>(30); //default value 
  const [job_id, setJobId] = useState<string>("");

  const [records, setRecords] = useState<Record[]>([]);
  const [special_records, setSpecialRecords] = useState<SpecialRecord[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  const { data: job_data } = useQuery(QUERY_GET_JOB_BY_NAME, {
    variables: {
      name: "job 1"
    }
  });

  useEffect(() => {

    if(job_data) //if the data is fetched
    {
      setJobId(job_data.getJobByName.id);
      setSalaryPerHour(job_data.getJobByName.salary_per_hour);
    }
  }, [job_data])

  //gets all the records of the corrent user
  const [ getRecords, {data: records_data}] = useLazyQuery(QUERY_GET_ALL_RECORDS);

  //gets all the special records of the corrent user
  const [ getSpecialRecords, {data:special_records_data} ] = useLazyQuery(QUERY_GET_ALL_SPECIAL_RECORDS);

  //gets all the extra records of the corrent user
  const [ getExtras, {data: extras_data} ] = useLazyQuery(QUERY_GET_ALL_EXTRAS);

  useEffect(() => {

    if(user_id)
    {
      try {
        getRecords({
          variables: {
            userId: user_id,
            jobId: job_id
          }
        });
        getSpecialRecords({
          variables: {
            userId: user_id,
            jobId: job_id
          }
        });
        getExtras({
          variables: {
            userId: user_id,
            jobId: job_id
          }
        });
      } catch (err: any) {
        console.error(err.message);
      }
    }
  }, [user_id]);

  useEffect(() => {

    if(records_data && records !== [])
      setRecords(records_data.getAllRecords);
    if(special_records_data && special_records !== [])
      setSpecialRecords(special_records_data.getAllSpecialRecords);
    if(extras_data && extras !== [])
      setExtras(extras_data.getAllExtras);
  }, [records_data, special_records_data, extras_data])

  const changeUserId = (id: string): void => {

    setUserId(id);
  }

  const changeRecords = (record: Record) => {

    setRecords((prev_records) => [...prev_records, record]);
  }

  const changeSpecialRecords = (special_record: SpecialRecord) => {

    setSpecialRecords((prev_records) => [...prev_records, special_record]);
  }

  const changeExtras = (extra: Extra) => {

    setExtras((prev_records) => [...prev_records, extra]);
  }

  return (
    <div className="app_container">

      <Header
        changeUserId={changeUserId}
      />
      <MainContent
        records={records}
        special_records={special_records}
        extras={extras}
        salary_per_hour={salary_per_hour}
      />
      <Footer
        user_id={user_id}
        job_id={job_id}
        changeRecords={changeRecords}
        changeSpecialRecords={changeSpecialRecords}
        changeExtras={changeExtras}
      />
    </div>
  );
}

export default App;
