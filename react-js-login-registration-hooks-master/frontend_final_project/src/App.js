import React, { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./background-image.css";
import UserProfileCheck from "./components/UserProfileCheck";
import UserInfo from "./components/UserInfo";
import AuthService from "./services/auth.service";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Standort from "./components/Standort";
import Tarif from "./components/Tarif";
import UeberLendMove from "./components/UeberLendMove";
import Buchung from "./components/Buchung";
import Fahrzeuge from "./components/Fahrzeuge";
import BoardAdmin from './components/BoardAdmin';
import BoardModerator from './components/BoardModerator';
import BoardUser from './components/BoardUser';
import Abrechnung from "./components/Abrechnung";
import EventBus from "./common/EventBus";
import TermsAndPolicy from "./components/TermsAndPolicy";
import CreateCar from "./components/CreateCar";


const App = () => {
  //const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      //setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    //setShowModeratorBoard(false);
    // setShowAdminBoard(false);
    setCurrentUser(undefined);
  };

  return (
    <div className="App-backgroundlayout">
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <li className="nav-item6">
          <Link to={"/"} className="navbar-brand">
            Home
          </Link>
        </li>
   

        <div className="navbar-nav mr-auto">
          <li className="nav-item1">
            <Link to={"/UeberLendMove"} className="nav-link">
              Über LendMove
            </Link>
          </li>

          <li className="nav-item2">
            <Link to={"/Fahrzeuge"} className="nav-link">
              Fahrzeuge
            </Link>
          </li>

          <li className="nav-item3">
            <Link to={"/tarif"} className="nav-link">
              Tarif
            </Link>
          </li>

          <li className="nav-item4">
            <Link to={"/standort"} className="nav-link">
              Standort
            </Link>
          </li>

          <li className="nav-item5">
            <Link to={"/termsandpolicy"} className="nav-link">
              Terms and policy
            </Link>
          </li>
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.username}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div>
        <Routes>
          <Route exact path={"/"} element={<Home />} />
          <Route exact path={"/standort"} element={<Standort />} />
          <Route exact path={"/termsandpolicy"} element={<TermsAndPolicy />} />
          <Route exact path={"/tarif"} element={<Tarif />} />
          <Route exact path="/Fahrzeuge" element={<Fahrzeuge />} />
          <Route exact path={"/UeberLendMove"} element={<UeberLendMove />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route path="/BoardUser" element={<BoardUser/>} />
          <Route path="/BoardModerator" element={<BoardModerator/>} />
          <Route path="/BoardAdmin" element={<BoardAdmin/>} />
          <Route exact path={"/userprofilecheck"} element={<UserProfileCheck />} />
          <Route exact path={"/user-info"} element={<UserInfo />} />
          <Route exact path="/buchung" element={<Buchung />} />
          <Route exact path="/abrechnung" element={<Abrechnung />} />
          <Route exact path="/createCar" element={<CreateCar />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
