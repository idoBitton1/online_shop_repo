import React from "react"
import "./Footer.css"
import { AddExtra } from "./AddExtra"
import { AddRecord } from "./AddRecord"
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