import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


import {
  Paper, Box, Typography,
  Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  Collapse, IconButton, Button
} from '@mui/material';
import {
  KeyboardArrowDown, KeyboardArrowUp,
  Add as AddIcon, Edit as EditOutlined
} from '@mui/icons-material';
import { useUser } from '../../../components/UserContext';


const RolesTable = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const { permissions } = useUser();
 


  // Obtener datos de roles
  useEffect(() => {
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
    fetchRoles();
  }, []);

  // Alternar expansión de fila
  const toggleExpand = (idrol) => {
    setRoles(roles.map(role =>
      role.idrol === idrol
        ? { ...role, isExpanded: !role.isExpanded }
        : role
    ));
  };


  // Verifica si tiene permiso de actualizar en un módulo
  const tienePermiso = (idmodulo) => {
    const permiso = permissions?.find(p => p.idmodulo === idmodulo);
    return permiso?.actualizar === true;
  };

  // Verifica si tiene permiso de insertar en un módulo
  const tienePermisoIn = (idmodulo) => {
    const permiso = permissions?.find(p => p.idmodulo === idmodulo);
    return permiso?.insertar === true;
  };



  // Columnas de la tabla
  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      renderCell: (params) => (
        <>
          {tienePermiso(5) && (
            <IconButton
              sx={{ color: "#88CFE0" }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/Dashboard/Seguridad/ModificarRolyPermisos/${params.row.idrol}`);
              }}
            >
              <EditOutlined />
            </IconButton>
          )}
          <IconButton
            size="small"
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
        <span style={{ color: params.row.estado ? 'green' : 'red' }}>
          {params.row.estado ? "Activo" : "Inactivo"}
        </span>
      )
    },
    { field: "creadopor", headerName: "Creado por", width: 150 },
  ];

  // Componente de fila personalizada
  const CustomRow = ({ row }) => {
    return (
      <>
        <TableRow>
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
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom>
                  Permisos
                </Typography>
                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#88CFE0" }}>

                        <TableCell sx={{ color: 'white' }}>Módulo</TableCell>
                        <TableCell sx={{ color: 'white' }} align="center">Consultar</TableCell>
                        <TableCell sx={{ color: 'white' }} align="center">Insertar</TableCell>
                        <TableCell sx={{ color: 'white' }} align="center">Actualizar</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.permisos?.map((permiso, index) => (
                        <TableRow key={index}>

                          <TableCell>{permiso.modulo}</TableCell>
                          <TableCell align="center">
                            <span style={{ color: permiso.consultar ? 'green' : 'red' }}>
                              {permiso.consultar ? "SI" : "NO"}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <span style={{ color: permiso.insertar ? 'green' : 'red' }}>
                              {permiso.insertar ? "SI" : "NO"}
                            </span>
                          </TableCell>
                          <TableCell align="center">
                            <span style={{ color: permiso.actualizar ? 'green' : 'red' }}>
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
  };

  return (

    <Box component={Paper} sx={{ p: 5 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h3" component="h2" sx={{ fontWeight: 'bold', color: "#88CFE0" }}>
          Roles y Permisos
        </Typography>

        {tienePermisoIn(5) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/Dashboard/Seguridad/CrearRolyPermisos')}
            sx={{ backgroundColor: "#88CFE0" }}
          >
            Nuevo
          </Button>
        )}
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field} sx={{ fontWeight: 'bold' }}>
                  {column.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {roles.map((row) => (
              <CustomRow key={row.idrol} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

  );
};

export default RolesTable;