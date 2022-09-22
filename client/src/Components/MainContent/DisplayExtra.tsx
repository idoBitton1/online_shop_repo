import React, { useState, useContext } from "react"
import * as Yup from "yup"
import { Formik, Form, Field, ErrorMessage } from "formik"

//Apollo and Graphql
import { useMutation } from "@apollo/client"
import { MUTATION_DELETE_EXTRA_RECORD, MUTATION_UPDATE_EXTRA_RECORD } from "../../Queries/Mutations";

//interface
import { MyFormValues } from "../Footer/AddExtra";

//Context
import { extrasContext } from "../../Helper/Context";

//Material Ui
import { Grid } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

    id: string,
    date: Date,
    bonus: boolean,
    amount: number,
    description?: string
}

export const DisplayExtra: React.FC<MyProps> = ({id, date, bonus, amount, description}) => {

    const {extras, setExtras} = useContext(extrasContext);

    const [open, setOpen] = useState<boolean>(false);

    //mutations
    const [deleteExtra, {error}] = useMutation(MUTATION_DELETE_EXTRA_RECORD);
    const [updateExtra] = useMutation(MUTATION_UPDATE_EXTRA_RECORD); 

    const dltRecord = () => {

        //delete from the display array
        setExtras((prev_extras) => {
            
            var index_of_current_record = -1;

            //find the index of the record in the array
            for(let i = 0; i < prev_extras.length; i++)
                if(prev_extras[i].id === id){
                    index_of_current_record = i;
                    break;
                }
            
            //delete the record
            return [...prev_extras.slice(0,index_of_current_record), ...prev_extras.slice(index_of_current_record + 1)];
        })

        //delete from the db
        deleteExtra({
            variables: {
                id: id
            }
        })
    }

    const initialValues: MyFormValues = {
        date: `${date.getFullYear()}-${(date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`}-${date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`}`,
        bonus: bonus,
        amount: amount,
        description: description
    }

    const validationSchema: any = Yup.object().shape({
        date: Yup.string().required("Required"),
        bonus: Yup.boolean(),
        amount: Yup.number().min(1, "can't be negative or zero").required("Required"),
        description: Yup.string().max(20, "please make a shorter description")
    });

    const onSubmit = (values: MyFormValues) => {
        
        try {
            const { date,bonus,amount,description } = values;
    
            //updates the extra record in the data base
            updateExtra({
              variables: {
                id: id,
                date: date,
                bonus: bonus,
                amount: amount,
                description: description
              }
            });

            //update the records array
            var index_of_current_record = -1;
            const datetime: Date = new Date(date);

            //find the index of the record in the array
            index_of_current_record = extras.findIndex((extra) => extra.id == id);

            //re create the record
            const extra = {
                //__typename: 'Record',
                id: id,
                date: String(datetime.getTime()),
                bonus: bonus,
                amount: amount,
                description: description
            }

            //change him with the old one
            const temp = [...extras];
            temp[index_of_current_record] = extra;
            temp.sort((a, b) => Number(a.date) - Number(b.date));

            //change the array
            setExtras([...temp]);
          }catch (err: any) {
            console.error(err.message)
        }
    
        toggleEditDialog();
    }

    const toggleEditDialog = () => {

        setOpen((prev_state) => !prev_state);
    }

    return(
        <>
        <Grid container sx={{
            backgroundColor: "#A7BBCB",
            fontFamily: "Rubik",
            fontSize: "20px",
            padding: "15px",
            paddingLeft: "2em",
            paddingRight: "2em",
            textAlign: "center",
            color: "white"
            }}>
            {/* date column */}
            <Grid item xs={2}>
                <div className="date_display">
                    {date.getDate()}
                </div>
            </Grid>
            {/* type column */}
            <Grid item xs={3}>
                {bonus ? "bonus" : "waste"}
            </Grid>
            {/* amount column */}
            <Grid item xs={2}>
                {amount}
            </Grid>
            {/* description column */}
            <Grid item xs={4}>
                {description}
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    onClick={toggleEditDialog}>
                    <EditIcon sx={{color: "white"}} />
                </IconButton>
                <IconButton
                    onClick={dltRecord}>
                    <DeleteIcon sx={{color: "white"}} />
                </IconButton>
            </Grid>
        </Grid>




        <Dialog open={open} onClose={toggleEditDialog} sx={{textAlign: "center"}}>
            <DialogTitle>
                <Typography 
                    fontSize={25}
                    fontWeight={"bold"}>
                        Edit extra record
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
                          sx={{color: "black"}}
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
    );
}