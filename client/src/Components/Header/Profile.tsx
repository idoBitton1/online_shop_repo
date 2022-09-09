import React, { useContext } from "react"

//Context
import { userIdContext, connectContext } from "../../Helper/Context"

//Material Ui
import PersonRounded from "@mui/icons-material/PersonRounded"
import IconButton from "@mui/material/IconButton"

interface MyProps{
  
}

export const Profile: React.FC<MyProps> = ({}) => {

    const {setUserId} = useContext(userIdContext);
    const {is_connected, setConnected} = useContext(connectContext);

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