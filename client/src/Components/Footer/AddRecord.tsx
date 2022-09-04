import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import * as uuid from "uuid"
import { Record } from "../../App"

//Material Ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

interface MyProps{

  user_id: string,
  job_id: string,
  changeRecords: (record: Record) => void
}

interface MyFormValues{

  start_date: string,
  start_time: string,
  end_date: string,
  end_time: string,
  daily_break: number
}

export const AddRecord: React.FC<MyProps> = ({user_id, job_id}) => {

    const [open, SetOpen] = useState<boolean>(false);
    var errmsg: string;

    const initialValues: MyFormValues = {
      start_date: "",
      start_time: "",
      end_date: "",
      end_time: "",
      daily_break: 30
    }

    const validationSchema: any = Yup.object().shape({
      start_date: Yup.string().required("Required"),
      start_time: Yup.string().required("Required"),
      end_date: Yup.string().required("Required"),
      end_time: Yup.string().required("Required"),
      daily_break: Yup.number().min(0, "can't be negative")
      .required("Required")
    })

    //Add to database with http POST
    const onSubmit = async(values: MyFormValues) => {

      const start_datetime: Date = new Date(`${values.start_date} ${values.start_time}`);
      const end_datetime: Date = new Date(`${values.end_date} ${values.end_time}`);

      if(end_datetime.getTime() < start_datetime.getTime())
      {
        errmsg = "end date can't be before the start date";
        return;
      }

      //http POST
      try {
        const id = uuid.v4();
        const { daily_break } = values;
        const start_time = `${values.start_date} ${values.start_time}`;
        const end_time = `${values.end_date} ${values.end_time}`;
        const data = { id, start_time, end_time,
                      daily_break, user_id, job_id };
        
        const response = await fetch("http://localhost:5000/records", {
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

    //toggle the dialog
    const toggleDialog = () => {

      SetOpen((prevState) => !prevState); 
    }

    return(
        <>
            <Button
              size="large"
              aria-label="add_record_button"
              variant="text"
              sx={{color: "black"}}
              onClick={toggleDialog}>
                Add Record!
            </Button>

            <Dialog open={open} onClose={toggleDialog}>
                <DialogTitle>
                  <Typography 
                   fontSize={20}
                   fontWeight={"bold"}>
                    record
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
                      <Field as={TextField} name="start_date"
                        margin="normal"
                        type="date"  
                        label="date"                   
                        variant="standard"
                        required
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={props.values.start_date}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="start_date" />}
                      />
                      <Field as={TextField} name="start_time"
                        sx={{marginLeft: 3}}
                        margin="normal"
                        type="time"    
                        label="start time"                 
                        variant="standard"
                        required
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={props.values.start_time}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="start_time" />}
                      />
                      <br />
                      <Field as={TextField} name="end_date"
                        margin="normal"
                        type="date"  
                        label="date"                   
                        variant="standard"
                        required
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={props.values.end_date}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="end_date" />}
                      />
                      <Field as={TextField} name="end_time"
                        sx={{marginLeft: 3}}
                        margin="normal"
                        type="time"   
                        label="end time"                 
                        variant="standard"
                        required
                        color="secondary"
                        InputLabelProps={{
                          shrink: true
                        }}
                        value={props.values.end_time}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="end_time" />}
                      />
                      <br />
                      <Field as={TextField} name="daily_break"
                        sx={{marginLeft: 5}}
                        margin="normal"   
                        label="daily break (minutes)"               
                        variant="standard"
                        required
                        color="secondary"
                        value={props.values.daily_break}
                        onChange={props.handleChange}
                        helperText={<ErrorMessage name="daily_break" />}
                      />
                      <br />
                      <br />
                      <Button type="submit"
                        sx={{marginLeft: "34%", color: "black"}}
                        color="primary"
                        variant="outlined">
                          submit
                      </Button>
                      <Typography
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
    );
}