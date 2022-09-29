import React, { useState, useEffect, useContext } from "react"
import "./Header.css"

//Apollo and Graphql
import { useQuery, useLazyQuery, useMutation } from "@apollo/client"
import {QUERY_USER_BY_ID,
        QUERY_JOB_BY_ID_FULL,
        QUERY_ALL_JOBS_NAMES,
        QUERY_GET_JOB_BY_NAME_FULL } from "../../Queries/Queries";
import {MUTATION_UPDATE_SALARY,
        MUTATION_UPDATE_JOB_TYPE,
        MUTATION_UPDATE_JOB_NAME } from "../../Queries/Mutations";

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
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputAdornment from "@mui/material/InputAdornment";
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import BadgeIcon from '@mui/icons-material/Badge';

interface MyProps{
  
}

interface Job{
    
    name: string,
    type: string,
    salary_per_hour: number
}

export const Profile: React.FC<MyProps> = ({}) => {

    //contexts
    const {user_id, setUserId} = useContext(userIdContext);
    const {setConnected} = useContext(connectContext);
    const {job_id, setJobId} = useContext(jobContext);

    //toggle the dialog
    const [open, setOpen] = useState<boolean>(false);
    //display the username
    const [username, setUsername] = useState<string>("");
    //saving the last saved salary 
    const [salary_per_hour, setSalaryPerHour] = useState<number>(0);
    //saving the current job name
    const [job_name, setJobName] = useState<string>("");
    //current job's info
    const [job_info, setjobInfo] = useState<Job>({name: "", type: "", salary_per_hour: 0});

    //all the jobs names
    const [all_jobs, setAllJobs] = useState<string[]>([]);
    //all types of jobs
    const [all_types, setAllTypes] = useState<string[]>(["sales", "kitchen", "high tech", "teacher"]);

    //get all the names
    const [getAllJobNames, {data: jobs_names}] = useLazyQuery(QUERY_ALL_JOBS_NAMES);
    useEffect(() => {
        getAllJobNames();
    }, [])
    useEffect(() => {
        if(jobs_names){
            setAllJobs(jobs_names.getAllJobs.map((job:any) => job.name)); 
        }
            
    }, [jobs_names])
    //

    //update salary mutation
    const [updateSalary] = useMutation(MUTATION_UPDATE_SALARY);
    //update job type mutation
    const [updateType] = useMutation(MUTATION_UPDATE_JOB_TYPE);
    //update job name mutation
    const [updateName] = useMutation(MUTATION_UPDATE_JOB_NAME);

    //get the job info when changing job
    const [getJobDataByName, {data: job_data}] = useLazyQuery(QUERY_GET_JOB_BY_NAME_FULL, {
        onCompleted: (data) => {//assign the new data of the corrent job
            setJobId(data.getJobByName.id);
            setjobInfo({//info
                name: data.getJobByName.name,
                type: data.getJobByName.type,
                salary_per_hour: data.getJobByName.salary_per_hour
            });
            setJobName(data.getJobByName.name);
            setSalaryPerHour(data.getJobByName.salary_per_hour);
        }
    });

    //get the username 
    const { data: user_data } = useQuery(QUERY_USER_BY_ID, {
        variables: {
          id: user_id
        }
    });
    useEffect(() => {
        if(user_data && user_id)
            setUsername(user_data.getUserById.username);
    }, [user_data])
    //

    //get the salary per hour
    const [getJobDataById, {data: job_data_id}] = useLazyQuery(QUERY_JOB_BY_ID_FULL, {
        variables: {
            id: job_id
        }
    });
    useEffect(() => {// fetching the data about the current job once
        getJobDataById();
    }, [])
    useEffect(() => {// updates the job_info variable
        if(job_data_id){
            //set the job data
            setjobInfo({
                name: job_data_id.getJobById.name,
                type: job_data_id.getJobById.type,
                salary_per_hour: job_data_id.getJobById.salary_per_hour
            });
            setJobName(job_data_id.getJobById.name);
            //set the salary per hour variable to the most recent value in the data base
            setSalaryPerHour(job_data_id.getJobById.salary_per_hour);
        }
    }, [job_data_id])
    //

    //update the salary per hour in the data base
    const changeSalaryPerHour = () => {

        try {
            updateSalary({
                variables: {
                    id: job_id,
                    salaryPerHour: job_info.salary_per_hour
                }
            });
            //update the value when the user is changing the value in data base
            setSalaryPerHour(job_info.salary_per_hour);
        } catch (err: any) {
            console.error(err.message);
        }
    }

    //update the job type
    const changeJobName = () => {

        try {
            updateName({
                variables: {
                    id: job_id,
                    name: job_name
                }
            })
        } catch (err: any) {
            console.error(err.message);
        }

        var index_of_current_record = all_jobs.findIndex((job) => job == job_info.name);
        const temp = [...all_jobs];
        temp[index_of_current_record] = job_name;
        setAllJobs([...temp]);
    }

    const handleChange = (event: SelectChangeEvent) => {

        setjobInfo((prevInfo) => ({name: event.target.value as string, type: prevInfo.type, salary_per_hour: prevInfo.salary_per_hour}));
        getJobDataByName({
            variables: {
                name: event.target.value as string
            }
        })//assigns the fetched data in the onComplete method above
    };

    const handleTypeChange = (event: SelectChangeEvent) => {

        setjobInfo((prevInfo) => ({name: prevInfo.name, type: event.target.value as string, salary_per_hour: prevInfo.salary_per_hour}));
        updateType({
            variables: {
                id: job_id,
                type: event.target.value as string
            }
        })
    }

    const disconnectUser = () => {

        setUserId("");
        setConnected(false);

        toggleDialog();
    }

    //toggle the dialog
    const toggleDialog = () => {

        //set the value of the salary to the most recent value from the base 
        setjobInfo((prevInfo) => ({name: prevInfo.name, type: prevInfo.type, salary_per_hour: salary_per_hour}));

        setOpen((prevState) => !prevState);    
    }

    return(
        <>
            <IconButton
              sx={{color: "white"}}
              onClick={toggleDialog}>
              <PersonRounded sx={{fontSize: 30}} />
            </IconButton>

            <Dialog open={open} onClose={toggleDialog}>
                <DialogTitle>
                  <Typography 
                    fontSize={25}
                    fontWeight={"bold"}>
                      {`Welcome ${username}`}
                  </Typography>
                  <Typography fontSize={15}>
                    {`currently connected to ${job_info.name}`}
                  </Typography>
                </DialogTitle>

            <DialogContent>
                <div className="row_field">
                    <TextField name="salary_field"
                        variant="outlined"
                        type="number"
                        label="your salary per hour"
                        value={job_info ? job_info.salary_per_hour : 0}
                        InputProps={{
                            inputProps: {min: 0}, style: {textAlign: 'center'},
                            startAdornment: (
                                <InputAdornment position="start">
                                  <AttachMoneyOutlinedIcon />
                                </InputAdornment>
                            )
                        }}
                         onChange={(e) => {
                            setjobInfo((prevInfo) => ({name: prevInfo.name, type: prevInfo.type, salary_per_hour: Number(e.target.value)}))
                        }}
                    />
                    <Button color="success"
                        sx={{marginLeft: 1}}
                        onClick={changeSalaryPerHour}>
                        change
                    </Button>
                </div>

                <div className="row_field">
                    <TextField name="job_name_field"
                        variant="outlined"
                        value={job_name}
                        label="job name"
                        InputProps={{
                            inputProps: {min: 0}, style: { textAlign: 'center'},
                            startAdornment: (
                                <InputAdornment position="start">
                                  <BadgeIcon />
                                </InputAdornment>
                              )
                        }}
                            onChange={(e) => {
                                setJobName(e.target.value);
                        }}
                    />
                    <Button color="success"
                        sx={{marginLeft: 1}}
                        onClick={changeJobName}>
                            change
                    </Button>
                </div>

                <div className="row_field">
                    <Box sx={{ minWidth: 150 }}>
                    <FormControl>
                        <InputLabel id="current_job">Current job</InputLabel>
                        <Select
                        labelId="current_job"
                        id="current_job_select"
                        value={job_info.name}
                        label="Current job"
                        onChange={handleChange}
                        >
                        {all_jobs.map((job, index) => {
                            return(
                                <MenuItem key={index} value={job}>{job}</MenuItem>
                            )   
                        })}
                        </Select>
                    </FormControl>
                    </Box>

                    <Box sx={{ minWidth: 150 }}>
                    <FormControl>
                        <InputLabel id="job_type">Job type</InputLabel>
                        <Select
                        labelId="job_type"
                        id="job_type_select"
                        value={job_info.type}
                        label="Job type"
                        onChange={handleTypeChange}
                        >
                        {all_types.map((type, index) => {
                            return(
                                <MenuItem key={index} value={type}>{type}</MenuItem>
                            )   
                        })}
                        </Select>
                    </FormControl>
                    </Box>
                </div>

                <Button color="error"
                sx={{marginTop: 3}}
                onClick={disconnectUser}
                >
                    Disconnect
                </Button>
            </DialogContent>
            </Dialog>
        </>
    )
}