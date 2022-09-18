import React, { useState, useContext } from "react";
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

//Components
import { AddButton } from "./AddButton";

//Inteface
import { Record } from "../../App"

//Apollo and Graphql
import { useMutation } from "@apollo/client";
import { MUTATION_CREATE_RECORD } from "../../Queries/Mutations";

//Context
import { recordsContext, connectContext } from "../../Helper/Context"; 

//Material Ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import InputAdornment from "@mui/material/InputAdornment";
import FreeBreakfastOutlinedIcon from '@mui/icons-material/FreeBreakfastOutlined';

interface MyProps{

  user_id: string,
  job_id: string,
}

interface MyFormValues{

  start_date: string,
  start_time: string,
  end_date: string,
  end_time: string,
  daily_break: number
}

export const AddRecord: React.FC<MyProps> = ({user_id, job_id}) => {

    const {records, setRecords} = useContext(recordsContext);
    const {is_connected} = useContext(connectContext);

    const [open, SetOpen] = useState<boolean>(false);

    const [createRecord, {data}] = useMutation(MUTATION_CREATE_RECORD, {
      onCompleted: (data) => {
        const record: Record = {
          id: data.createRecord.id,
          start_time: data.createRecord.start_time,
          end_time: data.createRecord.end_time,
          daily_break: data.createRecord.daily_break
        };

        //place the new object in the array and sort it
        var array_for_sort = [...records, record];
        array_for_sort.sort((a, b) => Number(a.start_time) - Number(b.start_time));
        setRecords([...array_for_sort]);
      }
    });

    var errmsg: string;

    const initialValues: MyFormValues = {
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      daily_break: 30
    }

    const validationSchema: any = Yup.object().shape({
      start_date: Yup.string().required("Required"),
      start_time: Yup.string().required("Required"),
      end_date: Yup.string().required("Required"),
      end_time: Yup.string().required("Required"),
      daily_break: Yup.number().min(0, "can't be negative")
      .required("Required")
    })

    const onSubmit = async(values: MyFormValues) => {

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
        const { daily_break } = values;
        const start_time = `${values.start_date} ${values.start_time}`;
        const end_time = `${values.end_date} ${values.end_time}`;

        //creates the records in the data base
        createRecord({
          variables: {
            startTime: start_time,
            endTime: end_time,
            dailyBreak: daily_break,
            userId: user_id,
            jobId: job_id
          }
        });

      } catch (err: any) {
        console.error(err.message);
      }

      toggleDialog();
    }

    //toggle the dialog
    const toggleDialog = () => {

      SetOpen((prevState) => !prevState); 
    }

    return(
        <>
            <AddButton 
              is_disabled={is_connected ? false : true}
              text_when_active={"add a record"}
              text={"Record"}
              onClick={toggleDialog}
            />

            <Dialog open={open} onClose={toggleDialog}>
                <DialogTitle>
                  <Typography 
                   fontSize={20}
                   fontWeight={"bold"}>
                    record
                  </Typography>
                  <Typography
                   fontSize={16}
                   color="GrayText">
                    fill the following fields to add a record
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
                        sx={{marginLeft: 4}}
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
                        sx={{marginLeft: "34%", color: "black"}}
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
    );
}