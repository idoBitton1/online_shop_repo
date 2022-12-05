import React from 'react'
import './Register.css';

//components
import { Header } from '../Components/Header/Header';
import { RegisterForm } from '../Components/Forms/RegisterForm';

const Register = () => {

    return(
        <div className="register_container">
            <Header />

            <div className="register_form">
                <RegisterForm />
            </div>
        </div>
    );
}

export default Register;
