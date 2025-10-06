import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";
import { useUser } from "../../../components/UserContext";

export default function ModalUsuario({ open, onClose, usuarioId, onSaved }) {
  const { user } = useUser();
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    correo: "",
    contraseña: "",
    idrol: "",
    estado: "Nuevo",
    creadopor: user.id,
  });

  // Obtener roles
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/roles`).then((res) => setRoles(res.data));
  }, []);

  // Si es edición, traer datos del usuario
  useEffect(() => {
    if (usuarioId) {
      axios.get(`${process.env.REACT_APP_API_URL}/usuario/${usuarioId}`)
        .then((res) => setFormData(res.data))
        .catch((err) => console.error("Error al obtener usuario:", err));
    } else {
      // resetear para creación
      setFormData({
        nombre: "",
        usuario: "",
        correo: "",
        contraseña: "",
        idrol: "",
        estado: "Nuevo",
        creadopor: user.id,
      });
    }
  }, [usuarioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (usuarioId) {
        // Editar
        await axios.put(`${process.env.REACT_APP_API_URL}/usuario/${usuarioId}`, formData);
        Swal.fire("¡Actualizado!", "Usuario actualizado correctamente.", "success");
      } else {
        // Crear
        await axios.post(`${process.env.REACT_APP_API_URL}/usuario`, formData);
        Swal.fire("¡Creado!", "Usuario creado correctamente.", "success");
      }
      onSaved(); // refresca tabla y cierra modal
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container justifyContent="space-between">
          {usuarioId ? "Editar Usuario" : "Nuevo Usuario"}
          <Button
            onClick={onClose}
            sx={{ color: "red", minWidth: "auto" }}
            startIcon={<CloseIcon />}
          >
          </Button>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ sx: 12, md: 6 }}>
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          <Grid size={{ sx: 12, md: 6 }}>
            <TextField
              label="Correo"
              name="correo"
              value={formData.correo || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ sx: 12, md: 6 }}>
            <TextField
              label="Usuario"
              name="usuario"
              value={formData.usuario || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ sx: 12, md: 6 }}>
            <TextField
              label="Contraseña"
              name="contraseña"
              type="password"
              value={formData.contraseña || ""}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid size={{ sx: 12, md: 6 }}>

            <FormControl fullWidth>
              <InputLabel>Rol</InputLabel>
              <Select
                label="Rol"
                name="idrol"
                value={formData.idrol || ""}
                onChange={handleChange}>
                <MenuItem value="">Seleccionar rol</MenuItem>
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>{r.rol}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ sx: 12, md: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                name="estado"
                value={formData.estado || "Nuevo"}
                onChange={handleChange}>
                <MenuItem value="">Seleccionar estado</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>

        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ backgroundColor: "#88CFE0" }}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
