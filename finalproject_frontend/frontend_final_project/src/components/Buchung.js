import React, { useEffect, useState, useContext, useRef } from "react";
import "./Buchung.css";
import moment from "moment";
import { useHistory } from "react-router-dom";
import ReservationContext from "../common/ReservationContext";
import { useLocation, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { reservation } from "../services/AdminAccessService";

const Buchung = () => {
  const [reservationDateStart, setreservationDateStart] = useState("");
  const [reservationTimeStart, setreservationTimeStart] = useState("");
  const [reservationDateEnd, setreservationDateEnd] = useState("");
  const [reservationTimeEnd, setreservationTimeEnd] = useState("");
  const [firstSelectionMade, setFirstSelectionMade] = useState(false);
  const [city, setCity] = useState("");
  const [actualStation, setActualStation] = useState("");
  const [image, setImage] = useState("");

  const currentDateTime = moment();

  const queryParams = new URLSearchParams(window.location.search);
  // Access the chosen card's information from URL parameters
  const category = queryParams.get("category");
  const name = queryParams.get("name");
  const id = queryParams.get("id");
  const carId = id;

  useEffect(() => {
   // const queryParams = new URLSearchParams(window.location.search);
    const cityQueryParam = queryParams.get("city");
    const actualStationQueryParam = queryParams.get("actualStation");
    const imageQueryParam = queryParams.get("image");
    setCity(cityQueryParam);
    setActualStation(actualStationQueryParam);
    setImage(imageQueryParam);
  }, []);

  const navigate = useNavigate();
  const reservationContext = useContext(ReservationContext);
  const isLoggedIn = reservationContext ? reservationContext.isLoggedIn : false;
  
  const stationStart = city + "-" + actualStation;
  const stationEnd = city + "-" + actualStation;

  const isButtonDisabled =
    !city ||
    !reservationDateStart ||
    !reservationTimeStart ||
    (firstSelectionMade && (!reservationDateEnd || !reservationTimeEnd)) ||
    (!firstSelectionMade && (reservationDateEnd || reservationTimeEnd));
   
    
  const handleReservationButtonClick = async () =>{
    const currentUser = AuthService.getCurrentUser();

    if ( isLoggedIn ||(currentUser && currentUser.roles.includes("ROLE_USER"))) 
    {
      console.log(localStorage.getItem("user").token);

      const tarif =  currentUser.tarif;

      const selectedCardDetails = {
        /*  image, */ /* need to add image  */ 
        reservationDateStart: reservationDateStart,
        reservationDateEnd: reservationDateEnd,
        reservationTimeStart: reservationTimeStart,
        reservationTimeEnd: reservationTimeEnd,
        //from car
        carId: carId,
      stationStart: stationStart,
      stationEnd: stationEnd,
      tarif: tarif, // from userdata
      image : image,
      };

      const selectedDetailsForUser = {
      //for car from DB
        id: id,
        name: name,
        category: category,
        image: image,
     
        // Add any additional item details as needed
        reservationDateStart: reservationDateStart,
        reservationTimeStart: reservationTimeStart,
        reservationDateEnd: reservationDateEnd,
        reservationTimeEnd: reservationTimeEnd,
        location: city,
        actualStation: actualStation,
        tarif : tarif,
        carId : carId,
       
      };
      const token = currentUser.token;
       await reservation(selectedCardDetails , token)
      .then((response) => {
        toast(' reservation success .', { autoClose: 2000 });

        console.log("sucess registration", response.price)
       
       navigate("/BoardUser", { state: selectedDetailsForUser });
       
      })
      .catch((error) => {
        console.log("reserving error")
        console.log("Reservation error:", error);
      });

     

    } else {
      toast('You must log in as user before reserving.', { autoClose: 2000 });
    } 
   
  };

  const availableDays = [];
  const availableHours = [];

  for (let i = 0; i < 7; i++) {
    const currentDay = moment(currentDateTime)
      .add(i, "days")
      .format("YYYY-MM-DD");
    availableDays.push(currentDay);
  }

  for (let i = 0; i < 24; i++) {
    const currentHour = moment()
      .startOf("hour")
      .add(i, "hours")
      .format("HH:mm");
    availableHours.push(currentHour);
  }

  return (
    <div className="reservation-wrapper">
      <div className="Buchung">
        <div className="row">
          <div>
            <label htmlFor="city">City:</label>
            <input type="text" id="city" value={city} disabled />
            <label htmlFor="actualstation">Actual Station:</label>
            <input
              type="text"
              id="actualstation"
              value={actualStation}
              disabled
            />
          </div>
        </div>
        <div className="row">
          <select
            value={reservationDateStart}
            onChange={(e) => {
              setreservationDateStart(e.target.value);
              setFirstSelectionMade(true);
            }}
          >
            <option value="">Select a start day</option>
            {availableDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <select
            value={reservationTimeStart}
            onChange={(e) => setreservationTimeStart(e.target.value)}
          >
            <option value="">Select a start hour</option>
            {availableHours.map((hour) => (
              <option key={hour} value={hour}>
                {hour}
              </option>
            ))}
          </select>
        </div>
        <div className="row">
          <div>
            <h2>Selected Card Details:</h2>
            <img src={image} alt={name} />
            <h3>Name: {name}</h3>
            <h3>Category: {category}</h3>
            <h3>id: {id}</h3>

            <button
              onClick={handleReservationButtonClick}
              disabled={isButtonDisabled}
            >
              make reservation
            </button>
          </div>
        </div>
        <div className="row">
          {firstSelectionMade && (
            <div>
              <select
                value={reservationDateEnd}
                onChange={(e) => {
                  const selectedDateEnd = e.target.value;
                  // Check if the selected date end is valid
                  if (selectedDateEnd >= reservationDateStart) {
                    setreservationDateEnd(selectedDateEnd);
                  }
                }}
              >
                <option value="">Select an end day</option>
                {availableDays
                  .filter((day) => day >= reservationDateStart) // Filter out days before reservationDateStart
                  .map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
              </select>

              <select
                value={reservationTimeEnd}
                onChange={(e) => setreservationTimeEnd(e.target.value)}
              >
                <option value="">Select end hour</option>
                {availableHours
                  .filter((hour) => {
                    if (reservationDateEnd === reservationDateStart) {
                      // If the start and end dates are the same, filter out hours before reservationTimeStart + 1
                      return (
                        parseInt(hour) >= parseInt(reservationTimeStart) + 1
                      );
                    } else {
                      // For other cases, no filtering is required
                      return true;
                    }
                  })
                  .map((hour) => (
                    <option key={hour} value={hour}>
                      {hour}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>
        <div className="row"></div>

        <div className="row">Row 5 Content</div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Buchung;
