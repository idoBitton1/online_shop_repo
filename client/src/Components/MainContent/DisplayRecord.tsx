import React, { useState, useContext } from "react"
import "./DisplayRecords.css"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

//Apollo and Graphql
import { useMutation } from "@apollo/client"
import {MUTATION_DELETE_RECORD,
        MUTATION_UPDATE_RECORD } from "../../Queries/Mutations";

//interface
import { MyFormValues } from "../Footer/AddRecord"

//Context
import { recordsContext } from "../../Helper/Context"; 

//Material Ui
import { Grid } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import InputAdornment from "@mui/material/InputAdornment";
import FreeBreakfastOutlinedIcon from '@mui/icons-material/FreeBreakfastOutlined';

interface MyProps{

    id: string,
    start_time: Date,
    end_time: Date,
    daily_break: number,
    salary_per_hour: number
}

export const DisplayRecord: React.FC<MyProps> = ({id, start_time, end_time, daily_break, salary_per_hour}) => {

    const {records, setRecords} = useContext(recordsContext);

    const [open, setOpen] = useState<boolean>(false);

    //mutations
    const [deleteRecord] = useMutation(MUTATION_DELETE_RECORD);
    const [updateRecord] = useMutation(MUTATION_UPDATE_RECORD);

    var errmsg: string;

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

    const dltRecord = () => {

        //delete from the display array
        setRecords((prev_records) => {
            
            var index_of_current_record = -1;

            //find the index of the record in the array
            index_of_current_record = prev_records.findIndex((record) => record.id == id);
            
            //delete the record
            return [...prev_records.slice(0,index_of_current_record), ...prev_records.slice(index_of_current_record + 1)];
        })

        //delete from the db
        deleteRecord({
            variables: {
                id: id
            }
        })
    }

    //set the initial values to the current data of the record
    const initialValues: MyFormValues = {
        start_date: `${start_time.getFullYear()}-${(start_time.getMonth() + 1) >= 10 ? start_time.getMonth() + 1 : `0${start_time.getMonth() + 1}`}-${start_time.getDate() >= 10 ? start_time.getDate() : `0${start_time.getDate()}`}`,
        start_time: `${start_time.getHours() >= 10 ? start_time.getHours() : `0${start_time.getHours()}`}:${start_time.getMinutes() >= 10 ? start_time.getMinutes() : `0${start_time.getMinutes()}`}`,
        end_date: `${end_time.getFullYear()}-${(end_time.getMonth() + 1) >= 10 ? end_time.getMonth() + 1 : `0${end_time.getMonth() + 1}`}-${end_time.getDate() >= 10 ? end_time.getDate() : `0${end_time.getDate()}`}`,
        end_time: `${end_time.getHours() >= 10 ? end_time.getHours() : `0${end_time.getHours()}`}:${end_time.getMinutes() >= 10 ? end_time.getMinutes() : `0${end_time.getMinutes()}`}`,
        daily_break: daily_break
    }

    //input check
    const validationSchema: any = Yup.object().shape({
        start_date: Yup.string().required("Required"),
        start_time: Yup.string().required("Required"),
        end_date: Yup.string().required("Required"),
        end_time: Yup.string().required("Required"),
        daily_break: Yup.number().min(0, "can't be negative")
        .required("Required")
    })

    //updates the record
    const onSubmit = (values: MyFormValues) => {

        const start_datetime: Date = new Date(`${values.start_date} ${values.start_time}`);
        const end_datetime: Date = new Date(`${values.end_date} ${values.end_time}`);

        //if the end time is before the start time, dont continue
        if(end_datetime.getTime() <= start_datetime.getTime())
        {
            errmsg = "end date can't be before or equals to the start date";
            return;
        }

        if(end_datetime.getTime() - start_datetime.getTime() <= values.daily_break*60000)
        {
            errmsg = "working time is less or equals to the break";
            return;
        }

        try {
            const {daily_break} = values;
            const start_time = `${values.start_date} ${values.start_time}`;
            const end_time = `${values.end_date} ${values.end_time}`;
            
            //updates the db
            updateRecord({
                variables: {
                    id: id,
                    startTime: start_time,
                    endTime: end_time,
                    dailyBreak: daily_break
                }
            })

            //update the records array
            var index_of_current_record = -1;

            //find the index of the record in the array
            index_of_current_record = records.findIndex((record) => record.id == id);

            //re create the record
            const record = {
                __typename: 'Record',
                id: id,
                start_time: String(start_datetime.getTime()),
                end_time: String(end_datetime.getTime()),
                daily_break: daily_break
            }

            //change him with the old one
            const temp = [...records];
            temp[index_of_current_record] = record;
            temp.sort((a, b) => Number(a.start_time) - Number(b.start_time));

            //change the array
            setRecords([...temp]);
        } catch (err: any) {
            console.error(err.message)
        }

        toggleEditDialog();
    }

    const toggleEditDialog = () => {

        setOpen((prevState) => !prevState);
    }

    return(
        <>
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
                    onClick={toggleEditDialog}>
                    <EditIcon sx={{color: "white"}} />
                </IconButton>
                <IconButton
                    onClick={dltRecord}>
                    <DeleteIcon sx={{color: "white"}} />
                </IconButton>
            </Grid>
        </Grid>





        <Dialog open={open} onClose={toggleEditDialog} sx={{textAlign: "center"}}>
            <DialogTitle>
                <Typography 
                fontSize={25}
                fontWeight={"bold"}>
                    Edit record
                </Typography>
            </DialogTitle>

            <DialogContent>
                <Formik 
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {(props) => (
                    <Form>
                      <Field as={TextField} name="start_date"
                        margin="normal"
                        type="date"  
                        label="Start date"                   
                        variant="outlined"
                        required
                        color="secondary"
                        value={props.values.start_date}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="start_date" />}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <Field as={TextField} name="start_time"
                        sx={{marginLeft: 3}}
                        margin="normal"
                        type="time"    
                        label="Start time"                 
                        variant="outlined"
                        required
                        color="secondary"
                        value={props.values.start_time}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="start_time" />}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <br />
                      <Field as={TextField} name="end_date"
                        margin="normal"
                        type="date"  
                        label="End date"                   
                        variant="outlined"
                        required
                        color="secondary"
                        value={props.values.end_date}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="end_date" />}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <Field as={TextField} name="end_time"
                        sx={{marginLeft: 3}}
                        margin="normal"
                        type="time"   
                        label="End time"                 
                        variant="outlined"
                        required
                        color="secondary"
                        value={props.values.end_time}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="end_time" />}
                        InputLabelProps={{
                          shrink: true
                        }}
                      />
                      <br />
                      <Field as={TextField} name="daily_break"
                        sx={{marginLeft: 2}}
                        margin="normal"   
                        type="number"
                        label="Daily break (minutes)"
                        placeholder="type your daily break"              
                        variant="outlined"
                        required
                        color="secondary"
                        value={props.values.daily_break}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="daily_break" />}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FreeBreakfastOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <br />
                      <br />
                      <Button type="submit"
                        sx={{marginLeft: "5%", color: "black"}}
                        color="primary"
                        variant="outlined">
                          submit
                      </Button>
                        <Typography
                            fontFamily={"Rubik"}
                            color={"red"}>
                            {errmsg}
                        </Typography>
                      </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
        </>
    )
}