import React from "react";
import './Wishlist.css';

//components
import { Header } from "../Components/Header/Header";

const Wishlist = () => {

    return (
        <div className="wishlist_container">
            <Header />

            <h1 style={{ fontFamily: "Arial" }}> Wishlist </h1>

            <div className="wishlist_context">

            </div>
        </div>
    );
}

export default Wishlist;