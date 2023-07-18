import React from 'react';
import { Navigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import AuthService from '../services/auth.service';
import NameInputForm from './NameInputForm';

const UserProfileCheck = () => {
  const currentUser = AuthService.getCurrentUser();

  if (!currentUser) {
    // Redirect the user to the login page if not authenticated
    return <Navigate to="/login" />;
  }

  if (!currentUser.name) {
    // Render the user name input form
    const handleNameSubmit = (name) => {
      // Update the current user object with the provided name
      currentUser.name = name;
    };

    return (
      <div>
        <h1>User Profile</h1>
        <h2>Please provide your name:</h2>
        <NameInputForm onSubmit={handleNameSubmit} />
      </div>
    );
  }

  return (
    <div>
      <h1>User Profile</h1>
      <UserInfo currentUser={currentUser} />
    </div>
  );
};

export default UserProfileCheck;
