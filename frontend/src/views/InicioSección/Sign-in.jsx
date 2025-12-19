import { useState } from "react";
import axios from "axios";
import {
  Button,
  CssBaseline,
  TextField,
  Grid,
  Card,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/UserContext";
import Swal from "sweetalert2";
import siieLogo from "../../img/Logos.png";


const theme = createTheme();

export default function SignIn() {
  const { setUser, setPermissions } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ usuario: "", contraseña: "" });

  const handleTogglePassword = () => setShowPassword(!showPassword);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/inicioSesion`,
        formData
      );

      if (response.status === 200) {
        const { id, usuario, idrol } = response.data.user;

        setUser({ id, usuario, idrol });

        // Obtener permisos
        const permisosResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/permiso/${idrol}`
        );

        if (permisosResponse.status === 200) {
          const permisos = permisosResponse.data.map((p) => ({
            idmodulo: p.idmodulo,
            consultar: p.consultar,
            insertar: p.insertar,
            actualizar: p.actualizar,
          }));
          setPermissions(permisos);
        }

        Swal.fire({
          icon: "success",
          title: "Inicio de sesión",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });

        navigate("/Dashboard");
      }
    } catch (error) {
      if (error.response) {

        // Credenciales incorrectas
        if (error.response.status === 401) {
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            timer: 6000,
            confirmButtonColor: "#88CFE0",
          });
        }

        //  Cambio de contraseña obligatorio
        else if (error.response.status === 403) {
          const { id, usuario, idrol, estado } = error.response.data.user;

          const userData = {
            id,
            usuario,
            idrol,
            estado,
            requiresPasswordChange: true,
          };

          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));

          navigate("/Dashboard/CambiarContrasena", { replace: true });
        }


        //  Otros errores
        else {
          Swal.fire({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            timer: 6000,
            confirmButtonColor: "#88CFE0",
          });
        }

      } else if (error.request) {
        alert("Error en la conexión con el servidor.");
      } else {
        alert("Hubo un problema con la solicitud. Inténtelo de nuevo.");
      }
    }

  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "90vh",
          }}
        >
          <Card
            component="form"
            onSubmit={handleSubmit}
            sx={{ p: 5, boxShadow: 5, borderRadius: 3, width: "100%" }}
          >

            <img
              src={siieLogo}
              alt="Logo CONED"
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />



            <TextField
              margin="normal"
              required
              fullWidth
              id="usuario"
              label="Usuario"
              name="usuario"
              autoFocus
              value={formData.usuario}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="contraseña"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.contraseña}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: "#88CFE0" }}
            >
              Ingresar
            </Button>
          </Card>


        </Box>
      </Container>
    </ThemeProvider>
  );
}
