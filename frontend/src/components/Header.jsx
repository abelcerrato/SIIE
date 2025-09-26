import React from "react";

import siieLogo from "../img/SIIE.png";
import conedLogo from "../img/logos-CONED.png";

import { NavLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";



const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black,
  fontWeight: 700,
  minWidth: "auto",
  padding: "6px 7px",
  "&.active": {
    color: "#ffffffff",
    fontWeight: "bold",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -5,
      left: 0,
      width: "100%",
      height: 2,
      backgroundColor: "#ffffffff",
      animation: "underline 0.3s ease",
    },
  },
  "@keyframes underline": {
    from: { width: 0 },
    to: { width: "100%" },
  },
}));
const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <AppBar position="static" sx={{ backgroundColor: "white" }}>
      <Toolbar
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "space-between",

          backgroundColor: "#88CFE0",
        }}
      >
        {/* Contenedor izquierdo (solo desktop) */}
        {!isMobile && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <NavButton component={NavLink} to="/">
              INICIO
            </NavButton>
            <NavButton component={NavLink} to="/Dashboard/Seguridad">
              Seguridad
            </NavButton>
          </Box>
        )}

        {/* Logo - siempre centrado */}
        <Box
          sx={{
            mx: isMobile ? 0 : 4,
            my: isMobile ? 1 : 0,
            flexShrink: 0,
          }}
        >
          <img
            src={siieLogo}
            alt="SIIE Logo"
            style={{
              height: isMobile ? "" : "140px",
              width: isMobile ? "90%" : "",
            }}
          />
          <img
            src={conedLogo}
            alt="CONED Logo"
            style={{
              height: isMobile ? "" : "140px",
              width: isMobile ? "90%" : "",
            }}
          />
          {/*           <img src={conedLogo} alt="CONED Logo" style={{ height: "180px" }} /> */}
        </Box>

        {/* Contenedor derecho (menu principal) */}
        <Box
          sx={{
            display: "flex",
            flex: isMobile ? "none" : 1,
            justifyContent: isMobile ? "center" : "flex-end",
            flexWrap: "wrap",
            gap: 1,
            "& .MuiButton-root:not(:last-child)::after": isMobile
              ? {
                //content: '"|"',
                //ml: 1.5,
                color: "#ccc",
              }
              : {},
          }}
        >
          {/* Mostrar INICIO en móvil si es necesario */}
          {isMobile && (
            <>
              <NavButton
                component={NavLink}
                to="/"
                sx={{ "&.active::after": { display: "none" } }}
              >
                INICIO
              </NavButton>
              <NavButton component={NavLink} to="/Seguridad">
                Seguridad
              </NavButton>

            </>
          )}
          <NavButton component={NavLink} to="/SEDUC">
            SEDUC
          </NavButton>
          <NavButton component={NavLink} to="/INFOP">
            INFOP
          </NavButton>
          <NavButton component={NavLink} to="/CONEANFO">
            CONEANFO
          </NavButton>
          <NavButton component={NavLink} to="/DES-UNAH">
            DES-UNAH
          </NavButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
