import React from "react";
import { useNavigate } from "react-router-dom";

//icons
import { CiLogin } from 'react-icons/ci';
import { FiUserPlus } from 'react-icons/fi';

export const DisconnectedUserDD = () => {

    const navigate = useNavigate();

    return (
        <>
            <li className='dropdown_item'>
                <FiUserPlus className="dropdown_item_icon" />
                <h3 style={{ fontWeight: "bold" }} onClick={() => navigate('/register')}> register </h3>
            </li>
            <li className='dropdown_item'>
                <FiUserPlus className="dropdown_item_icon" />
                <h3 onClick={() => navigate('/registerManager')}> become a manager </h3>
            </li>
            <li className='dropdown_item'>
                <CiLogin className="dropdown_item_icon" />
                <h3 onClick={() => navigate('/login')}> log in </h3>
            </li>
        </>
    )
}