import { Box } from "@mui/material";
import Header from "./Header";
import CambiarContraModal from "../views/InicioSección/CambiarContraModal";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "./UserContext";




const Layout = () => {
  const { user } = useUser();



  return (
    <Box sx={{ display: "flex", height: "100vh", flexDirection: "column" }}>

      <Header />

      <Box sx={{ flex: 1, p: 2, overflow: "auto" }}>
        <Outlet />

      </Box>
    </Box>
  );
};

export default Layout;
