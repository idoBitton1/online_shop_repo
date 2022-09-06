import Button from "@mui/material/Button"
import Tooltip from "@mui/material/Tooltip"
import React from "react"

interface MyProps{
    is_disabled: boolean,
    onClick: () => void,
    text: string
}

export const AddButton: React.FC<MyProps> = ({is_disabled, onClick, text}) => {


    return(
        <Tooltip title={!is_disabled ? "" : "sign up or sign in to preform this action"}>
            <span>
              <Button
                size="large"
                variant="text"
                disabled={is_disabled}
                sx={{color: "black"}}
                onClick={onClick}>
                  {text}
              </Button>
            </span>
        </Tooltip>
    )
}