import React, { useState } from "react"
import "./Header.css"
import { SignUp } from "./SignUp";
import { Profile } from "./Profile";

//Material Ui
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from "@mui/icons-material/Menu"


export const Header = () => {

    const [connected, setConnected] = useState<boolean>(false)

    const toggleConnected = () => {

        setConnected((prevState) => !prevState);
    }

    const date = new Date();

    const today = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return(
        <header className="app_header">
            <IconButton
             sx={{color: "white"}}>
                <Menu sx={{fontSize: 40}} />
            </IconButton>
                
            <Typography
              variant="h6"
              color={"white"}>
                {today}
            </Typography>

            {connected ? 
            <Profile 
              connected={connected}
              toggleConnected={toggleConnected}
            />
            :
            <SignUp
              connected={connected}
              toggleConnected={toggleConnected}
            />
            }
        </header>
    )
}