import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  styled,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";

import siieLogo from "../img/SIIE.png";
import conedLogo from "../img/LOGOCONED_Blanco.png";

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.black,
  fontWeight: 700,
  minWidth: "auto",
  padding: "6px 10px",
  textTransform: "none",
  "&.active": {
    color: "#fff", // blanco cuando está activo
    fontWeight: "bold",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: -5,
      left: 0,
      width: "100%",
      height: 2,
      backgroundColor: "#fff",
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
  const location = useLocation();

  // Estado para el submenú ADMINISTRACIÓN
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Verifica si la ruta pertenece a ADMINISTRACIÓN
  const isAdminActive = location.pathname.startsWith("/Dashboard/Administracion");

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
        {/* Izquierda */}
        {!isMobile && (
          <Box sx={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
            <NavButton
              component={NavLink}
              to="/"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              PORTAL SIIE
            </NavButton>

            {/* Menú ADMINISTRACIÓN */}
            <NavButton
              onClick={handleMenuOpen}
              className={isAdminActive ? "active" : ""}
            >
              ADMINISTRACIÓN
            </NavButton>

            <Menu
              id="admin-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{ "aria-labelledby": "admin-button" }}
              sx={{
                "& .MuiPaper-root": {
                  backgroundColor: "#f9f9f9",
                },
              }}
            >
              <MenuItem
                component={NavLink}
                to="/Dashboard/Administracion/Usuarios"
                onClick={handleMenuClose}
                sx={{
                  color:
                    location.pathname === "/Dashboard/Administracion/Usuarios"
                      ? "#88CFE0"
                      : "inherit",
                }}
              >
                Usuarios
              </MenuItem>

              <MenuItem
                component={NavLink}
                to="/Dashboard/Administracion/RolesyPermisos"
                onClick={handleMenuClose}
                sx={{
                  color:
                    location.pathname === "/Dashboard/Administracion/RolesyPermisos"
                      ? "#88CFE0"
                      : "inherit",
                }}
              >
                Roles y Permisos
              </MenuItem>
            </Menu>
          </Box>
        )}

        {/* Logos */}
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
        </Box>

        {/* Derecha */}
        <Box
          sx={{
            display: "flex",
            flex: isMobile ? "none" : 1,
            justifyContent: isMobile ? "center" : "flex-end",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          {isMobile && (
            <>
              <NavButton
                component={NavLink}
                to="/"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                PORTAL SIIE
              </NavButton>

              {/* ADMINISTRACIÓN en móvil */}
              <NavButton
                onClick={handleMenuOpen}
                className={isAdminActive ? "active" : ""}
              >
                ADMINISTRACIÓN
              </NavButton>
              <Menu
                id="admin-menu-mobile"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
              >
                <MenuItem
                  component={NavLink}
                  to="/Dashboard/Administracion/Usuarios"
                  onClick={handleMenuClose}
                  sx={{
                    color:
                      location.pathname === "/Dashboard/Administracion/Usuarios"
                        ? "#88CFE0"
                        : "inherit",
                  }}
                >
                  Usuarios
                </MenuItem>
                <MenuItem
                  component={NavLink}
                  to="/Dashboard/Administracion/RolesyPermisos"
                  onClick={handleMenuClose}
                  sx={{
                    color:
                      location.pathname === "/Dashboard/Administracion/RolesyPermisos"
                        ? "#88CFE0"
                        : "inherit",
                  }}
                >
                  Roles y Permisos
                </MenuItem>
              </Menu>
            </>
          )}

          <NavButton
            component={NavLink}
            to="/Dashboard/Descargas/SEDU"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            SEDUC
          </NavButton>
          <NavButton
            component={NavLink}
            to="/INFOP"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            INFOP
          </NavButton>
          <NavButton
            component={NavLink}
            to="/CONEANFO"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            CONEANFO
          </NavButton>
          <NavButton
            component={NavLink}
            to="/DES-UNAH"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            DES-UNAH
          </NavButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
