import React, { useState, useEffect, useContext } from "react"
import "./Header.css"

//Apollo and Graphql
import { useQuery, useMutation } from "@apollo/client"
import { QUERY_USER_BY_ID, QUERY_JOB_BY_ID } from "../../Queries/Queries";
import { MUTATION_UPDATE_SALARY } from "../../Queries/Mutations";

//Context
import { userIdContext, connectContext, jobContext } from "../../Helper/Context"

//Material Ui
import Typography from '@mui/material/Typography';
import TextField from "@mui/material/TextField";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PersonRounded from "@mui/icons-material/PersonRounded"
import IconButton from "@mui/material/IconButton"
import Button from "@mui/material/Button";

interface MyProps{
  
}

interface Job{
    
    name: string,
    type: string,
    salary_per_hour: number
}

export const Profile: React.FC<MyProps> = ({}) => {

    const {user_id, setUserId} = useContext(userIdContext);
    const {setConnected} = useContext(connectContext);
    const {job_id, setJobId} = useContext(jobContext);

    const [open, setOpen] = useState<boolean>(false);
    const [username, setUsername] = useState<string>("");
    const [job_info, setjobInfo] = useState<Job>({name: "", type: "", salary_per_hour: 0});

    const [updateSalary, {data: updateData}] = useMutation(MUTATION_UPDATE_SALARY);

    //get the username 
    const { data: user_data } = useQuery(QUERY_USER_BY_ID, {
        variables: {
          id: user_id
        }
    });
    useEffect(() => {
        if(user_data)
            setUsername(user_data.getUserById.username);
    }, [user_data])

    //get the salary per hour
    const { data: job_data } = useQuery(QUERY_JOB_BY_ID, {
        variables: {
            id: job_id
        }
    });
    useEffect(() => {
        if(job_data)
            setjobInfo({
                name: job_data.getJobById.name,
                type: job_data.getJobById.type,
                salary_per_hour: job_data.getJobById.salary_per_hour
            });
    }, [job_data])

    const changeSalaryPerHour = () => {

        try {

            updateSalary({
                variables: {
                    id: job_id,
                    salaryPerHour: job_info.salary_per_hour
                }
            });
        } catch (err: any) {
            console.error(err.message);
        }
    }

    //toggle the dialog
    const toggleDialog = () => {

        setOpen((prevState) => !prevState);    
    }

    return(
        <>
            <IconButton
              sx={{color: "white"}}
              onClick={toggleDialog}>
              <PersonRounded sx={{fontSize: 30}} />
            </IconButton>

            <Dialog open={open} onClose={toggleDialog} sx={{textAlign: "center"}}>
                <DialogTitle>
                  <Typography 
                    fontSize={25}
                    fontWeight={"bold"}>
                      {`Welcome ${username}`}
                  </Typography>
                </DialogTitle>

                <DialogContent>
                    <div className="profile_field">
                        <h4 className="profile_text">your salary per hour: </h4>
                        <TextField name="salary_field"
                            variant="standard"
                            type="number"
                            value={job_info ? job_info.salary_per_hour : 0}
                            onChange={(e) => setjobInfo((prevInfo) => ({name: prevInfo.name, type: prevInfo.type, salary_per_hour: Number(e.target.value)}))}
                            inputProps={{style: { width: 40, textAlign: 'center' }}}
                        />
                        <Button color="success"
                            sx={{marginLeft: 1}}
                            onClick={changeSalaryPerHour}>
                            change
                        </Button>
                    </div>
                    <p>{job_info ? job_info.name : ""}</p>
                    <p>{job_info ? job_info.type : ""}</p>
                    <p>{job_info ? job_info.salary_per_hour : ""}</p>
                </DialogContent>
            </Dialog>
        </>
    )
}