import React, { useState, useContext } from "react"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

//Apollo and Graphql
import { useMutation } from "@apollo/client"
import { MUTATION_LOGIN } from "../../Queries/Mutations"

//Context
import { userIdContext } from "../../Helper/Context"

//Interface
import { MyProps } from "./SignUp"

//Material Ui
import Button from "@mui/material/Button"
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

interface MyFormValues{

    username: string,
    password: string
}

export const SignIn: React.FC<MyProps> = ({toggleConnected}) => {

    const { setUserId } = useContext(userIdContext);

    const [open, setOpen] = useState<boolean>(false);

    const [loginUser, {error}] = useMutation(MUTATION_LOGIN, {
      onCompleted: (data) => setUserId(data.loginUser.id) //set the user id to the id of the current user
    });

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

    const onSubmit = async(values: MyFormValues) => {

      try {
        const { username, password } = values;

        //login
        await loginUser({
          variables: {
            username: username,
            password: password
          }
        });
      } catch (err: any) {
        console.error(err.message);
        return;
      }

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
                          label="Username"
                          placeholder="type your username"
                          variant="outlined"
                          color="secondary"
                          required
                          value={props.values.username}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="username" />}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PermIdentityOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <br />
                        <Field as={TextField} name="password"
                          margin="normal"
                          label="Password"
                          placeholder="type your password"
                          type="password"
                          variant="outlined"
                          color="secondary"
                          required
                          value={props.values.password}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="password" />}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <br />
                        <br />
                        <Button type="submit"
                          sx={{marginLeft: "31%", color: "black"}}
                          color="primary"
                          variant="outlined">
                            submit
                        </Button>
                        <Typography
                          sx={{marginLeft: "20%"}}
                          fontFamily={"Rubik"}
                          color={"red"}>
                            {error ? error.message : ""}
                        </Typography>
                    </Form>
                )}  
                </Formik>
            </DialogContent>
        </Dialog>
        </>
    )
}