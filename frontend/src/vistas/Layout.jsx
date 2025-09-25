import { Box, Typography } from "@mui/material";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import React from "react";

const Dashboard = ({ children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {/* Pasa openDrawer como prop 'open' al AppBarComponent */}

      <Header />
      <Navbar />
      <Box component="main">
        {children}

        <Typography
          variant="body2"
          color="text.secondary"
          align="center"
          sx={{ mt: 5, py: 2 }}
        >
          {"Copyright © "}
          Propiedad Intelectual del Estado de Honduras
        </Typography>
      </Box>
    </Box>
  );
};

export default Dashboard;
