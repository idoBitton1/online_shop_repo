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

const getMonthName = (month_number: number): string => {

    var month_name: string = "";
    switch (month_number) {
        case 1:
            month_name = "January";
            break;
        case 2:
            month_name = "February";
            break;
        case 3:
            month_name = "March";
            break;
        case 4:
            month_name = "April";
            break;
        case 5:
            month_name = "May";
            break;
        case 6:
            month_name = "June";
            break;
        case 7:
            month_name = "July";
            break;
        case 8:
            month_name = "August";
            break;
        case 9:
            month_name = "September";
            break;
        case 10:
            month_name = "October";
            break;
        case 11:
            month_name = "November";
            break;
        case 12:
            month_name = "December";
            break;
    }
    return month_name;
}

export const MainContent: React.FC<MyProps> = ({records, special_records, extras}) => {

    var current_date: Date = new Date();
    current_date.setMonth(current_date.getMonth() + 1);

    return(
        <>
        <div className="main_content_container">    

            <Grid container sx={{textAlign: "center"}}>
                <Grid item xs={2}>
                    left
                </Grid>
                <Grid item xs={8}>
                    {getMonthName(current_date.getMonth())}
                </Grid>
                <Grid item xs={2}>
                    right
                </Grid>
            </Grid>

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