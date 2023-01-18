import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";

//components
import { ConnectedUserDD } from "./ConnectedUserDD";

//icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AiOutlineHome } from 'react-icons/ai';
import { DisconnectedUserDD } from "./DisconnectedUserDD";

export const DropDown = () => {

  const user = useSelector((redux_state: ReduxState) => redux_state.user);

  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const toggleDropDown = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <button className="button dropdown_btn" onClick={toggleDropDown}>
        <MenuIcon sx={{ fontSize: 40 }} />
        <AccountCircleIcon sx={{ fontSize: 40 }} />
      </button>

      <div className={`dropdown_menu ${open ? 'active' : 'inactive'}`} >
        <ul>
          <li className='dropdown_item' onClick={() => navigate('/')}>
            <AiOutlineHome className="dropdown_item_icon" />
            <h3>Home</h3>
          </li>
          {
            user.token
              ?
              //things that connected users see
              <ConnectedUserDD toggleDropDown={toggleDropDown} />
              :
              //things that unconnected users see
              <DisconnectedUserDD />
          }
        </ul>
      </div>
    </>
  )
}