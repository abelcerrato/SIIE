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
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Swal from "sweetalert2";
import axios from "axios";
import { useUser } from "../../../components/UserContext";
import color from "../../../components/color";

export default function ModalRol({ open, onClose, rolId, onSaved }) {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    rol: "",
    descripcion: "",
    estado: true,
    permisos: [],
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

  useEffect(() => {
    const fetchModulos = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/modulos`);

        if (!rolId) {
          setFormData((prev) => ({
            ...prev,
            permisos: res.data.map((modulo) => ({
              idmodulo: modulo.id,
              modulo: modulo.modulo,
              consultar: false,
              insertar: false,
              actualizar: false,
            })),
          }));
        }
      } catch (err) {
        console.error("Error al obtener módulos:", err);
      }
    };
    fetchModulos();
  }, [rolId]);

  useEffect(() => {
    const initForm = async () => {
      if (!user) return;
      if (rolId) {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/permiso/${rolId}`);
          const permissionsArray = res.data;

          if (permissionsArray.length > 0) {
            const firstPermission = permissionsArray[0];

            const modulosMap = new Map();
            permissionsArray.forEach((permiso) => {
              if (!modulosMap.has(permiso.idmodulo)) {
                modulosMap.set(permiso.idmodulo, {
                  id: permiso.idmodulo,
                  modulo: permiso.modulo,
                });
              }
            });

            const permisosPorModulo = Array.from(modulosMap.values()).map((modulo) => {
              const permisosDelModulo = permissionsArray.filter(p => p.idmodulo === modulo.id);
              return {
                idmodulo: modulo.id,
                modulo: modulo.modulo,
                consultar: permisosDelModulo.some(p => p.consultar),
                insertar: permisosDelModulo.some(p => p.insertar),
                actualizar: permisosDelModulo.some(p => p.actualizar),
              };
            });

            setFormData({
              rol: firstPermission.rol,
              descripcion: firstPermission.descripcion || "",
              estado: firstPermission.estado,
              permisos: permisosPorModulo,
            });
          }
        } catch (err) {
          console.error("Error al obtener rol:", err);
        }
      } else {
        try {
          const res = await axios.get(`${process.env.REACT_APP_API_URL}/modulos`);
          setFormData({
            rol: "",
            descripcion: "",
            estado: true,
            permisos: res.data.map((modulo) => ({
              idmodulo: modulo.id,
              modulo: modulo.modulo,
              consultar: false,
              insertar: false,
              actualizar: false,
            })),
          });
        } catch (err) {
          console.error("Error al obtener módulos:", err);
        }
      }
    };

    initForm();
  }, [rolId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePermissionChange = (idmodulo, tipo) => {
    setFormData((prev) => {
      const updated = prev.permisos.map((p) => {
        if (p.idmodulo === idmodulo) {
          if (tipo === "consultar" && (p.insertar || p.actualizar)) return p;
          const newValue = !p[tipo];
          if ((tipo === "insertar" || tipo === "actualizar") && newValue && !p.consultar) {
            return { ...p, [tipo]: newValue, consultar: true };
          }
          return { ...p, [tipo]: newValue };
        }
        return p;
      });
      return { ...prev, permisos: updated };
    });
  };

  const handleToggleModule = (idmodulo) => {
    setFormData((prev) => {
      const updated = prev.permisos.map((p) => {
        if (p.idmodulo === idmodulo) {
          const shouldActivate = !(p.consultar && p.insertar && p.actualizar);
          return { ...p, consultar: shouldActivate, insertar: shouldActivate, actualizar: shouldActivate };
        }
        return p;
      });
      return { ...prev, permisos: updated };
    });
  };

  const allPermissionsActive = () => formData.permisos.every(p => p.consultar && p.insertar && p.actualizar);
  const allPermissionsOfTypeActive = (type) => formData.permisos.every(p => p[type]);

  const handleToggleAllPermissions = () => {
    const shouldActivate = !allPermissionsActive();
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.map(p => ({ ...p, consultar: shouldActivate, insertar: shouldActivate, actualizar: shouldActivate })),
    }));
  };

  const handleTogglePermissionType = (tipo) => {
    const shouldActivate = !allPermissionsOfTypeActive(tipo);
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.map(p => {
        if ((tipo === "insertar" || tipo === "actualizar") && shouldActivate) return { ...p, [tipo]: true, consultar: true };
        if (tipo === "consultar" && !shouldActivate && (p.insertar || p.actualizar)) return p;
        return { ...p, [tipo]: shouldActivate };
      }),
    }));
  };

  const handleSave = async () => {
    try {
      const permisosFormateados = formData.permisos.reduce((acc, p) => {
        acc[p.idmodulo] = { consultar: p.consultar, insertar: p.insertar, actualizar: p.actualizar };
        return acc;
      }, {});

      const dataToSend = {
        rol: formData.rol,
        descripcion: formData.descripcion,
        estado: formData.estado,
        permisos: permisosFormateados,
        ...(rolId ? { modificadopor: user?.id || 0, idrol: rolId } : { creadopor: user?.id || 0 }),
      };

      if (rolId) {
        await axios.put(`${process.env.REACT_APP_API_URL}/permisos`, dataToSend);
        Swal.fire("¡Actualizado!", "Rol actualizado correctamente.", "success");
      } else {
        await axios.post(`${process.env.REACT_APP_API_URL}/permisos`, dataToSend);
        Swal.fire("¡Creado!", "Rol creado correctamente.", "success");
      }

      onSaved();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Ocurrió un error al guardar", "error");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ backgroundColor: color.primary, color: color.white }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {rolId ? "Editar Rol" : "Nuevo Rol"}
          </Typography>
          <Button onClick={onClose} sx={{ color: color.white, minWidth: "auto" }} startIcon={<CloseIcon />} />
        </Grid>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, md: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField 
                  label="Rol" 
                  name="rol" 
                  value={formData.rol} 
                  onChange={handleChange} 
                  fullWidth 
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: color.primary },
                      "&.Mui-focused fieldset": { borderColor: color.primary }
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <TextField 
                  label="Descripción" 
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleChange} 
                  fullWidth
                  multiline
                  rows={3}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&:hover fieldset": { borderColor: color.primary },
                      "&.Mui-focused fieldset": { borderColor: color.primary }
                    }
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 12 }}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: color.contrastText }}>Estado</InputLabel>
                  <Select 
                    label="Estado" 
                    name="estado" 
                    value={formData.estado} 
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": { borderColor: color.primary },
                        "&.Mui-focused fieldset": { borderColor: color.primary }
                      }
                    }}
                  >
                    <MenuItem value={true}>Activo</MenuItem>
                    <MenuItem value={false}>Inactivo</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button 
                variant="outlined" 
                onClick={handleToggleAllPermissions} 
                startIcon={allPermissionsActive() ? <CancelIcon /> : <CheckCircleIcon />} 
                sx={{ 
                  borderColor: allPermissionsActive() ? color.secondary : color.primary,
                  color: allPermissionsActive() ? color.secondary : color.primary,
                  "&:hover": { 
                    backgroundColor: allPermissionsActive() ? `${color.secondary}15` : `${color.primary}15`,
                    borderColor: allPermissionsActive() ? color.secondary : color.primary
                  }
                }}
              >
                {allPermissionsActive() ? "Desactivar Todos" : "Activar Todos"}
              </Button>
              {["consultar", "insertar", "actualizar"].map(tipo => (
                <Button 
                  key={tipo} 
                  variant="outlined" 
                  onClick={() => handleTogglePermissionType(tipo)} 
                  startIcon={allPermissionsOfTypeActive(tipo) ? <CancelIcon /> : <CheckCircleIcon />} 
                  sx={{ 
                    borderColor: allPermissionsOfTypeActive(tipo) ? color.secondary : color.primary,
                    color: allPermissionsOfTypeActive(tipo) ? color.secondary : color.primary,
                    "&:hover": { 
                      backgroundColor: allPermissionsOfTypeActive(tipo) ? `${color.secondary}15` : `${color.primary}15`,
                      borderColor: allPermissionsOfTypeActive(tipo) ? color.secondary : color.primary
                    }
                  }}
                >
                  {allPermissionsOfTypeActive(tipo) ? `Desactivar ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}` : `Activar ${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`}
                </Button>
              ))}
            </Box>

            <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: color.primary }}>
                    <TableCell sx={{ fontWeight: "bold", color: color.white }}>Módulo</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: color.white }}>Todo</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: color.white }}>Consultar</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: color.white }}>Insertar</TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: color.white }}>Actualizar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formData.permisos.map((permiso) => {
                    const allModuleActive = permiso.consultar && permiso.insertar && permiso.actualizar;
                    return (
                      <TableRow key={permiso.idmodulo} hover>
                        <TableCell>{permiso.modulo}</TableCell>
                        <TableCell align="center">
                          <Checkbox 
                            checked={allModuleActive} 
                            onChange={() => handleToggleModule(permiso.idmodulo)} 
                            sx={{ 
                              "&.Mui-checked": { color: color.primary },
                              "&:hover": { backgroundColor: `${color.primary}15` }
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox 
                            checked={permiso.consultar} 
                            onChange={() => handlePermissionChange(permiso.idmodulo, "consultar")} 
                            disabled={permiso.insertar || permiso.actualizar}
                            sx={{ 
                              "&.Mui-checked": { color: color.primary },
                              "&:hover": { backgroundColor: `${color.primary}15` }
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox 
                            checked={permiso.insertar} 
                            onChange={() => handlePermissionChange(permiso.idmodulo, "insertar")} 
                            sx={{ 
                              "&.Mui-checked": { color: color.primary },
                              "&:hover": { backgroundColor: `${color.primary}15` }
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Checkbox 
                            checked={permiso.actualizar} 
                            onChange={() => handlePermissionChange(permiso.idmodulo, "actualizar")} 
                            sx={{ 
                              "&.Mui-checked": { color: color.primary },
                              "&:hover": { backgroundColor: `${color.primary}15` }
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<SaveIcon />} 
          onClick={handleSave} 
          sx={{ 
            backgroundColor: color.primary, 
            color: color.white,
            "&:hover": { backgroundColor: color.primary + "CC" }
          }}
        >
          Guardar
        </Button>
        <Button 
          variant="outlined" 
          onClick={onClose} 
          sx={{ 
            borderColor: color.secondary, 
            color: color.secondary,
            "&:hover": { backgroundColor: `${color.secondary}15`, borderColor: color.secondary }
          }}
        >
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
}