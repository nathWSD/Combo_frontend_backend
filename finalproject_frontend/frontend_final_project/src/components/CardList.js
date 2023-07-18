import React, { useState, useEffect } from 'react';
import Card from './Card';
import "./Card.css";


const CardList =()=>{
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/lendmove/api/auth/vehicule/all')
      .then(response => response.json())
      .then(data => {
        console.log('Received data:', data);
        const vehicules = data.vehicules || []; 
        setCards(vehicules);
        setFilteredCards(vehicules);
      })
      .catch(error => console.error('Error fetching car data:', error));
  }, []);
  

  const handleSearch = (selectedCity) => {
    let filteredCards = [];
  
    if (selectedCity === "all") {
      filteredCards = cards; 
      console.log('car actualStation all:', filteredCards.map(card => card.actualStation));
    } else {
      filteredCards = cards.filter((card) => card.city.trim() === selectedCity.trim() && card.available === true);
    }
  
    setFilteredCards(filteredCards);
  };
  
  
  return (
    <div>
      <div>
        <select onChange={(e) => handleSearch(e.target.value)}>
          <option value="all">All</option>
          <option value="Berlin">Berlin</option>
          <option value="Bremen">Bremen</option>
          <option value="Hamburg">Hamburg</option>
          <option value="Baden-Würtenberg">Baden-Würtenberg</option>
          <option value="Saarland">Saarland</option>
          <option value="Niedersachsen">Niedersachsen</option>
        </select>
      </div>
      <div className="card-list">
        <div style={{ height: '100%', overflowY: 'auto' }}>
          {filteredCards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              category={card.category}
              name={card.name}
              image={card.image}
              description={card.description}
              linkUrl={card.linkUrl}
              city={card.city}
              actualStation={card.actualStation}
              available={card.available}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardList;





