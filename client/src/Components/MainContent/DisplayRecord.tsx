import React from "react"
import "./DisplayRecords.css"

//Material Ui
import { Grid } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface MyProps{

    id: string,
    start_time: Date,
    end_time: Date,
    daily_break: number,
    salary_per_hour: number
}

export const DisplayRecord: React.FC<MyProps> = ({start_time, end_time, daily_break, salary_per_hour}) => {

    const getHours = (): number => {
    
        //the diff between the dates in milliseconds
        const diff: number = end_time.getTime() - start_time.getTime();
    
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
    
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
    
        const res: number = hh + mm/60

        return Number(res.toFixed(2));
    }

    //get the number of hours
    const hours: number = getHours();

    //total calculation
    var total = hours * salary_per_hour - ((daily_break / 60) * salary_per_hour); //salary_per_hour        
    total = Number(total.toFixed(2));

    const editRecord = () => {

    }

    const deleteRecord = () => {

    }

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
            {/* date column */}
            <Grid item xs={2}>
                <div className="date_display">
                    {start_time.getDate()}
                </div>
            </Grid>
            {/* from column */}
            <Grid item xs={3}>
                {
                    `${start_time.getHours()}:${start_time.getMinutes() < 10 ? 
                    `0${start_time.getMinutes()}`
                    :
                    `${start_time.getMinutes()}`}`
                }
            </Grid>
            {/* to column */}
            <Grid item xs={3}>
                {
                    `${end_time.getHours()}:${end_time.getMinutes() < 10 ? 
                    `0${end_time.getMinutes()}`
                    :
                    `${end_time.getMinutes()}`}`
                }
            </Grid>
            {/* hours column */}
            <Grid item xs={1}>
                {hours}
            </Grid>
            {/* total column */}
            <Grid item xs={2}>
                {total}
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    onClick={editRecord}>
                    <EditIcon sx={{color: "white"}} />
                </IconButton>
                <IconButton
                    onClick={deleteRecord}>
                    <DeleteIcon sx={{color: "white"}} />
                </IconButton>
            </Grid>
        </Grid>
    )
}