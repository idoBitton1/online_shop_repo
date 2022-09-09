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
        extrasContext,
        userIdContext,
        connectContext } from './Helper/Context';

//Material Ui
import { createTheme, ThemeProvider } from "@mui/material"
import { grey } from "@mui/material/colors"

export interface Record{

  id: string,
  start_time: string,
  end_time: string,
  daily_break: number
}

export interface SpecialRecord{

  id: string,
  date: string,
  hours_amount: number,
  special_record_type_id: string
}

export interface Extra{

  id: string,
  date: string,
  bonus: boolean,
  amount: number,
  description?: string
}

function App() {
 
  const [is_connected, setConnected] = useState<boolean>(false); 

  const [user_id, setUserId] = useState<string>("");
  const [salary_per_hour, setSalaryPerHour] = useState<number>(30); //default value 
  const [job_id, setJobId] = useState<string>("");

  const [records, setRecords] = useState<Record[]>([]);
  const [special_records, setSpecialRecords] = useState<SpecialRecord[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  //query the first job
  const { data: job_data } = useQuery(QUERY_GET_JOB_BY_NAME, {
    variables: {
      name: "job 1"
    }
  });

  useEffect(() => {

    if(job_data) //if the data is fetched
    {
      setJobId(job_data.getJobByName.id); //set the job id
      setSalaryPerHour(job_data.getJobByName.salary_per_hour); //set the salary
    }
  }, [job_data]) //updates everytime the user is changing the current job

  //gets all the records of the corrent user
  const [ getRecords, {data: records_data}] = useLazyQuery(QUERY_GET_ALL_RECORDS);

  //gets all the special records of the corrent user
  const [ getSpecialRecords, {data:special_records_data} ] = useLazyQuery(QUERY_GET_ALL_SPECIAL_RECORDS);

  //gets all the extra records of the corrent user
  const [ getExtras, {data: extras_data} ] = useLazyQuery(QUERY_GET_ALL_EXTRAS);

  //fetching all the records
  useEffect(() => {

    if(user_id) //if the user is connected
    {
      try {
        //fetch the records
        getRecords({
          variables: {
            userId: user_id,
            jobId: job_id
          }
        });
        //fetch the special records
        getSpecialRecords({
          variables: {
            userId: user_id,
            jobId: job_id
          }
        });
        //fetch the extra records
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

  //assign the data to the records arrays
  useEffect(() => {

    if(records_data){

      //sorting the records array
      var array_for_sort = [...records_data.getAllRecords];
      array_for_sort.sort((a, b) => Number(a.start_time) - Number(b.start_time));
      setRecords([...array_for_sort]);
    }
    if(special_records_data){

      //sorting the special records array
      var array_for_sort = [...special_records_data.getAllSpecialRecords];
      array_for_sort.sort((a, b) => Number(a.date) - Number(b.date));
      setSpecialRecords([...array_for_sort]);
    }
    if(extras_data){

      //sorting the extra records array
      var array_for_sort = [...extras_data.getAllExtras];
      array_for_sort.sort((a, b) => Number(a.date) - Number(b.date));
      setExtras([...array_for_sort]);
    }
  }, [records_data, special_records_data, extras_data]); //update each one of the records when their data is fetched

  //change the primary color
  const theme = createTheme({
    palette: {
      primary: {
        main: grey[500]
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>    
    <connectContext.Provider value={{is_connected, setConnected}}>
      <div className="app_container">

        <userIdContext.Provider value={{setUserId}}>
          <Header/>
        </userIdContext.Provider>

        <MainContent
          records={records}
          special_records={special_records}
          extras={extras}
          salary_per_hour={salary_per_hour}
        />

        <recordsContext.Provider value={{records, setRecords}}>
        <specialRecordsContext.Provider value={{special_records, setSpecialRecords}}>
        <extrasContext.Provider value={{extras, setExtras}}>
          <Footer
            user_id={user_id}
            job_id={job_id}
          />
        </extrasContext.Provider>
        </specialRecordsContext.Provider>
        </recordsContext.Provider>
      </div>
    </connectContext.Provider>
    </ThemeProvider>
  );
}

export default App;
