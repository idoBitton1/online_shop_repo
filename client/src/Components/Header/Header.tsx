import React, { useState } from "react"
import "./Header.css"

//Components
import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";
import { Profile } from "./Profile";

//Material Ui
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from "@mui/icons-material/Menu"

interface MyProps{

  changeUserId: (id: string) => void
}

export const Header: React.FC<MyProps> = ({changeUserId}) => {

    const [connected, setConnected] = useState<boolean>(false)

    const toggleConnected = (): void => {

        setConnected((prevState) => !prevState);
    }

    const date = new Date();

    const today = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return(
        <header className="app_header">
            <IconButton
             sx={{color: "black"}}>
                <Menu sx={{fontSize: 40}} />
            </IconButton>
                
            <Typography
              variant="h6"
              marginLeft={connected ? 0 : 15}
              color={"black"}>
                {today}
            </Typography>

            {connected ? 
            <Profile 
              connected={connected}
              toggleConnected={toggleConnected}
              changeUserId={changeUserId}
            />
            :
            <div>
              <SignIn
                toggleConnected={toggleConnected}
                changeUserId={changeUserId}
              />

              <SignUp
                toggleConnected={toggleConnected}
                changeUserId={changeUserId}
              />
            </div>
            }
        </header>
    )
}