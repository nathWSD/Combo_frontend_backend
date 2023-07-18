import React, { useState } from 'react';

const NameInputForm = ({ onSubmit }) => {
  const [name, setName] = useState('');

  const handleInputChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={name} onChange={handleInputChange} placeholder="Enter your name" />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NameInputForm;
