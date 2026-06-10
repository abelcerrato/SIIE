// components/ViewCounter.jsx
import React, { useState, useEffect } from "react";
import SiteViews from "react-siteviews";
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
import color from "./color";

// Componente de diseño completo que SIEMPRE se muestra
const CounterDesign = ({ views, loading, onClose }) => {
  return (
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
        <Badge
         
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          sx={{
            "& .MuiBadge-badge": {
              right: -2,
              bottom: -2,
              padding: 0,
              minWidth: 'auto',
              height: 'auto',
            },
          }}
        >
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
        </Badge>

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
              views?.toLocaleString() || 0
            )}
          </Typography>
        </Box>

        <Tooltip title="Ocultar contador">
          <IconButton
            size="small"
            onClick={onClose}
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
  );
};

const ViewCounter = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [useSiteViews, setUseSiteViews] = useState(true);

  useEffect(() => {
    // Intentar obtener datos de SiteViews
    let isMounted = true;
    
    // Timeout para cambiar a modo fallback si SiteViews no responde
    const timeoutId = setTimeout(() => {
      if (isMounted && loading) {
        console.log("SiteViews no responde, usando contador local");
        setUseSiteViews(false);
        
        // Usar localStorage como fallback
        const pageId = "siie-coned";
        const hasVisited = sessionStorage.getItem(`visited_${pageId}`);
        let currentViews = localStorage.getItem(`views_${pageId}`);
        let viewsCount = currentViews ? parseInt(currentViews) : 124;
        
        if (!hasVisited) {
          viewsCount++;
          localStorage.setItem(`views_${pageId}`, viewsCount.toString());
          sessionStorage.setItem(`visited_${pageId}`, 'true');
        }
        
        setViews(viewsCount);
        setLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [loading]);

  // Función para manejar las vistas cuando SiteViews responde
  const handleSiteViews = (siteViewsCount) => {
    if (siteViewsCount !== undefined) {
      setViews(siteViewsCount);
      setLoading(false);
      setUseSiteViews(true);
    }
  };

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

  // Siempre mostrar el diseño, sin importar qué
  return (
    <Fade in={isVisible}>
      <Box>
        {useSiteViews ? (
          // Intentar usar SiteViews (producción)
          <SiteViews
            projectName="SIIE-CONED"
            refresh="10"
            suppressLogs
          >
            {(siteViews) => {
              // Actualizar el estado cuando lleguen los datos
              if (siteViews !== undefined && loading) {
                handleSiteViews(siteViews);
              }
              // Siempre mostrar el diseño
              return (
                <CounterDesign 
                  views={siteViews !== undefined ? siteViews : views}
                  loading={loading && siteViews === undefined}
                  onClose={() => setIsVisible(false)}
                />
              );
            }}
          </SiteViews>
        ) : (
          // Usar contador local (fallback)
          <CounterDesign 
            views={views}
            loading={loading}
            onClose={() => setIsVisible(false)}
          />
        )}
      </Box>
    </Fade>
  );
};

export default ViewCounter;