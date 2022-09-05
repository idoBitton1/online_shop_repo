import React, { useState, useEffect } from 'react';
import './App.css';

//Components
import { Footer } from './Components/Footer/Footer';
import { MainContent } from './Components/MainContent/MainContent';
import { Header } from './Components/Header/Header';

//Apollo and Graphql
import { useQuery, useLazyQuery} from "@apollo/client"
import {QUERY_GET_JOB_BY_NAME,
  QUERY_GET_ALL_RECORDS,
  QUERY_GET_ALL_SPECIAL_RECORDS,
  QUERY_GET_ALL_EXTRAS} from "./Queries/Queries"

//Context
import {recordsContext,
        specialRecordsContext,
        extrasContext } from './Helper/Context';

//Material Ui
import { createTheme, ThemeProvider } from "@mui/material"
import { grey } from "@mui/material/colors"

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
  const [ getRecords, {data: records_data, refetch: refetchRecords}] = useLazyQuery(QUERY_GET_ALL_RECORDS);

  //gets all the special records of the corrent user
  const [ getSpecialRecords, {data:special_records_data, refetch: refetchSpecialRecords} ] = useLazyQuery(QUERY_GET_ALL_SPECIAL_RECORDS);

  //gets all the extra records of the corrent user
  const [ getExtras, {data: extras_data, refetch: refetchExtras} ] = useLazyQuery(QUERY_GET_ALL_EXTRAS);

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

    if(records_data)
      setRecords(records_data.getAllRecords);
    if(special_records_data)
      setSpecialRecords(special_records_data.getAllSpecialRecords);
    if(extras_data)
      setExtras(extras_data.getAllExtras);
  }, [records_data, special_records_data, extras_data])

  const changeUserId = (id: string): void => {

    setUserId(id);
  }

  const theme = createTheme({
    palette: {
      primary: {
        main: grey[500]
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      
      <div className="app_container">

        <Header
          changeUserId={changeUserId}
        />
        <recordsContext.Provider value={{records, setRecords}}>
        <specialRecordsContext.Provider value={{special_records, setSpecialRecords}}>
        <extrasContext.Provider value={{extras, setExtras}}>
          <MainContent
            records={records}
            special_records={special_records}
            extras={extras}
            salary_per_hour={salary_per_hour}
          />
          <Footer
            user_id={user_id}
            job_id={job_id}
          />
        </extrasContext.Provider>
        </specialRecordsContext.Provider>
        </recordsContext.Provider>
      </div>
    </ThemeProvider>
  );
}

export default App;
