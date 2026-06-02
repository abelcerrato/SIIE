import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Paper,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    CircularProgress,
    Alert,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Chip,
    Pagination,
    Card,
    CardContent,
    IconButton,
    Tooltip
} from "@mui/material";
import { Download, FilterList, ChevronLeft, ChevronRight, ArrowCircleLeftOutlined } from "@mui/icons-material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useUser } from "../../components/UserContext";
import LogoCONED from "../../img/nueva-linea-grafica/Logo CONED.png";
import LogoSIIE from "../../img/nueva-linea-grafica/logos-siie-y-coned.png";

const toBase64 = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const ReportesDesUnah = () => {
    const [reporteSeleccionado, setReporteSeleccionado] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const { permissions } = useUser();

    // Configuración específica para cada reporte
    const reportes = [
        {
            value: "desestudiantesprimertitulo",
            label: "Estudiantes con Primer Título",
            endpoint: "/desestudiantesprimertitulo",
            config: {
                titulo: "Reporte Estudiantes con Primer Título",
                filtros: ["AÑO", "CINE", "SEXO", "SECTOR DE GESTIÓN", "CAMPO DE EDUCACIÓN Y CAPACITACIÓN",
                    "MODALIDAD", "RANGO DE EDAD",],
                columnasBase: [
                    "AÑO", "CINE", "SEXO", "SECTOR DE GESTIÓN", "CAMPO DE EDUCACIÓN Y CAPACITACIÓN",
                    "MODALIDAD", "RANGO DE EDAD", "TOTAL DE ESTUDIANTES DE PRIMER TÍTULO"
                ],
                encabezados: {
                    "AÑO": "Año",
                    "CINE": "CINE",
                    "SEXO": "Sexo",
                    "SECTOR DE GESTIÓN": "Sector de Gestión",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN": "Campo de Educación y Capacitación",
                    "MODALIDAD": "Modalidad",
                    "RANGO DE EDAD": "Rango de Edad",
                }
            }
        },
        {
            value: "desestudiantesprimertitulox10milhabitantes",
            label: "Estudiantes con Primer Título por 10 mil Habitantes",
            endpoint: "/desestudiantesprimertitulox10milhabitantes",
            config: {
                titulo: "Reporte Estudiantes con Primer Título por 10 mil Habitantes",
                filtros: ["AÑO", "CINE", "SEXO", "SECTOR DE GESTIÓN", "CAMPO DE EDUCACIÓN Y CAPACITACIÓN",
                    "MODALIDAD", "RANGO DE EDAD",],
                columnasBase: [
                    "AÑO", "CINE", "SEXO", "SECTOR DE GESTIÓN", "CAMPO DE EDUCACIÓN Y CAPACITACIÓN",
                    "MODALIDAD", "RANGO DE EDAD", "TOTAL DE ESTUDIANTES DE PRIMER TÍTULO", "POBLACION TOTAL",
                    "indicador_4_2_por_10000_hab"],
                encabezados: {
                    "AÑO": "Año",
                    "CINE": "CINE",
                    "SEXO": "Sexo",
                    "SECTOR DE GESTIÓN": "Sector de Gestión",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN": "Campo de Educación y Capacitación",
                    "MODALIDAD": "Modalidad",
                    "RANGO DE EDAD": "Rango de Edad",
                    "TOTAL DE ESTUDIANTES DE PRIMER TÍTULO": "Total de Estudiantes de Primer Título",
                    "POBLACION TOTAL": "Población Total",
                    "indicador_4_2_por_10000_hab": "Estudiantes con Primer Título por 10 mil Habitantes"
                },


            }
        },

        {
            value: "despersonasqueingresan",
            label: "Personas que Ingresan a la Educación Superior",
            endpoint: "/despersonasqueingresan",
            config: {
                titulo: "Reporte Personas que Ingresan a la Educación Superior",
                filtros: ["AÑO", "NOMBRE PROGRAMA", "TIPO_INGRESO", "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN", "MODALIDAD", "RANGO DE EDAD",],
                columnasBase: ["AÑO", "NOMBRE PROGRAMA", "TIPO_INGRESO", "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN", "MODALIDAD", "RANGO DE EDAD",
                    "PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR"],
                encabezados: {
                    "AÑO": "Año",
                    "NOMBRE PROGRAMA": "Nombre del Programa",
                    "TIPO_INGRESO": "Tipo de Ingreso",
                    "CINE": "CINE",
                    "SEXO": "Sexo",
                    "SECTOR DE GESTIÓN": "Sector de Gestión",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN": "Campo de Educación y Capacitación",
                    "MODALIDAD": "Modalidad",
                    "RANGO DE EDAD": "Rango de Edad",
                    "PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR": "Personas que Ingresan a la Educación Superior"
                },
            }
        },

        {
            value: "desnuevosingresosiniciarprograma",
            label: "Nuevos Ingresos que Inician Programa",
            endpoint: "/desnuevosingresosiniciarprograma",
            config: {
                titulo: "Reporte Nuevos Ingresos que Inician Programa",
                filtros: ["AÑO", "NOMBRE PROGRAMA", "GRADO_ACADEMICO", "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN", "MODALIDAD", "RANGO DE EDAD"],
                columnasBase: ["AÑO", "NOMBRE PROGRAMA", "GRADO_ACADEMICO", "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN", "MODALIDAD", "RANGO DE EDAD", "NUEVOS INGRESOS"],
                encabezados: {
                    "AÑO": "Año",
                    "NOMBRE PROGRAMA": "Nombre del Programa",
                    "GRADO_ACADEMICO": "Grado Académico",
                    "CINE": "CINE",
                    "SEXO": "Sexo",
                    "SECTOR DE GESTIÓN": "Sector de Gestión",

                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN": "Campo de Educación y Capacitación",
                    "MODALIDAD": "Modalidad",
                    "RANGO DE EDAD": "Rango de Edad",
                    "NUEVOS INGRESOS": "Nuevos Ingresos que Inician Programa"
                },
            }
        },
        {
            value: "desgraduados",
            label: "Graduados de la Educación Superior",
            endpoint: "/desgraduados",
            config: {
                titulo: "Reporte Graduados de la Educación Superior",
                filtros: ["AÑO", "NOMBRE PROGRAMA", "GRADO_ACADEMICO", "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "MODALIDAD", "RANGO DE EDAD"],
                columnasBase: ["AÑO", "NOMBRE PROGRAMA", "GRADO_ACADEMICO",
                    "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "MODALIDAD", "RANGO DE EDAD", "CANTIDAD DE EGRESADOS"],
                encabezados: {
                    "AÑO": "Año",
                    "NOMBRE PROGRAMA": "Nombre del Programa",
                    "GRADO_ACADEMICO": "Grado Académico",
                    "CINE": "CINE",
                    "SEXO": "Sexo",
                    "SECTOR DE GESTIÓN": "Sector de Gestión",
                    "MODALIDAD": "Modalidad",
                    "RANGO DE EDAD": "Rango de Edad",
                    "CANTIDAD DE EGRESADOS": "Cantidad de Graduados"
                },
            }
        },
        {
            value: "destasabrutamatricula",
            label: "Tasa Bruta de Matrícula",
            endpoint: "/destasabrutamatricula",
            config: {
                titulo: "Reporte Tasa Bruta de Matrícula",
                filtros: ["AÑO"],
                columnasBase: ["AÑO", "MATRICULA", "POBLACIÓN EDAD TEÓRICA", "TASA BRUTA DE MATRÍCULA"],
                encabezados: {
                    "AÑO": "Año",
                    "MATRICULA": "Matrícula",
                    "POBLACIÓN EDAD TEÓRICA": "Población de Edad Teórica",
                    "TASA BRUTA DE MATRÍCULA": "Tasa Bruta de Matrícula"
                },
            }
        },
        {
            value: "destasanetamatricula",
            label: "Tasa Neta de Matrícula",
            endpoint: "/destasanetamatricula",
            config: {
                titulo: "Reporte Tasa Neta de Matrícula",
                filtros: ["AÑO"],
                columnasBase: ["AÑO", "MATRICULA DE 18 A 24", "POBLACIÓN EDAD TEÓRICA", "TASA NETA DE MATRÍCULA"],
                encabezados: {
                    "AÑO": "Año",
                    "MATRICULA DE 18 A 24": "Matrícula de 18 a 24",
                    "POBLACIÓN EDAD TEÓRICA": "Población de Edad Teórica",
                    "TASA NETA DE MATRÍCULA": "Tasa Neta de Matrícula"
                },
            }
        },
        {
            value: "desestudiantesinternacionales",
            label: "Estudiantes Internacionales",
            endpoint: "/desestudiantesinternacionales",
            config: {
                titulo: "Reporte Estudiantes Internacionales",
                filtros: ["AÑO", "NACIONALIDAD", "TITULO_EDMEDIA", "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN", "MODALIDAD", "RANGO DE EDAD"],
                columnasBase: ["AÑO", "NACIONALIDAD", "TITULO_EDMEDIA", "CINE", "SEXO", "SECTOR DE GESTIÓN",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN", "MODALIDAD", "RANGO DE EDAD",
                    "ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO",
                    "MATRICULA", "PORCENTAJE DE ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO"],
                encabezados: {
                    "AÑO": "Año",
                    "NACIONALIDAD": "Nacionalidad",
                    "TITULO_EDMEDIA": "Título de Educación Media",
                    "CINE": "CINE",
                    "SEXO": "Sexo",
                    "SECTOR DE GESTIÓN": "Sector de Gestión",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN": "Campo de Educación y Capacitación",
                    "MODALIDAD": "Modalidad",
                    "RANGO DE EDAD": "Rango de Edad",
                    "ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO": "Estudiantes Internacionales de Ciclo Completo",
                    "MATRICULA": "Matrícula",
                    "PORCENTAJE DE ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO": "Porcentaje de Estudiantes Internacionales de Ciclo Completo"
                },
            }
        },
        {
            value: "desestudianteseducacionsuperior",
            label: "Estudiantes de Educación Superior",
            endpoint: "/desestudianteseducacionsuperior",
            config: {
                titulo: "Reporte Estudiantes de Educación Superior",
                filtros: ["AÑO", "NOMBRE PROGRAMA", "TIPO_INGRESO", "CINE", "SEXO", "SECTOR DE GESTIÓN", "CAMPO DE EDUCACIÓN Y CAPACITACIÓN",
                    "MODALIDAD", "RANGO DE EDAD"],
                columnasBase: ["AÑO", "NOMBRE PROGRAMA", "TIPO_INGRESO", "CINE", "SEXO", "SECTOR DE GESTIÓN", "CAMPO DE EDUCACIÓN Y CAPACITACIÓN",
                    "MODALIDAD", "RANGO DE EDAD", "ESTUDIANTES EN LA EDUCACIÓN SUPERIOR"],
                encabezados: {
                    "AÑO": "Año",
                    "NOMBRE PROGRAMA": "Nombre del Programa",
                    "TIPO_INGRESO": "Tipo de Ingreso",
                    "CINE": "CINE",
                    "SEXO": "Sexo",
                    "SECTOR DE GESTIÓN": "Sector de Gestión",
                    "CAMPO DE EDUCACIÓN Y CAPACITACIÓN": "Campo de Educación y Capacitación",
                    "MODALIDAD": "Modalidad",
                    "RANGO DE EDAD": "Rango de Edad",
                    "ESTUDIANTES EN LA EDUCACIÓN SUPERIOR": "Estudiantes en la Educación Superior"
                },
            }
        },
    ];

    // Obtener configuración del reporte actual
    const getConfigReporte = () => {
        return reportes.find(r => r.value === reporteSeleccionado)?.config || {};
    };

    // Función para obtener el encabezado formateado
    const getEncabezado = (columna) => {
        const config = getConfigReporte();
        return config.encabezados?.[columna] || columna;
    };

    // Inicializar filtros cuando se selecciona un reporte
    useEffect(() => {
        if (reporteSeleccionado) {
            const config = getConfigReporte();
            const nuevosFiltros = {};

            config.filtros?.forEach(filtro => {
                nuevosFiltros[filtro] = "";
            });
            nuevosFiltros.valor = "";

            setFilters(nuevosFiltros);
        }
    }, [reporteSeleccionado]);

    // Obtener datos de la API
    useEffect(() => {
        if (reporteSeleccionado) {
            const fetchData = async () => {
                try {
                    setLoading(true);
                    setError("");
                    const reporte = reportes.find(r => r.value === reporteSeleccionado);
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}${reporte.endpoint}`);
                    setData(response.data);
                    setLoading(false);
                    setPage(1);
                } catch (err) {
                    setError("Error al cargar los datos del reporte");
                    setLoading(false);
                    console.error("Error:", err);
                }
            };

            fetchData();
        }
    }, [reporteSeleccionado]);


    // Filtrar datos
    const getFilteredDataForFiltro = (filtroActual) => {
        return data.filter(item => {
            return Object.keys(filters).every(key => {
                // Ignorar el filtro que estamos calculando
                if (key === filtroActual || key === "valor") return true;

                if (!filters[key]) return true;

                const valorItem = item[key];
                if (valorItem == null) return false;

                return (
                    valorItem.toString().trim().toLowerCase() ===
                    filters[key].toString().trim().toLowerCase()
                );
            });
        });
    };

    const getValoresUnicos = (campo) => {
        const datosFiltrados = getFilteredDataForFiltro(campo);

        return [...new Set(datosFiltrados.map(item => item[campo]))]
            .filter(val => val != null && val !== "")
            .sort();
    };


    const filteredData = data.filter(item => {
        return Object.keys(filters).every(key => {
            if (key === "valor" || !filters[key]) return true;

            const valor = item[key];
            if (valor == null || valor === "") return false;

            return (
                valor.toString().trim().toLowerCase() ===
                filters[key].toString().trim().toLowerCase()
            );
        });
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setPage(1);
    };

    const clearFilters = () => {
        const config = getConfigReporte();
        const nuevosFiltros = {};

        config.filtros?.forEach(filtro => {
            nuevosFiltros[filtro] = "";
        });
        nuevosFiltros.valor = "";

        setFilters(nuevosFiltros);
        setPage(1);
    };

    // Paginación
    const getPaginatedData = () => {
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        return Math.ceil(filteredData.length / rowsPerPage);
    };

    const totalPages = getTotalPages();
    const paginatedData = getPaginatedData();

    const downloadExcel = async () => {
        let datosParaExcel = [];
        let nombreArchivo = "";
        let nombreHoja = "";
        let tituloReporte = "";

        const now = new Date();
        const fechaHora = now.toLocaleString("es-HN", {
            dateStyle: "full",
            timeStyle: "short",
        });

        // 🔹 Reporte general
        const reporte = reportes.find((r) => r.value === reporteSeleccionado);
        const configReporte = getConfigReporte();
        const columnasAMostrar = configReporte.columnasBase;

        datosParaExcel = filteredData.map((item) => {
            const fila = {};
            columnasAMostrar.forEach((col) => {
                const encabezadoExcel = getEncabezado(col);
                fila[encabezadoExcel] = item[col];
            });
            return fila;
        });

        nombreArchivo = `${reporte.label.toLowerCase().replace(/\s+/g, "_")}.xlsx`;
        nombreHoja = reporte.label;
        tituloReporte = reporte.label;

        // 🧾 Crear workbook y hoja
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(nombreHoja);

        const image1Base64 = await toBase64(LogoCONED);
        const image2Base64 = await toBase64(LogoSIIE);

        // Agregar imágenes
        const image1 = workbook.addImage({
            base64: image1Base64,
            extension: "png",
        });
        const image2 = workbook.addImage({
            base64: image2Base64,
            extension: "png",
        });

        // Insertar las imágenes en el archivo Excel
        worksheet.addImage(image1, "A1:B9");
        worksheet.addImage(image2, "F2:H8");

        worksheet.mergeCells("C5", "E5");
        const titleCell = worksheet.getCell("C5");
        titleCell.value = tituloReporte;
        titleCell.font = { size: 16, bold: true, color: { argb: "88CFE0" } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells("C6", "E6");
        const dateCell = worksheet.getCell("C6");
        dateCell.value = `Generado el: ${fechaHora}`;
        dateCell.alignment = { horizontal: "center" };

        worksheet.addRow([]);
        worksheet.addRow([]);

        // 🧱 Agregar encabezados de tabla
        if (datosParaExcel.length > 0) {
            const headers = Object.keys(datosParaExcel[0]);
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "88CFE0" },
                };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

            // 📊 Agregar datos
            datosParaExcel.forEach((fila) => {
                const filaData = worksheet.addRow(Object.values(fila));
                filaData.eachCell((cell) => {
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                    cell.alignment = { vertical: "middle" };
                });
            });

            // Ajuste de ancho de columnas automático
            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const value = cell.value ? cell.value.toString() : "";
                    maxLength = Math.max(maxLength, value.length);
                });
                column.width = maxLength < 12 ? 12 : maxLength + 2;
            });

            // Asegurar ancho fijo del bloque del título
            worksheet.getColumn(3).width = 25; // C
            worksheet.getColumn(4).width = 25; // D
            worksheet.getColumn(5).width = 25; // E
        }

        // 💾 Generar archivo
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "DES-UNAH_" + nombreArchivo);
    };

    const activeFiltersCount = Object.values(filters).filter(val => val !== "").length;

    // Renderizar filtros dinámicamente para reportes
    const renderFiltros = () => {
        const config = getConfigReporte();

        return config.filtros?.map(filtro => {
            // Verificar si hay opciones predefinidas para este filtro
            const opcionesPredefinidas = config.opcionesFiltros?.[filtro];

            if (opcionesPredefinidas) {
                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={filtro}>
                        <FormControl fullWidth size="small">
                            <InputLabel>{getEncabezado(filtro)}</InputLabel>
                            <Select
                                value={filters[filtro] || ""}
                                onChange={(e) => handleFilterChange(filtro, e.target.value)}
                                label={getEncabezado(filtro)}
                            >
                                {opcionesPredefinidas.map(opcion => (
                                    <MenuItem key={opcion.value} value={opcion.value}>
                                        {opcion.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                );
            }

            // Para filtros de texto
            if (config.filtrosTexto?.includes(filtro)) {
                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={filtro}>
                        <TextField
                            fullWidth
                            size="small"
                            label={getEncabezado(filtro)}
                            value={filters[filtro] || ""}
                            onChange={(e) => handleFilterChange(filtro, e.target.value)}
                            placeholder={`Buscar ${getEncabezado(filtro).toLowerCase()}...`}
                        />
                    </Grid>
                );
            }

            // Filtro dinámico basado en datos
            const valoresUnicos = getValoresUnicos(filtro);

            return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={filtro}>
                    <FormControl fullWidth size="small">
                        <InputLabel>{getEncabezado(filtro)}</InputLabel>
                        <Select
                            value={filters[filtro] || ""}
                            onChange={(e) => handleFilterChange(filtro, e.target.value)}
                            label={getEncabezado(filtro)}
                        >
                            <MenuItem value="">Todos</MenuItem>
                            {valoresUnicos.map(valor => (
                                <MenuItem key={valor} value={valor}>{valor}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            );
        });
    };

    // Renderizar vista para reportes
    const renderReporte = () => {
        const config = getConfigReporte();
        const columnasAMostrar = config.columnasBase;

        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Box p={3}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            );
        }

        return (
            <>
                {/* 🔹 Encabezado con botón volver y título */}
                <Tooltip title="Volver">
                    <IconButton
                        aria-label="Volver"
                        onClick={() => {
                            setReporteSeleccionado("");
                            setData([]);
                            setFilters({});
                        }}
                    >
                        <ArrowCircleLeftOutlined sx={{ fontSize: 40, color: "red" }} />
                    </IconButton>
                </Tooltip>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: "bold",
                        color: "#88CFE0",
                        textAlign: "center",
                        wordWrap: "break-word",
                        mb: 2
                    }}
                >
                    {config.titulo}
                </Typography>

                {/* 🔹 Filtros */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f1f1f1ff" }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <FilterList sx={{ mr: 1 }} />
                        <Typography variant="h6">Filtros</Typography>

                        {activeFiltersCount > 0 && (
                            <Chip
                                label={`${activeFiltersCount} activos`}
                                size="small"
                                sx={{ ml: 1 }}
                                onDelete={clearFilters}
                            />
                        )}
                    </Box>

                    <Grid container spacing={2}>{renderFiltros()}</Grid>
                </Paper>

                {/* 🔹 Contenedor del botón de descarga */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={downloadExcel}
                        sx={{
                            backgroundColor: "#88CFE0",
                            "&:hover": { backgroundColor: "#ff0000ff" },
                        }}
                    >
                        Descargar Excel
                    </Button>
                </Box>

                {/* 🔹 Tabla con controles */}
                <Paper sx={{ p: 3 }}>
                    {/* Controles superiores */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: 2,
                            mb: 2,
                        }}
                    >
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Mostrando {filteredData.length} registros • Página {page} de {totalPages}
                        </Typography>

                        <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Filas por página</InputLabel>
                            <Select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(e.target.value);
                                    setPage(1);
                                }}
                                label="Filas por página"
                            >
                                {[10, 25, 50, 100, 200].map((num) => (
                                    <MenuItem key={num} value={num}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Paginación superior */}
                    {totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(event, value) => setPage(value)}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />
                        </Box>
                    )}

                    {/* Tabla */}
                    <TableContainer sx={{ maxHeight: 600, overflow: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columnasAMostrar.map((columna) => (
                                        <TableCell
                                            key={columna}
                                            sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                                        >
                                            {getEncabezado(columna)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedData.map((item, index) => (
                                    <TableRow key={index} hover>
                                        {columnasAMostrar.map((columna) => (
                                            <TableCell key={`${columna}-${index}`}>
                                                {item[columna] ?? "-"}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredData.length === 0 && (
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" color="text.secondary">
                                No se encontraron resultados con los filtros aplicados
                            </Typography>
                        </Box>
                    )}

                    {/* Paginación inferior */}
                    {filteredData.length > 0 && totalPages > 1 && (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mt: 2,
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary">
                                Mostrando {((page - 1) * rowsPerPage) + 1}-
                                {Math.min(page * rowsPerPage, filteredData.length)} de{" "}
                                {filteredData.length} registros
                            </Typography>

                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(event, value) => setPage(value)}
                                color="primary"
                                showFirstButton
                                showLastButton
                            />

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    size="small"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    startIcon={<ChevronLeft />}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    size="small"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    endIcon={<ChevronRight />}
                                >
                                    Siguiente
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </>
        );
    };


    const tienePermiso = (idmodulo) => permissions?.find(p => p.idmodulo === idmodulo)?.consultar;

    return (
        <>
            {tienePermiso(4) && (
                <Paper sx={{ p: 3, background: "#f5f7fa", boxShadow: "0px 4px 20px rgba(0,0,0,0.08)" }}>
                    {/* Selección de Reporte */}
                    {!reporteSeleccionado && (
                        <Box
                            sx={{
                                p: 3,
                                display: "flex",
                                justifyContent: "center",   // centra horizontalmente
                                alignItems: "center",       // centra verticalmente
                                minHeight: "70vh",          // altura mínima para centrar verticalmente
                            }}
                        >
                            <Grid container spacing={3} justifyContent="center">
                                {reportes.map((reporte) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }} key={reporte.value}>
                                        <Card
                                            sx={{
                                                cursor: "pointer",
                                                borderRadius: 2,
                                                transition: "all 0.3s",
                                                backgroundColor: "#fff",
                                                width: 250,
                                                height: 250,
                                                "&:hover": {
                                                    transform: "translateY(-5px)",
                                                    backgroundColor: "#88CFE0",
                                                    color: "#fff"
                                                }
                                            }}
                                            onClick={() => setReporteSeleccionado(reporte.value)}
                                        >
                                            <CardContent
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "100%",
                                                    textAlign: "center",
                                                }}
                                            >
                                                <Typography variant="h6" component="div" gutterBottom >
                                                    {reporte.label}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Generar reporte
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {/* Vista para reportes */}
                    {reporteSeleccionado && renderReporte()}
                </Paper>
            )}
        </>
    );
};

export default ReportesDesUnah;