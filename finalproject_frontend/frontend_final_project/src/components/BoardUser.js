import AuthService from "../services/auth.service";
import { Link } from "react-router-dom";
import "./BoardUser.css";
import { useNavigate } from "react-router-dom";
import Fahrzeuge from "./Fahrzeuge";
import Buchung from "./Buchung";
import { useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  findByUserActivReservation,
  deleteReservation,
} from "../services/AdminAccessService";

const BoardUser = () => {
  const currentUser = AuthService.getCurrentUser();
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /*   const selectedDetailsForUser = {
    id: queryParams.get("id"),
    name: queryParams.get("name"),
    category: queryParams.get("category"),
    image: queryParams.get("image"),
    reservationDateStart: queryParams.get("reservationDateStart"),
    reservationTimeStart: queryParams.get("reservationTimeStart"),
    reservationDateEnd: queryParams.get("reservationDateEnd"),
    reservationTimeEnd: queryParams.get("reservationTimeEnd"),
    location: queryParams.get("location"),
    actualStation: queryParams.get("actualStation"),
  };
 */

  /*  const queryParams = new URLSearchParams(location.search);
  // Access the chosen card's information from URL parameters
  const image = queryParams.get("image");
  const name = queryParams.get("name");
  const category = queryParams.get("category");
  const id = queryParams.get("id"); */

  const handlePayment = async () => {};

  const handleFetchReservations = () => {
    const token = currentUser.token;
    setIsLoading(true);
    setError(null); // Reset the error state before making the API call

    findByUserActivReservation(false, token)
      .then((response) => {
        console.log("this is response", response);
        const receivedReservations = response || []; // Handle the case when response is null or undefined
        setReservations(receivedReservations);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message); // Set the error message in the state
        setIsLoading(false);
      });
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      // Find the reservation with the specified reservationId
      const reservationToDelete = reservations.find(
        (reservation) => reservation.id === reservationId
      );

      if (reservationToDelete) {
        const token = currentUser.token;
        await deleteReservation(reservationToDelete, token);
        // Remove the deleted reservation from the state
        setReservations(
          reservations.filter((reservation) => reservation.id !== reservationId)
        );
      } else {
        console.error("Reservation not found");
      }
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  return (
    <div className="BoardUser">
      <div className="rows">
        <h2>{currentUser.username} Profile</h2>
        <header>
          <h3>
            <strong>personal data</strong>
          </h3>
        </header>
        <img
          className="profilbild"
          src="https://previews.123rf.com/images/sarahdesign/sarahdesign1506/sarahdesign150605280/41564095-my-account-icon.jpg"
          width="300"
          height="300"
        ></img>

        <p>
          <strong>Id:</strong> {currentUser.id}
        </p>

        <p>
          <strong>Email:</strong> {currentUser.email}
        </p>
        <p>
          <strong>Firstname:</strong> {currentUser.firstname}
        </p>
        <p>
          <strong>Surname:</strong> {currentUser.surname}
        </p>
        <p>
          <strong>Tarif:</strong> {currentUser.tarif}
        </p>
        <p>
          <strong>Date of entry:</strong> {currentUser.createdAt}
        </p>
        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>

        <div>
          <Link
            style={{ textDecoration: "none", color: "blue" }}
            to="/user-info"
          >
            change personal data
          </Link>
        </div>
      </div>

      <div className="rows">
        <h2>booked Cars</h2>
    
          <p>Reservations:</p>
          <div>
            {/* Button to fetch reservations */}
            <button onClick={handleFetchReservations}>
              Fetch Reservations
            </button>

            {/* Display reservations */}
            {isLoading && <p>Loading reservations...</p>}
            {!isLoading && error && (
              <p>Error fetching reservations: {error.message}</p>
            )}
            {!isLoading && !error && (
              <div>
                <h2>Reservations:</h2>
                {isLoading && <p>Loading reservations...</p>}
                {error && <p>Error fetching reservations: {error}</p>}
                {!isLoading && !error && (
                  <div>
                    {reservations.length === 0 ? (
                      <p>No reservations have been made.</p>
                    ) : (
                      reservations.map((reservation) => (
                        <div key={reservation.id}>
                          <img src={reservation.image} alt="Car Image" />
                          <p>Car Id: {reservation.carId}</p>
                          <p>
                            Price: {reservation.price} {"\u20AC"}
                          </p>
                          <p>
                            Reservation Date start:{" "}
                            {reservation.reservationDateStart}
                          </p>
                          <p>
                            Reservation Date End:{" "}
                            {reservation.reservationDateEnd}
                          </p>
                          <p>
                            Reservation Time start:{" "}
                            {reservation.reservationTimeStart}
                          </p>
                          <p>
                            Reservation Time End:{" "}
                            {reservation.reservationTimeEnd}
                          </p>
                          <p>
                            Start and End Station: {reservation.stationStart}
                          </p>
                          <button
                            onClick={() =>
                              handleDeleteReservation(reservation.id)
                            }
                          >
                            Delete
                          </button>
                          <Link
                            to={`/abrechnung?reservationId=${reservation.id}&carId=${reservation.carId}&price=${reservation.price}&image=${reservation.image}`}
                          >
                            <button>Payment</button>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
      
      </div>
      <div className="rows">
        <h1>User Dashboard</h1>
        <p>
          <Link to="/fahrzeuge">
            <button>choose a car</button>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default BoardUser;
