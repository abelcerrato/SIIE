import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Paper, Box, Typography,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Collapse, IconButton, Button
} from '@mui/material';
import {
  EditOutlined as EditOutlinedIcon,
  KeyboardArrowDown, KeyboardArrowUp,
  Add as AddIcon,
} from "@mui/icons-material";
import { useUser } from '../../../components/UserContext';
import ModalRol from './RolyPermisos';
import color from "../../../components/color";

const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const { permissions } = useUser();

  const [openModal, setOpenModal] = useState(false);
  const [rolId, setRolId] = useState(null);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/permisos`);
      setRoles(response.data.map(role => ({
        ...role,
        isExpanded: false
      })));
    } catch (error) {
      console.error("Error al obtener roles", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const toggleExpand = (idrol) => {
    setRoles(roles.map(role =>
      role.idrol === idrol
        ? { ...role, isExpanded: !role.isExpanded }
        : role
    ));
  };

  const tienePermiso = (idmodulo) => permissions?.find(p => p.idmodulo === idmodulo)?.actualizar;
  const tienePermisoIn = (idmodulo) => permissions?.find(p => p.idmodulo === idmodulo)?.insertar;

  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => (
        <>
          {tienePermiso(5) && (
            <IconButton
              sx={{ 
                color: color.primary,
                "&:hover": { backgroundColor: `${color.primary}15` }
              }}
              onClick={(e) => {
                e.stopPropagation();
                setRolId(params.row.idrol);
                setOpenModal(true);
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          )}
          <IconButton
            size="small"
            sx={{ 
              color: color.contrastText,
              "&:hover": { backgroundColor: `${color.primary}15` }
            }}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(params.row.idrol);
            }}
          >
            {params.row.isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </>
      )
    },
    { field: "idrol", headerName: "ID", width: 70 },
    { field: "rol", headerName: "Perfil", width: 180 },
    { field: "descripcion", headerName: "Descripción", width: 300 },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,
      renderCell: (params) => (
        <span style={{ color: params.row.estado ? '#4caf50' : '#f44336', fontWeight: 'bold' }}>
          {params.row.estado ? "Activo" : "Inactivo"}
        </span>
      )
    },
    { field: "creadopor", headerName: "Creado por", width: 150 },
  ];

  const CustomRow = ({ row }) => (
    <>
      <TableRow hover>
        {columns.map((column) => {
          const value = row[column.field];
          return (
            <TableCell key={column.field}>
              {column.renderCell ? column.renderCell({ row, value }) : value}
            </TableCell>
          );
        })}
      </TableRow>
      <TableRow>
        <TableCell style={{ padding: 0 }} colSpan={columns.length}>
          <Collapse in={row.isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2, p: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ color: color.primary, fontWeight: "bold" }}>
                Permisos
              </Typography>
              <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ backgroundColor: color.primary }}>
                      <TableCell sx={{ color: color.white, fontWeight: "bold" }}>Módulo</TableCell>
                      <TableCell sx={{ color: color.white, fontWeight: "bold" }} align="center">Consultar</TableCell>
                      <TableCell sx={{ color: color.white, fontWeight: "bold" }} align="center">Insertar</TableCell>
                      <TableCell sx={{ color: color.white, fontWeight: "bold" }} align="center">Actualizar</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.permisos?.map((permiso, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{permiso.modulo}</TableCell>
                        <TableCell align="center">
                          <span style={{ 
                            color: permiso.consultar ? '#4caf50' : '#f44336', 
                            fontWeight: "bold" 
                          }}>
                            {permiso.consultar ? "SI" : "NO"}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <span style={{ 
                            color: permiso.insertar ? '#4caf50' : '#f44336', 
                            fontWeight: "bold" 
                          }}>
                            {permiso.insertar ? "SI" : "NO"}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <span style={{ 
                            color: permiso.actualizar ? '#4caf50' : '#f44336', 
                            fontWeight: "bold" 
                          }}>
                            {permiso.actualizar ? "SI" : "NO"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );

  return (
    <Box component={Paper} sx={{ p: 3, backgroundColor: "#f5f7fa", borderRadius: 2, boxShadow: "0px 4px 20px rgba(0,0,0,0.08)" }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: color.primary }}>
          Roles y Permisos
        </Typography>
        {tienePermisoIn(5) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              backgroundColor: color.primary,
              color: color.white,
              "&:hover": { backgroundColor: color.primary + "CC" }
            }}
            onClick={() => { setRolId(null); setOpenModal(true); }}
          >
            Nuevo Rol
          </Button>
        )}
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: color.primary }}>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ fontWeight: 'bold', color: color.white }}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((row) => <CustomRow key={row.idrol} row={row} />)}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalRol
        open={openModal}
        onClose={() => setOpenModal(false)}
        rolId={rolId}
        onSaved={() => { setOpenModal(false); fetchRoles(); }}
      />
    </Box>
  );
};

export default RolesTable;