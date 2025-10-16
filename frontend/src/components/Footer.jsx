import React from "react";
import { Box, Typography, Container, Stack } from "@mui/material";
import foto from "../img/H_blanca.png";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#88CFE0",
        py: 2,
        mt: 4,
      }}
    >
      <Container maxWidth="md">
        <Stack direction="column" spacing={1} alignItems="center">
          <Box
            component="img"
            src={foto}
            alt="Logo"
            sx={{
              height: 50,
              objectFit: "contain",
            }}
            onClick={() => navigate("/Login")} 
          />
          <Typography variant="body2" align="center" color="text.primary">
            © {new Date().getFullYear()} Sistema Integrado de Información
            Educativa SIIE. Todos los derechos reservados.
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
