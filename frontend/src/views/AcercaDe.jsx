import React from "react";
import { useEffect, useRef, useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Box,
  Paper,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { motion, useInView, useAnimation } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import conedLogo from "../img/nueva-linea-grafica/coned-logo-con-fondo.png";
import Instituciones from "../img/nueva-linea-grafica/Instituciones.png";

import iconoDorado from "../img/nueva-linea-grafica/lofosiieconfondo.png";
import seducLogo from "../img/nueva-linea-grafica/logoSEDUC.jpg";
import coneanfoLogo from "../img/nueva-linea-grafica/logoCONEANFO.jpg";
import infopLogo from "../img/nueva-linea-grafica/logoINFOP.jpg";
import fondo from "../img/nueva-linea-grafica/fondo.png";
import {
  ListAlt,
  Info,
  PieChart,
  Computer,
  Search,
  Storage,
  Close,
} from "@mui/icons-material";
import SchoolRoundedIcon from "@mui/icons-material/SchoolRounded";
import CloseIcon from "@mui/icons-material/Close";
import color from "../components/color";
import logosiie from "../img/nueva-linea-grafica/lofosiieconfondo.png";
import hero from "../img/nueva-linea-grafica/Hero.png";
import AutoGraphRoundedIcon from "@mui/icons-material/AutoGraphRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import ThumbsUpDownRoundedIcon from "@mui/icons-material/ThumbsUpDownRounded";


// Componente para animaciones al hacer scroll
const ScrollReveal = ({
  children,
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = false, // Cambiado a false por defecto
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: once, // Usar el prop once
    margin: "-100px 0px -100px 0px",
  });
  const controls = useAnimation();

  const directions = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
    none: { y: 0, x: 0 },
  };

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      // Reiniciar la animación cuando salga de vista
      controls.start("hidden");
    }
  }, [isInView, controls]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, ...directions[direction] },
        visible: {
          opacity: 1,
          y: 0,
          x: 0,
          transition: { duration, delay, ease: "easeOut" },
        },
      }}
    >
      {children}
    </motion.div>
  );
};

export default function AcercaDe() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [open, setOpen] = useState(false);

  const miembros = [
    {
      nombre: "Rafael Nuñez Lagos ",
      puesto: " Secretario Ejecutivo",
    },
    {
      nombre: "Martha Yanina Isaula Hernandez",
      puesto: "Asistente Ejecutiva",
    },
    
    { nombre: "Martha Alicia García Casco", puesto: "Asesora Legal" }, 
     { nombre: "Saudy Skarleth Herrera Andino", puesto: "Talento Humano" }, 
    
    { nombre: "Olman Abel Baquedano Flores", puesto: "Coordinadoro de UPEG" },
    { nombre: "Karen Noelia Elvir Rodriguez", puesto: " UPEG" },
    {
      nombre: "Melany Lizzeth Ordoñez Cruz",
      puesto: "Asistente Técnico de Desarrollo Profesional Docente",
    },

    { nombre: "Emma Guadalupe Oyuela Rivera", puesto: "Coordinadora de EFTP" },



    { nombre: "Digna Carelia Murillo Escobar", puesto: "Administradora" },

    {
      nombre: "David Enrique Fu Flores",
      puesto: "Asistente de Administración",
    },
    {
      nombre: "Luis Daniel Euraque Morales",
      puesto: "Coordinador de Infotecnología",
    },
    { nombre: "Seydi Johana Lara Fuentes", puesto: "Desarrolladora BackEnd" },
    {
      nombre: "Luesbelin Julieth Mejia Garcia",
      puesto: "Desarrolladora FrontEnd",
    },
    {
      nombre: "Heydy Carolina Elvir Gutierrez",
      puesto: "Asistente de Servicios Generales",
    },
    {
      nombre: "Jose Adolfo Nuñez Varga",
      puesto: "Asistente de Servicios Generales",
    },
  ];

  const trasporte = [
    
    { nombre: "Jhimy Xavier Valladares" },
  ];

  const objetivos = [
    {
      icon: <HubRoundedIcon sx={{ fontSize: "4rem" }} />,
      title: "Centralizar la información educativa del país",
      text: "Integrar en una sola plataforma digital la información generada por distintas instituciones del sistema educativo hondureño, como el Instituto INFOP, CONEANFO, SEDUC y UNAH. Esto permite consolidar los datos educativos en un único punto de acceso, facilitando su consulta, organización y análisis por parte de usuarios e instituciones.",
    },

    {
      icon: <SchoolRoundedIcon sx={{ fontSize: "4rem" }} />,
      title:
        "Proporcionar información confiable para el análisis del sistema educativo",
      text: "Almacenar y gestionar datos relevantes que permitan calcular indicadores educativos nacionales e internacionales, asegurando que la información presentada sea confiable, actualizada y útil para evaluar el estado del sistema educativo del país, identificar avances, detectar desafíos y dar seguimiento a los objetivos educativos establecidos.",
    },

    {
      icon: <ThumbsUpDownRoundedIcon sx={{ fontSize: "4rem" }} />,
      title: "Apoyar la toma de decisiones estratégicas en el ámbito educativo",
      text: "Generar información clara y oportuna que sirva como base para la formulación de políticas públicas, programas educativos y estrategias de mejora del sistema educativo. A través del análisis de los datos disponibles, las autoridades y organizaciones pueden tomar decisiones fundamentadas que contribuyan al fortalecimiento de una educación inclusiva, equitativa y de calidad.",
    },
    {
      icon: <AutoGraphRoundedIcon sx={{ fontSize: "4rem" }} />,
      title: "Facilitar el acceso y la comprensión de la información educativa",
      text: "Presentar los datos mediante representaciones visuales, estadísticas interactivas y herramientas de filtrado que permitan a los usuarios explorar la información de manera sencilla. De esta forma, el sistema busca que investigadores, estudiantes, autoridades y ciudadanos puedan comprender fácilmente los datos educativos y utilizarlos para análisis, investigación o consulta general.",
    },
  ];

  const instituciones = [
    {
      name: "SEDUC",
      logo: seducLogo,
      agradecimientos: [
        { nombre: "Jefry Ismael Damas", puesto: "DBA" },
        {
          nombre: "Manuel Eduardo Perdomo Mazier",
          puesto:
            "Coordinador General del Sistema Nacional de Información Educativa de Honduras",
        },
      ],
    },
    {
      name: "CONEANFO",
      logo: coneanfoLogo,
      agradecimientos: [
        { nombre: "Roberto Bussi", puesto: "Secretario Ejecutivo" },
        { nombre: "Julio Miralda", puesto: "Coordinador Unidad Técnica" },
        { nombre: "Lourdes Brid", puesto: "Coordinadora Gestión de Calidad" },
        {
          nombre: "Poleth Solórzano",
          puesto: "Gestor de Sistemas de Información",
        },
        { nombre: "Juan Giron", puesto: "Asistente de Sistemas Informáticos" },
        {
          nombre: "Onan Martínez ",
          puesto: "Asistente de Monitoreo y Seguimiento",
        },
        { nombre: "Kenia Ramírez", puesto: "Asistente de Certificación" },
      ],
    },
    {
      name: "INFOP",
      logo: infopLogo,
      agradecimientos: [
        { nombre: "Carlos Alvarado", puesto: "Facilitador" },
        { nombre: "Kevin Matamoros", puesto: "Programador" },
        { nombre: "Esli Rivera", puesto: "Coordinadora unidad de Estadística" },
      ],
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Encabezado con logos - Hero */}
      <ScrollReveal delay={0.2}>
        <Box
          sx={{
            position: "relative",
            height: { xs: "auto", md: 220 },
            display: "flex",
            alignItems: "center",
            pl: { xs: 2, md: 20 },
            py: { xs: 6, md: 0 },
            backgroundImage: `url(${fondo})`,
            backgroundSize: "cover",
            backgroundPosition: "center 20%",
            borderRadius: 5,
            overflow: "hidden",
            mb: 6,
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(59, 105, 190, 0.56)",
              borderRadius: "inherit",
              zIndex: 1,
            }}
          />

          <Box
            component="img"
            src={iconoDorado}
            alt="Icono"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: { xs: 120, md: 255 },
              zIndex: 2,
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              width: { xs: "100%", md: "60%", lg: "80%" },
              textAlign: { xs: "center", md: "right" },
              top: { xs: 20, md: 0 },
              color: "#fff",
              px: { xs: 2, md: 12},
            }}
          >
            <Typography
              sx={{
                fontSize: "clamp(1.3rem, 4vw, 3.5rem)",
                fontWeight: "bold",
              }}
            >
              Sistema Integrado de Información Educativa
            </Typography>
          </Box>
        </Box>
      </ScrollReveal>

      {/* ¿Qué es el SIIE? */}
      <Grid container spacing={2} alignItems="center">
        <Grid item size={{ xs: 12, md: 7 }} mb={5}>
          <ScrollReveal delay={0.3} direction="right">
            <Box
              sx={{
                position: "relative",
                animation: "slideUp 0.6s ease-out",
                "@keyframes slideUp": {
                  "0%": {
                    opacity: 0,
                    transform: "translateY(30px)",
                  },
                  "100%": {
                    opacity: 1,
                    transform: "translateY(0)",
                  },
                },
              }}
            >
              <Typography
                variant="h3"
                gutterBottom
                fontWeight="bold"
                sx={{
                  color: color.secondary,
                  position: "relative",
                  display: "inline-block",
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: -10,
                    left: 0,
                    width: "60px",
                    height: "4px",
                    background: color.secondary,
                    borderRadius: "2px",
                    animation: "expandWidth 0.8s ease-out 0.3s both",
                  },
                  "@keyframes expandWidth": {
                    "0%": { width: 0 },
                    "100%": { width: "60px" },
                  },
                }}
              >
                ¿Qué es el SIIE?
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: color.contrastText, marginBottom: 2, mt: 3 }}
              >
                SIIE – Sistema Integrado de Información Educativa
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: color.third,
                  textAlign: "justify",
                  lineHeight: 1.8,
                }}
              >
                El SIIE es una plataforma web que centraliza, organiza y pone a
                disposición la información proveniente de cuatro instituciones
                clave del sector educativo: INFOP, CONEANFO, SEDUC y DES-UNAH. Su
                principal objetivo es presentar datos confiables y actualizados
                de manera clara, accesible e intuitiva mediante representaciones
                estadísticas interactivas.
                <br /> <br />
                La plataforma integra tableros dinámicos que permiten visualizar
                indicadores educativos relevantes, facilitando la comprensión de
                la información y apoyando la toma de decisiones basada en datos.
                Asimismo, el sistema incorpora múltiples filtros y opciones de
                exploración que permiten a los usuarios personalizar la
                visualización según sus necesidades, haciendo posible analizar
                la información desde distintas perspectivas y niveles de
                detalle.
                <br /> <br />
                De esta manera, el SIIE contribuye a mejorar la transparencia,
                el acceso a la información y el análisis del sector educativo a
                través de una experiencia de navegación ágil, interactiva y
                centrada en el usuario.
              </Typography>
            </Box>
          </ScrollReveal>
        </Grid>
        <Grid item size={{ xs: 12, md: 5 }}>
          <ScrollReveal delay={0.5} direction="left">
            <Box
              sx={{
                position: "relative",
                "&:before": {
                  content: '""',
                  position: "absolute",
                  top: -10,
                  left: -10,
                  right: -10,
                  bottom: -10,
                  background: `linear-gradient(45deg, ${color.secondary}, transparent, ${color.secondary})`,
                  borderRadius: 3,
                  opacity: 0,
                  transition: "opacity 0.5s ease",
                  zIndex: 0,
                },
              }}
            >
              <CardMedia
                sx={{
                  borderRadius: 2,
                  maxWidth: 400,
                  margin: "auto",
                  position: "relative",
                  zIndex: 1,
                  transition: "all 0.4s ease",
                  filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.2))",
                  "&:hover": {
                    transform: "scale(1.08)",
                    filter: "drop-shadow(0 20px 15px rgba(0,0,0,0.3))",
                  },
                }}
                component="img"
                image={Instituciones}
                alt="Logo SIIE"
              />
            </Box>
          </ScrollReveal>
        </Grid>
      </Grid>

      {/* Objetivos y Funciones Principales */}
      <Grid container spacing={2} mt={4}>
        <Typography
          variant="h3"
          gutterBottom
          fontWeight="bold"
          width="100%"
          sx={{
            color: color.secondary,
            textAlign: "center",
            mb: 4,
            position: "relative",
            "&:after": {
              content: '""',
              display: "block",
              width: "80px",
              height: "4px",
              background: color.secondary,
              margin: "20px auto 0",
              borderRadius: "2px",
            },
          }}
        >
          Objetivos y Funciones Principales
        </Typography>

        <Grid container spacing={8}>
          {objetivos.map((obj, index) => (
            <Grid
              item
              size={{ xs: 12, sm: 6, md: 3 }}
              key={index}
              sx={{ display: "flex" }}
            >
              <ScrollReveal
                delay={index * 0.15}
                direction="up"
                style={{ width: "100%", height: "100%" }}
              >
                <Box
                  sx={{
                    perspective: "1000px",
                    height: "100%",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      flexDirection:
                        index % 2 === 0 ? "column" : "column-reverse",
                      alignItems: "center",
                      transition: "transform 0.5s ease",
                      transformStyle: "preserve-3d",
                      "&:hover": {
                        transform: "rotateY(10deg) rotateX(5deg)",
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        flex: 1,
                        p: 2,
                        bgcolor: color.primary,
                        color: color.white,
                        borderTopLeftRadius: index % 2 === 0 ? 20 : 0,
                        borderTopRightRadius: index % 2 === 0 ? 20 : 0,
                        borderBottomLeftRadius: index % 2 !== 0 ? 20 : 0,
                        borderBottomRightRadius: index % 2 !== 0 ? 20 : 0,
                        transition: "all 0.3s ease",
                      }}
                    >
                      <Typography variant="h6" fontWeight="bold" mb={2}>
                        {obj.title}
                      </Typography>
                      <Typography textAlign="justify" variant="body2">
                        {obj.text}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        height: 80,
                        p: 2,
                        bgcolor: color.secondary,
                        borderBottomLeftRadius: index % 2 === 0 ? 20 : 0,
                        borderBottomRightRadius: index % 2 === 0 ? 20 : 0,
                        borderTopLeftRadius: index % 2 !== 0 ? 20 : 0,
                        borderTopRightRadius: index % 2 !== 0 ? 20 : 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: color.white,
                        transition: "all 0.3s ease",
                      }}
                    >
                      {obj.icon}
                    </Box>
                  </Box>
                </Box>
              </ScrollReveal>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Colaboradores */}
      <Grid container spacing={2} mt={8}>
        <Grid item size={{ xs: 12 }}>
          <ScrollReveal delay={0.2}>
            <Typography
              variant="h3"
              gutterBottom
              fontWeight="bold"
              width="100%"
              sx={{
                color: color.secondary,
                textAlign: "center",
                mb: 4,
                position: "relative",
                "&:after": {
                  content: '""',
                  display: "block",
                  width: "80px",
                  height: "4px",
                  background: color.secondary,
                  margin: "20px auto 0",
                  borderRadius: "2px",
                },
              }}
            >
              Colaboradores
            </Typography>
          </ScrollReveal>
        </Grid>

        <Grid item size={{ xs: 12, md: 12 }}>
  {/*         {selectedInstitution ? (
            <ScrollReveal delay={0.2} direction="none">
              <Grid container spacing={4} mb={4}>
                <Grid
                  item
                  size={{ xs: 12, sm: 6, md: 5 }}
                  sx={{ textAlign: "center" }}
                >
                  <Grid
                    item
                    size={{ xs: 12 }}
                    sx={{ textAlign: "left", mb: 2 }}
                  >
                    <IconButton
                      aria-label="Volver"
                      onClick={() => setSelectedInstitution(null)}
                      sx={{
                        backgroundColor: "rgba(255,255,255,0.1)",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                      }}
                    >
                      <ArrowBackIcon sx={{ color: color.secondary }} />
                    </IconButton>
                  </Grid>

                  <Box
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <CardMedia
                      component="img"
                      src={selectedInstitution.logo}
                      alt={selectedInstitution.name}
                      sx={{
                        width: "80%",
                        height: "auto",
                        maxHeight: 250,
                        borderRadius: 2,
                        objectFit: "contain",
                        mx: "auto",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />
                  </Box>
                  {isMobile && (
                    <Typography
                      variant="h5"
                      sx={{ mt: 2, fontWeight: "bold", color: color.white }}
                    >
                      {selectedInstitution.name}
                    </Typography>
                  )}
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 7 }}>
                  <Typography
                    variant="h4"
                    textAlign="center"
                    gutterBottom
                    fontWeight="bold"
                    sx={{ color: color.secondary, mb: 3 }}
                  >
                    Agradecimientos Especiales
                  </Typography>
                  <Grid container spacing={3}>
                    {selectedInstitution.agradecimientos.map((miembro, i) => (
                      <Grid item size={{ xs: 12, sm: 6 }} key={i}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: "rgba(255,255,255,0.05)",
                            borderLeft: `3px solid ${color.secondary}`,
                            transition: "all 0.3s ease",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.1)",
                              transform: "translateX(5px)",
                            },
                          }}
                        >
                          <Typography
                            variant="body1"
                            fontWeight="bold"
                            sx={{ color: color.secondary }}
                          >
                            {miembro.nombre}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: color.third, opacity: 0.8 }}
                          >
                            {miembro.puesto}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </ScrollReveal>
          ) : ( */}
            <Grid container spacing={4} justifyContent="center">
              {instituciones.map((inst, index) => (
                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={inst.name}>
                  <ScrollReveal delay={index * 0.15} direction="up">
                    <Box
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-10px)",
                          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                        },
                      }}
                      onClick={() => setSelectedInstitution(inst)}
                    >
                      <Box
                        sx={{
                          position: "relative",
                          width: "100%",
                          aspectRatio: "4/3",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <CardMedia
                          component="img"
                          src={inst.logo}
                          alt={inst.name}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            transition: "transform 0.5s ease",
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          p: 2,
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          backdropFilter: "blur(10px)",
                          borderTop: `1px solid ${color.secondary}`,
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          textAlign="center"
                          sx={{ color: color.secondary }}
                        >
                          {inst.name}
                        </Typography>
                      </Box>

                      {/* <Box
                        className="overlay"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: `linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 100%)`,
                          backdropFilter: "blur(20px)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0,
                          transition: "opacity 0.3s ease",
                          p: 2,
                          textAlign: "center",
                          "&:hover": {
                            opacity: 1,
                          },
                          "@media (hover: none)": {
                            "&:active": {
                              opacity: 1,
                            },
                          },
                        }}
                      >
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{
                            color: color.secondary,
                            mb: 2,
                            borderBottom: `2px solid ${color.secondary}`,
                            pb: 1,
                          }}
                        >
                          {inst.name}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            color: color.white,
                            mb: 1.5,
                            fontWeight: "bold",
                          }}
                        >
                          Agradecimientos
                        </Typography>

                        <Box
                          sx={{
                            maxHeight: "70%",
                            overflow: "auto",
                            width: "100%",
                          }}
                        >
                          {inst.agradecimientos &&
                            inst.agradecimientos.length > 0 ? (
                            inst.agradecimientos.map((miembro, idx) => (
                              <Box key={idx} sx={{ mb: 1.5 }}>
                                <Typography
                                  variant="body2"
                                  fontWeight="bold"
                                  sx={{ color: color.white }}
                                >
                                  {miembro.nombre}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ color: "#aaa", fontSize: "0.7rem" }}
                                >
                                  {miembro.puesto}
                                </Typography>
                              </Box>
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: color.white }}
                            >
                              Sin agradecimientos registrados
                            </Typography>
                          )}
                        </Box>

                        <Typography
                          variant="caption"
                          sx={{
                            color: color.secondary,
                            mt: 2,
                            fontWeight: "bold",
                          }}
                        >
                          Ver más
                        </Typography>
                      </Box> */}
                    </Box>
                  </ScrollReveal>
                </Grid>
              ))}
            </Grid>
        {/*   )} */}
        </Grid>
      </Grid>

      {/* Institución */}
      <ScrollReveal delay={0.2} direction="up">
        <Grid
          container
          spacing={4}
          alignItems="center"
          mt={8}
          sx={{
            backgroundColor: "#ffffff",
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #e0e0e0",
          }}
        >
          <Grid item size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                p: 4,
                backgroundColor: "#9a7d36",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CardMedia
                component="img"
                image={conedLogo}
                alt="Logo institución"
                sx={{
                  maxWidth: 350,
                  margin: "auto",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />
            </Box>
          </Grid>

          <Grid item size={{ xs: 12, md: 6 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="bold"
                  sx={{
                    color: color.secondary,
                  }}
                >
                  Institución
                </Typography>
                <Typography variant="body1" sx={{ color: "#333", ml: 1 }}>
                  Secretaría Técnica del Consejo Nacional de Educación en
                  Honduras
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="bold"
                  sx={{
                    color: color.secondary,
                  }}
                >
                  Unidad
                </Typography>
                <Typography variant="body1" sx={{ color: "#333", ml: 1 }}>
                  Infotecnología
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="bold"
                  sx={{
                    color: color.secondary,
                  }}
                >
                  Secretario Ejecutivo
                </Typography>
                <Box sx={{ ml: 1 }}>
                  <Typography variant="body1" sx={{ color: "#333" }}>
                    <strong>Nombre:</strong> Rafael Nuñez Lagos
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#333", mt: 1 }}>
                    <strong>Contacto:</strong> {" "}
                    <Link
                      href="mailto:rafael.nunez@coned.gob.hn"
                      underline="hover"
                      sx={{
                        color: color.secondary,
                        fontWeight: "bold",
                        "&:hover": { color: color.primary },
                      }}
                    >
rafael.nunez@coned.gob.hn
                    </Link>
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  fontWeight="bold"
                  sx={{
                    color: color.secondary,
                    mb: 2,
                  }}
                >
                  Miembros del Consejo
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    cursor: "pointer",
                    color: color.primary,
                    ml: 1,
                    display: "inline-block",
                    fontWeight: "bold",
                    "&:hover": {
                      textDecoration: "underline",
                      color: color.secondary,
                    },
                  }}
                  onClick={() => setOpen(true)}
                >
                  Ver listado completo →
                </Typography>
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </ScrollReveal>

      {/* Coordinador del Proyecto | Desarrolladores */}
      <Grid container spacing={3} sx={{ mt: 8 }}>
        {/* Columna izquierda - Coordinadores
        <Grid item size={{ xs: 12, md: 5 }}>
          <Grid container spacing={3}>
            <Grid item size={{ xs: 12, sm: 6, md: 12 }}>
              <ScrollReveal delay={0.1} direction="right">
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 30,
                        backgroundColor: color.secondary,
                        borderRadius: 2,
                        mr: 2,
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: color.primary }}>
                      Coordinador del Proyecto
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: color.contrastText, mb: 1 }}>
                    <strong>Nombre:</strong> Rubén Isaac Fú Flores
                  </Typography>
                  <Typography variant="body1" sx={{ color: color.contrastText }}>
                    <strong>Contacto:</strong>{" "}
                    <Link
                      href="mailto:ruben.fu@coned.gob.hn"
                      underline="hover"
                      sx={{ color: color.secondary, fontWeight: "bold" }}
                    >
                      ruben.fu@coned.gob.hn
                    </Link>
                  </Typography>
                </Box>
              </ScrollReveal>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6, md: 12 }}>
              <ScrollReveal delay={0.2} direction="right">
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    backgroundColor: "#ffffff",
                    border: "1px solid #e0e0e0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 30,
                        backgroundColor: color.secondary,
                        borderRadius: 2,
                        mr: 2,
                      }}
                    />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: color.primary }}>
                      Sub Coordinador del Proyecto
                    </Typography>
                  </Box>
                  <Typography variant="body1" sx={{ color: color.contrastText, mb: 1 }}>
                    <strong>Nombre:</strong> Abel Mauricio Cerrato Anchecta
                  </Typography>
                  <Typography variant="body1" sx={{ color: color.contrastText }}>
                    <strong>Contacto:</strong>{" "}
                    <Link
                      href="mailto:abel.cerrato@coned.gob.hn"
                      underline="hover"
                      sx={{ color: color.secondary, fontWeight: "bold" }}
                    >
                      abel.cerrato@coned.gob.hn
                    </Link>
                  </Typography>
                </Box>
              </ScrollReveal>
            </Grid>
          </Grid>
        </Grid>
 */}
        {/* Columna derecha - Desarrolladores 
        <Grid item size={{ xs: 12, md: 7 }}>
          <ScrollReveal delay={0.3} direction="left">
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                backgroundColor: "#ffffff",
                border: "1px solid #e0e0e0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 30,
                    backgroundColor: color.secondary,
                    borderRadius: 2,
                    mr: 2,
                  }}
                />
                <Typography variant="h6" fontWeight="bold" sx={{ color: color.primary }}>
                  Equipo de Desarrollo
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ color: color.primary, mb: 1 }}>
                      Seydi Johana Lara Fuentes
                    </Typography>
                    <Typography variant="body2" sx={{ color: color.secondary, fontWeight: "bold", mb: 1 }}>
                      Desarrolladora BackEnd
                    </Typography>
                    <Typography variant="body2" sx={{ color: color.contrastText, mb: 1 }}>
                      <strong>Contacto:</strong>
                      <br />
                      <Link
                        href="mailto:seydi.lara@coned.gob.hn"
                        underline="hover"
                        sx={{ color: color.secondary, fontWeight: "bold" }}
                      >
                        seydi.lara@coned.gob.hn
                      </Link>
                    </Typography>
                    <Link
                      href="https://www.linkedin.com/in/seydi-johana-lara-fuentes-35b08a2a4"
                      target="_blank"
                      underline="hover"
                      sx={{
                        color: color.primary,
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        "&:hover": { color: color.secondary },
                      }}
                    >
                      LinkedIn →
                    </Link>
                  </Box>
                </Grid>

                <Grid item size={{ xs: 12, sm: 6 }}>
                  <Box
                    sx={{
                      p: 2.5,
                      borderRadius: 2,
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <Typography variant="h6" fontWeight="bold" sx={{ color: color.primary, mb: 1 }}>
                      Luesbelin Julieth Mejia Garcia
                    </Typography>
                    <Typography variant="body2" sx={{ color: color.secondary, fontWeight: "bold", mb: 1 }}>
                      Desarrolladora FrontEnd
                    </Typography>
                    <Typography variant="body2" sx={{ color: color.contrastText, mb: 1 }}>
                      <strong>Contacto:</strong>
                      <br />
                      <Link
                        href="mailto:luesbelin.mejia@coned.gob.hn"
                        underline="hover"
                        sx={{ color: color.secondary, fontWeight: "bold" }}
                      >
                        luesbelin.mejia@coned.gob.hn
                      </Link>
                    </Typography>
                    <Link
                      href="https://www.linkedin.com/in/luesbelin-mejia-154546279"
                      target="_blank"
                      underline="hover"
                      sx={{
                        color: color.primary,
                        fontSize: "0.875rem",
                        fontWeight: "bold",
                        "&:hover": { color: color.secondary },
                      }}
                    >
                      LinkedIn →
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </ScrollReveal>
        </Grid>*/}
      </Grid>

      {/* Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: 3,
            backgroundColor: "#ffffff",
          },
        }}
      >
        <DialogTitle>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid item size={{ xs: 11 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ color: color.third }}
              >
                Miembros del Consejo Nacional de Educación
              </Typography>
            </Grid>
            <Grid item size={{ xs: 1 }}>
              <IconButton
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
                size="large"
                sx={{
                  color: "#666",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    transform: "rotate(90deg)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Close />
              </IconButton>
            </Grid>
          </Grid>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "#e0e0e0" }}>
          <Grid container spacing={2}>
            {miembros.map((miembro, index) => (
              <Grid item size={{ xs: 12, md: 6 }} key={index}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f8f9fa",
                    borderLeft: `3px solid ${color.secondary}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#e9ecef",
                      transform: "translateX(3px)",
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: color.primary }}
                  >
                    {miembro.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {miembro.puesto}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h6"
            gutterBottom
            fontWeight="bold"
            align="center"
            sx={{ color: color.primary, mb: 3 }}
          >
            Transporte
          </Typography>

          <Grid container spacing={2}>
            {trasporte.map((miembro, index) => (
              <Grid item size={{ xs: 12, md: 6 }} key={index}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: "#f8f9fa",
                    borderLeft: `3px solid ${color.secondary}`,
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: "#e9ecef",
                      transform: "translateX(3px)",
                    },
                  }}
                >
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    sx={{ color: color.primary }}
                  >
                    {miembro.nombre}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {miembro.puesto}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
