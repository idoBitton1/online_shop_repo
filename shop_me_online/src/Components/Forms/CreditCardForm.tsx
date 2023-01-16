import React, { useState } from "react";

//form
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

//Apollo and graphql
import { useMutation } from "@apollo/client"
import { ADD_CREDIT_CARD } from "../../Queries/Mutations";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//material ui
import { Button, TextField, Typography, InputAdornment } from "@mui/material";

//icons
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

//interface
import validator from "../../CreditCard/Validator";

export interface MyFormValues {
    card_name: string,
    card_number: string,
    card_expiration: string,
    card_security_code: string,
} 

export interface Errors {
    show: boolean,
    color: string,
    message: string,
    cname: boolean,
    cnumber: boolean,
    cexp: boolean,
    ccvv: boolean,
}

interface MyProps {
    toggleDialog: () => void,
    setHasCreditCard: React.Dispatch<React.SetStateAction<boolean>>
}

export const CreditCardForm: React.FC<MyProps> = ({toggleDialog, setHasCreditCard}) => {
    //redux states
    const user = useSelector((redux_state: ReduxState) => redux_state.user);

    //states
    const [errors, setErrors] = useState<Errors>({
        show: true,
        color: "red",
        message: "",
        cname: false,
        cnumber: false,
        cexp: false,
        ccvv: false
    });

    //mutations
    const [addCreditCard] = useMutation(ADD_CREDIT_CARD);

    //initial values of the form
    const initial_values: MyFormValues = {
        card_name: "",
        card_number: "",
        card_expiration: "",
        card_security_code: ""
    }

    //validation schema for the form
    const validation_schema: any = Yup.object().shape({
        card_name: Yup.string().required("Required"),
        card_number: Yup.string().min(16, "Must be 16 numbers").max(16, "Must be 16 numbers").required("Required"),
        card_expiration: Yup.string().required("Required"),
        card_security_code: Yup.string().min(3, "Must be 3 numbers").max(3, "Must be 3 numbers").required("Required")
    });


    
    const onSubmit = (values: MyFormValues) => {
        setErrors(validator(values));

        if(errors.message !== "Credit Card is valid")
            return;
        
        //add the credit card to the db
        addCreditCard({
            variables: {
                id: user.token?.user_id,
                creditCardNumber: values.card_number
            }
        });

        //change to has a credit card
        setHasCreditCard(true);

        //close the dialog
        toggleDialog();

        window.location.reload(); //refresh the window
    }

    return (
        <Formik 
        initialValues={initial_values}
        validationSchema={validation_schema}
        onSubmit={onSubmit}
        >
        {(props) => (
            <Form>
                <Field as={TextField} name="card_name"
                    label="card name"
                    placeholder="Card holder name"
                    variant="outlined"
                    value={props.values.card_name}
                    onChange={props.handleChange}
                    fullWidth
                    margin="normal"
                    helperText={<ErrorMessage name="card_name" />}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <PermIdentityOutlinedIcon />
                        </InputAdornment>
                        )
                    }}
                />

                <br />
                <Field as={TextField} name="card_number"
                    label="card number"
                    placeholder="XXXXXXXXXXXXXXXX"
                    variant="outlined"
                    value={props.values.card_number}
                    onChange={props.handleChange}
                    fullWidth
                    margin="normal"
                    helperText={<ErrorMessage name="card_number" />}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <CreditCardOutlinedIcon />
                        </InputAdornment>
                        )
                    }}
                />

                <br />
                <Field as={TextField} name="card_expiration"
                    label="expiration"
                    placeholder="XX/XX"
                    variant="outlined"
                    value={props.values.card_expiration}
                    onChange={props.handleChange}
                    margin="normal"
                    helperText={<ErrorMessage name="card_expiration" />}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <HourglassEmptyOutlinedIcon />
                        </InputAdornment>
                        )
                    }}
                />
                <Field as={TextField} name="card_security_code"
                    label="cvc"
                    placeholder="XXX"
                    variant="outlined"
                    value={props.values.card_security_code}
                    onChange={props.handleChange}
                    margin="normal"
                    sx={{marginLeft: 5.2}}
                    helperText={<ErrorMessage name="card_security_code" />}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <LockOutlinedIcon />
                        </InputAdornment>
                        )
                    }}
                />

                <Button type="submit"
                    color="primary"
                    fullWidth
                    variant="contained"
                    sx={{ textTransform: "none", fontWeight: "bold", fontSize: 17, marginTop: 1 }}
                >
                    Add card
                </Button>
                <Typography
                    marginTop={2}
                    fontFamily={"Rubik"}
                    color={errors.color}
                >
                    {errors ? errors.message : ""}
                </Typography>
            </Form>
        )}
        </Formik>
    );
}