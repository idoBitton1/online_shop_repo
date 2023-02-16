import React from "react";
import { useNavigate } from "react-router-dom";

//redux
import { useDispatch, useSelector } from 'react-redux';
import { actionsCreators, ReduxState } from "../../state";
import { bindActionCreators } from 'redux';

//icons
import { BsCart2, BsTruck } from 'react-icons/bs';
import { AiOutlineHeart, AiOutlineUser } from 'react-icons/ai';
import { CiLogout } from 'react-icons/ci';

interface MyProps {
    toggleDropDown: () => void
}

export const ConnectedUserDD: React.FC<MyProps> = ({ toggleDropDown }) => {
    const user = useSelector((redux_state: ReduxState) => redux_state.user);

    const navigate = useNavigate();

    const dispatch = useDispatch();
    const { logout, setCart } = bindActionCreators(actionsCreators, dispatch);

    return (
        <>
            <li className="dropdown_item" onClick={() => navigate('/profile')}>
                <AiOutlineUser className="dropdown_item_icon" />
                <h3>Profile</h3>
            </li>
            {
                user.token?.is_manager
                ?
                <>
                <li className="dropdown_item" onClick={() => navigate('/shipOrders')}>
                    <BsTruck className="dropdown_item_icon" />
                    <h3>Ship orders</h3>
                </li>
                <li className="dropdown_item" onClick={() => navigate('/manageProducts')}>
                    <BsTruck className="dropdown_item_icon" />
                    <h3>Update stock</h3>
                </li>
                </>
                :
                <>
                <li className="dropdown_item" onClick={() => navigate('/cart')}>
                <BsCart2 className="dropdown_item_icon" />
                <h3>Cart</h3>
                </li>
                <li className="dropdown_item" onClick={() => navigate('/wishlist')}>
                    <AiOutlineHeart className="dropdown_item_icon" />
                    <h3>Wishlist</h3>
                </li>
                </>
            }
            <li className='dropdown_item' onClick={() => {
                logout(); //disconnect the user
                setCart([]); //refresh the cart
                navigate('/'); //return to the home page
                toggleDropDown();
                window.location.reload();
            }}>
                <CiLogout className="dropdown_item_icon" />
                <h3>Log out</h3>
            </li>
        </>
    )
}