import { Box, Typography, FormControl, Select, MenuItem } from "@mui/material";

const FiltroSelect = ({ label, value, options, onChange, size = "small" }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
    }}
  >
    <Typography
      variant="h7"
      fontWeight="bold"
      textAlign="center"
      sx={{
        mb: 0.5,
        fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
      }}
    >
      {label}
    </Typography>
    <FormControl size={size} fullWidth>
      <Select
        value={value}
        onChange={onChange}
        sx={{
          borderRadius: 2,
          backgroundColor: "#f8f9fa",
          "&:hover": {
            backgroundColor: "#ffffff",
            borderColor: color => color.palette.secondary.main,
          },
          transition: "all 0.2s ease",
          fontSize: { xs: "0.8rem", sm: "0.9rem" },
          minWidth: 200,
        }}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Box>
);

export default FiltroSelect;