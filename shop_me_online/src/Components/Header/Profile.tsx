import React, { useState } from "react";

//components
import { DropdownItem } from "./DropdownItem";

//material ui icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

        <div className={`dropdown-menu ${open? 'active' : 'inactive'}`} >
          <ul>
            <DropdownItem />
            <DropdownItem />
            <DropdownItem />
            <DropdownItem />
            <DropdownItem />
          </ul>
        </div>
        </>
    )
}