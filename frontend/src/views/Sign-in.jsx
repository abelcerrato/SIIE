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
import { useUser } from "../Components/UserContext";
import Swal from "sweetalert2";
import LogoCONED from "../Components/img/logos_CONED.png";
import LogoDGDP from "../Components/img/Logo_DGDP.png";
import { color } from "../Components/color";

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
          `${process.env.REACT_APP_API_URL}/permisos/${idrol}`
        );

        if (permisosResponse.status === 200) {
          const permisos = permisosResponse.data.map((p) => ({
            idobjeto: p.idobjeto,
            objeto: p.objeto,
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

        navigate("/dashboard");
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Hubo un problema con la solicitud. Inténtelo de nuevo.";
      Swal.fire({ title: "Error", text: msg, icon: "error", timer: 6000 });
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
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={6}>
                <img
                  src={LogoCONED}
                  alt="Logo CONED"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Grid>
              <Grid item xs={6}>
                <img
                  src={LogoDGDP}
                  alt="Logo DGDP"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </Grid>
            </Grid>

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
              sx={{ mt: 3, mb: 2, backgroundColor: color.primary.azul }}
            >
              Ingresar
            </Button>
          </Card>

          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 5 }}
          >
            © {new Date().getFullYear()} Propiedad Intelectual del Estado de Honduras
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
