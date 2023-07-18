import React, { useState ,useRef} from 'react';
import AuthService from "../services/auth.service";
import "./UserInfo.css";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import BoardAdmin from './BoardAdmin';
import BoardUser from './BoardUser';
import BoardModerator from './BoardModerator';
import { useNavigate   } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const UserInfo = () => {
  const navigate = useNavigate();
      const currentUser = AuthService.getCurrentUser();

  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [userData, setUserData] = useState({
    id:'',
    username: '',
    firstname: '',
    surname: '',
    email: '',
    password: '',
    city: '',
    postalCode: '',
    country: '',
    streetNameAndNumber: '',
    phonenumber: '',
    tarif: '', /* must be nullable at back end  */
    checkpassword: '',
  });
 
  const form = useRef();
  const tarifOptions = [
    { label: 'basic', value: 'basic' },
    { label: 'standard', value: 'standard' },
    { label: 'premium', value: 'premium' },
  ];
  const handleEdit = () => {
    setEditing(true);
    setEditedData({ ...userData });
  };

  const handleSave = () => {
    setUserData({ ...editedData });
    console.log(editedData);

    setEditing(false);
    console.log(currentUser.token);
    AuthService.changePersonalData(
      editedData.id,
       editedData.username,
     editedData.firstname,
    editedData.surname,
    editedData.email,
     editedData.password,
    editedData.city,
       editedData.postalCode,
    editedData.country,
    editedData.streetNameAndNumber,
      editedData.phonenumber,
    editedData.tarif,
      editedData.checkpassword,
     )
      .then(() => {
        toast('Personal Data changed successful.', { autoClose: 2000 });
        // Navigation based on user role
        if (currentUser && currentUser.roles && currentUser.roles.includes("ROLE_ADMIN")) {
          navigate('/BoardAdmin');
        } else if (currentUser && currentUser.roles && currentUser.roles.includes("ROLE_WORKER")) {
          navigate('/BoardModerator');
        } else if (currentUser && currentUser.roles && currentUser.roles.includes("ROLE_USER")) {
          navigate('/BoardUser');
        } else {
        }
      })
      .catch((error) => {
        // Handle error
        toast.error('Failed to change personal data.', { autoClose: 2000 });
        console.log(error);
      });
  };
   
  
  const handleChange = (e) => {
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
  };

  return (

    

    <div className="UserInfo">

<div>
        <label className='UserInfo label'>your ID: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="number"
            name="id"
            value={editedData.id || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.id}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>First name: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="firstname"
            value={editedData.firstname || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.firstname}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>Surname: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="surname"
            value={editedData.surname || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.surname}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>User name: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="username"
            value={editedData.username || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.username}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>Password: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="password"
            value={editedData.password || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.password}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>Password verify: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="checkpassword"
            value={editedData.checkpassword || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.password}</span>
        )}
      </div>
      <div>
        <label className='UserInfo label'>City: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="city"
            value={editedData.city || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.city}</span>
        )}
      </div>

                  
      <div>
        <label className='UserInfo label'>Country: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="country"
            value={editedData.country || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.country}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>street Name And Number </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="streetNameAndNumber"
            value={editedData.streetNameAndNumber || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.streetNameAndNumber}</span>
        )}
      </div>
      
      <div>
        <label className='UserInfo label'>postal Code: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="postalCode"
            value={editedData.postalCode || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.postalCode}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>Email: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="email"
            name="email"
            value={editedData.email || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.email}</span>
        )}
      </div>

      <div>
        <label className='UserInfo label'>phonenumber: </label>
        {editing ? (
          <input className= 'UserInfo input'
            type="text"
            name="phonenumber"
            value={editedData.phonenumber || ''}
            onChange={handleChange}
          />
        ) : (
          <span>{userData.phonenumber}</span>
        )}
      </div>

      {currentUser.roles.includes("ROLE_USER") && (
      <div>
      <label className="UserInfo label">Tarif:</label>
      {editing ? (
    <select
      className='UserInfo input'
      name="tarif"
      value={editedData.tarif || 'basic'}
      onChange={handleChange}
    >
      {tarifOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ) : (
    <span>{userData.tarif}</span>
  )}
      </div>
 )}
      {editing ? (
        <button  className='UserInfo button' onClick={handleSave}>Save</button>
      ) : (
        <button className='UserInfo button' onClick={handleEdit}>Edit</button>
      )}
  <ToastContainer />
    </div>
     
    )};

export default UserInfo;
