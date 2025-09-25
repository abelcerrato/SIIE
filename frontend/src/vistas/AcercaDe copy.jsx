import React, { useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import conedLogo from "../img/CONED.webp";
import siieLogo from "../img/SIIE.png";
import colaboradoresLogo from "../img/Colaboradores.png";
import seducLogo from "../img/SEDUC.png";
import coneanfoLogo from "../img/CONEANFO.webp";
import infopLogo from "../img/INFOP.png";
export default function AcercaDe() {
    const [hovered, setHovered] = useState(null);

    const instituciones = [
        { name: "SEDUC", logo: seducLogo },
        { name: "INFOP", logo: infopLogo }, { name: "CONEANFO", logo: coneanfoLogo },

    ];
    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            {/* Sección principal - ¿Qué es el sitio? */}
          
                <Grid container spacing={2} alignItems="center">
                    <Grid item size={{ xs: 12, md: 7 }}>
                   
                            <Typography variant="h5" gutterBottom fontWeight="bold">
                                ¿Qué es el SIIE?
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="justify"
                            >
                                <b>SIIE – Sistema Integrado de Información Educativa</b>
                                <br />
                                El SIIE es una plataforma que centraliza y organiza la
                                información proveniente de tres instituciones: INFOP, CONEANFO y
                                SEDUC. Su objetivo es presentar datos confiables del sector
                                educativo del país de manera clara y accesible, a través de
                                representaciones estadísticas interactivas.
                                <br /> <br />
                                El sistema permite aplicar diversos filtros para que los
                                usuarios puedan explorar la información de acuerdo con sus
                                necesidades específicas, garantizando así una experiencia más
                                dinámica y personalizada en el análisis de los datos educativos.
                                <br />
                            </Typography>
                      
                    </Grid>
                    <Grid item size={{ xs: 12, md: 5 }}>
                        <CardMedia
                            sx={{
                                borderRadius: 2,
                                maxWidth: 290,
                                margin: "auto",
                                transition: "transform 0.3s ease",
                                "&:hover": {
                                    transform: "scale(1.4)",
                                },
                            }}
                            component="img"
                            image={siieLogo}
                            alt="Logo SIIE"
                        />
                    </Grid>
                </Grid>
         

            {/* Colaboradores */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Colaboradores
            </Typography>
       
                <Grid container spacing={2} alignItems="center">
                    {/* Lista */}
                    <Grid item size={{ xs: 12, md: 4 }}>
                       
                            <Typography variant="body2" color="text.secondary">
                                <ul style={{ listStyle: "none", padding: 15 }}>
                                    {instituciones.map((inst) => (
                                        <li
                                            key={inst.name}
                                            onMouseEnter={() => setHovered(inst.name)}
                                            onMouseLeave={() => setHovered(null)}
                                            style={{
                                                marginBottom: 8,
                                                cursor: "pointer",
                                                fontWeight: hovered === inst.name ? "bold" : "normal",
                                                color: hovered === inst.name ? "#88CFE0" : "inherit",
                                            }}
                                        >
                                            - {inst.name}
                                        </li>
                                    ))}
                                </ul>
                            </Typography>
                    
                    </Grid>

                    {/* Logo */}
                    <Grid item size={{ xs: 12, md: 8 }} sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                        {instituciones.map((inst) => (
                            <CardMedia
                                key={inst.name}
                                component="img"
                                src={inst.logo}
                                alt={inst.name}
                                sx={{
                                    width: hovered === inst.name ? 220 : 150,
                                    height: 180,
                                    borderRadius: 2,
                                    objectFit: "contain",
                                    transition: "all 0.3s ease",
                                }}
                            />
                        ))}
                    </Grid>
                </Grid>
     

            <Grid container spacing={2} alignItems="center">
                <Grid item size={{ xs: 12, md: 7 }}>
                    {/* Institución */}
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Institución
                    </Typography>
                
                        <Grid container spacing={2} alignItems="center">
                            <Grid item size={{ xs: 12, md: 6 }}>
                                <CardMedia
                                    component="img"
                                    image={conedLogo}
                                    alt="Logo institución"
                                    sx={{
                                        borderRadius: 2,
                                        maxWidth: 150,
                                        margin: "auto",
                                        transition: "transform 0.3s ease",
                                        "&:hover": {
                                            transform: "scale(1.2)",
                                        },
                                    }}
                                />

                            </Grid>
                            <Grid item size={{ xs: 12, md: 6 }}>
                                <CardContent>
                                    <Typography variant="body2" color="text.primary">
                                        Secretaría Técnica del Consejo Nacional de Educación en
                                        Honduras
                                    </Typography>
                                </CardContent>
                            </Grid>
                        </Grid>
                 
                </Grid>
                <Grid item size={{ xs: 12, md: 5 }}>
                    {/* Unidad */}
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Unidad
                    </Typography>
                  
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                <b>Unidad de Infotecnología</b>
                                <br />
                                <br />
                                La Unidad de Infotecnología es la encargada de brindar soporte
                                técnico al CONED y de desarrollar los sistemas planificados o
                                previstos por el Consejo, contribuyendo a la modernización y
                                eficiencia de sus procesos.
                            </Typography>
                        </CardContent>
                    
                </Grid>
            </Grid>

            {/* Coordinador del Proyecto */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Coordinador del Proyecto
            </Typography>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Nombre: <br />
                        Contacto:
                    </Typography>
                </CardContent>
        

            {/* Desarrolladores */}
            <Typography variant="h6" gutterBottom fontWeight="bold">
                Desarrolladores
            </Typography>
         
               
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                Nombre: <br />
                                Contacto:
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="body2" color="text.secondary">
                                Nombre: <br />
                                Contacto:
                            </Typography>
                        </Grid>
                    </Grid>
            
         
        </Container>
    );
}
