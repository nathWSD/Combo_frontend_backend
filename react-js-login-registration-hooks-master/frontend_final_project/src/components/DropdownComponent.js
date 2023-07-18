import React, { useState } from 'react';

const DropdownComponent = ({ options, onSelect }) => {
  return (
    <select onChange={onSelect}>
      <option value="">Select a State and location</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default DropdownComponent;
