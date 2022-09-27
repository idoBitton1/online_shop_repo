import React, { useState, useContext } from "react"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

//Components
import { AddButton } from "./AddButton";

//Interface
import { Extra } from "../../../App"

//Apollo and Graphql
import { useMutation } from "@apollo/client"
import { MUTATUIN_CREATE_EXTRA } from "../../../Queries/Mutations"

//Context
import {extrasContext,
        connectContext,
        userIdContext,
        jobContext } from "../../../Helper/Context"

//Material Ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';

interface MyProps{

}

export interface MyFormValues{

  date: string,
  bonus: boolean,
  amount: number,
  description?: string
}

export const AddExtra: React.FC<MyProps> = () => {

    const {extras, setExtras} = useContext(extrasContext);
    const {is_connected} = useContext(connectContext);
    const {user_id} = useContext(userIdContext);
    const {job_id} = useContext(jobContext);

    const [open, SetOpen] = useState<boolean>(false);

    const [createExtra, {data}] = useMutation(MUTATUIN_CREATE_EXTRA, {
      onCompleted: (data) => {
        const extra: Extra = {
          id: data.createExtra.id,
          date: data.createExtra.date,
          bonus: data.createExtra.bonus,
          amount: data.createExtra.amount,
          description: data.createExtra.description          
        };

        //place the new object in the array and sort it
        var array_for_sort = [...extras, extra];
        array_for_sort.sort((a, b) => Number(a.date) - Number(b.date));
        setExtras([...array_for_sort]);
      }
    });
    
    const initialValues: MyFormValues = {
        date: "",
        bonus: true,
        amount: 0,
        description: ""
    }

    const validationSchema: any = Yup.object().shape({
        date: Yup.string().required("Required"),
        bonus: Yup.boolean(),
        amount: Yup.number().min(1, "can't be negative or zero").required("Required"),
        description: Yup.string().max(20, "please make a shorter description")
    })   

    //Add to data base with http
    const onSubmit = async(values: MyFormValues) => {

      try {
        const { date,bonus,amount,description } = values;

        //creates the extra record in the data base
        await createExtra({
          variables: {
            date: date,
            bonus: bonus,
            amount: amount,
            userId: user_id,
            jobId: job_id,
            description: description
          }
        });

      } catch (err: any) {
        console.error(err.message)
      }

      toggleDialog();
    }

    //toggle the dialog
    const toggleDialog = () => {

      SetOpen((prevState) => !prevState);    
    }

    return(
        <>
            <AddButton 
              is_disabled={is_connected ? false : true}
              text_when_active={"add an extra record"}
              text={"bonus / waste"}
              onClick={toggleDialog}
            />

            <Dialog open={open} onClose={toggleDialog}>
                <DialogTitle>
                  <Typography 
                   fontSize={20}
                   fontWeight={"bold"}>
                    Add a bonus / waste
                  </Typography>
                  <Typography
                   fontSize={16}
                   color="GrayText">
                    check the checkbox for a bonus (leave unchecked for a waste), and fill the following fields
                  </Typography>
                </DialogTitle>

                <DialogContent>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                    >

                    {(props) => (
                    <Form>
                        <Field as={TextField} name="date"
                          sx={{marginRight: 1}}
                          margin="normal"
                          type="date"  
                          label="Date"                   
                          variant="outlined"
                          required
                          color="secondary"
                          value={props.values.date}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="date" />}
                          InputLabelProps={{
                            shrink: true
                          }}
                        />
                        <Field as={TextField} name="amount"
                          sx={{marginRight: 3}}
                          margin="normal"   
                          type="number"
                          label="Amount"               
                          variant="outlined"
                          color="secondary"
                          required
                          value={props.values.amount}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="amount" />}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoneyOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <FormControlLabel
                          control={<Field 
                            name="bonus"
                            margin="normal"
                            as={Checkbox}
                            type="checkbox"
                            color="primary"
                          />}
                          label="bonus?"
                          sx={{marginTop: 3}}
                        />
                        <br />
                        <Field as={TextField} name="description"
                          margin="normal"
                          label="Description"
                          variant="outlined"
                          color="secondary"
                          fullWidth
                          multiline
                          rows={2}
                          value={props.values.description}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="description" />}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <ArticleOutlinedIcon />
                              </InputAdornment>
                            ),
                          }}
                        />
                        <br />
                        <br />
                        <Button type="submit"
                          sx={{marginLeft: "42%", color: "black"}}
                          color="primary"
                          variant="outlined">
                            submit
                        </Button>
                    </Form>
                    )}
                    </Formik>
                </DialogContent>
            </Dialog>
        </>
    )
}