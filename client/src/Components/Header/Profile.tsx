import React, { useContext } from "react"

//Context
import { userIdContext } from "../../Helper/Context"

//Material Ui
import PersonRounded from "@mui/icons-material/PersonRounded"
import IconButton from "@mui/material/IconButton"

interface MyProps{

    connected: boolean,
    toggleConnected: () => void,
}

export const Profile: React.FC<MyProps> = ({connected, toggleConnected}) => {

    const {setUserId} = useContext(userIdContext);

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