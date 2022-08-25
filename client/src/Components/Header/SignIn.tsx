import React, { useState } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { MyProps } from "./SignUp"

//Material Ui
import Button from "@mui/material/Button"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Co2Sharp } from "@mui/icons-material"

interface MyFormValues{

    username: string,
    password: string
}

export const SignIn: React.FC<MyProps> = ({toggleConnected, changeUserId}) => {

    const [open, setOpen] = useState<boolean>(false);
    
    var errmsg: string;

    const initialValues: MyFormValues = {

        username: "",
        password: ""
    }

    const validationSchema: any = Yup.object().shape({

        username: Yup.string().min(3, "username is too short")
        .max(15, "username is too long").required("Required"),
        password: Yup.string().min(8, "password is too short")
        .max(20, "password is too long").required("Required")
    })

    const validateUser = async(username: string, password: string) => {

        try {
            
        } catch (err: any) {
            console.error(err.message);
        }
    }

    const onSubmit = async(values: MyFormValues) => {

        var temp: string = "";

        try {
            const { username, password } = values;
            const response = await fetch(`http://localhost:5000/users_validation?username=${username}&password=${password}`);
            const json_data = await response.json();

            temp = json_data.check_if_user_exists;
        } catch (err: any) {
            console.error(err.message);
        }

        if(temp === "")  //if not valid, return
        {
            errmsg = "username or password is incorrect";
            return;
        }

        changeUserId(temp);
        toggleConnected();
        toggleDialog();
    }

    const toggleDialog = () => {

        setOpen((prev_state) => !prev_state);
    }

    return(
        <>
        <Button
          color="secondary"
          variant="text"
          sx={{color: "white", marginRight: 1}}
          onClick={toggleDialog}>
            sign in
        </Button>

        <Dialog open={open} onClose={toggleDialog}>

            <DialogTitle>
                <Typography 
                  fontSize={20}
                  fontWeight={"bold"}>
                    Sign In
                </Typography>
                <Typography
                  fontSize={16}
                  color="GrayText"
                  gutterBottom>
                    fill the following fields to sign in
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
                        <br />
                        <Button type="submit"
                          sx={{marginLeft: "29%"}}
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