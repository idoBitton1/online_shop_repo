import React from "react";

//form
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

//material- ui
import { TextField } from '@mui/material';

interface MyFormValues{
    first_name: string,
    last_name: string,
    password: string,
    address: string,
    email: string,
    is_manager: boolean
}

export const RegisterForm = () => {

    //the initial values of the form
    const initial_values: MyFormValues = {
        first_name: "",
        last_name: "",
        password: "",
        address: "",
        email: "",
        is_manager: false
    };

    const validation_schema: any = Yup.object().shape({
        first_name: Yup.string().min(3, "name is too short")
        .max(15, "name is too long").required("Required"),
        last_name: Yup.string().min(3, "last name is too short")
        .max(20, "last name is too long").required("Required"),
        password: Yup.string().min(8, "password is too short")
        .max(20, "password is too long").required("Required"),
        address: Yup.string().required("Required"),
        email: Yup.string().email().required("Required"),
        is_manager: Yup.boolean()
    });

    const onSubmit = (values: MyFormValues) => {

    }

    return(
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
                sx={{marginRight: 1}}
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
                <Field as={TextField} name="address"
                label="address"
                variant="outlined"
                value={props.values.address}
                onChange={props.handleChange}
                margin="normal"
                fullWidth
                helperText={<ErrorMessage name="address" />}
                />          
            </Form>
            )}
        </Formik>
    );
}