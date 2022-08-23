import React from "react"
import { DisplayRecord } from "./DisplayRecord"
import "./MainContent.css"
import { Extra, Record, SpecialRecord } from "../../App"

//Material Ui
import Grid from "@mui/material/Grid"

interface MyProps{

    records: Record[],
    special_records: SpecialRecord[],
    extras: Extra[],
    salary_per_hour: number
}

export const MainContent: React.FC<MyProps> = ({records, special_records, extras}) => {

    return(
        <>
        <div className="main_content_container">    

            <Grid container sx={{
                    backgroundColor: "#30a890",
                    fontFamily: "Rubik",
                    fontSize: "20px",
                    padding: "5px",
                    paddingLeft: "2em",
                    paddingRight: "2em",
                    textAlign: "center"
                }}>
                <Grid item xs={2}>
                    date
                </Grid>
                <Grid item xs={3}>
                    from
                </Grid>
                <Grid item xs={3}>
                    to
                </Grid>
                <Grid item xs={2}>
                    hours
                </Grid>
                <Grid item xs={2}>
                    total
                </Grid>  
            </Grid> 

            <DisplayRecord 
                start_time="2022-08-23 22:00"
                end_time="2022-08-23 23:00"
                percentage={150}
                salary_per_hour={30}
            /> 
        </div>
        </>
    )
}