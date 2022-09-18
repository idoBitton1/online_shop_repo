import React, { useState, useEffect } from "react"
import "./DisplayRecords.css"

//Apollo and Graphql
import { QUERY_SPECIAL_RECORD_TYPE_BY_ID } from "../../Queries/Queries";
import { useQuery } from "@apollo/client"

//Material Ui
import { Grid } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MyProps{

    id: string,
    date: Date,
    hours_amount: number,
    special_record_type_id: string,
    salary_per_hour: number
}

export const DisplaySpecialRecord: React.FC<MyProps> = ({date, hours_amount, special_record_type_id, salary_per_hour}) => {

    //variables that will rerender when the data from the query will be fetched
    const [type, setType] = useState<string>("");
    const [total, setTotal] = useState<number>(0);

    //fetch the data about the special record's type
    const { data } = useQuery(QUERY_SPECIAL_RECORD_TYPE_BY_ID, {
        variables: {
            getSpecialRecordTypeByIdId: special_record_type_id
        }
    });

    //set values 
    useEffect(() => {
        if(data)
        {
            //assign the type
            setType(data.getSpecialRecordTypeById.type);

            //total calculation
            var percentage = data.getSpecialRecordTypeById.percentage;
            setTotal((salary_per_hour * hours_amount) * (percentage / 100));
        }
    }, [data]) //when the data is fetched

    const showOptions = () => {
        
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
                    {date.getDate()}
                </div>
            </Grid>
            {/* type column */}
            <Grid item xs={5}>
                {type}
            </Grid>
            {/* hours column */}
            <Grid item xs={2}>
                {hours_amount}
            </Grid>
            {/* total column */}
            <Grid item xs={2}>
                {total}
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    onClick={showOptions}>
                    <MoreVertIcon sx={{color: "white"}} />
                </IconButton>
            </Grid>
        </Grid>
    )
}