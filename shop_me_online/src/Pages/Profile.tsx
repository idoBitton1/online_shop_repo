import React from "react";
import './Profile.css';

//components
import { Header } from "../Components/Header/Header";
import { ProfileForm } from "../Components/Forms/ProfileForm";

const Profile = () => {
    return (
        <div className="profile_container">
            <Header />

            <h1 className="headline">Profile</h1>

            <div className="profile_context">
                <ProfileForm />
            </div>
        </div>
    );
}

export default Profile;