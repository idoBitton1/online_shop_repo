import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"

//Material Ui
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import IconButton from '@mui/material/IconButton';
import PersonAdd from "@mui/icons-material/PersonAdd";

export interface MyProps{

  connected: boolean,
  toggleConnected: () => void
}

interface MyFormValues{

    username: string,
    password: string,
    confirm_password: string,
    salary_per_hour: number
}

export const SignUp: React.FC<MyProps> = ({connected, toggleConnected}) => {

    const [open, SetOpen] = useState<boolean>(false);
    var errmsg: string;
    
    const initialValues: MyFormValues = {
        username: "",
        password: "",
        confirm_password: "",
        salary_per_hour: 0
    }

    const validationSchema: any = Yup.object().shape({
        username: Yup.string().min(3, "username is too short")
        .max(15, "username is too long")
        .required("Required"),
        password: Yup.string().min(8, "password is too long")
        .required("Required"),
        confirm_password: Yup.string().min(8, "password is too long")
        .required("Required"),
        salary_per_hour: Yup.number().min(1, "can't be negative or zero")
        .required("Required")
    })

    //toggle the dialog
    const toggleDialog = () => {

        SetOpen((prevState) => !prevState);    
    }

    //Add to data base with http
    const onSubmit = (values: MyFormValues) => {

      if(values.password !== values.confirm_password)
      {
        errmsg = "passwords do not match"
        return
      }

        console.log(values);
        toggleConnected();
        toggleDialog();
    }

    return(
        <>
            <IconButton
              sx={{color: "white"}}
              onClick={toggleDialog}>
                <PersonAdd sx={{fontSize: 30}} />
            </IconButton>

            <Dialog open={open} onClose={toggleDialog}>

                <DialogTitle>
                  <Typography 
                    fontSize={20}
                    fontWeight={"bold"}>
                      Sign Up
                  </Typography>
                  <Typography
                   fontSize={16}
                   color="GrayText">
                    fill the following fields to sign up
                  </Typography>
                </DialogTitle>
                  
                <DialogContent>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}>

                    {(props) => (
                        <Form>
                          <Field as={TextField} name="username"
                            margin="normal"
                            label="username"
                            variant="standard"
                            color="secondary"
                            required
                            value={props.values.username}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="username" />}
                          />
                          <br />
                          <Field as={TextField} name="password"
                            margin="normal"
                            label="password"
                            type="password"
                            variant="standard"
                            color="secondary"
                            required
                            value={props.values.password}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="password" />}
                          />
                          <br />
                          <Field as={TextField} name="confirm_password"
                            margin="normal"
                            label="confirm password"
                            type="password"
                            variant="standard"
                            color="secondary"
                            required
                            value={props.values.confirm_password}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="confirm_password" />}
                          />
                          <br />
                          <Field as={TextField} name="salary_per_hour"
                            margin="normal"
                            label="salary per hour"
                            variant="standard"
                            color="secondary"
                            required
                            value={props.values.salary_per_hour}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="salary_per_hour" />}
                          />
                          <br />
                          <br />
                          
                          <Button type="submit"
                            color="secondary"
                            variant="contained">
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