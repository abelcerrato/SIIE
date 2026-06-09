import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Paper,
  Box,
  Button,
  IconButton,
  Tooltip,
} from "@mui/material";

import { EditOutlined as EditOutlinedIcon, Add as AddIcon } from "@mui/icons-material";

import ModalUsuario from "./Usuarios";
import { useUser } from "../../../components/UserContext";
import color from "../../../components/color";

export default function TablaUsuarios() {

  const { permissions } = useUser();
  const [rows, setRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/usuarios`)
      .then((res) => setRows(res.data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, [isSaved]);

  const tienePermiso = (idmodulo) => {
    const permiso = permissions?.find((p) => p.idmodulo === idmodulo);
    return permiso?.actualizar === true;
  };

  const tienePermisoIn = (idmodulo) => {
    const permiso = permissions?.find((p) => p.idmodulo === idmodulo);
    return permiso?.insertar === true;
  };

  const handleResetearContra = async (usuario) => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/resetearContra/${usuario}`);
      Swal.fire({
        title: "Contraseña actualizada",
        text: "Se ha restablecido la contraseña al número de identidad del usuario.",
        icon: "success",
        timer: 4000,
      });
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
    }
  };

  const columns = [
    {
      field: "actions",
      headerName: "Acciones",
      width: 120,
      renderCell: (row) => (
        <>
          {tienePermiso(6) && (
            <Tooltip title="Editar Usuario">
              <IconButton
                sx={{ 
                  color: color.primary,
                  "&:hover": { backgroundColor: `${color.primary}15` }
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setUsuarioSeleccionado(row.id);
                  setOpenModal(true);
                }}
              >
                <EditOutlinedIcon />
              </IconButton>
            </Tooltip>
          )}
          {/* <Tooltip title="Restablecer Contraseña">
            <IconButton
              sx={{ 
                color: color.secondary,
                "&:hover": { backgroundColor: `${color.secondary}15` }
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleResetearContra(row.usuario);
              }}
            >
              <VpnKeyOutlinedIcon />
            </IconButton>
          </Tooltip> */}
        </>
      ),
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "nombre", headerName: "Nombre", width: 180 },
    { field: "correo", headerName: "Correo Electrónico", width: 250 },
    { field: "usuario", headerName: "Usuario", width: 150 },
    {
      field: "rol",
      headerName: "Rol",
      width: 120,
      renderCell: (row) => row.rol || "Sin rol",
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,
      renderCell: (row) => (
        <span style={{ color: row.estado === "Activo" ? "#4caf50" : "#f44336", fontWeight: "bold" }}>
          {row.estado}
        </span>
      ),
    },
  ];

  return (
    <Paper sx={{ 
      p: 3, 
      backgroundColor: "#f5f7fa", 
      borderRadius: 2, 
      boxShadow: "0px 4px 20px rgba(0,0,0,0.08)" 
    }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: color.primary, mb: 2 }}>
        Usuarios
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        {tienePermisoIn(6) && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ 
              backgroundColor: color.primary,
              color: color.white,
              "&:hover": { backgroundColor: color.primary + "CC" }
            }}
            onClick={() => {
              setUsuarioSeleccionado(null);
              setOpenModal(true);
            }}
          >
            Nuevo Usuario
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: color.primary }}>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ fontWeight: "bold", color: color.white, width: col.width }}>
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id} hover>
                  {columns.map((col) => (
                    <TableCell key={col.field}>
                      {col.renderCell ? col.renderCell(row) : row[col.field] ?? ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No hay datos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ModalUsuario
        open={openModal}
        onClose={() => setOpenModal(false)}
        usuarioId={usuarioSeleccionado}
        onSaved={() => {
          setIsSaved(!isSaved);
          setOpenModal(false);
        }}
      />
    </Paper>
  );
}