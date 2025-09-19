import React, { useState } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Box,
    Paper,
    Link,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemText,
    IconButton
} from "@mui/material";
import { motion } from "framer-motion";
import { useTheme, useMediaQuery } from "@mui/material";

import conedLogo from "../img/logos-CONED.png";
import siieLogo from "../img/SIIE.png";
import colaboradoresLogo from "../img/Colaboradores.png";
import seducLogo from "../img/SEDUC.png";
import coneanfoLogo from "../img/CONEANFO.png";
import infopLogo from "../img/INFOP.png";
import {
    ListAlt,
    Info,
    PieChart,
    Computer,
    Search,
    Storage,
    Close
} from "@mui/icons-material";
import CloseIcon from '@mui/icons-material/Close';
export default function AcercaDe() {
    const [hovered, setHovered] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const instituciones = [
        { name: "SEDUC", logo: seducLogo },
        { name: "INFOP", logo: infopLogo },
        { name: "CONEANFO", logo: coneanfoLogo },
    ];

    const objetivos = [
        {
            icon: <ListAlt sx={{ fontSize: "4rem" }} />,
            title: "Registrar las trayectorias educativas",
            text: "El SIIE tiene como objetivo registrar las trayectorias educativas de los ciudadanos a lo largo de la vida, crear la base de centros educativos, asociaciones de padres de familia, centros de formación técnica y benefactores, así como de los docentes e instructores certificados.",
        },

        {
            icon: <PieChart sx={{ fontSize: "4rem" }} />,
            title: "Generar información estratégica",
            text: "El SIIE busca generar información confiable y oportuna que permita una toma de decisiones informada para formular nuevas políticas educativas y diseñar estrategias orientadas a una educación inclusiva y de calidad basada en evidencias.",
        },

        {
            icon: <Search sx={{ fontSize: "4rem" }} />,
            title: "Brindar mayor transparencia",
            text: "A través de la implementación de un portal de datos abiertos para Educación, que responda a criterios de confianza requeridos por el Open Data Institute.",
        },
        {
            icon: <Storage sx={{ fontSize: "4rem" }} />,
            title: "Almacenar información para indicadores",
            text: "Incluye información pertinente y necesaria para el cálculo de indicadores nacionales e internacionales de Educación a los cuales Honduras responde.",
        },
    ];

    const [open, setOpen] = useState(false);

    // Ejemplo de datos para los miembros del consejo
    const miembros = [
        { nombre: "Jose Alexis Ordoñes Velasquez ", puesto: " Secretario Ejecutivo" },
        { nombre: "Beatriz Victoria Galeano Escobar", puesto: "Asistente Ejecutiva" },
        { nombre: "Zorayda Waleska Zelaya Acosta", puesto: "Coordinadora de Telecomunicaciones" },
        { nombre: "Tomas Santiago Cayetano Arzu", puesto: "Diseñador Gráfico" },
        { nombre: "Karen Noelia Elvir Rodriguez", puesto: "Coordinadora de UPEG" },
        { nombre: "Zoila Suyapa Padilla Sabillon", puesto: "Cordinadora de Desarrollo Profesional Docente" },
        { nombre: "Melany Lizzeth Ordoñez Cruz", puesto: "Asistente Técnico de Desarrollo Profesional Docente" },
        { nombre: "Abel Mauricio Cerrato Anchecta", puesto: "Asistente del SIIE" },
        { nombre: "Karla Paola Cartagena Lagos", puesto: "Asistente de EFTP" },
        { nombre: "Mare Yescenia Figueroa Aguiriano", puesto: "Asistente Técnica de la UTC" },
        { nombre: "José Donaldo Ochoa Herrera", puesto: "Coordinador de FTP" },
        { nombre: "Luis Armando Ortiz Laines", puesto: "Asesor Legal" },
        { nombre: "Conrado Ernesto Fuentes Carranza", puesto: "Cordinador de Gestión de la Información" },
        { nombre: "Roberto Briceño Jimenez", puesto: "Cordinador del Modelo Ejecutivo" },
        { nombre: "Digna Carelia Murillo Escobar", puesto: "Administradora" },
        { nombre: "Giuver Andony Padilla Santos", puesto: "Asistente de Administración" },
        { nombre: "Seydi Johana Lara Fuentes", puesto: "Desarrolladora BackEnd" },
        { nombre: "Luesbelin Julieth Mejia Garcia", puesto: "Desarrolladora FrontEnd" },
        { nombre: "Heydy Carolina Elvir Gutierrez", puesto: "Asistente de Servicios Generales" },
    ];

    const trasporte = [
        { nombre: "Edwin David Ramos Bustillo" },
        { nombre: "Jhimy Xavier Valladares" },
    ];
    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            {/* Sección principal - ¿Qué es el sitio? */}

            <Grid container spacing={2} alignItems="center">
                <Grid item size={{ xs: 12, md: 7 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        ¿Qué es el SIIE?
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="justify">
                        <b>SIIE – Sistema Integrado de Información Educativa</b>
                        <br />
                        El SIIE es una plataforma que centraliza y organiza la información
                        proveniente de tres instituciones: INFOP, CONEANFO y SEDUC. Su
                        objetivo es presentar datos confiables del sector educativo del país
                        de manera clara y accesible, a través de representaciones
                        estadísticas interactivas.
                        <br /> <br />
                        El sistema permite aplicar diversos filtros para que los usuarios
                        puedan explorar la información de acuerdo con sus necesidades
                        específicas, garantizando así una experiencia más dinámica y
                        personalizada en el análisis de los datos educativos.
                        <br />
                    </Typography>
                </Grid>
                <Grid item size={{ xs: 12, md: 5 }}>
                    <CardMedia
                        sx={{
                            borderRadius: 2,
                            maxWidth: 300,
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
            <Grid container spacing={2} mt={4}>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                    Objetivos y Funciones Principales
                </Typography>

                <Grid container spacing={2}>
                    {objetivos.map((obj, index) => (
                        <Grid item size={{ xs: 12 }} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    p: 2,
                                    bgcolor: "#88CFE0",
                                    color: "white",
                                    width: "97%",
                                }}
                            >
                                <Box
                                    sx={{
                                        borderRadius: 1,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        minWidth: 80,
                                    }}
                                >
                                    {" "}
                                    {obj.icon}
                                </Box>
                                <Box sx={{ ml: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                        {obj.title}
                                    </Typography>
                                    <Typography>{obj.text}</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
            {/* Colaboradores */}
            <Grid container spacing={2} mt={4}>
                {/* Título */}
                <Grid item size={{ xs: 12 }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Colaboradores
                    </Typography>
                </Grid>

                {!isMobile ? (
                    <>
                        {/* --- ESCRITORIO --- Lista a la izquierda --- */}
                        <Grid item size={{ xs: 12, md: 3 }}>
                            <Typography variant="body2" color="text.secondary" marginLeft={5}>
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
                                            {inst.name}
                                        </li>
                                    ))}
                                </ul>
                            </Typography>
                        </Grid>

                        {/* Logos a la derecha */}
                        <Grid container item size={{ xs: 12, md: 9 }} spacing={2}>
                            {instituciones.map((inst) => (
                                <Grid
                                    item
                                    size={{ xs: 12, sm: 6, md: 4 }}
                                    key={inst.name}
                                    sx={{ textAlign: "center" }}
                                >
                                    <CardMedia
                                        component="img"
                                        src={inst.logo}
                                        alt={inst.name}
                                        sx={{
                                            width: hovered === inst.name ? 240 : 200,
                                            height: 120,
                                            borderRadius: 2,
                                            objectFit: "contain",
                                            transition: "all 0.3s ease",
                                            mx: "auto",
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </>
                ) : (
                    <>
                        {/* --- MÓVIL --- Nombre y logo juntos --- */}
                        {instituciones.map((inst) => (
                            <Grid
                                item
                                size={{ xs: 12 }}
                                key={inst.name}
                                sx={{ textAlign: "center" }}
                                onMouseEnter={() => setHovered(inst.name)}
                                onMouseLeave={() => setHovered(null)}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        mt: 2,
                                        mb: 1,
                                        fontWeight: hovered === inst.name ? "bold" : "normal",
                                        color: hovered === inst.name ? "#88CFE0" : "inherit",
                                    }}
                                >
                                    {inst.name}
                                </Typography>
                                <CardMedia
                                    component="img"
                                    src={inst.logo}
                                    alt={inst.name}
                                    sx={{
                                        width: hovered === inst.name ? 240 : 200,
                                        height: 120,
                                        borderRadius: 2,
                                        objectFit: "contain",
                                        transition: "all 0.3s ease",
                                        mx: "auto",
                                    }}
                                />
                            </Grid>
                        ))}
                    </>
                )}

                {/* Texto inferior */}
                <Grid item size={{ xs: 12 }} mt={2} p={2}>
                    <Typography variant="body2" gutterBottom align="justify">
                        El SIIE estará integrado con otros sistemas, con el fin de
                        consolidar la información relativa a centros educativos, oferta
                        educativa, participantes, docentes (instructores y facilitadores),
                        trayectorias educativas, matrícula, financiadores y más.
                        <br />
                        <br />
                        El SIIE se vinculará con los sistemas de información de la
                        Secretaría de Educación (SEDUCA), la Dirección de Educación Superior
                        (DES-UNAH), el Instituto Nacional de Formación Profesional (INFOP) y
                        la Comisión para el Desarrollo de la Educación Alternativa No Formal
                        (CONEANFO), permitiendo el aprendizaje colaborativo mediante la
                        constitución de fichas estandarizadas de información que permitirán
                        generar indicadores e información.
                    </Typography>
                </Grid>
            </Grid>

            {/* Institución */}
            <Grid
                container
                spacing={2}
                alignItems="center"
                sx={{ backgroundColor: "#f5f5f5", borderRadius: 2 }}
            >
                <Grid item size={{ xs: 12, md: 6 }}>
                    <CardMedia
                        component="img"
                        image={conedLogo}
                        alt="Logo institución"
                        sx={{
                            maxWidth: 530,
                            margin: "auto",
                            transition: "transform 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.2)",
                            },
                        }}
                    />
                </Grid>
                <Grid item size={{ xs: 12, md: 6 }} marginTop={2}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Institución
                        </Typography>
                        <Typography variant="body2" color="text.primary" marginLeft={1}>
                            Secretaría Técnica del Consejo Nacional de Educación en Honduras
                        </Typography>
                        <br />
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Unidad
                        </Typography>
                        <Typography variant="body2" color="text.primary" marginLeft={1}>
                            Infotecnología
                        </Typography>
                        <br />
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Secretario Ejecutivo
                        </Typography>
                        <Typography variant="body2" color="text.primary" marginLeft={1}>
                            Nombre: Jose Alexis Ordoñes Velasquez <br />
                            Contacto:{" "}
                            <Link
                                href="mailto:alexis.ordoñez@coned.gob.hn"
                                underline="none"
                                sx={{ color: "#88CFE0", fontWeight: "bold" }}
                            >
                                alexis.ordoñez@coned.gob.hn
                            </Link>
                        </Typography>
                        <br />
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Miembros del Consejo
                            <Typography
                                variant="body2"
                                gutterBottom
                                fontWeight="bold"
                                sx={{ cursor: "pointer", color: "#88CFE0", marginLeft: 1 }}
                                onClick={() => setOpen(true)}
                            >
                                Ver listado completo
                            </Typography>
                        </Typography>


                        {/* Modal con listado */}
                        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                            <DialogTitle>
                                <Grid container spacing={2} >
                                    <Grid item variant="h3" container fontWeight="bold" alignItems="center" size={{ xs: 11, md: 11 }} >
                                        Miembros del Consejo Nacional de Educación
                                    </Grid>
                                    <Grid item size={{ xs: 1, md: 1 }} container justifyContent="flex-end">

                                        <IconButton onClick={() => setOpen(false)} aria-label="Cerrar" size="large" color="error">
                                            <Close />
                                        </IconButton>
                                    </Grid>

                                </Grid>
                            </DialogTitle>
                            <DialogContent dividers>
                                <Grid container spacing={2}>
                                    {miembros.map((miembro, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item size={{ xs: 12, md: 6 }}>
                                                <Typography variant="body1" >
                                                    {miembro.nombre}{/*•  DB473C*/}
                                                </Typography>

                                                <Typography variant="body2" color="#88CFE0">
                                                    {miembro.puesto}
                                                </Typography>
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom fontWeight="bold" align="center" sx={{ mt: 2 }}>
                                    Transporte
                                </Typography>
                                <Grid container spacing={2}>
                                    {trasporte.map((miembro, index) => (
                                        <React.Fragment key={index}>
                                            <Grid item size={{ xs: 12, md: 6 }}>
                                                <Typography variant="body1" >
                                                    {miembro.nombre}{/*•  DB473C*/}
                                                </Typography>

                                                <Typography variant="body2" color="#88CFE0">
                                                    {miembro.puesto}
                                                </Typography>
                                            </Grid>
                                        </React.Fragment>
                                    ))}
                                </Grid>
                            </DialogContent>

                        </Dialog>

                    </CardContent>
                </Grid>
            </Grid>

            {/* Coordinador del Proyecto | Desarrolladores*/}
            <Grid
                container
                spacing={4}
                sx={{ marginTop: 3, backgroundColor: "#f5f5f5", padding: 2, borderRadius: 2 }}
            >
                <Grid item size={{ xs: 12, md: 3 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Coordinador del Proyecto
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Nombre: Rubén Isaac Fú Flores <br />
                        Contacto: {" "}
                        <Link
                            href="mailto:ruben.fu@coned.gob.hn"
                            underline="none"
                            sx={{ color: "#88CFE0", fontWeight: "bold" }}
                        >
                            ruben.fu@coned.gob.hn
                        </Link>

                    </Typography>
                </Grid>

                <Grid item size={{ xs: 12, md: 3.5 }}>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Sub Coordinador del Proyecto
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Nombre: Abel Mauricio Cerrato Anchecta
                        <br />
                        Contacto:{" "}

                        <Link
                            href="mailto:abel.cerrato@coned.gob.hn"
                            underline="none"
                            sx={{ color: "#88CFE0", fontWeight: "bold" }}
                        >
                            abel.cerrato@coned.gob.hn
                        </Link>
                    </Typography>
                </Grid>
                <Grid item size={{ xs: 12, md: 5.5 }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                        fontWeight="bold"
                        align="center"
                    >
                        Desarrolladores
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                Nombre: Seydi Johana Lara Fuentes
                                <br />
                                Puesto: Desarrolladora BackEnd
                                <br />
                                Contacto:{" "}

                                <Link
                                    href="https://www.linkedin.com/in/seydi-johana-lara-fuentes-35b08a2a4"
                                    //underline="none"
                                    sx={{ color: "#88CFE0", fontWeight: "bold" }}
                                >
                                    LinkedIn
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid item size={{ xs: 12, sm: 6, md: 6 }}>
                            <Typography variant="body2" color="text.secondary">
                                Nombre: Luesbelin Julieth Mejia
                                <br />
                                Puesto: Desarrolladora FrontEnd
                                <br />
                                Contacto:{" "}
                                <Link
                                    href="https://www.linkedin.com/in/luesbelin-mejia-154546279"
                                    //underline="none"
                                    sx={{ color: "#88CFE0", fontWeight: "bold" }}
                                >
                                    LinkedIn
                                </Link>

                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}
