import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { isEmail } from "validator";
import "./Register.css";
import AuthService from "../services/auth.service";
import { useNavigate } from "react-router-dom";
const required = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">This field is required!</div>
    );
  }
};

const vbirthday = (value) => {
  if (value < 18) {
    return <div className="invalid-feedback d-block">Still to young!</div>;
  }
};

const vcity = (value) => {
  if (value.length < 3) {
    return (
      <div className="invalid-feedback d-block">The city must greater 3.</div>
    );
  }
};

const vpostalCode = (value) => {
  if (value.length < 3) {
    return (
      <div className="invalid-feedback d-block">
        The vpostalCode must greater 3 digits .
      </div>
    );
  }
};

const vstreetNameAndNumber = (value) => {
  if (value.length < 3) {
    return (
      <div className="invalid-feedback d-block">
        The Street and number greeter be greater than 3 .
      </div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">This is not a valid email.</div>
    );
  }
};

const vusername = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The username must be between 3 and 20 characters.
      </div>
    );
  }
};

const vfirstname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The firstname must be between 3 and 20 characters.
      </div>
    );
  }
};

const vsurname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The lastname must be between 3 and 20 characters.
      </div>
    );
  }
};

const vcountry = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The country must be between 3 and 20 characters.
      </div>
    );
  }
};



const vpassword = (value) => {
  if (value.length < 6 || value.length > 40) {
    return (
      <div className="invalid-feedback d-block">
        The password must be between 6 and 40 characters.
      </div>
    );
  }
};

const vcheckpassword = (value) => {
  const passwordValidation = vpassword(value); // Invoke vpassword function to get the validation result
  if (passwordValidation) {
    return (
      <div className="invalid-feedback d-block">The password must be same.</div>
    );
  }
};


const Register = (props) => {
  const form = useRef();
  const checkBtn = useRef();

  const [username, setUsername] = useState("");
  const [firstname, setfirstname] = useState("");
  const [surname, setsurname] = useState("");
  const [birthday, setbirthday] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checkpassword, setcheckPassword] = useState("");
  const [city, setcity] = useState("");
  const [postalCode, setpostalCode] = useState("");
  const [country, setcountry] = useState("");
  const [streetNameAndNumber, setstreetNameAndNumber] = useState("");
  const [phonenumber, setphonenumber] = useState("");
  const [tarif, settarif] = useState(""); // State to store the selected option

  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleTarifChange = (event) => {
    const tarif = event.target.value;
    console.log("Tarif:", tarif); // Log the value of tarif
    settarif(tarif);
  };

  const onChangeUsername = (e) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangecheckPassword = (e) => {
    const checkpassword = e.target.value;
    setcheckPassword(checkpassword);
  };

  const onChangefirstname = (e) => {
    const firstname = e.target.value;
    setfirstname(firstname);
  };

  const onChangesurname = (e) => {
    const surname = e.target.value;
    setsurname(surname);
  };

  const onChangecountry = (e) => {
    const country = e.target.value;
    setcountry(country);
  };

  const onChangephonenumber = (e) => {
    const phonenumber = e.target.value;
    console.log("Phone Number:", phonenumber); // Log the value of phonenumber
    const isValidPhoneNumber = /^\d{10}$/g.test(phonenumber);

    // If the input is valid, update the phone number state
    if (isValidPhoneNumber) {
      setphonenumber(phonenumber);
    }
  };

  const onChangebirthday = (e) => {
    const selectedDate = new Date(e.target.value);
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");

    const birthday = `${year}-${month}-${day}`;
    setbirthday(birthday);
  };

  const onChangeCity = (e) => {
    const city = e.target.value;
    setcity(city);
  };

  const onChangePostalCode = (e) => {
    const postalCode = e.target.value;
    setpostalCode(postalCode);
  };

  const onChangeStreetNameAndNumber = (e) => {
    const streetNameAndNumber = e.target.value;
    setstreetNameAndNumber(streetNameAndNumber);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.register(
        username,
        firstname,
        surname,
        email,
        password,
        city,
        postalCode,
        country,
        streetNameAndNumber,
        phonenumber,
        tarif,
        checkpassword,
        birthday
      ).then(
        (response) => {
          setTimeout(() => {
            setSuccessful(true);
            setMessage('Registration successful. Redirecting to login page...');
      
            setTimeout(() => {
              navigate('/login');
            }, 2000);
          }, 2000);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-container">
        <img
          src="https://www.seekpng.com/png/full/966-9665493_my-profile-icon-blank-profile-image-circle.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <Form onSubmit={handleRegister} ref={form}>
          {!successful && (
            <div>
              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="firstname">Firstname</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="firstname"
                      value={firstname}
                      onChange={onChangefirstname}
                      validations={[required, vfirstname]}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="surname">Surname</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="surname"
                      value={surname}
                      onChange={onChangesurname}
                      validations={[required, vsurname]}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="birthday">Birthday</label>
                    <Input
                      type="date"
                      className="form-control"
                      name="birthday"
                      value={birthday}
                    
                      aria-describedby="button-addon2"
                      onChange={onChangebirthday}
                      validations={[vbirthday]}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="country"
                      value={country}
                      onChange={onChangecountry}
                      validations={[required, vcountry]}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="city"
                      value={city}
                      onChange={onChangeCity}
                      validations={[required, vcity]}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="streetNameAndNumber">
                      Street name and number
                    </label>
                    <Input
                      type="text"
                      className="form-control"
                      name="streetNameAndNumber"
                      value={streetNameAndNumber}
                      onChange={onChangeStreetNameAndNumber}
                      validations={[required, vstreetNameAndNumber]}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor="city">Postal Code</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="postalCode"
                      value={postalCode}
                      onChange={onChangePostalCode}
                      validations={[required, vpostalCode]}
                    />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <Input
                      type="text"
                      className="form-control"
                      name="username"
                      value={username}
                      onChange={onChangeUsername}
                      validations={[required, vusername]}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="text"
                  className="form-control"
                  name="email"
                  value={email}
                  onChange={onChangeEmail}
                  validations={[required, validEmail]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phonenumber">Phone Number</label>
                <Input
                  type="text"
                  className="form-control"
                  name="phonenumber"
                  placeholder="Enter phone number"
                  value={phonenumber}
                  onChange={onChangephonenumber}
                  validations={[required]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tarif">Choose a Tarif:</label>
                <select
                  value={tarif}
                  name="tarif"
                  style={{ width: "270px", height: "40px" }}
                  onChange={handleTarifChange}
                >
                  <option value="basic">basic</option>
                  <option value="exclusiv">exclusiv</option>
                  <option value="normal">normal</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required, vpassword]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="checkpassword">Password Verify</label>
                <Input
                  type="password"
                  className="form-control"
                  name="checkpassword"
                  value={checkpassword}
                  onChange={onChangecheckPassword}
                  validations={[required, vcheckpassword]}
                />
              </div>

              <div className="form-group">
                <button className="btn btn-primary btn-block">Sign Up</button>
              </div>
            </div>
          )}

          {message && (
            <div className="form-group">
              <div
                className={
                  successful ? "alert alert-success" : "alert alert-danger"
                }
                role="alert"
              >
                {message}
              </div>
            </div>
          )}
          <CheckButton style={{ display: "none" }} ref={checkBtn} />
        </Form>
      </div>
    </div>
  );
};

export default Register;
