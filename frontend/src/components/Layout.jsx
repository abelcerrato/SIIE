import { Box } from "@mui/material";
import Header from "./Header";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
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
