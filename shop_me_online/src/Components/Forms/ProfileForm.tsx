import React, { useEffect, useState } from "react";

//form
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

//Apollo and graphql
import { useQuery, useMutation } from "@apollo/client"
import { GET_USER } from "../../Queries/Queries";
import { UPDATE_USER_INFORMATION } from "../../Queries/Mutations";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//material-ui
import { TextField, Button, Typography } from '@mui/material';

//interface
import { MyFormValues } from "./RegisterForm";

export const ProfileForm = () => {

    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    const [is_manager, setIsManager] = useState<boolean>(false);

    const { data: user_data } = useQuery(GET_USER, {
        variables: {
            userId: user.token?.user_id
        }
    });

    const [updateUserInformation, { error }] = useMutation(UPDATE_USER_INFORMATION);

    //the initial values of the form to the user information
    const initial_values: MyFormValues ={
        first_name: user_data ? user_data.getUser.first_name : "",
        last_name: user_data ? user_data.getUser.last_name : "",
        password: user_data ? user_data.getUser.password : "",
        address: user_data ? user_data.getUser.address : "",
        email: user_data ? user_data.getUser.email : ""
    }

    const validation_schema: any = Yup.object().shape({
        first_name: Yup.string().required("Required"),
        last_name: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
        address: Yup.string().required("Required"),
        email: Yup.string().email().required("Required")
    });

    useEffect(() => {
        if(user_data) {
            setIsManager(user_data.getUser.is_manager);
        }
    }, [user_data]);

    const onSubmit = (values: MyFormValues) => {
        //if all the information is the same, dont change the db
        if(values.first_name === user_data.getUser.first_name &&
            values.last_name === user_data.getUser.last_name &&
            values.password === user_data.getUser.password &&
            values.address === user_data.getUser.address &&
            values.email === user_data.getUser.email)
            return;
        
        updateUserInformation({
            variables: {
                id: user.token?.user_id,
                firstName: values.first_name,
                lastName: values.last_name,
                password: values.password,
                address: values.address,
                email: values.email,
                isManager: is_manager
            }
        });
    }

    const handleCreditCartClick = () => {
        
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
                        helperText={<ErrorMessage name="first_name" />}
                    />
                    <Field as={TextField} name="last_name"
                        label="last name"
                        variant="outlined"
                        value={props.values.last_name}
                        onChange={props.handleChange}
                        margin="normal"
                        helperText={<ErrorMessage name="last_name" />}
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
                        helperText={<ErrorMessage name="password" />}
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
                                    helperText={<ErrorMessage name="address" />}
                                />
                            )
                    }

                    {is_manager ? <></> : <br />}
                    <br />
                    <h3 className="point_me" onClick={handleCreditCartClick}
                        style={{ color: "gray", textAlign: "left" }}
                        >
                            add credit card
                    </h3>
                    <br />
                    <h3
                        style={{ fontFamily: "Rubik" ,color: "GrayText", textAlign: "left" }}
                        >
                            *if no data is displaying, go to another page and come back
                    </h3>

                    <br />
                    <Button type="submit"
                        sx={{ textTransform: "none", fontWeight: "bold", fontSize: 17, marginTop: 1 }}
                        fullWidth
                        variant="contained">
                        Update Information
                    </Button>
                    <Typography
                        marginTop={2}
                        fontFamily={"Rubik"}
                        color={"red"}
                        sx={{textAlign: "left"}}>
                        {error ? error.message : ""}
                    </Typography>
                </Form>
            )}
        </Formik>
    );
}