import React from "react"
import "./Footer.css"
import { AddExtra } from "./AddExtra"
import { AddRecord } from "./AddRecord"
import { AddSpecialRecord } from "./AddSpecialRecord"
import { Extra } from "../../App"

export interface MyProps{

  user_id: string,
  job_id: string,
}

export const Footer: React.FC<MyProps> = ({user_id, job_id}) => {

  return(
    <footer>
      <AddRecord 
        user_id={user_id} 
        job_id={job_id}
      />
      <AddExtra
        user_id={user_id} 
        job_id={job_id} 
      />
      <AddSpecialRecord
        user_id={user_id} 
        job_id={job_id}
      />
    </footer>
  )
}