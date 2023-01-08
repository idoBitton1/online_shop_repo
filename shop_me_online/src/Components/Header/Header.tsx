import React from "react";
import "./Header.css"
import { useNavigate } from "react-router-dom";

//components
import { DropDown } from "./DropDown";

export const Header = () => {

    const navigate = useNavigate();

    return (
        <header className="header_container">
            <p className="site_name" onClick={() => navigate('/')}>
                shop me online
            </p>
            <DropDown />
        </header>
    )
}