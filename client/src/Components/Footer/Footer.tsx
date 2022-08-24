import React from "react"
import "./Footer.css"
import { AddExtra } from "./AddExtra"
import { AddRecord } from "./AddRecord"
import { AddSpecialRecord } from "./AddSpecialRecord"
import { Record, SpecialRecord, Extra } from "../../App"

export interface MyProps{

    user_id: string,
    job_id: string,
    changeRecords: (record: Record) => void,
    changeSpecialRecords: (special_record: SpecialRecord) => void,
    changeExtras: (extra: Extra) => void,
}

export const Footer: React.FC<MyProps> = ({user_id, job_id, changeRecords, changeSpecialRecords, changeExtras}) => {

    return(
        <footer>
            <AddRecord 
              user_id={user_id} 
              job_id={job_id}
              changeRecords={changeRecords}
            />
            <AddExtra
              user_id={user_id} 
              job_id={job_id} 
              changeExtras={changeExtras}
            />
            <AddSpecialRecord
              user_id={user_id} 
              job_id={job_id}
              changeSpecialRecords={changeSpecialRecords}
            />
        </footer>
    )
}