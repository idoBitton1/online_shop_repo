import React, { useState } from "react"
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup"
import * as uuid from "uuid"
import { SpecialRecord } from "../../App"

//Material Ui
import Button from "@mui/material/Button"
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { MenuItem, Select } from "@mui/material";

interface MyProps{

  user_id: string,
  job_id: string,
  changeSpecialRecords: (special_record: SpecialRecord) => void
}

interface MyFormValues{

    date: string,
    hours_amount: number,
    type: string
}

export const AddSpecialRecord: React.FC<MyProps> = ({user_id, job_id}) => {

    const [open, setOpen] = useState<boolean>(false);
    const [special_record_type_id, setSpecialRecordTypeId] = useState<string>("");
    const [optionList, setOptionsList] = useState<string[]>([
        "vacation", "sick day", "holiday"
    ]);

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

    //GET the percentage of the chosen type and his id
    const getPercentage = async(type: string) => {

      try {
        const response = await fetch(`http://localhost:5000/special_record_types?type=${type}`);
        const json_data = await response.json();

        setSpecialRecordTypeId(json_data.id)
      } catch (err: any) {
        console.error(err.message);
      }
    }
  
    //Add to database with http POST
    const onSubmit = async(values: MyFormValues) => {

      try {
        //http GET
        await getPercentage(values.type);

        //http POST
        const id = uuid.v4();
        const { date, hours_amount } = values;
        const data = { id,date,hours_amount,
                      user_id,job_id,special_record_type_id};

        const response = await fetch("http://localhost:5000/special_records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        console.log(response);
      } catch (err: any) {
        console.error(err.message);
      }

      toggleDialog();
    }

    const toggleDialog = () => {

      setOpen((prevState) => !prevState);  
    }

    return(
        <>
            <Button
              size="large"
              aria-label="add_extra_button"
              variant="text"
              color="secondary"
              onClick={toggleDialog}>
                special Record!
            </Button>

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
                            margin="normal"
                            type="date"  
                            label="date"                   
                            variant="standard"
                            required
                            color="secondary"
                            InputLabelProps={{
                            shrink: true
                            }}
                            value={props.values.date}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="date" />}
                          />
                          <br />
                          <Field as={TextField} name="hours_amount"
                            margin="normal"   
                            label="hours_amount"               
                            variant="standard"
                            required
                            color="secondary"
                            value={props.values.hours_amount}
                            onChange={props.handleChange}
                            helperText={<ErrorMessage name="hours_amount" />}
                          />
                          <br />
                          <Field 
                            name="type"
                            type="select" 
                            as={Select}
                            helpertext={<ErrorMessage name="type" />}>
                            {optionList.map((option) => {

                                return(
                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                )   
                            })}
                          </Field>
                          <br />
                          <br />
                          <Button type="submit"
                            color="secondary"
                            variant="contained">
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