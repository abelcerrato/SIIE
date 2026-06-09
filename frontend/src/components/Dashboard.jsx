// views/Dashboard/Dashboard.jsx
import React from "react";
import { Box, Typography, Paper, Grid, Card, CardContent, Avatar } from "@mui/material";
import { useUser } from "./UserContext";
import color from "./color";
import {
  Description as DescriptionIcon,
  CloudDownload as DownloadIcon,
  Security as SecurityIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user } = useUser();

  // Obtener la hora actual para el saludo
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const statsCards = [
    {
      title: "Informes Disponibles",
      value: "3",
      icon: <DescriptionIcon sx={{ fontSize: 40, color: color.white }} />,
      bgColor: color.primary,
    },
    {
      title: "Descargas Realizadas",
      value: "12",
      icon: <DownloadIcon sx={{ fontSize: 40, color: color.white }} />,
      bgColor: color.secondary,
    },
    {
      title: "Módulos Activos",
      value: "4",
      icon: <SecurityIcon sx={{ fontSize: 40, color: color.white }} />,
      bgColor: color.third,
    },
    {
      title: "Instituciones",
      value: "3",
      icon: <SchoolIcon sx={{ fontSize: 40, color: color.white }} />,
      bgColor: "#2e7d32",
    },
  ];

  return (
    <Box>
      {/* Bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: `linear-gradient(135deg, ${color.primary} 0%, ${color.primary}CC 100%)`,
            borderRadius: 3,
            color: color.white,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            {getGreeting()}, {user?.usuario || "Usuario"}!
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 500, mb: 2 }}>
            Bienvenido al Sistema de Descargas del SIIE
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95, maxWidth: "80%" }}>
            Desde aquí podrá acceder a todos los informes educativos generados por el sistema,
            descargar documentos oficiales y gestionar la información de manera rápida y segura.
          </Typography>
        </Paper>
      </motion.div>

      {/* Tarjetas de estadísticas
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 3,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ color: color.contrastText, mb: 1, fontWeight: 500 }}>
                      {card.title}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: card.bgColor }}>
                      {card.value}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: card.bgColor,
                      width: 56,
                      height: 56,
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    }}
                  >
                    {card.icon}
                  </Avatar>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid> */}

      {/* Sección de información adicional 
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: color.primary, mb: 2 }}>
                Descargas disponibles
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { name: "SEDUC - Informes trimestrales", count: "8 informes", color: "#4caf50" },
                  { name: "INFOP - Reportes de formación", count: "5 informes", color: "#2196f3" },
                  { name: "CONEANFO - Estadísticas educativas", count: "6 informes", color: "#ff9800" },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 2,
                      borderRadius: 2,
                      bgcolor: `${item.color}10`,
                      borderLeft: `4px solid ${item.color}`,
                    }}
                  >
                    <Typography sx={{ fontWeight: 500 }}>{item.name}</Typography>
                    <Typography variant="body2" sx={{ color: item.color, fontWeight: 600 }}>
                      {item.count}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={5}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
                background: `linear-gradient(135deg, ${color.secondary}10 0%, ${color.white} 100%)`,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, color: color.primary, mb: 2 }}>
                Últimas actividades
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                  { action: "Descarga de informe SEDUC", date: "Hace 2 horas", icon: <DownloadIcon sx={{ fontSize: 20 }} /> },
                  { action: "Acceso al módulo de administración", date: "Hace 1 día", icon: <SecurityIcon sx={{ fontSize: 20 }} /> },
                  { action: "Actualización de permisos", date: "Hace 3 días", icon: <SchoolIcon sx={{ fontSize: 20 }} /> },
                ].map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      borderRadius: 2,
                      "&:hover": { bgcolor: `${color.primary}08` },
                    }}
                  >
                    <Avatar sx={{ bgcolor: `${color.primary}20`, width: 36, height: 36 }}>
                      {item.icon}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {item.action}
                      </Typography>
                      <Typography variant="caption" sx={{ color: color.contrastText }}>
                        {item.date}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </motion.div>
        </Grid>
      </Grid>*/}
    </Box>
  );
};

export default Dashboard;