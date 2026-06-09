// DrawerMenu.jsx
import React, { useState, useCallback } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Divider,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AdminPanelSettings as AdminIcon,
  People as UsersIcon,
  Security as RolesIcon,
  Download as DownloadIcon,
  School as SeduIcon,
  Psychology as InfopIcon,
  Analytics as ConeanfoIcon,
  ExpandLess,
  ExpandMore,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
} from "@mui/icons-material";
import { NavLink, useLocation } from "react-router-dom";
import { useUser } from "./UserContext";
import color from "./color";

const DrawerMenu = ({ open, onToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const { permissions } = useUser();
  
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openDescargas, setOpenDescargas] = useState(false);
  
  // Estados para los menús flotantes
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);
  const [descargasAnchorEl, setDescargasAnchorEl] = useState(null);

  const drawerWidth = 280;
  const collapsedDrawerWidth = 72;

  const tienePermiso = useCallback((idmodulo) => 
    permissions?.find(p => p.idmodulo === idmodulo)?.consultar,
    [permissions]
  );

  const mostrarAdministracion = tienePermiso(5) || tienePermiso(6);
  const mostrarDescargas = tienePermiso(1) || tienePermiso(2) || tienePermiso(3);

  const handleAdminClick = (event) => {
    if (!open) {
      setAdminAnchorEl(event.currentTarget);
    } else {
      setOpenAdmin(!openAdmin);
    }
  };

  const handleAdminClose = () => {
    setAdminAnchorEl(null);
  };

  const handleDescargasClick = (event) => {
    if (!open) {
      setDescargasAnchorEl(event.currentTarget);
    } else {
      setOpenDescargas(!openDescargas);
    }
  };

  const handleDescargasClose = () => {
    setDescargasAnchorEl(null);
  };

  // Versión simplificada para móvil
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={open}
        onClose={onToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: color.white,
          },
        }}
      >
        <List xs={{ mt: 7 }}>
          <ListItem disablePadding>
            <ListItemButton 
              component={NavLink} 
              to="/Dashboard" 
              onClick={onToggle}
              sx={{
                '&.active': {
                  backgroundColor: `${color.primary}15`,
                  borderRight: `3px solid ${color.primary}`,
                }
              }}
            >
              <ListItemIcon><DashboardIcon sx={{ color: color.primary }} /></ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>

          {mostrarAdministracion && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenAdmin(!openAdmin)}>
                  <ListItemIcon><AdminIcon sx={{ color: color.primary }} /></ListItemIcon>
                  <ListItemText primary="Administración" />
                  {openAdmin ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openAdmin}>
                <List component="div" disablePadding>
                  {tienePermiso(6) && (
                    <ListItemButton
                      component={NavLink}
                      to="/Dashboard/Administracion/Usuarios"
                      onClick={onToggle}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><UsersIcon /></ListItemIcon>
                      <ListItemText primary="Usuarios" />
                    </ListItemButton>
                  )}
                  {tienePermiso(5) && (
                    <ListItemButton
                      component={NavLink}
                      to="/Dashboard/Administracion/RolesyPermisos"
                      onClick={onToggle}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><RolesIcon /></ListItemIcon>
                      <ListItemText primary="Roles y Permisos" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            </>
          )}

          {mostrarDescargas && (
            <>
              <ListItem disablePadding>
                <ListItemButton onClick={() => setOpenDescargas(!openDescargas)}>
                  <ListItemIcon><DownloadIcon sx={{ color: color.primary }} /></ListItemIcon>
                  <ListItemText primary="Descargas" />
                  {openDescargas ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
              </ListItem>
              <Collapse in={openDescargas}>
                <List component="div" disablePadding>
                  {tienePermiso(1) && (
                    <ListItemButton
                      component={NavLink}
                      to="/Dashboard/Descargas/SEDU"
                      onClick={onToggle}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><SeduIcon /></ListItemIcon>
                      <ListItemText primary="SEDUC" />
                    </ListItemButton>
                  )}
                  {tienePermiso(2) && (
                    <ListItemButton
                      component={NavLink}
                      to="/Dashboard/Descargas/INFOP"
                      onClick={onToggle}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><InfopIcon /></ListItemIcon>
                      <ListItemText primary="INFOP" />
                    </ListItemButton>
                  )}
                  {tienePermiso(3) && (
                    <ListItemButton
                      component={NavLink}
                      to="/Dashboard/Descargas/CONEANFO"
                      onClick={onToggle}
                      sx={{ pl: 4 }}
                    >
                      <ListItemIcon><ConeanfoIcon /></ListItemIcon>
                      <ListItemText primary="CONEANFO" />
                    </ListItemButton>
                  )}
                </List>
              </Collapse>
            </>
          )}
        </List>
      </Drawer>
    );
  }

  // Versión desktop con menús flotantes
  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: open ? drawerWidth : collapsedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : collapsedDrawerWidth,
            boxSizing: 'border-box',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
            mt: '64px',
            height: 'calc(100% - 64px)',
            backgroundColor: color.white,
            borderRight: `1px solid ${color.primary}20`,
          },
        }}
      >
    
    
        <List>
          {/* Dashboard */}
          <ListItem disablePadding sx={{ display: 'block' }}>
            <Tooltip title={!open ? "Dashboard" : ""} placement="right">
              <ListItemButton
                component={NavLink}
                to="/Dashboard"
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&.active': {
                    backgroundColor: `${color.primary}15`,
                    borderRight: `3px solid ${color.primary}`,
                  },
                  '&:hover': {
                    backgroundColor: `${color.primary}10`,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: location.pathname === "/Dashboard" ? color.primary : color.contrastText,
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText 
                  primary="Dashboard" 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    display: open ? 'block' : 'none',
                    '& .MuiTypography-root': {
                      fontWeight: location.pathname === "/Dashboard" ? 700 : 500,
                      color: location.pathname === "/Dashboard" ? color.primary : color.contrastText,
                    }
                  }} 
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>

          {/* Administración */}
          {mostrarAdministracion && (
            <>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <Tooltip title={!open ? "Administración" : ""} placement="right">
                  <ListItemButton
                    onClick={handleAdminClick}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: `${color.primary}10`,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: location.pathname.includes("/Dashboard/Administracion") ? color.primary : color.contrastText,
                      }}
                    >
                      <AdminIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Administración" 
                      sx={{ 
                        opacity: open ? 1 : 0,
                        display: open ? 'block' : 'none',
                        '& .MuiTypography-root': {
                          fontWeight: location.pathname.includes("/Dashboard/Administracion") ? 700 : 500,
                          color: location.pathname.includes("/Dashboard/Administracion") ? color.primary : color.contrastText,
                        }
                      }} 
                    />
                    {open && (openAdmin ? <ExpandLess sx={{ color: color.primary }} /> : <ExpandMore sx={{ color: color.contrastText }} />)}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              
              {open && (
                <Collapse in={openAdmin} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {tienePermiso(6) && (
                      <ListItemButton
                        component={NavLink}
                        to="/Dashboard/Administracion/Usuarios"
                        sx={{ 
                          pl: 4,
                          '&.active': {
                            backgroundColor: `${color.primary}15`,
                            borderRight: `3px solid ${color.primary}`,
                          }
                        }}
                      >
                        <ListItemIcon><UsersIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                        <ListItemText primary="Usuarios" />
                      </ListItemButton>
                    )}
                    {tienePermiso(5) && (
                      <ListItemButton
                        component={NavLink}
                        to="/Dashboard/Administracion/RolesyPermisos"
                        sx={{ 
                          pl: 4,
                          '&.active': {
                            backgroundColor: `${color.primary}15`,
                            borderRight: `3px solid ${color.primary}`,
                          }
                        }}
                      >
                        <ListItemIcon><RolesIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                        <ListItemText primary="Roles y Permisos" />
                      </ListItemButton>
                    )}
                  </List>
                </Collapse>
              )}
            </>
          )}

          {/* Descargas */}
          {mostrarDescargas && (
            <>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <Tooltip title={!open ? "Descargas" : ""} placement="right">
                  <ListItemButton
                    onClick={handleDescargasClick}
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      '&:hover': {
                        backgroundColor: `${color.primary}10`,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                        color: location.pathname.includes("/Dashboard/Descargas") ? color.primary : color.contrastText,
                      }}
                    >
                      <DownloadIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Descargas" 
                      sx={{ 
                        opacity: open ? 1 : 0,
                        display: open ? 'block' : 'none',
                        '& .MuiTypography-root': {
                          fontWeight: location.pathname.includes("/Dashboard/Descargas") ? 700 : 500,
                          color: location.pathname.includes("/Dashboard/Descargas") ? color.primary : color.contrastText,
                        }
                      }} 
                    />
                    {open && (openDescargas ? <ExpandLess sx={{ color: color.primary }} /> : <ExpandMore sx={{ color: color.contrastText }} />)}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
              
              {open && (
                <Collapse in={openDescargas} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {tienePermiso(1) && (
                      <ListItemButton
                        component={NavLink}
                        to="/Dashboard/Descargas/SEDU"
                        sx={{ 
                          pl: 4,
                          '&.active': {
                            backgroundColor: `${color.primary}15`,
                            borderRight: `3px solid ${color.primary}`,
                          }
                        }}
                      >
                        <ListItemIcon><SeduIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                        <ListItemText primary="SEDUC" />
                      </ListItemButton>
                    )}
                    {tienePermiso(2) && (
                      <ListItemButton
                        component={NavLink}
                        to="/Dashboard/Descargas/INFOP"
                        sx={{ 
                          pl: 4,
                          '&.active': {
                            backgroundColor: `${color.primary}15`,
                            borderRight: `3px solid ${color.primary}`,
                          }
                        }}
                      >
                        <ListItemIcon><InfopIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                        <ListItemText primary="INFOP" />
                      </ListItemButton>
                    )}
                    {tienePermiso(3) && (
                      <ListItemButton
                        component={NavLink}
                        to="/Dashboard/Descargas/CONEANFO"
                        sx={{ 
                          pl: 4,
                          '&.active': {
                            backgroundColor: `${color.primary}15`,
                            borderRight: `3px solid ${color.primary}`,
                          }
                        }}
                      >
                        <ListItemIcon><ConeanfoIcon sx={{ fontSize: 20 }} /></ListItemIcon>
                        <ListItemText primary="CONEANFO" />
                      </ListItemButton>
                    )}
                  </List>
                </Collapse>
              )}
            </>
          )}
        </List>

        {/* Footer del drawer */}
        {open && (
          <Box sx={{ p: 2, borderTop: 1, borderColor: `${color.primary}20`, mt: 'auto', textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: color.contrastText }}>
              SIIE - Sistema Integrado de Información Educativa
            </Typography>
          </Box>
        )}
      </Drawer>

      {/* Menú flotante para Administración */}
      <Menu
        anchorEl={adminAnchorEl}
        open={Boolean(adminAnchorEl) && !open}
        onClose={handleAdminClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: -2,
            ml: 1,
            minWidth: 220,
            boxShadow: 3,
            borderLeft: `3px solid ${color.primary}`,
          }
        }}
      >
        <MenuItem sx={{ fontWeight: 'bold', color: color.primary, backgroundColor: `${color.primary}08`, pointerEvents: 'none' }}>
          <AdminIcon sx={{ mr: 1, color: color.primary }} /> Administración
        </MenuItem>
        <Divider />
        {tienePermiso(6) && (
          <MenuItem 
            component={NavLink} 
            to="/Dashboard/Administracion/Usuarios"
            onClick={handleAdminClose}
            sx={{ '&:hover': { backgroundColor: `${color.primary}10` } }}
          >
            <UsersIcon sx={{ mr: 1, fontSize: 20, color: color.primary }} /> Usuarios
          </MenuItem>
        )}
        {tienePermiso(5) && (
          <MenuItem 
            component={NavLink} 
            to="/Dashboard/Administracion/RolesyPermisos"
            onClick={handleAdminClose}
            sx={{ '&:hover': { backgroundColor: `${color.primary}10` } }}
          >
            <RolesIcon sx={{ mr: 1, fontSize: 20, color: color.primary }} /> Roles y Permisos
          </MenuItem>
        )}
      </Menu>

      {/* Menú flotante para Descargas */}
      <Menu
        anchorEl={descargasAnchorEl}
        open={Boolean(descargasAnchorEl) && !open}
        onClose={handleDescargasClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        PaperProps={{
          sx: {
            mt: -2,
            ml: 1,
            minWidth: 220,
            boxShadow: 3,
            borderLeft: `3px solid ${color.primary}`,
          }
        }}
      >
        <MenuItem sx={{ fontWeight: 'bold', color: color.primary, backgroundColor: `${color.primary}08`, pointerEvents: 'none' }}>
          <DownloadIcon sx={{ mr: 1, color: color.primary }} /> Descargas
        </MenuItem>
        <Divider />
        {tienePermiso(1) && (
          <MenuItem 
            component={NavLink} 
            to="/Dashboard/Descargas/SEDU"
            onClick={handleDescargasClose}
            sx={{ '&:hover': { backgroundColor: `${color.primary}10` } }}
          >
            <SeduIcon sx={{ mr: 1, fontSize: 20, color: color.primary }} /> SEDUC
          </MenuItem>
        )}
        {tienePermiso(2) && (
          <MenuItem 
            component={NavLink} 
            to="/Dashboard/Descargas/INFOP"
            onClick={handleDescargasClose}
            sx={{ '&:hover': { backgroundColor: `${color.primary}10` } }}
          >
            <InfopIcon sx={{ mr: 1, fontSize: 20, color: color.primary }} /> INFOP
          </MenuItem>
        )}
        {tienePermiso(3) && (
          <MenuItem 
            component={NavLink} 
            to="/Dashboard/Descargas/CONEANFO"
            onClick={handleDescargasClose}
            sx={{ '&:hover': { backgroundColor: `${color.primary}10` } }}
          >
            <ConeanfoIcon sx={{ mr: 1, fontSize: 20, color: color.primary }} /> CONEANFO
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

export default DrawerMenu;