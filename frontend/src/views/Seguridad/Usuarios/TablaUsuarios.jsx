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

import ModalUsuario from "./Usuarios"; // Modal unificado
import { useUser } from "../../../components/UserContext";


import color from "../../../components/color";

export default function TablaUsuarios() {

  const { permissions } = useUser();
  const [rows, setRows] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  const [isSaved, setIsSaved] = useState(false); // Para refrescar tabla al guardar

  // Obtener usuarios
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/usuarios`)
      .then((res) => setRows(res.data))
      .catch((err) => console.error("Error al obtener usuarios:", err));
  }, [isSaved]);

  // Permisos
  const tienePermiso = (idmodulo) => {
    const permiso = permissions?.find((p) => p.idmodulo === idmodulo);
    return permiso?.actualizar === true;
  };

  const tienePermisoIn = (idmodulo) => {
    const permiso = permissions?.find((p) => p.idmodulo === idmodulo);
    return permiso?.insertar === true;
  };

  // Resetear contraseña
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
            <IconButton
              sx={{ color: color.white }}
              onClick={(e) => {
                e.stopPropagation();
                setUsuarioSeleccionado(row.id);
                setOpenModal(true);
              }}
            >
              <EditOutlinedIcon />
            </IconButton>
          )}
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
        <span style={{ color: row.estado === "Activo" ? "green" : "red" }}>
          {row.estado}
        </span>
      ),
    },
  ];

  return (
    <Paper sx={{ padding: 3, marginBottom: 3 }}>
      <Typography variant="h3" sx={{ fontWeight: "bold", color: color.white, mb: 2 }}>
        Usuarios
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "flex-end", marginBottom: 2 }}>
        {tienePermisoIn(6) && (
          <Button
            variant="contained"
            sx={{ backgroundColor: color.white }}
            startIcon={<AddIcon />}
            onClick={() => {
              setUsuarioSeleccionado(null); // null = crear
              setOpenModal(true);
            }}
          >
            Nuevo
          </Button>
        )}
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.field} sx={{ fontWeight: "bold", width: col.width }}>
                  {col.headerName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.length > 0 ? (
              rows.map((row) => (
                <TableRow key={row.id}>
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

      {/* Modal Crear / Editar */}
      <ModalUsuario
        open={openModal}
        onClose={() => setOpenModal(false)}
        usuarioId={usuarioSeleccionado} // null = crear
        onSaved={() => {
          setIsSaved(!isSaved); // refresca tabla
          setOpenModal(false);
        }}
      />
    </Paper>
  );
}
