import React, { useState } from "react";
import { useNavigate } from "react-router-dom"

//redux
import { useSelector } from 'react-redux';
import { ReduxState } from "../../state";
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionsCreators } from '../../state';

//icons
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AiOutlineUser } from 'react-icons/ai';
import { AiOutlineHome } from 'react-icons/ai';
import { CiLogin } from 'react-icons/ci';
import { CiLogout } from 'react-icons/ci';
import { FiUserPlus } from 'react-icons/fi';

export const Profile = () => {

  const is_connected = useSelector((redux_state: ReduxState) => redux_state.is_connected);

  const dispatch = useDispatch();
  const { disconnect } = bindActionCreators(actionsCreators, dispatch);

  const [open, setOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setOpen((prev) => !prev)
  }

  return (
    <>
      <button className="button profile_btn" onClick={handleClick}>
        <MenuIcon sx={{ fontSize: 40 }} />
        <AccountCircleIcon sx={{ fontSize: 40 }} />
      </button>

      <div className={`dropdown_menu ${open ? 'active' : 'inactive'}`} >
        <ul>
          <li className='dropdown_item'>
            <AiOutlineHome className="dropdown_item_icon" />
            <h3 onClick={() => navigate('/')}> home </h3>
          </li>
          {
            is_connected
              ?
              //things that connected users see
              (
                <>
                  <li className="dropdown_item">
                    <AiOutlineUser className="dropdown_item_icon" />
                    <h3>profile</h3>
                  </li>
                  <li className='dropdown_item'>
                    <CiLogout className="dropdown_item_icon" />
                    <h3 onClick={() => {
                      disconnect(); //disconnect the user
                      navigate('/'); //nvigate back to home
                    }}>
                      log out
                    </h3>
                  </li>
                </>
              )
              :
              //things that unconnected users see
              (
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
        </ul>
      </div>
    </>
  )
}