import React from "react";
import { useNavigate } from "react-router-dom";

//redux
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionsCreators } from '../../state';

//icons
import { BsCart2 } from 'react-icons/bs';
import { AiOutlineHeart, AiOutlineUser } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci';

interface MyProps {
    toggleDropDown: () => void
}

export const ConnectedUserDD: React.FC<MyProps> = ({toggleDropDown}) => {

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { logout } = bindActionCreators(actionsCreators, dispatch);

    return (
        <>
            <li className="dropdown_item">
                <AiOutlineUser className="dropdown_item_icon" />
                <h3>profile</h3>
            </li>
            <li className="dropdown_item">
                <BsCart2 className="dropdown_item_icon" />
                <h3>cart</h3>
            </li>
            <li className="dropdown_item">
                <AiOutlineHeart className="dropdown_item_icon" />
                <h3>wishlist</h3>
            </li>
            <li className='dropdown_item'>
                <CiLogout className="dropdown_item_icon" />
                <h3 onClick={() => {
                    logout(); //disconnect the user
                    toggleDropDown();
                }}>
                    log out
                </h3>
            </li>
        </>
    )
}