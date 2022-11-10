import React from "react";

//material ui icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const Profile = () => {

    return(
        <>
        <button className="button profile_btn">
            <MenuIcon sx={{fontSize: 40}} />
            <AccountCircleIcon sx={{fontSize: 40}} />
        </button>
        </>
    )
}