import React, { useEffect, useState } from "react";

//form
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

//Apollo and graphql
import { useQuery, useMutation } from "@apollo/client"
import { GET_USER, CHECK_FOR_CREDIT_CARD } from "../../Queries/Queries";
import { UPDATE_USER_INFORMATION, REMOVE_CREDIT_CARD } from "../../Queries/Mutations";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//components
import { CreditCardForm } from "./CreditCardForm";

//material-ui
import { TextField, Button, Typography, InputAdornment } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

//icons
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';

//interface
import { MyFormValues } from "./RegisterForm";

export const ProfileForm = () => {
    //redux states
    const user = useSelector((redux_state: ReduxState) => redux_state.user);
    
    //states
    const [has_credit_card, setHasCreditCard] = useState<boolean>(false);
    const [is_manager, setIsManager] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);

    //queries
    const { data: user_data, refetch } = useQuery(GET_USER, {
        variables: {
            userId: user.token?.user_id
        }
    });
    const { data: credit_data } = useQuery(CHECK_FOR_CREDIT_CARD, {
        variables: {
            id: user.token?.user_id
        }
    });

    //mutations
    const [updateUserInformation, { error }] = useMutation(UPDATE_USER_INFORMATION);
    const [removeCreditCard] = useMutation(REMOVE_CREDIT_CARD);

    //the initial values of the form to the user information
    const initial_values: MyFormValues ={
        first_name: user_data ? user_data.getUser.first_name : "",
        last_name: user_data ? user_data.getUser.last_name : "",
        password: user_data ? user_data.getUser.password : "",
        address: user_data ? user_data.getUser.address : "",
        email: user_data ? user_data.getUser.email : ""
    }

    //cvalidation schema for the form
    const validation_schema: any = Yup.object().shape({
        first_name: Yup.string().required("Required"),
        last_name: Yup.string().required("Required"),
        password: Yup.string().required("Required"),
        address: Yup.string(),
        email: Yup.string().email().required("Required")
    });



    useEffect(() => {
        if(user_data) {
            setIsManager(user_data.getUser.is_manager);
        }
    }, [user_data]);

    const onSubmit = (values: MyFormValues) => {
        //update db        
        updateUserInformation({
            variables: {
                id: user.token?.user_id,
                firstName: values.first_name,
                lastName: values.last_name,
                password: values.password,
                address: is_manager ? "" : values.address,
                email: values.email,
                isManager: is_manager
            }
        });

        refetch();
    }

    useEffect(() => {
        if(credit_data) {
            setHasCreditCard(credit_data.checkForCreditCard);
        }
    }, [credit_data]);

    const handleCreditCardClick = () => {
        toggleDialog();
    }

    const handleRemoveCreditCardClick = () => {
        //set to dont have credit card
        setHasCreditCard(false);

        //remove from the db
        removeCreditCard({
            variables: {
                id: user.token?.user_id
            }
        });

        window.location.reload(); //refresh the window
    }

    const toggleDialog = () => {
        setOpen((prev) => !prev);
    }

    return (
        <>
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
                        helperText={<ErrorMessage name="last_name" />}
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
                        helperText={<ErrorMessage name="password" />}
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
                                    helperText={<ErrorMessage name="address" />}
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
                    {
                    has_credit_card
                    ?
                    <h3 className="point_me" onClick={handleRemoveCreditCardClick}
                    style={{ textAlign: "left", display: "flex", alignItems: "center" }}
                    >
                        <RemoveCircleOutlineOutlinedIcon /> &nbsp; remove credit card
                    </h3>
                    :
                    <h3 className="point_me" onClick={handleCreditCardClick}
                    style={{ textAlign: "left", display: "flex", alignItems: "center" }}
                    >
                        <AddCircleOutlineOutlinedIcon /> &nbsp; add credit card
                    </h3>
                    }

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




        <Dialog open={open} onClose={toggleDialog} fullWidth>
            <DialogTitle>
                <Typography
                fontSize={25}
                borderBottom={1}
                borderColor={"lightgray"}
                gutterBottom>
                    Add credit card
                </Typography>
            </DialogTitle>

            <DialogContent>
                <CreditCardForm 
                toggleDialog={toggleDialog}
                setHasCreditCard={setHasCreditCard}
                />
            </DialogContent>
        </Dialog>
        </>
    );
}