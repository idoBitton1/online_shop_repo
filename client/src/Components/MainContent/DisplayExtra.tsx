import React from "react"

//Material Ui
import { Grid } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface MyProps{

    id: string,
    date: Date,
    bonus: boolean,
    amount: number,
    description?: string
}

export const DisplayExtra: React.FC<MyProps> = ({date, bonus, amount, description}) => {

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
            <Grid item xs={3}>
                {bonus ? "bonus" : "waste"}
            </Grid>
            {/* amount column */}
            <Grid item xs={2}>
                {amount}
            </Grid>
            {/* description column */}
            <Grid item xs={4}>
                {description}
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    onClick={showOptions}>
                    <MoreVertIcon sx={{color: "white"}} />
                </IconButton>
            </Grid>
        </Grid>
    );
}