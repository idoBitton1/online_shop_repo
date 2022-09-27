import React from "react"

//Material Ui
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

interface MyProps{
    is_disabled: boolean,
    text: string,
    text_when_active: string,
    onClick: () => void
}

export const AddButton: React.FC<MyProps> = ({is_disabled, text_when_active, text, onClick}) => {


    return(
        <Tooltip title={!is_disabled ? text_when_active : "sign up or sign in to preform this action"}>
            <span>
              <IconButton
                disabled={is_disabled}
                sx={{color: "white", marginBottom: 0.4, marginLeft: -1}}
                onClick={onClick}>
                  <AddCircleOutlineOutlinedIcon />
              </IconButton>
            </span>
        </Tooltip>
    )
}