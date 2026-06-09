// Header.jsx
import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";
import siieLogo from "../img/nueva-linea-grafica/Gobierno + Institución a color.png";
import color from "./color";

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    flushSync(() => logout());
    navigate("/");
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: color.white, 
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)", 
        zIndex: 1201,
        borderBottom: `2px solid ${color.primary}`,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Menú hamburguesa y logo */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={onMenuClick}
            edge="start"
            sx={{ color: color.primary }}
          >
            <MenuIcon />
          </IconButton>
          
          <img
            src={siieLogo}
            alt="SIIE Logo"
            style={{
              height: isMobile ? "40px" : "50px",
              width: "auto",
            }}
          />

        </Box>

        {/* Usuario y botón salir */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: "rgba(36, 78, 158, 0.08)",
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 28, color: color.primary }} />
            <Typography variant="body1" sx={{ fontWeight: 600, color: color.primary }}>
              {user?.usuario || "Usuario"}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ 
              textTransform: "none", 
              fontWeight: 600,
              borderColor: color.secondary,
              color: color.secondary,
              '&:hover': {
                borderColor: color.primary,
                backgroundColor: 'rgba(173, 132, 17, 0.04)',
              }
            }}
          >
            Salir
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;