import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Fade,
  Badge,
  CircularProgress
} from "@mui/material";

import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// Define los colores
const color = {
  primary: '#244e9e',
  secondary: '#ad8411',
  third: '#231f20',
  white: '#FFFFFF',
  contrastText: '#747474',
};

const ViewCounter = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);

  // Usar CountAPI que funciona localmente
  useEffect(() => {
    const fetchViews = async () => {
      try {
        const pageId = "siie-coned";
        
        // Verificar si ya se contó esta visita
        const hasVisited = sessionStorage.getItem(`visited_${pageId}`);
        
        if (!hasVisited) {
          // Incrementar contador
          const response = await fetch(`https://api.countapi.xyz/hit/${pageId}/visits`);
          const data = await response.json();
          setViews(data.value);
          sessionStorage.setItem(`visited_${pageId}`, 'true');
        } else {
          // Solo obtener valor actual
          const response = await fetch(`https://api.countapi.xyz/get/${pageId}/visits`);
          const data = await response.json();
          setViews(data.value || 0);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error con contador:", error);
        // Fallback a contador local
        const localViews = localStorage.getItem('local_views') || 0;
        setViews(parseInt(localViews));
        setLoading(false);
      }
    };

    fetchViews();
  }, []);

  if (!isVisible) {
    return (
      <Tooltip title="Mostrar contador" placement="left">
        <IconButton
          onClick={() => setIsVisible(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            zIndex: 1000,
            bgcolor: color.primary,
            color: color.white,
            "&:hover": { bgcolor: color.primary, opacity: 0.9 },
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Fade in={isVisible}>
      <Paper
        elevation={3}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          padding: 1,
          paddingRight: 1,
          borderRadius: 40,
          background: `linear-gradient(135deg, ${color.white} 0%, #f8f9fa 100%)`,
          borderLeft: `4px solid ${color.secondary}`,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: 8,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      
            <Box
              sx={{
                bgcolor: `${color.primary}15`,
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <VisibilityIcon sx={{ color: color.primary }} />
            </Box>
         

          <Box>
            <Typography
              variant="caption"
              sx={{
                color: color.contrastText,
                textTransform: "uppercase",
                letterSpacing: 0.5,
                fontSize: 10,
              }}
            >
              Visitas totales
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: color.primary,
                fontWeight: "bold",
                lineHeight: 1,
                fontSize: "1.25rem",
              }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: color.primary }} />
              ) : (
                views.toLocaleString()
              )}
            </Typography>
          </Box>

          <Tooltip title="Ocultar contador">
            <IconButton
              size="small"
              onClick={() => setIsVisible(false)}
              sx={{
                color: color.contrastText,
                "&:hover": { color: color.primary },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>
    </Fade>
  );
};

export default ViewCounter;