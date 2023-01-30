import React from "react"
import './LogIn.css';

//components
import { Header } from '../Components/Header/Header';
import { LogInForm } from "../Components/Forms/LogInForm";

const LogIn = () => {
    return (
        <div className="login_container">
            <Header />

            <div className="login_form">
                <h1 className="headline"> Welcome back </h1>
                <LogInForm />
            </div>
        </div>
    );
}

export default LogIn;