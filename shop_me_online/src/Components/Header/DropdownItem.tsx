import React from "react"

import img from "../../Images/j1.png"

export const DropdownItem = () => {

    return(
        <li className = 'dropdownItem'>
            <img src={img} alt="text"></img>
            <a> text </a>
        </li>
    )
}