import React, { useState } from "react";
import "./Menu.css"; // Custom CSS file for additional styling

const Menu = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMouseEnter = () => {
    setMenuVisible(true);
  };

  const handleMouseLeave = () => {
    setMenuVisible(false);
  };

  return (
    <div
      className={`menu-wrapper ${menuVisible ? "visible" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="menu-content">
        <h3>Menu</h3>
        <ul>
          <li>Button 1</li>
          <li>Button 2</li>
          <li>Button 3</li>
        </ul>
      </div>
      <div className={`info ${menuVisible ? "visible" : ""}`}>
        <h3>Information</h3>
        <p>This is some information.</p>
      </div>
    </div>
  );
};

export default Menu;
