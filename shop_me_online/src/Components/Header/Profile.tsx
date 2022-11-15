import React, { useState } from "react";

//components
import { DropdownItem } from "./DropdownItem";

//icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {CiLogin} from 'react-icons/ci';
import {CiLogout} from 'react-icons/ci';
import {FiUserPlus} from 'react-icons/fi';

export const Profile = () => {

    const [open, setOpen] = useState<boolean>(false);

    const handleClick = () => {
        setOpen((prev) => !prev)
    }

    return(
        <>
        <button className="button profile_btn" onClick={handleClick}>
            <MenuIcon sx={{fontSize: 40}} />
            <AccountCircleIcon sx={{fontSize: 40}} />
        </button>

        <div className={`dropdown_menu ${open ? 'active' : 'inactive'}`} >
          <ul>
            <li className = 'dropdown_item'>
              <FiUserPlus className="dropdown_item_icon"/>
              <a style={{fontWeight: "bold"}}> sign up </a>
            </li>
            <li className = 'dropdown_item'>
              <CiLogin className="dropdown_item_icon"/>
              <a> log in </a>
            </li>            
            <li className = 'dropdown_item'>
              <FiUserPlus className="dropdown_item_icon"/>
              <a> become a manager </a>
            </li>
            <li className = 'dropdown_item'>
              <CiLogin className="dropdown_item_icon"/>
              <a> manager log in </a>
            </li>            
            <li className = 'dropdown_item'>
              <CiLogout className="dropdown_item_icon"/>
              <a> log out </a>
            </li>
          </ul>
        </div>
        </>
    )
}