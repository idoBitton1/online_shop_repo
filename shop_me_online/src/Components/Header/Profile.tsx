import React, { useState } from "react";
import { useNavigate } from "react-router-dom"

//icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {AiFillHome} from 'react-icons/ai';
import {CiLogin} from 'react-icons/ci';
import {CiLogout} from 'react-icons/ci';
import {FiUserPlus} from 'react-icons/fi';

export const Profile = () => {

    const [open, setOpen] = useState<boolean>(false);
    const navigate = useNavigate();

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
              <AiFillHome className="dropdown_item_icon"/>
              <h3 onClick={() => navigate('/')}> home </h3>
            </li>
            <li className = 'dropdown_item'>
              <FiUserPlus className="dropdown_item_icon"/>
              <h3 style={{fontWeight: "bold"}} onClick={() => navigate('/register')}> register </h3>
            </li>
            <li className = 'dropdown_item'>
              <FiUserPlus className="dropdown_item_icon"/>
              <h3 onClick={() => navigate('/registerManager')}> become a manager </h3>
            </li> 
            <li className = 'dropdown_item'>
              <CiLogin className="dropdown_item_icon"/>
              <h3 onClick={() => navigate('/login')}> log in </h3>
            </li>                      
            <li className = 'dropdown_item'>
              <CiLogout className="dropdown_item_icon"/>
              <h3> log out </h3>
            </li>
          </ul>
        </div>
        </>
    )
}