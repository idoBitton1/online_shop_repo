import React, { useState, useContext } from "react"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useMutation } from "@apollo/client"
import { MUTATUIN_CREATE_EXTRA } from "../../Queries/Mutations"
import { Extra } from "../../App"
import { extrasContext } from "../../Helper/Context"

//Material Ui
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";


interface MyProps{

  user_id: string,
  job_id: string,
}

interface MyFormValues{

  date: string,
  bonus: boolean,
  amount: number,
  description?: string
}

export const AddExtra: React.FC<MyProps> = ({user_id, job_id}) => {

    const {setExtras} = useContext(extrasContext);
    const [open, SetOpen] = useState<boolean>(false);

    const [createExtra, {data}] = useMutation(MUTATUIN_CREATE_EXTRA, {
      onCompleted: (data) => {
        const extra: Extra = {
          date: data.createExtra.date,
          bonus: data.createExtra.bonus,
          amount: data.createExtra.amount,
          description: data.createExtra.description          
        };

        setExtras((prev_records) => [...prev_records, extra]);
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

        createExtra({
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
            <Tooltip title={user_id ? "" : "sign up or sign in to preform this action"}>
              <span>
                <Button
                  size="large"
                  aria-label="add_extra_button"
                  variant="text"
                  disabled={user_id ? false : true}
                  sx={{color: "black"}}
                  onClick={toggleDialog}>
                    bonus / waste
                </Button>
              </span>
            </Tooltip>

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
                        <Field as={TextField} name="amount"
                          sx={{marginLeft: 3}}
                          margin="normal"   
                          type="number"
                          label="amount"               
                          variant="standard"
                          color="secondary"
                          required
                          value={props.values.amount}
                          onChange={props.handleChange}
                          helperText={<ErrorMessage name="amount" />}
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
                          sx={{margin: 3}}
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