import React from "react"
import "./Footer.css"
import { AddExtra } from "./AddExtra"
import { AddRecord } from "./AddRecord"
import { Button } from "@mui/material"
import { AddSpecialRecord } from "./AddSpecialRecord"

export const Footer = () => {

    return(
        <footer>
            <AddRecord />
            <AddExtra />
            <AddSpecialRecord />
        </footer>
    )
}