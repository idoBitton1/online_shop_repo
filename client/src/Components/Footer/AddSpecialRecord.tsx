import React, { useState, useContext } from "react"
import * as Yup from "yup"
import { ErrorMessage, Field, Form, Formik } from "formik";

//Components
import { AddButton } from "./AddButton";

//Interface
import { SpecialRecord } from "../../App"

//Apollo and Graphql
import { useLazyQuery, useMutation } from "@apollo/client";
import { MUTATION_CREATE_SPECIAL_RECORD } from "../../Queries/Mutations";
import { QUERY_SPECIAL_RECORD_TYPE_BY_TYPE } from "../../Queries/Queries";

//Context
import { specialRecordsContext, connectContext } from "../../Helper/Context"; 

//Material Ui
import Button from "@mui/material/Button"
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { MenuItem, Select } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined';

interface MyProps{

  user_id: string,
  job_id: string,
}

interface MyFormValues{

    date: string,
    hours_amount: number,
    type: string
}

export const AddSpecialRecord: React.FC<MyProps> = ({user_id, job_id}) => {

    const {special_records, setSpecialRecords} = useContext(specialRecordsContext);
    const {is_connected} = useContext(connectContext);

    const [open, setOpen] = useState<boolean>(false);
    const [optionList, setOptionsList] = useState<string[]>([
      "vacation", "sick day", "holiday"
    ]);

    const [date, setDate] = useState<String>("");
    const [hours_amount, setHoursAmount] = useState<Number>(0);

    const [createSpecialRecord, {data: special_record_data, loading, error}] = useMutation(MUTATION_CREATE_SPECIAL_RECORD, {
      onCompleted: (special_record_data) => {

        //creates the special record
        const special_record: SpecialRecord = {
          id: special_record_data.createSpecialRecord.id,
          date: special_record_data.createSpecialRecord.date,
          hours_amount: special_record_data.createSpecialRecord.hours_amount,
          special_record_type_id: special_record_data.createSpecialRecord.special_record_type_id
        };

        //place the new object in the array and sort it
        var array_for_sort = [...special_records, special_record];
        array_for_sort.sort((a, b) => Number(a.date) - Number(b.date));
        setSpecialRecords([...array_for_sort]);
      }
    });

    //gets the id of a special record type, by type
    const [getSpecialRecordType, {data}] = useLazyQuery(QUERY_SPECIAL_RECORD_TYPE_BY_TYPE,{
      onCompleted: (data) => {
        try {

          //when the special record type id is fetched, add the special record to the data base
          createSpecialRecord({
            variables: {
              date: date,
              hoursAmount: hours_amount,
              userId: user_id,
              jobId: job_id,
              specialRecordTypeId: data.getSpecialRecordTypeByType.id
            }
          });
  
        } catch (err: any) {
          console.error(err.message);
        }
      }}
    );

    const initialValues: MyFormValues = {
        date: "",
        hours_amount: 0,
        type: ""
    }

    const validationSchema: any = Yup.object().shape({
        date: Yup.string().required("Required"),
        hours_amount: Yup.number().min(1, "can't be negative or zero").required("Required"),
        type: Yup.string().required("Required")
    })
  
    const onSubmit = (values: MyFormValues) => {
    
      const { date, hours_amount } = values; 
      setDate(date);
      setHoursAmount(hours_amount);
      const { type } = values
      try {

        //creates the special record in the data base
        getSpecialRecordType({
          variables: {
            type: type
          }
        });
      } catch (err: any) {
        console.error(err.message);
      }

      //the special record itself is submiting after fetching
      //the id of the type.

      toggleDialog();
    }

    const toggleDialog = () => {

      setOpen((prevState) => !prevState);  
    }

    return(
        <>
            <AddButton 
              is_disabled={is_connected ? false : true}
              text_when_active={"add a special record"}
              text={"special record"}
              onClick={toggleDialog}
            />

            <Dialog open={open} onClose={toggleDialog}>
                <DialogTitle>
                <Typography 
                   fontSize={20}
                   fontWeight={"bold"}>
                    Add a special record
                  </Typography>
                  <Typography
                   fontSize={16}
                   color="GrayText">
                    fill the following fields to add a record
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
                            sx={{marginRight: 3}}
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
                          <Field 
                            name="type"
                            type="select" 
                            sx={{marginTop: 2}}
                            as={Select}
                            helpertext={<ErrorMessage name="type" />}>
                            {optionList.map((option) => {
                                return(
                                  <MenuItem key={option} value={option}>{option}</MenuItem>
                                )   
                            })}
                          </Field>
                          <br />
                          <Field as={TextField} name="hours_amount"
                            sx={{marginLeft: 1}}
                            margin="normal"   
                            label="Hours amount"   
                            type="number"            
                            variant="outlined"
                            required
                            color="secondary"
                            value={props.values.hours_amount}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="hours_amount" />}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <WatchLaterOutlinedIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                          <br />
                          <br />
                          <Button type="submit"
                            sx={{marginLeft: "34%", color: "black"}}
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