import React from "react";
import "./Header.css"

//components
import { Profile } from "./Profile";


export const Header = () => {

    return(
        <header className="header_container">
            <p className="site_name">shop me online</p>
            <Profile />
        </header>
    )
}