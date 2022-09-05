import React, { useEffect, useState } from "react"
import { DisplayRecord } from "./DisplayRecord"
import "./MainContent.css"
import { Extra, Record, SpecialRecord } from "../../App"

//Material Ui
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import { Typography } from "@mui/material"

interface MyProps{

    records: Record[],
    special_records: SpecialRecord[],
    extras: Extra[],
    salary_per_hour: number
}

const getMonthName = (month_number: number): string => {

    var month_name: string = "";
    switch (month_number) {
        case 0:
            month_name = "DECEMBER";
            break;
        case 1:
            month_name = "JANUARY";
            break;
        case 2:
            month_name = "FEBRUARY";
            break;
        case 3:
            month_name = "MARCH";
            break;
        case 4:
            month_name = "APRIL";
            break;
        case 5:
            month_name = "MAY";
            break;
        case 6:
            month_name = "JUNE";
            break;
        case 7:
            month_name = "JULY";
            break;
        case 8:
            month_name = "AUGUST";
            break;
        case 9:
            month_name = "SEPTEMBER";
            break;
        case 10:
            month_name = "OCTOBER";
            break;
        case 11:
            month_name = "NOVEMBER";
            break;
        case 12:
            month_name = "DECEMBER";
            break;
        case 13:
            month_name = "JANUARY";
            break;
    }
    return month_name;
}

export const MainContent: React.FC<MyProps> = ({records, special_records, extras}) => {

    var current_date: Date = new Date();

    const [month_number, setMonthNumber] = useState<number>(current_date.getMonth() + 1);
    
    useEffect(() => {
        if(month_number > 12)
            setMonthNumber(1);
        else if(month_number < 1)
            setMonthNumber(12);
    }, [month_number]);

    const oneMonthBackwards = () => {
        
        setMonthNumber((prevMonth) => prevMonth - 1);
    }

    const oneMonthForward = () => {
       
        setMonthNumber((prevMonth) => prevMonth + 1);
    }

    return(
        <>
        <Grid container sx={{
                textAlign: "center",
                paddingLeft: "2em",
                paddingRight: "2em",
                padding: "5px",
                fontFamily: "Rubik"
            }}>
            <Grid item xs={2}>
                <Button
                  sx={{color: "black"}}
                  onClick={oneMonthBackwards}
                  >
                    {`<${getMonthName(month_number - 1)}`}
                </Button>
            </Grid>
            <Grid item xs={8}>
                <Typography
                  marginTop={1}
                  >
                    {getMonthName(month_number)}
                </Typography>
            </Grid>
            <Grid item xs={2}>
                <Button
                  sx={{color: "black"}}
                  onClick={oneMonthForward}
                  >
                    {`${getMonthName(month_number + 1)}>`}
                </Button>
            </Grid>
        </Grid>

        <Grid container sx={{
                backgroundColor: "rgb(230, 230, 230)",
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

        <div className="main_content_container">    

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