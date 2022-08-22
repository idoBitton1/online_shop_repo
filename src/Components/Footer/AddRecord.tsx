import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

//Material Ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

interface MyFormValues{

  record_date: string,
  start_time: string,
  end_time: string,
  daily_bonus?: number,
  daily_waste?: number
  daily_break: number
}

export const AddRecord = () => {

    const [open, SetOpen] = useState<boolean>(false);

    const initialValues: MyFormValues = {
      record_date: "",
      start_time: "",
      end_time: "",
      daily_bonus: 0,
      daily_waste: 0,
      daily_break: 30
    }

    const validationSchema: any = Yup.object().shape({
      record_date: Yup.string().required("Required"),
      start_time: Yup.string().required("Required"),
      end_time: Yup.string().required("Required"),
      daily_bonus: Yup.number().min(0, "can't be negative"),
      daily_waste: Yup.number().min(0, "can't be negative"),
      daily_break: Yup.number().min(0, "can't be negative")
      .required("Required")
    })

    //Add to data base with http
    const onSubmit = (values: MyFormValues) => {
      console.log(values);
      toggleDialog();
    }

    //toggle the dialog
    const toggleDialog = () => {

      SetOpen((prevState) => !prevState);    
    }

    return(
        <>
            <Button
              size="large"
              aria-label="add_record_button"
              variant="text"
              color="secondary"
              onClick={toggleDialog}>
                Add Record!
            </Button>

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
                      <Field as={TextField} name="record_date"
                        margin="normal"
                        type="date"  
                        label="date"                   
                        variant="standard"
                        required
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={props.values.record_date}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="record_date" />}
                      />
                      <br />
                      <Field as={TextField} name="start_time"
                        margin="normal"
                        type="time"    
                        label="start time"                 
                        variant="standard"
                        required
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={props.values.start_time}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="start_time" />}
                      />
                      <br />
                      <Field as={TextField} name="end_time"
                        margin="normal"
                        type="time"   
                        label="end time"                 
                        variant="standard"
                        required
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={props.values.end_time}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="end_time" />}
                      />
                      <br />
                      <Field as={TextField} name="daily_bonus"
                        margin="normal"
                        label="daily bonus"                  
                        variant="standard"
                        color="secondary"
                        value={props.values.daily_bonus}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="daily_bonus" />}
                      />
                      <br />
                      <Field as={TextField} name="daily_waste"
                        margin="normal"   
                        label="daily waste"               
                        variant="standard"
                        color="secondary"
                        value={props.values.daily_waste}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="daily_waste" />}
                      />
                      <br />
                      <Field as={TextField} name="daily_break"
                        margin="normal"   
                        label="daily break (minutes)"               
                        variant="standard"
                        required
                        color="secondary"
                        value={props.values.daily_break}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="daily_break" />}
                      />
                      <br />
                      <br />
                      <Button type="submit"
                        color="secondary"
                        variant="contained">
                          submit
                      </Button>
                    </Form>
                    )}
                  </Formik>
                </DialogContent>
            </Dialog>
        </>
    );
}