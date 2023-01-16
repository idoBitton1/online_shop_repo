import React from "react";
import { useNavigate } from "react-router-dom"

//form
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

//Apollo and graphql
import { useMutation } from "@apollo/client"
import { CREATE_USER } from "../../Queries/Mutations";

//redux
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionsCreators } from '../../state';

//material-ui
import { TextField, Button, Typography, InputAdornment } from '@mui/material';

//icons
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

interface MyProps {
    is_manager: boolean
}

export interface MyFormValues {
    first_name: string,
    last_name: string,
    password: string,
    address: string,
    email: string
}

export const RegisterForm: React.FC<MyProps> = ({ is_manager }) => {
    //navigation
    const navigate = useNavigate();

    //redux actions
    const dispatch = useDispatch();
    const { login } = bindActionCreators(actionsCreators, dispatch);

    //mutations
    const [createUser, { error }] = useMutation(CREATE_USER, {
        onCompleted: (data) => {
            localStorage.setItem("token", data.createUser.token);
            login(data.createUser.token);
        } //after registering, connect the user
    });

    //the initial values of the form
    const initial_values: MyFormValues = {
        first_name: "",
        last_name: "",
        password: "",
        address: "",
        email: ""
    };

    //validation schema for the form
    const validation_schema: any = Yup.object().shape({
        email: Yup.string().email().required("Required")
    });

    

    const onSubmit = async (values: MyFormValues) => {

        try {
            const { first_name, last_name, password, address, email } = values;

            await createUser({
                variables: {
                    firstName: first_name,
                    lastName: last_name,
                    password: password,
                    address: address,
                    email: email,
                    isManager: is_manager
                }
            });
        } catch (err: any) {
            console.error(err.message);
            return; //dont continue
        }

        //if registered successfully, navigate back to the home page
        navigate('/');
    }

    return (
        <Formik
            initialValues={initial_values}
            validationSchema={validation_schema}
            onSubmit={onSubmit}
        >
            {(props) => (
                <Form>
                    <Field as={TextField} name="first_name"
                        label="first name"
                        variant="outlined"
                        value={props.values.first_name}
                        onChange={props.handleChange}
                        margin="normal"
                        sx={{ marginRight: 1 }}
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PermIdentityOutlinedIcon />
                              </InputAdornment>
                            )
                        }}
                    />
                    <Field as={TextField} name="last_name"
                        label="last name"
                        variant="outlined"
                        value={props.values.last_name}
                        onChange={props.handleChange}
                        margin="normal"
                        InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <PermIdentityOutlinedIcon />
                              </InputAdornment>
                            )
                        }}
                    />

                    <br />
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

                    <br />
                    {
                        is_manager
                            ?
                            <></>
                            :
                            (
                                <Field as={TextField} name="address"
                                    label="address"
                                    variant="outlined"
                                    value={props.values.address}
                                    onChange={props.handleChange}
                                    margin="normal"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                          <InputAdornment position="start">
                                            <HomeOutlinedIcon />
                                          </InputAdornment>
                                        )
                                    }}
                                />
                            )
                    }

                    {is_manager ? <></> : <br />}
                    <br />
                    <h3 className="point_me" 
                        style={{ color: "gray" }}
                        onClick={() => navigate('/login')}>
                            already have an account?
                    </h3>

                    <br />
                    <Button type="submit"
                        sx={{ textTransform: "none", fontWeight: "bold", fontSize: 17, marginTop: 1 }}
                        fullWidth
                        variant="contained">
                        Register
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

    );
}