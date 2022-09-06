import React from "react"

//Material Ui
import { Grid } from "@mui/material";

interface MyProps{

    date: Date,
    bonus: boolean,
    amount: number,
    description?: string
}

export const DisplayExtra: React.FC<MyProps> = ({date, bonus, amount, description}) => {

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
            <Grid item xs={6}>
                {bonus ? "bonus" : "waste"}
            </Grid>
            {/* amount column */}
            <Grid item xs={2}>
                {amount}
            </Grid>
            {/* description column */}
            <Grid item xs={2}>
                {description}
            </Grid>
        </Grid>
    );
}