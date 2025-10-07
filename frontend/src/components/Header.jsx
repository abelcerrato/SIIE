import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { flushSync } from "react-dom";

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
import { useUser } from "./UserContext";
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
  const navigate = useNavigate();
  const { user, logout, permissions } = useUser();


  // Estado para el submenú ADMINISTRACIÓN
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // Verifica si la ruta pertenece a ADMINISTRACIÓN
  const isAdminActive = location.pathname.startsWith("/Dashboard/Administracion");



  const handleLogout = () => {
    handleMenuClose();
    flushSync(() => logout());
    navigate("/");
  };


  const tienePermiso = (idmodulo) => permissions?.find(p => p.idmodulo === idmodulo)?.consultar;
  const mostrarAdministracion = tienePermiso(5) || tienePermiso(6);

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
              onClick={handleLogout}
            >
              PORTAL SIIE
            </NavButton>



            {/* Menú ADMINISTRACIÓN */}
            {mostrarAdministracion && (
              <>
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
                  {tienePermiso(6) && (
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
                  )}

                  {tienePermiso(5) && (
                    <MenuItem
                      component={NavLink}
                      to="/Dashboard/Administracion/RolesyPermisos"
                      onClick={handleMenuClose}
                      sx={{
                        color:
                          location.pathname ===
                            "/Dashboard/Administracion/RolesyPermisos"
                            ? "#88CFE0"
                            : "inherit",
                      }}
                    >
                      Roles y Permisos
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}

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
              height: isMobile ? "" : "120px",
              width: isMobile ? "80%" : "",
            }}
          />
          <img
            src={conedLogo}
            alt="CONED Logo"
            style={{
              height: isMobile ? "" : "140px",
              width: isMobile ? "80%" : "",
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
              {mostrarAdministracion && (
                <>
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
                    {tienePermiso(6) && (
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
                    )}

                    {tienePermiso(5) && (
                      <MenuItem
                        component={NavLink}
                        to="/Dashboard/Administracion/RolesyPermisos"
                        onClick={handleMenuClose}
                        sx={{
                          color:
                            location.pathname ===
                              "/Dashboard/Administracion/RolesyPermisos"
                              ? "#88CFE0"
                              : "inherit",
                        }}
                      >
                        Roles y Permisos
                      </MenuItem>
                    )}
                  </Menu>
                </>
              )}

            </>
          )}
          {tienePermiso(1) && (
            <NavButton
              component={NavLink}
              to="/Dashboard/Descargas/SEDU"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              SEDUC
            </NavButton>
          )}
          {tienePermiso(2) && (
            <NavButton
              component={NavLink}
              to="/Dashboard/Descargas/INFOP"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              INFOP
            </NavButton>
          )}
          {tienePermiso(3) && (
            <NavButton
              component={NavLink}
              to="/CONEANFO"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              CONEANFO
            </NavButton>
          )}
          {tienePermiso(4) && (
            <NavButton
              component={NavLink}
              to="/Dashboard/Descargas/DES-UNAH"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              DES-UNAH
            </NavButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
