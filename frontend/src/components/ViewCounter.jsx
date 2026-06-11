// components/ViewCounter.jsx - Versión alternativa
import React, { useState } from "react";
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
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import color from "./color";

// Componente que envuelve a SiteViews y mantiene el diseño
const ViewsWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);

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
          <Badge
            badgeContent={
              <Box sx={{ 
                bgcolor: color.secondary, 
                borderRadius: "50%", 
                width: 14, 
                height: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TrendingUpIcon sx={{ fontSize: 8, color: color.white }} />
              </Box>
            }
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
              {children}
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

const ViewCounter = () => {
  return (
    <SiteViews
      projectName="SIIE-CONED"
      refresh="10"
      suppressLogs
      placeHolder={<CircularProgress size={20} sx={{ color: color.primary }} />}
    >
      {(views) => (
        <ViewsWrapper>
          {views !== undefined ? views.toLocaleString() : 0}
        </ViewsWrapper>
      )}
    </SiteViews>
  );
};

export default ViewCounter;