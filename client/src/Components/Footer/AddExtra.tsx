import React, { useState} from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import * as uuid from "uuid"
import { Extra } from "../../App"

//Material Ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";

interface MyProps{

  user_id: string,
  job_id: number,
  changeExtras: (extra: Extra) => void
}

interface MyFormValues{

    date: string,
    bonus: boolean,
    amount: number,
    description?: string
}

export const AddExtra: React.FC<MyProps> = ({user_id, job_id}) => {

    const [open, SetOpen] = useState<boolean>(false);
    
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

      //http POST
      try {
        const id = uuid.v4();
        const { date,bonus,amount,description } = values;
        const data = { id,date,bonus,amount,
                      description,user_id,job_id };

        const response = await fetch("http://localhost:5000/extras", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });

        console.log(response);

        const win: Window = window;
        win.location = "/";
      } catch (err: any) {
        console.error(err.message)
      }

      console.log(values);
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
              aria-label="add_extra_button"
              variant="text"
              color="secondary"
              onClick={toggleDialog}>
                bonus / waste!
            </Button>

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
                        <FormControlLabel
                          control={<Field 
                            name="bonus"
                            margin="normal"
                            as={Checkbox}
                            type="checkbox"
                            color="secondary"
                          />}
                          label="bonus?"
                        />
                        <br />
                        <Field as={TextField} name="amount"
                          margin="normal"   
                          label="amount"               
                          variant="standard"
                          color="secondary"
                          required
                          value={props.values.amount}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="amount" />}
                        />
                        <br />
                        <Field as={TextField} name="description"
                          margin="normal"
                          label="description"
                          variant="standard"
                          color="secondary"
                          fullWidth
                          multiline
                          rows={2}
                          value={props.values.description}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="description" />}
                        />
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