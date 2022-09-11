import React, { useState, useContext, useEffect } from "react"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

//Apollo and graphql
import { useMutation } from "@apollo/client"
import { MUTATION_CREATE_USER } from "../../Queries/Mutations";

//Context
import { userIdContext } from "../../Helper/Context";

//Material Ui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';

export interface MyProps{

  toggleConnected: () => void
}

interface MyFormValues{

    username: string,
    password: string,
    confirm_password: string
    //salary_per_hour: number
}

export const SignUp: React.FC<MyProps> = ({toggleConnected}) => {

    const {setUserId} = useContext(userIdContext);

    const [open, setOpen] = useState<boolean>(false);

    const [ createUser, {data, loading, error} ] = useMutation(MUTATION_CREATE_USER, {
      onCompleted: (data) => setUserId(data.createUser.id) //after submiting, return the user id
    });
    
    const initialValues: MyFormValues = {
      username: "",
      password: "",
      confirm_password: ""
      //salary_per_hour: 0
    }

    const validationSchema: any = Yup.object().shape({
        username: Yup.string().min(3, "username is too short")
        .max(15, "username is too long").required("Required"),
        password: Yup.string().min(8, "password is too short")
        .max(20, "password is too long").required("Required"),
        confirm_password: Yup.string().min(8, "password is too short")
        .max(20, "password is too long").required("Required"),
        //salary_per_hour: Yup.number().min(1, "can't be negative or zero")
        //.required("Required")
    })

    //Add to data base
    const onSubmit = async(values: MyFormValues) => {

      try {
        const { username, password, confirm_password } = values;

        //creates the user in the data base
        await createUser({
          variables: {
            username: username,
            password: password,
            confirmPassword: confirm_password
          }
        });
      } catch (err: any) {
        console.error(err.message);
        return;
      }
      
      toggleConnected();
      toggleDialog();
    }

    //toggle the dialog
    const toggleDialog = () => {

      setOpen((prevState) => !prevState);    
    }

    return(
      <>
            <Button
              color="primary"
              variant="outlined"
              sx={{color: "white"}}
              onClick={toggleDialog}>
                sign up
            </Button>

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
                          {/*<Field as={TextField} name="salary_per_hour"
                            sx={{marginLeft: 3}}
                            margin="normal"
                            type="number"
                            label="Salary per hour"
                            placeholder="type your hourly salary"
                            variant="outlined"
                            color="secondary"
                            required
                            value={props.values.salary_per_hour}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="salary_per_hour" />}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoneyOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                          />*/}
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
                          <Field as={TextField} name="confirm_password"
                            sx={{marginLeft: 3}}
                            margin="normal"
                            label="confirm password"
                            placeholder="confirm your password"
                            type="password"
                            variant="outlined"
                            color="secondary"
                            required
                            value={props.values.confirm_password}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="confirm_password" />}
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
                            sx={{marginLeft: "38%", color: "black"}}
                            color="primary"
                            variant="outlined">
                              submit
                          </Button>
                          <Typography
                            sx={{marginLeft: "31%"}}
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