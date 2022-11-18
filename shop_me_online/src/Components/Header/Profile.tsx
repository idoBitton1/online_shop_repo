import React, { useState } from "react";

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
              <a style={{fontWeight: "bold"}} href="www.google.com"> sign up </a>
            </li>
            <li className = 'dropdown_item'>
              <CiLogin className="dropdown_item_icon"/>
              <a href="www.google.com"> log in </a>
            </li>            
            <li className = 'dropdown_item'>
              <FiUserPlus className="dropdown_item_icon"/>
              <a href="www.google.com"> become a manager </a>
            </li>
            <li className = 'dropdown_item'>
              <CiLogin className="dropdown_item_icon"/>
              <a href="www.google.com"> manager log in </a>
            </li>            
            <li className = 'dropdown_item'>
              <CiLogout className="dropdown_item_icon"/>
              <a href="www.google.com"> log out </a>
            </li>
          </ul>
        </div>
        </>
    )
}