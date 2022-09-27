import React, { useEffect, useState, useContext } from "react"
import "./MainContent.css"

//Components
import { DisplayRecord } from "./DisplayRecords/DisplayRecord"
import { DisplaySpecialRecord } from "./DisplayRecords/DisplaySpecialRecord"
import { DisplayExtra } from "./DisplayRecords/DisplayExtra"

//Interface
import { Record, SpecialRecord, Extra } from "../../App"

//Context
import { connectContext } from "../../Helper/Context"

//images
import background from "../../Images/background.png"

//Material Ui
import Grid from "@mui/material/Grid"
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import { IconButton, Typography } from "@mui/material"
import SpecialRecordIcon from "@mui/icons-material/PhotoFilterOutlined"
import ExtraIcon from "@mui/icons-material/NoteAddOutlined"
import RecordIcon from "@mui/icons-material/InsertDriveFileOutlined"
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { AddRecord } from "./AddingRecords/AddRecord"
import { AddSpecialRecord } from "./AddingRecords/AddSpecialRecord"
import { AddExtra } from "./AddingRecords/AddExtra"

interface MyProps{

    records: Record[],
    special_records: SpecialRecord[],
    extras: Extra[],
    salary_per_hour: number
}

//converts the month's number to its name
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

export const MainContent: React.FC<MyProps> = ({records, special_records, extras,  salary_per_hour}) => {

    const {is_connected} = useContext(connectContext);

    const [record_type, setType] = useState<number>(1);
    const [record_name, setName] = useState<string>("");

    var current_date: Date = new Date();

    //displayed month and year
    const [month_number, setMonthNumber] = useState<number>(current_date.getMonth() + 1);
    const [year, setYear] = useState<number>(current_date.getFullYear());

    useEffect(() => {
        if(record_type == 1)
            setName("Record");
        else if(record_type == 2)
            setName("Special Record");
        else if(record_type == 3)
            setName("Extra Record")
    }, [record_type])

    //checks that the month number is valid, and updated the year if needed
    useEffect(() => {
        if(month_number > 12){
            setMonthNumber(1);
            setYear((prevYear) => prevYear + 1);
        }      
        else if(month_number < 1){
            setMonthNumber(12);
            setYear((prevYear) => prevYear - 1);
        }      
    }, [month_number]);

    //checks that the type is valid
    useEffect(() => {
        if(record_type > 3)
            setType(1);
    }, [record_type]);

    const oneMonthBackwards = () => {
        
        setMonthNumber((prevMonth) => prevMonth - 1);
    }

    const oneMonthForward = () => {
       
        setMonthNumber((prevMonth) => prevMonth + 1);
    }

    const chooseTableHeaders = (): any => {

        if(record_type == 1){ //records table headers
            return(
                <>
                    <Grid item xs={2}>
                        date
                    </Grid>
                    <Grid item xs={3}>
                        from
                    </Grid>
                    <Grid item xs={3}>
                        to
                    </Grid>
                    <Grid item xs={1}>
                        hours
                    </Grid>
                    <Grid item xs={2}>
                        total
                    </Grid> 
                    <Grid item xs={1}>
                        
                    </Grid>
                </>
            );
        }
        else if(record_type == 2){ //special records table headers
            return(
                <>
                    <Grid item xs={2}>
                        date
                    </Grid>
                    <Grid item xs={5}>
                        type
                    </Grid>
                    <Grid item xs={2}>
                        hours
                    </Grid>
                    <Grid item xs={2}>
                        total
                    </Grid> 
                    <Grid item xs={1}>
                        
                    </Grid>
                </>
            );
        }
        else if(record_type == 3){ //extra records table headers
            return(
                <>
                    <Grid item xs={2}>
                        date
                    </Grid>
                    <Grid item xs={3}>
                        type
                    </Grid>
                    <Grid item xs={2}>
                        amount
                    </Grid>
                    <Grid item xs={4}>
                        description
                    </Grid> 
                    <Grid item xs={1}>
                        
                    </Grid>
                </>
            );
        }
    }

    //displays the icon of the current display type of records
    const chooseIcon = (): any => {
        
        if(record_type == 1){
            return (
                <Tooltip title="record">
                    <RecordIcon sx={{fontSize: 20}} />
                </Tooltip>
            );
        }
        else if(record_type == 2){
            return  (
                <Tooltip title="special record">
                    <SpecialRecordIcon sx={{fontSize: 20}} />
                </Tooltip>
            );
        }
        else{
            return (
                <Tooltip title="extra record">
                    <ExtraIcon sx={{fontSize: 20}} />
                </Tooltip>
            );
        }
    }

    //displays the current type of records
    const displayCurrentRecordType = (): any => {

        if(record_type == 1){ //records
            return (
                //display each record  
                records.filter((record) => {        
                    const record_date = new Date(Number(record.start_time))

                    return ((record_date.getMonth() + 1) === month_number)
                }).map((record) => {

                    //create a date object for the start and end times
                    const start_time: Date = new Date(Number(record.start_time));
                    const end_time: Date = new Date(Number(record.end_time));

                    

                    return (
                        <DisplayRecord 
                            id={record.id}
                            start_time={start_time}
                            end_time={end_time}
                            daily_break={record.daily_break}
                            salary_per_hour={salary_per_hour}
                            key={record.id}
                        /> 
                    );
                })
            );
        }
        else if(record_type == 2){ //special records
            return(
                special_records.filter((special_record) => {
                    const record_date = new Date(Number(special_record.date))
    
                    return ((record_date.getMonth() + 1) === month_number)
                }).map((special_record) => {

                    //create a date object for the date
                    const date: Date = new Date(Number(special_record.date));

                    return(
                        <DisplaySpecialRecord
                            id={special_record.id}
                            date={date}
                            hours_amount={special_record.hours_amount}
                            special_record_type_id={special_record.special_record_type_id}
                            salary_per_hour={salary_per_hour}
                            key={special_record.id}
                        />
                    );
                })
            );
        }
        else if(record_type == 3){ //extra records
            return(
                extras.filter((extra) => {
                    const record_date = new Date(Number(extra.date))
    
                    return ((record_date.getMonth() + 1) === month_number)
                }).map((extra) => {

                    //create a date object for the date
                    const date: Date = new Date(Number(extra.date));

                    return(
                        <DisplayExtra
                            id={extra.id}
                            date={date}
                            bonus={extra.bonus}
                            amount={extra.amount}
                            description={extra.description}
                            key={extra.id}
                        />
                    );
                })
            );
        }
    }

    const whatToAdd = (): any => {

        if(record_type == 1){// normal record
            return <AddRecord />;
        }
        else if(record_type == 2){// special record
            return <AddSpecialRecord />;
        }
        else if(record_type == 3){// extra record
            return <AddExtra />;
        }
    }

    return(
        <>
        {/** month displayer */}
        <Grid container sx={{
                textAlign: "center",
                paddingLeft: "2em",
                paddingRight: "2em",
                padding: "5px",
                fontFamily: "Rubik",
                color: "white"
            }}>
            <Grid item xs={2}>
                <Button
                  sx={{color: "white"}}
                  disabled={is_connected ? false : true}
                  onClick={oneMonthBackwards}
                  >
                    <ArrowBackIosIcon />
                </Button>
            </Grid>
            <Grid item xs={8}>
                <div className="date_and_type">
                    {getMonthName(month_number) + " " + year}
                    <div className="just_type">
                        {record_name}
                        <IconButton
                        sx={{color: "white", marginBottom: 0.4}}
                        disabled={is_connected ? false : true}
                        onClick={() => setType((prevType) => prevType + 1)}>
                            {chooseIcon()}
                        </IconButton>
                        {whatToAdd()}
                    </div>
                </div>
            </Grid>
            <Grid item xs={2}>
                <Button
                  sx={{color: "white"}}
                  disabled={is_connected ? false : true}
                  onClick={oneMonthForward}
                  >
                    <ArrowForwardIosIcon />
                </Button>
            </Grid>
        </Grid>

        {/** table headers */}
        <Grid container sx={{
                backgroundColor: "#8CA0B1",
                fontFamily: "Rubik",
                fontSize: "20px",
                padding: "5px",
                paddingLeft: "2em",
                paddingRight: "2em",
                textAlign: "center",
                color: "white"
            }}>

            {chooseTableHeaders()} 
        </Grid> 

        <div className="main_content_container">    

            {is_connected ? 
                displayCurrentRecordType()
                :
                <div>
                    <img src={background} alt="background image" className="background_image" style={{width: "20%"}} />
                    <Typography
                        color={"white"}
                        fontSize={20}>
                        Welcome to shift manager, sign in to begin!
                    </Typography>
                </div>
            }
        </div>
        </>
    )
}