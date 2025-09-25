import React from "react";
import siieLogo from "../img/SIIE.png"; 
const Header = () => {
  return (
    <header
      style={{
        background: "#88CFE0",
        color: "white",
        //padding: "1rem",
        textAlign: "center",
      }}
    >
      <img
        src={siieLogo}
        alt="siieLogo"
        style={{ width: "10%", height: "auto" }}
      />

    </header>
  );
};

export default Header;
