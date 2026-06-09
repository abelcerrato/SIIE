// Layout.jsx
import { Box } from "@mui/material";
import Header from "./Header";
import DrawerMenu from "./DrawerMenu";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import color from "./color";

const Layout = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setDrawerOpen(prev => !prev);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Header onMenuClick={toggleDrawer} />
      <DrawerMenu open={drawerOpen} onToggle={toggleDrawer} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: "64px",
          p: 3,
          overflow: "auto",
          backgroundColor: `${color.primary}08`,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;