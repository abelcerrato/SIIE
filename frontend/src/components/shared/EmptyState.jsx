import { Box, Typography, Button, alpha } from "@mui/material";
import color from "../color";

const EmptyState = ({ message, onClearFilters }) => (
  <Box
    sx={{
      textAlign: "center",
      py: 4,
      px: 2,
      bgcolor: alpha(color.primary, 0.05),
      borderRadius: 2,
    }}
  >
    <Typography variant="body1" color="text.secondary" gutterBottom>
      {message || "No hay datos para los filtros seleccionados"}
    </Typography>
    <Button
      variant="outlined"
      size="small"
      onClick={onClearFilters}
      sx={{ mt: 1 }}
    >
      Limpiar filtros
    </Button>
  </Box>
);

export default EmptyState;