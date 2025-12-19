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
  Typography
} from "@mui/material";
import { useUser } from "./UserContext";
import siieLogo from "../img/SIIE.png";
import conedLogo from "../img/LOGOCONED_Blanco.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



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
        {isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              backgroundColor: "rgba(255,255,255,0.3)",
              justifyContent: "flex-end",
              alignSelf: "flex-end",
              mr: 2
            }}
          >
            <AccountCircleIcon sx={{ fontSize: 28, color: "white" }} />
            <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
              {user.usuario}
            </Typography>
          </Box>
        )}

        {/* Logos */}
        <Box
          sx={{
            mx: isMobile ? 0 : 4,
            my: isMobile ? 1 : 0,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 2,
          }}
        >
          <img
            src={siieLogo}
            alt="SIIE Logo"
            style={{
              height: isMobile ? "" : "120px",
              width: isMobile ? "40%" : "",
            }}
          />
          <img
            src={conedLogo}
            alt="CONED Logo"
            style={{
              height: isMobile ? "" : "140px",
              width: isMobile ? "40%" : "",
            }}
          />
        </Box>

        {/* Contenedor derecha */}
        <Box
          sx={{
            display: "flex",
            flex: isMobile ? "none" : 1,
            justifyContent: isMobile ? "center" : "flex-end",
            alignItems: "flex-end",
            flexDirection: "column", // 🔹 Hace que el usuario quede arriba
            gap: 1,
          }}
        >
          {/* Usuario arriba */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            >
              <AccountCircleIcon sx={{ fontSize: 28, color: "white" }} />
              <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
                {user.usuario}
              </Typography>
            </Box>
          )}

          {/* Botones debajo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: isMobile ? "center" : "flex-end",
              flexWrap: "wrap",
              flexDirection: "column",
              gap: 1,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: isMobile ? "center" : "flex-end",
                flexWrap: "wrap",

                gap: 1,
              }}
            >
              {isMobile && (
                <>
                 

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

                </>
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: isMobile ? "center" : "flex-end",
                flexWrap: "wrap",

                gap: 1,
              }}
            >
              {tienePermiso(1) && (
                <NavButton component={NavLink} to="/Dashboard/Descargas/SEDU">
                  SEDUC
                </NavButton>
              )}
              {tienePermiso(2) && (
                <NavButton component={NavLink} to="/Dashboard/Descargas/INFOP">
                  INFOP
                </NavButton>
              )}
              {tienePermiso(3) && (
                <NavButton component={NavLink} to="/Dashboard/Descargas/CONEANFO">
                  CONEANFO
                </NavButton>
              )}
             {tienePermiso(4) && (
                <NavButton component={NavLink} to="/Dashboard/Descargas/DES-UNAH">
                  DES-UNAH
                </NavButton>
              )} 
            </Box>
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
};

export default Header;
