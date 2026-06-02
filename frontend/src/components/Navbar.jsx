import React from "react";
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
import color from "../components/color";
import siieLogo from "../img//nueva-linea-grafica/Logo Siie.png";
import conedLogo from "../img/nueva-linea-grafica/Logo CONED.png";
import logos from "../img/nueva-linea-grafica/logos-siie-y-coned.png";

import fondo from "../img/nueva-linea-grafica/fondo.png";

const NavButton = styled(Button)(({ theme }) => ({
  color: color.white,
  fontWeight: "bold",
  fontSize: "16px",
  minWidth: "auto",
  padding: "6px 7px",
  "&.active": {
    color: color.white,
    fontWeight: "bold",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 4,
      left: 0,
      width: "100%",
      height: 2,
      backgroundColor: color.secondary,
      animation: "underline 0.3s ease",
    },
  },
  "@keyframes underline": {
    from: { width: 0 },
    to: { width: "100%" },
  },
}));

const Navbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppBar
      position="static"
      sx={{
        borderRadius: "0px 0px 40px 40px",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "start",
        py: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
     {/* Logo - siempre centrado */}
<Box
  sx={{
    width: "100%",           // Asegura que ocupe todo el ancho disponible
    display: "flex",
    justifyContent: "center", // Centra horizontalmente
    alignItems: "center",
    flexShrink: 0,
    gap: 2,
    mb: isMobile ? 2 : 0,    // Espaciado en móvil
  }}
>
  <img
    src={logos}
    alt="SIIE y CONED Logos"
    style={{
      height: isMobile ? "auto" : "100px",
      width: isMobile ? "80%" : "auto",  // Cambiado de 70% a 80%
      maxWidth: isMobile ? "300px" : "none", // Limita el ancho máximo en móvil
      objectFit: "contain",  // Mantiene la proporción
    }}
  />
</Box>

      {/* Contenedor derecho (menu principal) */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexWrap: "wrap",
          gap: isMobile ? 2 : 8,
          "& .MuiButton-root:not(:last-child)::after": isMobile
            ? {
                //content: '"|"',
                //ml: 1.5,
                color: "#ccc",
              }
            : {},
        }}
      >
        <NavButton component={NavLink} to="/">
          INICIO
        </NavButton>
        <NavButton component={NavLink} to="/ACERCA-DE">
          ACERCA DE
        </NavButton>

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
    </AppBar>
  );
};

export default Navbar;
