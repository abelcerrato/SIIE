import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  Button,
  CssBaseline,
  TextField,
  Card,
  Box,
  InputAdornment,
  IconButton,
  Typography,
  Container,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate,Link } from "react-router-dom";
import { useUser } from "../../components/UserContext";
import Swal from "sweetalert2";
import siieLogo from "../../img/nueva-linea-grafica/logos-siie-y-coned.png";
import color from "../../components/color";
import fondo from "../../img/nueva-linea-grafica/fondo.png";
import { motion, useInView, useAnimation } from "framer-motion";

const theme = createTheme();

export default function SignIn() {
  const { setUser, setPermissions } = useUser();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ usuario: "", contraseña: "" });

  // Refs para los elementos a animar
  const welcomeRef = useRef(null);
  const cardRef = useRef(null);

  // Controles de animación
  const welcomeControls = useAnimation();
  const cardControls = useAnimation();

  // Detectar si los elementos están en vista
  const isWelcomeInView = useInView(welcomeRef, { once: true, amount: 0.3 });
  const isCardInView = useInView(cardRef, { once: true, amount: 0.3 });

  useEffect(() => {
    if (isWelcomeInView) {
      welcomeControls.start("visible");
    }
    if (isCardInView) {
      cardControls.start("visible");
    }
  }, [isWelcomeInView, isCardInView, welcomeControls, cardControls]);

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
        formData,
      );

      if (response.status === 200) {
        const { id, usuario, idrol } = response.data.user;

        setUser({ id, usuario, idrol });

        // Obtener permisos
        const permisosResponse = await axios.get(
          `${process.env.REACT_APP_API_URL}/permiso/${idrol}`,
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
      const msg =
        error.response?.data?.message ||
        "Hubo un problema con la solicitud. Inténtelo de nuevo.";
      Swal.fire({ title: "Error", text: msg, icon: "error", timer: 6000 });
    }
  };

  // Variantes de animación para el texto de bienvenida
  const welcomeVariants = {
    hidden: {
      opacity: 0,
      x: -80,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const welcomeTextVariants = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Variantes de animación para el card
  const cardVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2,
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Variantes para elementos internos del card
  const cardHeaderVariants = {
    hidden: {
      opacity: 0,
      y: -30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.3,
      },
    },
  };

  const formVariants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.4,
      },
    },
  };

  const formItemVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const buttonVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.6,
      },
    },
    hover: {
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Fondo general */}
      <Box
        sx={{
          minHeight: "100vh",
          background: `url(${fondo})`,
          display: "flex",
          alignItems: "center",
          backgroundSize: "cover",
          justifyContent: "center",
          px: 2,
          py: 4,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Círculos decorativos de fondo con animación */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            position: "absolute",
            bottom: "-120px",
            right: "-120px",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.08)",
          }}
        />

        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: "center",
              justifyContent: "space-between",
              gap: { xs: 4, md: 5 },
            }}
          >
            {/* Botón PORTAL SIIE - Esquina superior izquierda */}
<Button
  component={Link}
  to="/"
  sx={{
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.9)",
    color: color.secondary,
    fontWeight: "bold",
    padding: "8px 20px",
    borderRadius: "30px",
    textTransform: "none",
    fontSize: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
    "&:hover": {
      backgroundColor: color.secondary,
      color: "white",
      transform: "translateY(-2px)",
      transition: "all 0.3s ease",
    },
  }}
>
  PORTAL SIIE
</Button>
            {/* BIENVENIDA CON ANIMACIÓN */}
            <motion.div
              ref={welcomeRef}
              initial="hidden"
              animate={welcomeControls}
              variants={welcomeVariants}
              style={{
                flex: 1,
              }}
            >
              <Box
                sx={{
                  color: color.white,
                  textAlign: { xs: "center", md: "left" },
                  width: { xs: "100%", md: "650px" },
                }}
              >
                <motion.div variants={welcomeTextVariants}>
                  <Typography
                    sx={{
                      fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
                      fontWeight: 800,
                      lineHeight: 1.2,
                      mb: 2,
                      textShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    }}
                  >
                    Bienvenido al apartado de descargas de informes del SIIE
                  </Typography>
                </motion.div>

                <motion.div variants={welcomeTextVariants}>
                  <Typography
                    sx={{
                      fontSize: { xs: "1rem", sm: "1.2rem", md: "1.35rem" },
                      fontWeight: 500,
                      mb: 2,
                      opacity: 0.95,
                      textShadow: "0 2px 8px rgba(0,0,0,0.2)",
                    }}
                  >
                    Sistema Integrado de Información Educativa
                  </Typography>
                </motion.div>

                <motion.div variants={welcomeTextVariants}>
                  <Typography
                    sx={{
                      fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
                      fontWeight: 400,
                      lineHeight: 1.8,
                      maxWidth: { xs: "100%", md: "90%" },
                      mx: { xs: "auto", md: 0 },
                      opacity: 0.95,
                      textShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    }}
                  >
                    Acceda de manera segura a la plataforma para consultar,
                    visualizar y descargar informes oficiales del SIIE,
                    facilitando el acceso a la información educativa de forma
                    rápida, ordenada e intuitiva.
                  </Typography>
                </motion.div>
              </Box>
            </motion.div>

            {/* CARD LOGIN CON ANIMACIÓN */}
            <motion.div
              ref={cardRef}
              initial="hidden"
              animate={cardControls}
              variants={cardVariants}
              style={{
                width: "100%",

                flexShrink: 0,
              }}
            >
              <Card
                sx={{
                  width: { xs: "100%", md: "500px" },
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: "0 18px 40px rgba(0,0,0,0.25)",
                  backgroundColor: color.white,
                }}
              >
                {/* Encabezado del card con animación */}
                <motion.div
                  variants={cardHeaderVariants}
                  initial="hidden"
                  animate={cardControls}
                >
                  <Box
                    sx={{
                      background: `linear-gradient(180deg, ${color.secondary} 1%, ${color.secondary} 100%)`,
                      color: color.white,
                      textAlign: "center",
                      px: { xs: 3, sm: 5 },
                      py: { xs: 3, sm: 4 },
                      position: "relative",
                    }}
                  >
                    {/* decoraciones animadas */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      style={{
                        position: "absolute",
                        top: 20,
                        left: 20,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.7)",
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      style={{
                        position: "absolute",
                        top: 40,
                        right: 30,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.6)",
                      }}
                    />
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, duration: 0.5 }}
                      style={{
                        position: "absolute",
                        bottom: 30,
                        left: "15%",
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: "rgba(255,255,255,0.3)",
                      }}
                    />

                    <Box
                      component="img"
                      src={siieLogo}
                      alt="Logo SIIE"
                      sx={{
                        width: "100%",
                        height: "auto",
                        objectFit: "contain",
                        mx: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                </motion.div>

                {/* Formulario con animación */}
                <motion.div
                  variants={formVariants}
                  initial="hidden"
                  animate={cardControls}
                >
                  <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{
                      px: { xs: 3, sm: 5 },
                      py: { xs: 4, sm: 5 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <motion.div variants={formItemVariants}>
                      <Typography
                        sx={{
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          color: color.primary,
                          mb: 2,
                          letterSpacing: 1,
                          textAlign: "center",
                        }}
                      >
                        INICIO DE SESIÓN
                      </Typography>
                    </motion.div>

                    <motion.div
                      variants={formItemVariants}
                      style={{ width: "100%" }}
                    >
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
                        variant="outlined"
                        sx={{
                          mb: 2,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 10,
                            backgroundColor: "#F7FAFC",
                          },
                        }}
                      />
                    </motion.div>

                    <motion.div
                      variants={formItemVariants}
                      style={{ width: "100%" }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="contraseña"
                        label="Contraseña"
                        type={showPassword ? "text" : "password"}
                        value={formData.contraseña}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                          mb: 3,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 10,
                            backgroundColor: "#F7FAFC",
                          },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePassword}
                                edge="end"
                              >
                                {showPassword ? (
                                  <VisibilityOff />
                                ) : (
                                  <Visibility />
                                )}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    </motion.div>

                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      style={{ width: "100%" }}
                    >
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 1,
                          py: 1.4,
                          borderRadius: 3,
                          fontWeight: 700,
                          fontSize: "1rem",
                          textTransform: "none",
                          background: color.secondary,
                          color: color.white,
                          boxShadow: "0 8px 20px rgba(11,92,117,0.35)",
                          "&:hover": {
                            background: color.primary,
                            transform: "translateY(-2px)",
                            boxShadow: "0 12px 24px rgba(11,92,117,0.4)",
                          },
                          transition: "all 0.3s ease",
                        }}
                      >
                        Ingresar
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Card>
            </motion.div>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
