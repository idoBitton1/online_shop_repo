import React from "react"
import { MyProps } from "./SignUp"

//Material Ui
import PersonRounded from "@mui/icons-material/PersonRounded"
import IconButton from "@mui/material/IconButton"

export const Profile: React.FC<MyProps> = ({connected, toggleConnected}) => {

    return(
        <>
            {/* onClick={toggleDialog} add later */}
            <IconButton
              sx={{color: "white"}}>
              <PersonRounded sx={{fontSize: 30}} />
            </IconButton>
        </>
    )
}