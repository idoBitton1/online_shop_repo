import React, { useState, useContext, useEffect } from "react"
import "./DisplayStyles.css"
import * as Yup from "yup"
import { ErrorMessage, Field, Form, Formik } from "formik";

//Apollo and Graphql
import { useQuery, useLazyQuery, useMutation } from "@apollo/client"
import { QUERY_SPECIAL_RECORD_TYPE_BY_ID, QUERY_SPECIAL_RECORD_TYPE_BY_TYPE } from "../../../Queries/Queries";
import { MUTATION_DELETE_SPECIAL_RECORD, MUTATION_UPDATE_SPECIAL_RECORD } from "../../../Queries/Mutations";

//Context
import { specialRecordsContext } from "../../../Helper/Context";

//interface
import { MyFormValues } from "../AddingRecords/AddSpecialRecord";

//Material Ui
import { Grid } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Button from "@mui/material/Button"
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { MenuItem, Select } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';

interface MyProps{

    id: string,
    date: Date,
    hours_amount: number,
    special_record_type_id: string,
    salary_per_hour: number
}

export const DisplaySpecialRecord: React.FC<MyProps> = ({id, date, hours_amount, special_record_type_id, salary_per_hour}) => {

    const {special_records, setSpecialRecords} = useContext(specialRecordsContext);

    const [open, setOpen] = useState<boolean>(false);
    const [optionList, setOptionsList] = useState<string[]>([
        "vacation", "sick day", "holiday"
    ]);

    const [date_state, setDate] = useState<string>("");
    const [hours_amount_state, setHoursAmount] = useState<number>(0);

    //variables that will rerender when the data from the query will be fetched
    const [type, setType] = useState<string>("");
    const [total, setTotal] = useState<number>(0);

    //queries
    const { data } = useQuery(QUERY_SPECIAL_RECORD_TYPE_BY_ID, {
        variables: {
            getSpecialRecordTypeByIdId: special_record_type_id
        }
    });

    //gets the id of a special record type, by type
    const [getSpecialRecordType] = useLazyQuery(QUERY_SPECIAL_RECORD_TYPE_BY_TYPE, {
        onCompleted: (data) => {
          try {

  
            //when the special record type id is fetched, add the special record to the data base
            updateSpecialRecord({
              variables: {
                id: id,
                date: date_state,
                hoursAmount: hours_amount_state,
                specialRecordTypeId: data.getSpecialRecordTypeByType.id
              }
            });
    
            //update the records array
            var index_of_current_record = -1;
            const datetime: Date = new Date(date_state);

            //find the index of the record in the array
            index_of_current_record = special_records.findIndex((special_record) => special_record.id == id);

            //re create the record
            const special_record = {
                //__typename: 'Record',
                id: id,
                date: String(datetime.getTime()),
                hours_amount: hours_amount_state,
                special_record_type_id: data.getSpecialRecordTypeByType.id
            }

            //change him with the old one
            const temp = [...special_records];
            temp[index_of_current_record] = special_record;
            temp.sort((a, b) => Number(a.date) - Number(b.date));

            //change the array
            setSpecialRecords([...temp]);
          } catch (err: any) {
            console.error(err.message);
          }
        }}
    );

    //mutations
    const [deleteSpecialRecord] = useMutation(MUTATION_DELETE_SPECIAL_RECORD);
    const [updateSpecialRecord, {error}] = useMutation(MUTATION_UPDATE_SPECIAL_RECORD);

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

    const dltRecord = () => {

        //delete from the display array
        setSpecialRecords((prev_special_records) => {
            
            var index_of_current_record = -1;

            //find the index of the record in the array
            for(let i = 0; i < prev_special_records.length; i++)
                if(prev_special_records[i].id === id){
                    index_of_current_record = i;
                    break;
                }
            
            //delete the record
            return [...prev_special_records.slice(0,index_of_current_record), ...prev_special_records.slice(index_of_current_record + 1)];
        })

        //delete from the db
        deleteSpecialRecord({
            variables: {
                id: id
            }
        })
    }

    const initialValues: MyFormValues = {
        date: `${date.getFullYear()}-${(date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`}`,
        hours_amount: hours_amount,
        type: type
    }

    const validationSchema: any = Yup.object().shape({
        date: Yup.string().required("Required"),
        hours_amount: Yup.number().min(1, "can't be negative or zero").required("Required"),
        type: Yup.string().required("Required")
    })

    const onSubmit = (values: MyFormValues) => {

        const { date, hours_amount, type } = values; 
        setDate(date);
        setHoursAmount(hours_amount);
        try {

            //updates the special record in the data base
            getSpecialRecordType({
            variables: {
                type: type
            }
            });
        } catch (err: any) {
            console.error(err.message);
        }

        //the special record itself is submiting after fetching
        //the id of the type.

        toggleEditDialog();
    }

    const toggleEditDialog = () => {

        setOpen((prev_state) => !prev_state);
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
                        Edit special record
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
                        <Field as={TextField} name="date"
                            sx={{marginRight: 3}}
                            margin="normal"
                            type="date"  
                            label="Date"                   
                            variant="outlined"
                            required
                            color="secondary"
                            value={props.values.date}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="date" />}
                            InputLabelProps={{
                              shrink: true
                            }}
                        />
                        <Field 
                            name="type"
                            type="select" 
                            sx={{marginTop: 2}}
                            as={Select}
                            helpertext={<ErrorMessage name="type" />}>
                            {optionList.map((option) => {
                                return(
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                )   
                            })}
                        </Field>
                        <br />
                        <Field as={TextField} name="hours_amount"
                            sx={{marginLeft: 1}}
                            margin="normal"   
                            label="Hours amount"   
                            type="number"            
                            variant="outlined"
                            required
                            color="secondary"
                            value={props.values.hours_amount}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="hours_amount" />}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <WatchLaterOutlinedIcon />
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
                    </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
        </>
    )
}