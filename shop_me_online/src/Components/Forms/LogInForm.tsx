import React from "react";
import { useNavigate } from "react-router-dom"

//form
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

//Apollo and graphql
import { useMutation } from "@apollo/client"
import { LOGIN_USER } from "../../Queries/Mutations";

//redux
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionsCreators } from '../../state';

//material-ui
import { TextField, Button, Typography, InputAdornment } from '@mui/material';

//icons
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';

interface MyFormValues {
    email: string,
    password: string
}

export const LogInForm = () => {
    //navigation
    const navigate = useNavigate();

    //redux actions
    const dispatch = useDispatch();
    const { login } = bindActionCreators(actionsCreators, dispatch);

    //mutations
    const [loginUser, { error }] = useMutation(LOGIN_USER, {
        onCompleted: (data) => {
            localStorage.setItem("token", data.loginUser.token);
            login(data.loginUser.token);
        } //after logging, connect the user
    });


    
    //the initial values of the form
    const initial_values: MyFormValues = {
        email: "",
        password: ""
    };

    //the validation schema 
    const validation_schema: any = Yup.object().shape({
        email: Yup.string().email().required("Required")
    });

    //after submiting the form
    const onSubmit = async (values: MyFormValues) => {

        //login the user
        try {
            const { email, password } = values;

            await loginUser({
                variables: {
                    email: email,
                    password: password
                }
            });
        } catch (err: any) {
            console.error(err.message);
            return; //dont continue
        }

        //if logined successfully, navigate back to the home page
        navigate('/')
    }

    return (
        <Formik
            initialValues={initial_values}
            validationSchema={validation_schema}
            onSubmit={onSubmit}
        >
            {(props) => (
                <Form>
                    <Field as={TextField} name="email"
                        label="email"
                        variant="outlined"
                        type="email"
                        value={props.values.email}
                        onChange={props.handleChange}
                        margin="normal"
                        fullWidth
                        helperText={<ErrorMessage name="email" />}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EmailOutlinedIcon />
                              </InputAdornment>
                            )
                        }}
                    />

                    <Field as={TextField} name="password"
                        label="password"
                        variant="outlined"
                        type="password"
                        value={props.values.password}
                        onChange={props.handleChange}
                        margin="normal"
                        fullWidth
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LockOutlinedIcon />
                              </InputAdornment>
                            )
                        }}
                    />

                    <br />
                    <br />
                    <h3 className="point_me" style={{ color: "gray" }}
                        onClick={() => navigate('/register')}>don't have an account?</h3>
                    <br />
                    <h3 className="point_me" style={{ color: "gray" }}
                        onClick={() => navigate('/registerManager')}>become a manager</h3>

                    <br />
                    <Button type="submit"
                        sx={{ textTransform: "none", fontWeight: "bold", fontSize: 17, marginTop: 1 }}
                        color="primary"
                        fullWidth
                        variant="contained">
                        Log in
                    </Button>
                    <Typography
                        marginTop={2}
                        fontFamily={"Rubik"}
                        color={"red"}>
                        {error ? error.message : ""}
                    </Typography>
                </Form>
            )}
        </Formik>
    )
}