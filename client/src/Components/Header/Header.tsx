import React, { useContext } from "react"
import "./Header.css"

//Components
import { SignUp } from "./SignUp";
import { SignIn } from "./SignIn";
import { Profile } from "./Profile";

//Context
import { connectContext } from "../../Helper/Context";

//Material Ui
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Menu from "@mui/icons-material/Menu"

interface MyProps{
 
}

export const Header: React.FC<MyProps> = ({}) => {

    const {is_connected, setConnected} = useContext(connectContext);

    const toggleConnected = (): void => {

      setConnected((prevState) => !prevState);
    }

    const date = new Date();

    //today's date
    const today = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    return(
        <header className="app_header">
            <IconButton
             sx={{color: "white"}}>
              <Menu sx={{fontSize: 40}} />
            </IconButton>
                
            <Typography
              variant="h6"
              marginLeft={is_connected ? 0 : 15}
              color={"white"}>
                {today}
            </Typography>

            {is_connected ? 
            <Profile />
            :
            <div>
              <SignIn 
                toggleConnected={toggleConnected}
              />

              <SignUp 
                toggleConnected={toggleConnected}
              />
            </div>
            }
        </header>
    )
}