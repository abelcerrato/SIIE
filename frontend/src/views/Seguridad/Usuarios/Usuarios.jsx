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
  FormHelperText,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";
import { useUser } from "../../../components/UserContext";

export default function ModalUsuario({ open, onClose, usuarioId, onSaved }) {
  const { user } = useUser();
  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nombre: "",
    usuario: "",
    correo: "",
    contraseña: "",
    idrol: "",
    estado: "",
    creadopor: user?.id || 0,
    modificadopor: user?.id || 0,
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        creadopor: user.id,
        modificadopor: user.id,
      }));
    }
  }, [user]);



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
        estado: "",
        creadopor: user?.id || 0,
        modificadopor: user?.id || 0,
      });
    }
  }, [usuarioId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleResetearContra = async (usuario) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/resetearContra/${usuario}`
      );

      Swal.fire({
        title: "Contraseña Actualizada",
        text: "La contraseña ha sido actualizada exitosamente al número de identidad del usuario.",
        icon: "success",
        timer: 6000,
      });
    } catch (error) {
      console.error("Error al restablecer la contraseña:", error);
    }
  };

  
  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre?.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.usuario?.trim()) newErrors.usuario = "El usuario es obligatorio";

    if (!formData.correo?.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio";
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido";
    }

    if (!formData.contraseña?.trim() && !usuarioId)
      newErrors.contraseña = "La contraseña es obligatoria";

    if (!formData.idrol) newErrors.idrol = "El rol es obligatorio";
    if (!formData.estado) newErrors.estado = "El estado es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSave = async () => {
    // Validar antes de enviar
    if (!validateForm()) {
      return;
    }

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
          <Grid size={{ sx: 12, md: 6 }}>
            {usuarioId ? "Editar Usuario" : "Nuevo Usuario"}
          </Grid>
          <Grid
            size={{ sx: 12, md: 6 }}
            sx={{ display: 'flex', justifyContent: 'flex-end' }}
          >
            <IconButton aria-label="delete" onClick={onClose} color="error">
              <CloseIcon />
            </IconButton>
          </Grid>
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
              error={!!errors.nombre}
              helperText={errors.nombre}
              required
              fullWidth
            />
          </Grid>

          <Grid size={{ sx: 12, md: 6 }}>
            <TextField
              label="Correo Electrónico"
              name="correo"
              value={formData.correo || ""}
              onChange={handleChange}
              error={!!errors.correo}
              helperText={errors.correo}
              required
              fullWidth
            />
          </Grid>
          <Grid size={{ sx: 12, md: 6 }}>
            <TextField
              label="Usuario"
              name="usuario"
              value={formData.usuario || ""}
              onChange={handleChange}
              error={!!errors.usuario}
              helperText={errors.usuario}
              required
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
              error={!!errors.contraseña}
              helperText={errors.contraseña}
              required
              fullWidth
            />
          </Grid>
          <Grid size={{ sx: 12, md: 6 }}>

            <FormControl fullWidth error={!!errors.idrol}>
              <InputLabel>Rol</InputLabel>
              <Select
                label="Rol"
                name="idrol"
                value={formData.idrol || ""}
                onChange={handleChange}
                required
              >
                <MenuItem value="">Seleccionar rol</MenuItem>
                {roles.map((r) => (
                  <MenuItem key={r.id} value={r.id}>{r.rol}</MenuItem>
                ))}
              </Select>
              {errors.idrol && <FormHelperText>{errors.idrol}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid size={{ sx: 12, md: 6 }}>
            <FormControl fullWidth error={!!errors.estado}>
              <InputLabel>Estado</InputLabel>
              <Select
                label="Estado"
                name="estado"
                value={formData.estado || ""}
                onChange={handleChange}>
                <MenuItem value="">Seleccionar estado</MenuItem>
                <MenuItem value="Activo">Activo</MenuItem>
                <MenuItem value="Inactivo">Inactivo</MenuItem>
              </Select>
              {errors.estado && <FormHelperText>{errors.estado}</FormHelperText>}
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
