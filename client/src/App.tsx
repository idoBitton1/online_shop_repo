import React, { useState, useEffect } from 'react';
import './App.css';
import { Footer } from './Components/Footer/Footer';
import { MainContent } from './Components/MainContent/MainContent';
import { Header } from './Components/Header/Header';

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
  const [salary_per_hour, setSalaryPerHour] = useState<number>(35); //default value 
  const [job_id, setJobId] = useState<string>(""); //the id of the first job

  const [records, setRecords] = useState<Record[]>([]);
  const [special_records, setSpecialRecords] = useState<SpecialRecord[]>([]);
  const [extras, setExtras] = useState<Extra[]>([]);

  const getFirstJobId = async() => {

    try {
      const response = await fetch("http://localhost:5000/jobs");
      const json_data = await response.json();

      setJobId(json_data.id);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  //gets the first job id
  useEffect(() => {

    getFirstJobId();   
  }, [])

  const getSalary = async() => {

    try {
      const response = await fetch(`http://localhost:5000/jobs/${job_id}`);
      const json_data = await response.json();  

      setSalaryPerHour(json_data.salary_per_hour);
    } catch (err: any) {
      console.error(err.message);
    }
  }

  //keeps the salay per hour updated
  useEffect(() => {

    getSalary();  
  }, [job_id])

  //gets all the records of the corrent user
  const getRecords = async() => {

    try {
      const response = await fetch(`http://localhost:5000/records?user_id=${user_id}&job_id=${job_id}`);
      const json_data = await response.json();

      setRecords(json_data);
    } catch (err: any) {
      console.error(err.message); 
    }
  }

  //gets all the special records of the corrent user
  const getSpecialRecords = async() => {

    try {
      const response = await fetch(`http://localhost:5000/special_records?user_id=${user_id}&job_id=${job_id}`);
      const json_data = await response.json();

      setSpecialRecords(json_data);
    } catch (err: any) {
      console.error(err.message); 
    }
  }

  //gets all the extra records of the corrent user
  const getExtras = async() => {

    try {
      const response = await fetch(`http://localhost:5000/extras?user_id=${user_id}&job_id=${job_id}`);
      const json_data = await response.json();

      setExtras(json_data);
    } catch (err: any) {
      console.error(err.message); 
    }
  }

  //gets all the records of the conncted user
  useEffect(() => {

    //if logged in, fetch the records of the user
    if(user_id)
    {
      console.log("fetching data...");
      getRecords();
      getSpecialRecords();
      getExtras();
    }
  }, [user_id])

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
