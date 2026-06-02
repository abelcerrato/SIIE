import React from "react";
import {
  Box,
  Typography,
  Container,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import foto from "../img/nueva-linea-grafica/escudo-blanco.png";
import { useNavigate } from "react-router-dom";
import color from "../components/color";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LanguageIcon from "@mui/icons-material/Language";
import { AiFillTikTok } from "react-icons/ai";

const Footer = () => {
  const navigate = useNavigate();

  // Configuración de enlaces de redes sociales
  const socialLinks = {
    instagram: "https://www.instagram.com/conedhn/",
    facebook: "https://www.facebook.com/profile.php?id=61590243682905",
    youtube: "https://www.youtube.com/@conedhn",
    website: "https://www.coned.gob.hn/",
    tiktok: "https://www.tiktok.com/@conedhonduras",
  };

  const handleSocialClick = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: color.primary,
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
              height: 70,
              objectFit: "contain",
            }}
            onClick={() => navigate("/Login")}
          />
          <Typography
            variant="body2"
            align="center"
            xs={{ color: color.white }}
          >
            © {new Date().getFullYear()} Sistema Integrado de Información
            Educativa SIIE. Todos los derechos reservados.
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Tooltip title="Instagram" arrow>
              <IconButton
                aria-label="Instagram"
                size="large"
                sx={{ color: color.white }}
                onClick={() => handleSocialClick(socialLinks.instagram)}
              >
                <InstagramIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Facebook" arrow>
              <IconButton
                aria-label="Facebook"
                size="large"
                sx={{ color: color.white }}
                onClick={() => handleSocialClick(socialLinks.facebook)}
              >
                <FacebookIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Tik Tok" arrow>
              <IconButton
                aria-label="Tik Tok"
                size="large"
                sx={{ color: color.white }}
                onClick={() => handleSocialClick(socialLinks.tiktok)}
              >
                <AiFillTikTok fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="YouTube" arrow>
              <IconButton
                aria-label="YouTube"
                size="large"
                sx={{ color: color.white }}
                onClick={() => handleSocialClick(socialLinks.youtube)}
              >
                <YouTubeIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sitio Web" arrow>
              <IconButton
                aria-label="Sitio Web"
                size="large"
                sx={{ color: color.white }}
                onClick={() => handleSocialClick(socialLinks.website)}
              >
                <LanguageIcon fontSize="inherit" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default Footer;
