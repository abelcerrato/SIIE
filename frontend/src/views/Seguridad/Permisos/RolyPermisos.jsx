import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../components/UserContext";
import Dashboard from "../../../components/Layout";
import {
  Paper,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const CreateRole = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [modulos, setModulos] = useState([]);
  const [formData, setFormData] = useState({
    rol: "",
    descripcion: "",
    estado: true,
    permisos: [],
  });

  // Obtener módulos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const modulosRes = await axios.get(`${process.env.REACT_APP_API_URL}/modulos`);
        setModulos(modulosRes.data);

        // Inicializar permisos para cada módulo
        setFormData((prev) => ({
          ...prev,
          permisos: modulosRes.data.map((modulo) => ({
            idmodulo: modulo.id,
            modulo: modulo.modulo,
            consultar: false,
            insertar: false,
            actualizar: false,
          })),
        }));
      } catch (error) {
        console.error("Error al obtener módulos", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Formatear permisos para el backend
      const permisosFormateados = formData.permisos.reduce((acc, permiso) => {
        acc[permiso.idmodulo] = {
          consultar: permiso.consultar,
          insertar: permiso.insertar,
          actualizar: permiso.actualizar,
        };
        return acc;
      }, {});

      const dataToSend = {
        rol: formData.rol,
        descripcion: formData.descripcion,
        estado: formData.estado,
        permisos: permisosFormateados,
        creadopor: user.id,
      };

      await axios.post(`${process.env.REACT_APP_API_URL}/permisos`, dataToSend);

      Swal.fire({
        title: "¡Registro!",
        text: "El rol ha sido registrado correctamente",
        icon: "success",
        confirmButtonColor: "#88CFE0",
      }).then(() => {
        navigate("/Dashboard/Seguridad");
      });
    } catch (error) {
      console.error("Error al crear rol", error);
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Ocurrió un error al crear el rol",
        icon: "error",
        confirmButtonColor: "#88CFE0",
      });
    }
  };

  // Manejar cambios en los permisos de cada módulo
  const handlePermissionChange = (idmodulo, tipo) => {
    setFormData((prev) => {
      const updatedPermisos = prev.permisos.map((permiso) => {
        if (permiso.idmodulo === idmodulo) {
          // Si intentan desactivar "consultar" pero "insertar" o "actualizar" están activos, no permitirlo
          if (
            tipo === "consultar" &&
            (permiso.insertar || permiso.actualizar)
          ) {
            return permiso; // No hacer cambios
          }

          const newValue = !permiso[tipo];

          // Si activan "insertar" o "actualizar", activar también "consultar" (si no lo está)
          if (
            (tipo === "insertar" || tipo === "actualizar") &&
            newValue &&
            !permiso.consultar
          ) {
            return {
              ...permiso,
              [tipo]: newValue,
              consultar: true, // Forzar activación de consultar
            };
          }

          // Cambio normal del permiso
          return {
            ...permiso,
            [tipo]: newValue,
          };
        }
        return permiso;
      });

      return { ...prev, permisos: updatedPermisos };
    });
  };

  // Activar/desactivar todo el módulo
  // Activar/desactivar todo el módulo
  const handleToggleModule = (idmodulo) => {
    setFormData((prev) => {
      const updatedPermisos = prev.permisos.map((permiso) => {
        if (permiso.idmodulo === idmodulo) {
          const shouldActivate = !(permiso.consultar && permiso.insertar && permiso.actualizar);
          return {
            ...permiso,
            consultar: shouldActivate,
            insertar: shouldActivate,
            actualizar: shouldActivate,
          };
        }
        return permiso;
      });

      return { ...prev, permisos: updatedPermisos };
    });
  };

  // Verifica si todos los permisos están activos
  const allPermissionsActive = () => {
    return (
      formData.permisos.length > 0 &&
      formData.permisos.every((p) => p.consultar && p.insertar && p.actualizar)
    );
  };

  // Verifica si todos los permisos de un tipo están activos
  const allPermissionsOfTypeActive = (type) => {
    return (
      formData.permisos.length > 0 && formData.permisos.every((p) => p[type])
    );
  };

  // Funciones toggle actualizadas
  const handleToggleAllPermissions = () => {
    const shouldActivate = !allPermissionsActive();
    setFormData((prev) => ({
      ...prev,
      permisos: prev.permisos.map((permiso) => ({
        ...permiso,
        consultar: shouldActivate,
        insertar: shouldActivate,
        actualizar: shouldActivate,
      })),
    }));
  };

  const handleTogglePermissionType = (tipo) => {
    setFormData((prev) => {
      const shouldActivate = !allPermissionsOfTypeActive(tipo);

      // Validación para evitar desactivar consultar si hay insertar/actualizar activos en cualquier módulo
      if (tipo === "consultar" && !shouldActivate) {
        const hasInsertOrUpdate = prev.permisos.some(
          (p) => p.insertar || p.actualizar
        );
        if (hasInsertOrUpdate) {
          return prev;
        }
      }

      return {
        ...prev,
        permisos: prev.permisos.map((permiso) => {
          // Si estamos activando insertar/actualizar, forzar consultar=true
          if (
            (tipo === "insertar" || tipo === "actualizar") &&
            shouldActivate
          ) {
            return {
              ...permiso,
              [tipo]: true,
              consultar: true,
            };
          }

          // Cambio normal del permiso (incluye desactivación segura de consultar)
          return {
            ...permiso,
            [tipo]: shouldActivate,
          };
        }),
      };
    });
  };



  return (
    <Box component={Paper} sx={{ p: 5 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{ fontWeight: "bold", color: "#88CFE0", mb: 3 }}
      >
        Crear Nuevo Rol
      </Typography>
      <Box sx={{ mb: 3, mt: 2 }}>
        <TextField
          fullWidth
          label="Rol"
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Descripción"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          margin="normal"
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            label="Estado"
          >
            <MenuItem value={true}>Activo</MenuItem>
            <MenuItem value={false}>Inactivo</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Asignación de Permisos por Módulo
      </Typography>

      {/* Controles masivos de permisos */}
      <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button
          variant="text"
          onClick={() => handleToggleAllPermissions()}
          startIcon={
            allPermissionsActive() ? <CancelIcon /> : <CheckCircleIcon />
          }
          sx={{
            color: allPermissionsActive() ? "red" : "#88CFE0",
          }}
        >
          {allPermissionsActive() ? "Desactivar Todos" : "Activar Todos"}
        </Button>

        <Button
          variant="text"
          onClick={() => handleTogglePermissionType("consultar")}
          startIcon={
            allPermissionsOfTypeActive("consultar") ? (
              <CancelIcon />
            ) : (
              <CheckCircleIcon />
            )
          }
          sx={{
            color: allPermissionsOfTypeActive("consultar")
              ? "red"
              : "#88CFE0",
          }}
        >
          {allPermissionsOfTypeActive("consultar")
            ? "Desactivar Consultar"
            : "Activar Consultar"}
        </Button>

        <Button
          variant="text"
          onClick={() => handleTogglePermissionType("insertar")}
          startIcon={
            allPermissionsOfTypeActive("insertar") ? (
              <CancelIcon />
            ) : (
              <CheckCircleIcon />
            )
          }
          sx={{
            color: allPermissionsOfTypeActive("insertar")
              ? "red"
              : "#88CFE0",
          }}
        >
          {allPermissionsOfTypeActive("insertar")
            ? "Desactivar Insertar"
            : "Activar Insertar"}
        </Button>

        <Button
          variant="text"
          onClick={() => handleTogglePermissionType("actualizar")}
          startIcon={
            allPermissionsOfTypeActive("actualizar") ? (
              <CancelIcon />
            ) : (
              <CheckCircleIcon />
            )
          }
          sx={{
            color: allPermissionsOfTypeActive("actualizar")
              ? "red"
              : "#88CFE0",
          }}
        >
          {allPermissionsOfTypeActive("actualizar")
            ? "Desactivar Actualizar"
            : "Activar Actualizar"}
        </Button>
      </Box>

      {/* Lista de módulos con permisos - TABLA */}
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: '30%' }}>Módulo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", width: '18%' }}>Todo</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", width: '18%' }}>Consultar</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", width: '18%' }}>Insertar</TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", width: '18%' }}>Actualizar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {modulos.map((modulo) => {
              const permiso = formData.permisos.find((p) => p.idmodulo === modulo.id) || {};
              const allModulePermissionsActive = permiso.consultar && permiso.insertar && permiso.actualizar;

              return (
                <TableRow key={modulo.id} hover>
                  <TableCell sx={{ fontWeight: "bold" }}>
                    {modulo.modulo}
                  </TableCell>

                  {/* Checkbox para activar/desactivar todo el módulo */}
                  <TableCell align="center">
                    <Checkbox
                      checked={allModulePermissionsActive || false}
                      onChange={() => handleToggleModule(modulo.id)}
                      sx={{
                        color: "#c1c1c1ff",
                        "&.Mui-checked": { color: "#88CFE0" },
                      }}
                    />
                  </TableCell>

                  {/* Permiso Consultar */}
                  <TableCell align="center">
                    <Checkbox
                      checked={permiso.consultar || false}
                      onChange={() => handlePermissionChange(modulo.id, "consultar")}
                      disabled={permiso.insertar || permiso.actualizar}
                      sx={{
                        color: "#c1c1c1ff",
                        "&.Mui-checked": { color: "#88CFE0" },
                      }}
                    />
                  </TableCell>

                  {/* Permiso Insertar */}
                  <TableCell align="center">
                    <Checkbox
                      checked={permiso.insertar || false}
                      onChange={() => {
                        handlePermissionChange(modulo.id, "insertar");
                        if (!permiso.consultar && !permiso.insertar) {
                          setTimeout(() => {
                            const updatedPermiso = formData.permisos.find(
                              (p) => p.idmodulo === modulo.id
                            );
                            if (updatedPermiso?.consultar) {
                              Swal.fire({
                                title: "Permiso de consulta activado",
                                text: "Para poder insertar, se requiere permiso de consulta",
                                icon: "info",
                                confirmButtonColor: "#88CFE0",
                                timer: 2000,
                              });
                            }
                          }, 100);
                        }
                      }}
                      sx={{
                        color: "#c1c1c1ff",
                        "&.Mui-checked": { color: "#88CFE0" },
                      }}
                    />
                  </TableCell>

                  {/* Permiso Actualizar */}
                  <TableCell align="center">
                    <Checkbox
                      checked={permiso.actualizar || false}
                      onChange={() => {
                        handlePermissionChange(modulo.id, "actualizar");
                        if (!permiso.consultar && !permiso.actualizar) {
                          setTimeout(() => {
                            const updatedPermiso = formData.permisos.find(
                              (p) => p.idmodulo === modulo.id
                            );
                            if (updatedPermiso?.consultar) {
                              Swal.fire({
                                title: "Permiso de consulta activado",
                                text: "Para poder actualizar, se requiere permiso de consulta",
                                icon: "info",
                                confirmButtonColor: "#88CFE0",
                                timer: 2000,
                              });
                            }
                          }, 100);
                        }
                      }}
                      sx={{
                        color: "#c1c1c1ff",
                        "&.Mui-checked": { color: "#88CFE0" },
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        <Button
          onClick={() => navigate("/Dashboard/Seguridad")}
          sx={{ color: "red", mr: 2 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ backgroundColor: "#88CFE0" }}
        >
          Guardar
        </Button>
      </Box>
    </Box>
  );
};

export default CreateRole;