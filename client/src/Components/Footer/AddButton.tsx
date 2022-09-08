import React from "react"

//Material Ui
import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"

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
              <Button
                size="large"
                variant="text"
                disabled={is_disabled}
                sx={{color: "white"}}
                onClick={onClick}>
                  {text}
              </Button>
            </span>
        </Tooltip>
    )
}