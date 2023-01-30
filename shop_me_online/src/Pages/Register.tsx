import React from 'react'
import './Register.css';

//components
import { Header } from '../Components/Header/Header';
import { RegisterForm } from '../Components/Forms/RegisterForm';

interface MyProps {
    is_manager: boolean
}

const Register: React.FC<MyProps> = ({ is_manager }) => {
    return (
        <div className="register_container">
            <Header />

            <div className="register_form">
                <h1 className="headline">{is_manager ? "Become a manager" : "Create an account"}</h1>
                <RegisterForm is_manager={is_manager} />
            </div>
        </div>
    );
}

export default Register;
