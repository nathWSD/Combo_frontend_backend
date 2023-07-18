import React, { useState } from 'react';
import ReservationContext from './ReservationContext';
import AuthService from "../services/auth.service";
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const ReservationButton = ({ cardInfo }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   
  const handleReserveButtonClick = () => {
    if (isLoggedIn) {
        const currentUser = AuthService.getCurrentUser();
        if (
          currentUser &&
          currentUser.roles &&
          currentUser.roles.includes('ROLE_USER')
        ) {
          // Send the card information to the backend
          axios
            .post(API_URL + 'reserve', {
              cardId: cardInfo.id,
              cardName: cardInfo.name,
            })
            .then(response => {
              // Handle the response from the backend if needed
    
              // Navigate to user board page with card information
              const history = useHistory();
              history.push('/BoardUser', {
                cardId: cardInfo.id,
                cardName: cardInfo.name,
              });
            })
            .catch(error => {
              // Handle the error from the backend if needed
              console.error(error);
            });
        } else {
          // Show alert if user is not authorized
          alert('You are not authorized to access this page.');
        }
      } else {
        // Show login alert
        alert('You must log in before making a reservation.');
      }
  };

  return (
    <ReservationContext.Provider value={{ isLoggedIn }}>
      <button onClick={handleReserveButtonClick}>Reserve</button>
    </ReservationContext.Provider>
  );
};

export default ReservationButton;
