import { useMemo } from "react";
import { Box, Typography, Paper, IconButton, Button } from "@mui/material";
import { Close, FilterAlt } from "@mui/icons-material";
import color from "../color";

const FiltrosActivos = ({ filtros, onRemoveFilter, onClearAll }) => {
  const hasActiveFilters = useMemo(() => {
    return Object.values(filtros).some((value) => value !== "Todos");
  }, [filtros]);

  if (!hasActiveFilters) return null;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
        mb: 3,
        px: { xs: 1, sm: 2 },
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: "bold",
          color: color.secondary,
          mr: 1,
          whiteSpace: "nowrap",
        }}
      >
        Filtros activos:
      </Typography>

      {Object.entries(filtros).map(([key, value]) => {
        if (value !== "Todos") {
          return (
            <Paper
              key={key}
              elevation={0}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0.5,
                bgcolor: `${color.secondary}15`,
                color: color.secondary,
                px: { xs: 1, sm: 1.5 },
                py: 0.5,
                borderRadius: 20,
                fontSize: { xs: "0.7rem", sm: "0.85rem" },
                fontWeight: "bold",
                border: `1px solid ${color.secondary}30`,
                transition: "all 0.2s ease",
                "&:hover": {
                  bgcolor: `${color.secondary}25`,
                  transform: "scale(1.02)",
                },
              }}
            >
              <span style={{ fontWeight: 600 }}>{value}</span>
              <IconButton
                size="small"
                onClick={() => onRemoveFilter(key)}
                sx={{
                  p: 0.2,
                  color: color.secondary,
                  "&:hover": {
                    backgroundColor: `${color.secondary}20`,
                    transform: "scale(1.1)",
                  },
                }}
                aria-label={`Remover filtro de ${key}`}
              >
                <Close sx={{ fontSize: { xs: 12, sm: 14 } }} />
              </IconButton>
            </Paper>
          );
        }
        return null;
      })}

      <Button
        variant="outlined"
        size="small"
        onClick={onClearAll}
        startIcon={<FilterAlt sx={{ fontSize: 14 }} />}
        sx={{
          borderRadius: 16,
          borderColor: color.secondary,
          color: color.secondary,
          px: { xs: 1.5, sm: 2 },
          py: { xs: 0.25, sm: 0.5 },
          fontSize: { xs: "0.7rem", sm: "0.75rem" },
          minWidth: "auto",
          ml: 2,
          "&:hover": {
            borderColor: color.primary,
            backgroundColor: color.secondary + "10",
            transform: "scale(1.02)",
          },
        }}
      >
        Limpiar todos
      </Button>
    </Box>
  );
};

export default FiltrosActivos;