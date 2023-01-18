import React from "react";
import { useNavigate } from "react-router-dom";

//icons
import { CiLogin } from 'react-icons/ci';
import { FiUserPlus } from 'react-icons/fi';

export const DisconnectedUserDD = () => {

    const navigate = useNavigate();

    return (
        <>
            <li className='dropdown_item' onClick={() => navigate('/register')}>
                <FiUserPlus className="dropdown_item_icon" />
                <h3 style={{ fontWeight: "bold" }}>Register</h3>
            </li>
            <li className='dropdown_item' onClick={() => navigate('/registerManager')}>
                <FiUserPlus className="dropdown_item_icon" />
                <h3>Become a manager</h3>
            </li>
            <li className='dropdown_item' onClick={() => navigate('/login')}>
                <CiLogin className="dropdown_item_icon" />
                <h3>Log in</h3>
            </li>
        </>
    )
}