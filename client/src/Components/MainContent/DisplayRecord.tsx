import React from "react"
import "./DisplayRecord.css"

//Material Ui
import { Grid } from "@mui/material";

interface MyProps{

    start_time: string,
    end_time: string,
    daily_break?: number,
    percentage?: number
    salary_per_hour: number
}

//Material Ui

export const DisplayRecord: React.FC<MyProps> = ({start_time, end_time, daily_break, percentage, salary_per_hour}) => {

    const start_datetime: Date = new Date(start_time);
    const end_datetime: Date = new Date(end_time);

    const getHours = (): number => {
    
        //the diff between the dates in milliseconds
        const diff: number = end_datetime.getTime() - start_datetime.getTime();
    
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
    
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
    
        const res: number = hh + mm/60

        return Number(res.toFixed(2));
    }

    const hours: number = getHours();

    var total;
    if(daily_break !== undefined)
        total = hours * salary_per_hour - ((daily_break / 60) * salary_per_hour); //salary_per_hour     
    else if(percentage !== undefined)
        total = ((hours * salary_per_hour) / 100) * percentage;
    else
        total = hours * salary_per_hour;     

    return(
        <Grid container sx={{
                backgroundColor: "#A7BBCB",
                fontFamily: "Rubik",
                fontSize: "20px",
                padding: "15px",
                paddingLeft: "2em",
                paddingRight: "2em",
                textAlign: "center",
                color: "white"
            }}>
            <Grid item xs={2}>
                <div className="date_display">
                    {start_datetime.getDate()}
                </div>
            </Grid>
            <Grid item xs={3}>
                {
                    `${start_datetime.getHours()}:${start_datetime.getMinutes() < 10 ? 
                    `0${start_datetime.getMinutes()}`
                    :
                    `${start_datetime.getMinutes()}`}`
                }
            </Grid>
            <Grid item xs={3}>
                {
                    `${end_datetime.getHours()}:${end_datetime.getMinutes() < 10 ? 
                    `0${end_datetime.getMinutes()}`
                    :
                    `${end_datetime.getMinutes()}`}`
                }
            </Grid>
            <Grid item xs={2}>
                {hours}
            </Grid>
            <Grid item xs={2}>
                {total}
            </Grid>
        </Grid>
    )
}