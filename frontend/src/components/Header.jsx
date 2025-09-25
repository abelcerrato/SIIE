import React from "react";
import { AppBar, Toolbar, Box } from "@mui/material";
import siieLogo from "../img/SIIE.png";

const Header = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#88CFE0" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box
          component="img"
          src={siieLogo}
          alt="SIIE Logo"
          sx={{ width: { xs: "20%", sm: "15%", md: "10%" }, height: "auto" }}
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
