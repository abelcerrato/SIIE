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
import color from "../../components/color";

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

const ReportesInfop = () => {
    const [reporteSeleccionado, setReporteSeleccionado] = useState("");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const { permissions } = useUser();

    // Configuración específica para cada reporte (mantener igual)
    const reportes = [
        // ... (todos los reportes igual que antes)
        {
            value: "infopcapacitadospordepartamentos",
            label: "Capacitaciones por Departamento y Municipio",
            endpoint: "/infopcapacitadospordepartamentos",
            config: {
                titulo: "Reporte Capacitaciones por Departamento y Municipio",
                filtros: ["anio", "departamento", "municipio"],
                columnasBase: [
                    "anio",
                    "departamento",
                    "municipio",
                    "horas_impartidas",
                    "cursos_finalizados",
                    "matriculados_hombre",
                    "matriculados_mujer",
                    "matriculados_total",
                    "aprobados_hombre",
                    "aprobados_mujer",
                    "aprobados_total",
                    "desertores_hombre",
                    "desertores_mujer",
                    "desertores_total",
                    "reprobados_hombre",
                    "reprobados_mujer",
                    "reprobados_total"
                ],
                encabezados: {
                    "anio": "Año",
                    "departamento": "Departamento",
                    "municipio": "Municipio",
                    "horas_impartidas": "Horas Impartidas",
                    "cursos_finalizados": "Cursos Finalizados",
                    "matriculados_hombre": "Matriculados Hombre",
                    "matriculados_mujer": "Matriculados Mujer",
                    "matriculados_total": "Matriculados Total",
                    "aprobados_hombre": "Aprobados Hombre",
                    "aprobados_mujer": "Aprobados Mujer",
                    "aprobados_total": "Aprobados Total",
                    "desertores_hombre": "Desertores Hombre",
                    "desertores_mujer": "Desertores Mujer",
                    "desertores_total": "Desertores Total",
                    "reprobados_hombre": "Reprobados Hombre",
                    "reprobados_mujer": "Reprobados Mujer",
                    "reprobados_total": "Reprobados Total"
                }
            }
        },
        // ... (resto de reportes igual)
    ];

    const getConfigReporte = () => {
        return reportes.find(r => r.value === reporteSeleccionado)?.config || {};
    };

    const getEncabezado = (columna) => {
        const config = getConfigReporte();
        return config.encabezados?.[columna] || columna;
    };

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

    const getValoresUnicos = (campo) => {
        let datosFiltrados = data;
        const filtrosAplicar = { ...filters };
        delete filtrosAplicar[campo];

        if (campo === 'departamento') {
            delete filtrosAplicar.municipio;
        }

        if (campo === 'municipio' && filters.departamento) {
            datosFiltrados = data.filter(item =>
                item.departamento === filters.departamento
            );
        }

        Object.keys(filtrosAplicar).forEach(key => {
            if (filtrosAplicar[key] && key !== 'valor') {
                datosFiltrados = datosFiltrados.filter(item =>
                    item[key] === filtrosAplicar[key]
                );
            }
        });

        return [...new Set(datosFiltrados.map(item => item[campo]))]
            .filter(val => val != null && val !== "")
            .sort();
    };

    const getMunicipiosFiltrados = () => {
        if (filters.departamento) {
            const municipiosPorDepartamento = data
                .filter(item => item.departamento === filters.departamento)
                .map(item => item.municipio);

            return [...new Set(municipiosPorDepartamento)]
                .filter(val => val != null && val !== "")
                .sort();
        } else {
            return [...new Set(data.map(item => item.municipio))]
                .filter(val => val != null && val !== "")
                .sort();
        }
    };

    const filteredData = data.filter(item => {
        return Object.keys(filters).every(key => {
            if (key === "valor" || !filters[key]) return true;

            const valor = item[key];
            if (valor == null || valor === "") return false;

            const valorStr = valor.toString().trim().toLowerCase();
            const filtroStr = filters[key].toString().trim().toLowerCase();

            return valorStr === filtroStr;
        });
    });

    const handleFilterChange = (field, value) => {
        setFilters(prev => {
            const nuevosFiltros = { ...prev, [field]: value };
            if (field === 'departamento' && value !== prev.departamento) {
                nuevosFiltros.municipio = "";
            }
            return nuevosFiltros;
        });
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

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet(nombreHoja);

        const image1Base64 = await toBase64(LogoCONED);
        const image2Base64 = await toBase64(LogoSIIE);

        const image1 = workbook.addImage({
            base64: image1Base64,
            extension: "png",
        });
        const image2 = workbook.addImage({
            base64: image2Base64,
            extension: "png",
        });

        worksheet.addImage(image1, "A1:B9");
        worksheet.addImage(image2, "F2:H8");

        worksheet.mergeCells("C5", "E5");
        const titleCell = worksheet.getCell("C5");
        titleCell.value = tituloReporte;
        titleCell.font = { size: 16, bold: true, color: { argb: color.primary.replace("#", "") } };
        titleCell.alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells("C6", "E6");
        const dateCell = worksheet.getCell("C6");
        dateCell.value = `Generado el: ${fechaHora}`;
        dateCell.alignment = { horizontal: "center" };

        worksheet.addRow([]);
        worksheet.addRow([]);

        if (datosParaExcel.length > 0) {
            const headers = Object.keys(datosParaExcel[0]);
            const headerRow = worksheet.addRow(headers);

            headerRow.eachCell((cell) => {
                cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
                cell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: color.primary.replace("#", "") },
                };
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" },
                };
            });

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

            worksheet.columns.forEach((column) => {
                let maxLength = 0;
                column.eachCell({ includeEmpty: true }, (cell) => {
                    const value = cell.value ? cell.value.toString() : "";
                    maxLength = Math.max(maxLength, value.length);
                });
                column.width = maxLength < 12 ? 12 : maxLength + 2;
            });

            worksheet.getColumn(3).width = 25;
            worksheet.getColumn(4).width = 25;
            worksheet.getColumn(5).width = 25;
        }

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "INFOP_" + nombreArchivo);
    };

    const activeFiltersCount = Object.values(filters).filter(val => val !== "").length;

    const renderFiltros = () => {
        const config = getConfigReporte();

        return config.filtros?.map(filtro => {
            const opcionesPredefinidas = config.opcionesFiltros?.[filtro];

            if (opcionesPredefinidas) {
                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={filtro}>
                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ color: color.contrastText }}>{getEncabezado(filtro)}</InputLabel>
                            <Select
                                value={filters[filtro] || ""}
                                onChange={(e) => handleFilterChange(filtro, e.target.value)}
                                label={getEncabezado(filtro)}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": { borderColor: color.primary },
                                        "&.Mui-focused fieldset": { borderColor: color.primary }
                                    }
                                }}
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
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": { borderColor: color.primary },
                                    "&.Mui-focused fieldset": { borderColor: color.primary }
                                }
                            }}
                        />
                    </Grid>
                );
            }

            if (filtro === 'departamento') {
                const departamentosUnicos = [...new Set(data.map(item => item.departamento))]
                    .filter(val => val != null && val !== "")
                    .sort();

                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={filtro}>
                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ color: color.contrastText }}>{getEncabezado(filtro)}</InputLabel>
                            <Select
                                value={filters[filtro] || ""}
                                onChange={(e) => handleFilterChange(filtro, e.target.value)}
                                label={getEncabezado(filtro)}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": { borderColor: color.primary },
                                        "&.Mui-focused fieldset": { borderColor: color.primary }
                                    }
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {departamentosUnicos.map(departamento => (
                                    <MenuItem key={departamento} value={departamento}>
                                        {departamento}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                );
            }

            if (filtro === 'municipio' && config.filtros?.includes('departamento')) {
                const municipiosFiltrados = getMunicipiosFiltrados();

                return (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={filtro}>
                        <FormControl fullWidth size="small">
                            <InputLabel sx={{ color: color.contrastText }}>{getEncabezado(filtro)}</InputLabel>
                            <Select
                                value={filters[filtro] || ""}
                                onChange={(e) => handleFilterChange(filtro, e.target.value)}
                                label={getEncabezado(filtro)}
                                disabled={municipiosFiltrados.length === 0}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": { borderColor: color.primary },
                                        "&.Mui-focused fieldset": { borderColor: color.primary }
                                    }
                                }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {municipiosFiltrados.map(municipio => (
                                    <MenuItem key={municipio} value={municipio}>
                                        {municipio}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {filters.departamento && (
                            <Typography variant="caption" sx={{ color: color.contrastText, mt: 0.5, display: 'block' }}>
                                {municipiosFiltrados.length} municipio(s) en {filters.departamento}
                            </Typography>
                        )}
                    </Grid>
                );
            }

            const valoresUnicos = getValoresUnicos(filtro);

            return (
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={filtro}>
                    <FormControl fullWidth size="small">
                        <InputLabel sx={{ color: color.contrastText }}>{getEncabezado(filtro)}</InputLabel>
                        <Select
                            value={filters[filtro] || ""}
                            onChange={(e) => handleFilterChange(filtro, e.target.value)}
                            label={getEncabezado(filtro)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    "&:hover fieldset": { borderColor: color.primary },
                                    "&.Mui-focused fieldset": { borderColor: color.primary }
                                }
                            }}
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

    const renderReporte = () => {
        const config = getConfigReporte();
        const columnasAMostrar = config.columnasBase;

        if (loading) {
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress sx={{ color: color.primary }} />
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
                <Tooltip title="Volver">
                    <IconButton
                        aria-label="Volver"
                        onClick={() => {
                            setReporteSeleccionado("");
                            setData([]);
                            setFilters({});
                        }}
                        sx={{ color: color.secondary }}
                    >
                        <ArrowCircleLeftOutlined sx={{ fontSize: 40 }} />
                    </IconButton>
                </Tooltip>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        fontWeight: "bold",
                        color: color.primary,
                        textAlign: "center",
                        wordWrap: "break-word",
                        mb: 2
                    }}
                >
                    {config.titulo}
                </Typography>

                <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5", borderRadius: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <FilterList sx={{ mr: 1, color: color.primary }} />
                        <Typography variant="h6" sx={{ color: color.primary }}>Filtros</Typography>

                        {activeFiltersCount > 0 && (
                            <Chip
                                label={`${activeFiltersCount} activos`}
                                size="small"
                                sx={{ ml: 1, backgroundColor: color.secondary, color: color.white }}
                                onDelete={clearFilters}
                            />
                        )}
                    </Box>

                    <Grid container spacing={2}>{renderFiltros()}</Grid>
                </Paper>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={downloadExcel}
                        sx={{ backgroundColor: color.secondary, "&:hover": { backgroundColor: color.primary } }}
                    >
                        Descargar Excel
                    </Button>
                </Box>

                <Paper sx={{ p: 3, borderRadius: 2, backgroundColor: color.white }}>
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
                        <Typography variant="body2" sx={{ color: color.contrastText }}>
                            Mostrando {filteredData.length} registros • Página {page} de {totalPages}
                        </Typography>

                        <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                            <InputLabel sx={{ color: color.contrastText }}>Filas por página</InputLabel>
                            <Select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(e.target.value);
                                    setPage(1);
                                }}
                                label="Filas por página"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&:hover fieldset": { borderColor: color.primary },
                                        "&.Mui-focused fieldset": { borderColor: color.primary }
                                    }
                                }}
                            >
                                {[10, 25, 50, 100, 200].map((num) => (
                                    <MenuItem key={num} value={num}>
                                        {num}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={(event, value) => setPage(value)}
                                color="primary"
                                showFirstButton
                                showLastButton
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        "&.Mui-selected": {
                                            backgroundColor: color.primary,
                                            color: color.white
                                        }
                                    }
                                }}
                            />
                        </Box>
                    )}

                    <TableContainer sx={{ maxHeight: 600, overflow: "auto" }}>
                        <Table stickyHeader size="small">
                            <TableHead>
                                <TableRow>
                                    {columnasAMostrar.map((columna) => (
                                        <TableCell
                                            key={columna}
                                            sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white }}
                                        >
                                            {getEncabezado(columna)}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedData.map((item, index) => (
                                    <TableRow key={index} hover>
                                        {columnasAMostrar.map((columna) => {
                                            const valor = item[columna];
                                            const esTasa = columna.startsWith("tasa_");
                                            const valorFormateado =
                                                valor === null || valor === undefined
                                                    ? "-"
                                                    : esTasa
                                                        ? `${(valor * 100).toFixed(2)} %`
                                                        : valor;

                                            return (
                                                <TableCell key={`${columna}-${index}`}>
                                                    {valorFormateado}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {filteredData.length === 0 && (
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" sx={{ color: color.contrastText }}>
                                No se encontraron resultados con los filtros aplicados
                            </Typography>
                        </Box>
                    )}

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
                            <Typography variant="body2" sx={{ color: color.contrastText }}>
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
                                sx={{
                                    "& .MuiPaginationItem-root": {
                                        "&.Mui-selected": {
                                            backgroundColor: color.primary,
                                            color: color.white
                                        }
                                    }
                                }}
                            />

                            <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    size="small"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    startIcon={<ChevronLeft />}
                                    sx={{ color: color.primary }}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    size="small"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    endIcon={<ChevronRight />}
                                    sx={{ color: color.primary }}
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
            {tienePermiso(2) && (
                <Paper sx={{ p: 3, backgroundColor: "#f5f7fa", borderRadius: 2, boxShadow: "0px 4px 20px rgba(0,0,0,0.08)" }}>
                    {!reporteSeleccionado && (
                        <Box
                            sx={{
                                p: 3,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: "70vh",
                            }}
                        >
                            <Grid container spacing={2} justifyContent="center">
                                {reportes.map((reporte) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={reporte.value}>
                                        <Card
                                            sx={{
                                                cursor: "pointer",
                                                borderRadius: 2,
                                                transition: "all 0.3s",
                                                backgroundColor: color.white,
                                                width: 250,
                                                height: 250,
                                                border: `1px solid ${color.primary}20`,
                                                "&:hover": {
                                                    transform: "translateY(-5px)",
                                                    backgroundColor: color.primary,
                                                    color: color.white,
                                                    boxShadow: "0px 8px 25px rgba(0,0,0,0.15)"
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
                                                <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: "bold" }}>
                                                    {reporte.label}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "inherit" }}>
                                                    Generar reporte
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {reporteSeleccionado && renderReporte()}
                </Paper>
            )}
        </>
    );
};

export default ReportesInfop;