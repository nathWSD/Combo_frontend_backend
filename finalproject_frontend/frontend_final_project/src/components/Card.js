import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Card.css';

const Card = ({id,name, image, category,
   description, city, actualStation, available }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate(`/buchung?image=${encodeURIComponent(image)}&category=${encodeURIComponent(category)}&id=${encodeURIComponent(id)}&name=${encodeURIComponent(name)}&actualStation=${encodeURIComponent(actualStation)}&city=${encodeURIComponent(city)}&available=${encodeURIComponent(available)}`);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const cardStyle = {
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  };

  return (
    <div
      className="card"
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="card-image-container">
        <img className="card-image" src={image} alt={name} />
      </div>
      <div className="card-content">
      {/* <h2 className="card-id">{id}</h2> */}
        <h2 className="card-name">{name}</h2>
        <h2 className="card-category">{category}</h2>
        <p className="card-description">{description}</p>
        <h2 className="card-city">{city}</h2>
        <h2 className="card-actualStation">{actualStation}</h2>
      </div>
    </div>
  );
};

export default Card;
