import React, { useState } from "react"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

//Apollo and graphql
import { useMutation } from "@apollo/client"
import { MUTATION_CREATE_USER } from "../../Queries/Mutations";

//Material Ui
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from "@mui/material/TextField";

export interface MyProps{

  toggleConnected: () => void,
  changeUserId: (id: string) => void
}

interface MyFormValues{

    username: string,
    password: string,
    confirm_password: string,
    salary_per_hour: number
}

export const SignUp: React.FC<MyProps> = ({toggleConnected, changeUserId}) => {

    const [open, SetOpen] = useState<boolean>(false);
    const [ createUser, {data, loading, error} ] = useMutation(
      MUTATION_CREATE_USER, 
      {onCompleted: (data) => changeUserId(data.createUser.id)} //after submiting, return the user id
    );
    var errmsg: string;
    
    const initialValues: MyFormValues = {
        username: "",
        password: "",
        confirm_password: "",
        salary_per_hour: 0
    }

    const validationSchema: any = Yup.object().shape({
        username: Yup.string().min(3, "username is too short")
        .max(15, "username is too long").required("Required"),
        password: Yup.string().min(8, "password is too short")
        .max(20, "password is too long").required("Required"),
        confirm_password: Yup.string().min(8, "password is too short")
        .max(20, "password is too long").required("Required"),
        salary_per_hour: Yup.number().min(1, "can't be negative or zero")
        .required("Required")
    })

    const checkPassword = (password: string, confirm_password: string): boolean => {

      if (password.search(/\d/) == -1) {
          errmsg = "please add at least 1 number";
          return false;
      } else if (password.search(/[a-zA-Z]/) == -1) {
          errmsg = "please add at least 1 letter";
          return false;
      } else if(password !== confirm_password){
          errmsg = "passwords do not match";
          return false;
      }

      return true;
    }

    //Add to data base with http
    const onSubmit = async(values: MyFormValues) => {

      if(!checkPassword(values.password, values.confirm_password)) 
        return;

      try {
        const { username,password } = values;

        await createUser({
          variables: {
            username: username,
            password: password
          }
        });
      } catch (err: any) {
        console.error(err.message);
      }
      
      toggleConnected();
      toggleDialog();
    }

    //toggle the dialog
    const toggleDialog = () => {

      SetOpen((prevState) => !prevState);    
    }

    return(
      <>
            <Button
              color="primary"
              variant="outlined"
              sx={{color: "black"}}
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
                            label="username"
                            variant="standard"
                            color="secondary"
                            required
                            value={props.values.username}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="username" />}
                          />
                          <Field as={TextField} name="salary_per_hour"
                            sx={{marginLeft: 3}}
                            margin="normal"
                            type="number"
                            label="salary per hour"
                            variant="standard"
                            color="secondary"
                            required
                            value={props.values.salary_per_hour}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="salary_per_hour" />}
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
                          <Field as={TextField} name="confirm_password"
                            sx={{marginLeft: 3}}
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
                          <br />
                          <Button type="submit"
                            sx={{marginLeft: "38%", color: "black"}}
                            color="primary"
                            variant="outlined">
                              submit
                          </Button>
                          <Typography
                            sx={{marginLeft: "28%"}}
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