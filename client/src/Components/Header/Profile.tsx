import React from "react"

//Material Ui
import PersonRounded from "@mui/icons-material/PersonRounded"
import IconButton from "@mui/material/IconButton"

interface MyProps{

    connected: boolean,
    toggleConnected: () => void,
    changeUserId: (id: string) => void
}

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