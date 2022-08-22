import React, { useState } from "react"
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"

//Material Ui
import Button from "@mui/material/Button"
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { MenuItem, Select } from "@mui/material";

interface MyFormValues{

    date: string,
    hours_amount: number,
    type: string
}

export const AddSpecialRecord = () => {

    const [open, setOpen] = useState<boolean>(false);
    const [optionList, setOptionsList] = useState<string[]>([
        "option1", "option2", "option3"
    ]);

    const initialValues: MyFormValues = {
        date: "",
        hours_amount: 0,
        type: ""
    }

    const validationSchema: any = Yup.object().shape({
        date: Yup.string().required("Required"),
        hours_amount: Yup.number().min(1, "can't be negative or zero").required("Required"),
        type: Yup.string().required("Required")
    })

    const toggleDialog = () => {

        setOpen((prevState) => !prevState);
    }

    const onSubmit = (values: MyFormValues) => {

        console.log(values);
        toggleDialog();
    }

    return(
        <>
            <Button
              size="large"
              aria-label="add_extra_button"
              variant="text"
              color="secondary"
              onClick={toggleDialog}>
                special Record!
            </Button>

            <Dialog open={open} onClose={toggleDialog}>
                <DialogTitle>
                <Typography 
                   fontSize={20}
                   fontWeight={"bold"}>
                    Add a special record
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
                          <Field as={TextField} name="date"
                            margin="normal"
                            type="date"  
                            label="date"                   
                            variant="standard"
                            required
                            color="secondary"
                            InputLabelProps={{
                            shrink: true
                            }}
                            value={props.values.date}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="date" />}
                          />
                          <br />
                          <Field as={TextField} name="hours_amount"
                            margin="normal"   
                            label="hours_amount"               
                            variant="standard"
                            required
                            color="secondary"
                            value={props.values.hours_amount}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="hours_amount" />}
                          />
                          <br />
                          <Field 
                            name="type"
                            type="select" 
                            as={Select}
                            helpertext={<ErrorMessage name="type" />}>
                            {optionList.map((option) => {

                                return(
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                )   
                            })}
                          </Field>
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
    )
}