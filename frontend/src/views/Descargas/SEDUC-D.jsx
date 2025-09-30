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
} from "@mui/material";
import { Download, FilterList, ChevronLeft, ChevronRight } from "@mui/icons-material";
import * as XLSX from "xlsx";

const NivelesAcademicos = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState({
        periodo: "",
        departamento: "",
        nivel: "",
        categoria: "",
        sexo: "",
        valor: ""
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(50);

    // Obtener datos de la API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/niveles`);
                setData(response.data);
                setLoading(false);
            } catch (err) {
                setError("Error al cargar los datos");
                setLoading(false);
                console.error("Error:", err);
            }
        };

        fetchData();
    }, []);

    // Obtener valores únicos para los filtros
    const periodos = [...new Set(data.map(item => item.Periodo))].sort();
    const departamentos = [...new Set(data.map(item => item.Departamento))].sort();
    const niveles = ["", "Prebasica", "Basica", "Media", "General"];
    const categorias = ["", "Matricula", "Desercion", "Cancelacion", "MatriculaFinal", "Reprobados", "Aprobados", "Repitencias"];
    const sexos = ["", "Mujer", "Hombre", "Total"];

    // Función para determinar qué columnas mostrar
    const getColumnasAMostrar = () => {
        const columnasBase = ["Periodo", "Departamento"];

        if (!filters.categoria && !filters.nivel && !filters.sexo) {
            return Object.keys(data[0] || {});
        }

        const columnasFiltradas = [...columnasBase];

        if (filters.categoria && filters.nivel && filters.sexo) {
            const columna = filters.nivel === "General"
                ? `${filters.categoria}TotalGeneral`
                : `${filters.categoria}${filters.sexo}${filters.nivel}`;
            columnasFiltradas.push(columna);
        } else if (filters.categoria && filters.nivel) {
            if (filters.nivel === "General") {
                columnasFiltradas.push(`${filters.categoria}TotalGeneral`);
            } else {
                columnasFiltradas.push(
                    `${filters.categoria}Mujer${filters.nivel}`,
                    `${filters.categoria}Hombre${filters.nivel}`,
                    `${filters.categoria}Total${filters.nivel}`
                );
            }
        } else if (filters.categoria && filters.sexo) {
            niveles.filter(n => n).forEach(nivel => {
                if (nivel === "General") {
                    columnasFiltradas.push(`${filters.categoria}TotalGeneral`);
                } else {
                    columnasFiltradas.push(`${filters.categoria}${filters.sexo}${nivel}`);
                }
            });
        } else if (filters.categoria) {
            Object.keys(data[0] || {}).forEach(col => {
                if (col.startsWith(filters.categoria)) {
                    columnasFiltradas.push(col);
                }
            });
        } else if (filters.nivel) {
            Object.keys(data[0] || {}).forEach(col => {
                if (filters.nivel === "General") {
                    if (col.endsWith("General")) columnasFiltradas.push(col);
                } else if (col.includes(filters.nivel)) {
                    columnasFiltradas.push(col);
                }
            });
        } else if (filters.sexo) {
            Object.keys(data[0] || {}).forEach(col => {
                if (filters.sexo === "Total") {
                    if (col.includes("Total")) columnasFiltradas.push(col);
                } else if (col.includes(filters.sexo)) {
                    columnasFiltradas.push(col);
                }
            });
        }

        return [...new Set(columnasFiltradas)];
    };

    // Filtrar datos
    const filteredData = data.filter(item => {
        const matchesPeriodo = !filters.periodo || item.Periodo === filters.periodo;
        const matchesDepartamento = !filters.departamento || item.Departamento.includes(filters.departamento);
        const matchesValor = !filters.valor || aplicarFiltroValor(item);

        return matchesPeriodo && matchesDepartamento && matchesValor;
    });

    const aplicarFiltroValor = (item) => {
        if (!filters.valor) return true;

        const columnasAMostrar = getColumnasAMostrar();

        return columnasAMostrar.some(columna => {
            if (columna === "Periodo" || columna === "Departamento") return false;

            const valor = item[columna];
            return valor !== null && valor !== undefined &&
                valor.toString().includes(filters.valor);
        });
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value
        }));
        setPage(1); // Resetear a primera página cuando cambian los filtros
    };

    const clearFilters = () => {
        setFilters({
            periodo: "",
            departamento: "",
            nivel: "",
            categoria: "",
            sexo: "",
            valor: ""
        });
        setPage(1);
    };

    // Paginación
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    const downloadExcel = () => {
        const columnasAMostrar = getColumnasAMostrar();
        const datosParaExcel = filteredData.map(item => {
            const fila = {};
            columnasAMostrar.forEach(col => {
                fila[col] = item[col];
            });
            return fila;
        });

        const worksheet = XLSX.utils.json_to_sheet(datosParaExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Niveles Académicos");
        XLSX.writeFile(workbook, "niveles_academicos.xlsx");
    };

    const activeFiltersCount = Object.values(filters).filter(val => val !== "").length;
    const columnasAMostrar = getColumnasAMostrar();

    // Función para agrupar columnas por categoría y nivel
    const getEstructuraColumnas = () => {
        const estructura = {};

        columnasAMostrar.forEach(columna => {
            if (columna === "Periodo" || columna === "Departamento") return;

            // Extraer categoría, sexo y nivel de la columna
            let categoria, sexo, nivel;

            if (columna.endsWith("General")) {
                categoria = columna.replace("TotalGeneral", "");
                sexo = "Total";
                nivel = "General";
            } else {
                // Para columnas como "MatriculaMujerPrebasica"
                for (const cat of categorias.filter(c => c)) {
                    if (columna.startsWith(cat)) {
                        categoria = cat;
                        const resto = columna.replace(cat, "");

                        for (const niv of niveles.filter(n => n && n !== "General")) {
                            if (resto.endsWith(niv)) {
                                nivel = niv;
                                sexo = resto.replace(niv, "");
                                break;
                            }
                        }
                        break;
                    }
                }
            }

            if (!categoria || !nivel || !sexo) return;

            if (!estructura[categoria]) estructura[categoria] = {};
            if (!estructura[categoria][nivel]) estructura[categoria][nivel] = [];

            estructura[categoria][nivel].push({ columna, sexo });
        });

        return estructura;
    };

    const estructuraColumnas = getEstructuraColumnas();

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
        <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
                    Niveles Académicos por Departamento
                </Typography>

                {/* Filtros */}
                <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
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

                    <Grid container spacing={2}>
                        <Grid size={{ xs:12, md: 6, lg:2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Periodo</InputLabel>
                                <Select
                                    value={filters.periodo}
                                    onChange={(e) => handleFilterChange("periodo", e.target.value)}
                                    label="Periodo"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {periodos.map(periodo => (
                                        <MenuItem key={periodo} value={periodo}>{periodo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs:12, md: 6, lg:2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Departamento</InputLabel>
                                <Select
                                    value={filters.departamento}
                                    onChange={(e) => handleFilterChange("departamento", e.target.value)}
                                    label="Departamento"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {departamentos.map(depto => (
                                        <MenuItem key={depto} value={depto}>{depto}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs:12, md: 6, lg:2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Nivel</InputLabel>
                                <Select
                                    value={filters.nivel}
                                    onChange={(e) => handleFilterChange("nivel", e.target.value)}
                                    label="Nivel"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {niveles.filter(n => n).map(nivel => (
                                        <MenuItem key={nivel} value={nivel}>
                                            {nivel === "Prebasica" ? "Prebásica" : nivel === "Basica" ? "Básica" : nivel}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs:12, md: 6, lg:2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Categoría</InputLabel>
                                <Select
                                    value={filters.categoria}
                                    onChange={(e) => handleFilterChange("categoria", e.target.value)}
                                    label="Categoría"
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {categorias.filter(c => c).map(categoria => (
                                        <MenuItem key={categoria} value={categoria}>{categoria}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs:12, md: 6, lg:2 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Sexo</InputLabel>
                                <Select
                                    value={filters.sexo}
                                    onChange={(e) => handleFilterChange("sexo", e.target.value)}
                                    label="Sexo"
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    {sexos.filter(s => s).map(sexo => (
                                        <MenuItem key={sexo} value={sexo}>{sexo}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs:12, md: 6, lg:2 }}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Valor"
                                value={filters.valor}
                                onChange={(e) => handleFilterChange("valor", e.target.value)}
                                placeholder="Buscar valor..."
                            />
                        </Grid>
                    </Grid>
                </Paper>

                {/* Controles */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Mostrando {filteredData.length} registros • Página {page} de {totalPages}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Columnas mostradas: {columnasAMostrar.length - 2} de {Object.keys(data[0] || {}).length - 2}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <InputLabel>Filas por página</InputLabel>
                            <Select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(e.target.value);
                                    setPage(1);
                                }}
                                label="Filas por página"
                            >
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={200}>200</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="contained"
                            startIcon={<Download />}
                            onClick={downloadExcel}
                            sx={{ backgroundColor: "#2e7d32", "&:hover": { backgroundColor: "#1b5e20" } }}
                        >
                            Descargar Excel
                        </Button>
                    </Box>
                </Box>

                {/* Paginación superior */}
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
            </Box>

            {/* Tabla con encabezado segmentado */}
            <TableContainer sx={{ maxHeight: 600, overflow: 'auto' }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        {/* Fila 1: Categorías */}
                        <TableRow>
                            <TableCell rowSpan={3} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", minWidth: 120 }}>Periodo</TableCell>
                            <TableCell rowSpan={3} sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", minWidth: 150 }}>Departamento</TableCell>

                            {Object.keys(estructuraColumnas).map(categoria => (
                                <TableCell
                                    key={categoria}
                                    colSpan={Object.values(estructuraColumnas[categoria]).reduce((total, nivel) => total + nivel.length, 0)}
                                    sx={{ fontWeight: "bold", backgroundColor: "#e3f2fd", textAlign: "center" }}
                                >
                                    {categoria}
                                </TableCell>
                            ))}
                        </TableRow>

                        {/* Fila 2: Niveles */}
                        <TableRow>
                            {Object.keys(estructuraColumnas).map(categoria =>
                                Object.keys(estructuraColumnas[categoria]).map(nivel => (
                                    <TableCell
                                        key={`${categoria}-${nivel}`}
                                        colSpan={estructuraColumnas[categoria][nivel].length}
                                        sx={{ fontWeight: "bold", backgroundColor: "#f3e5f5", textAlign: "center" }}
                                    >
                                        {nivel === "Prebasica" ? "Prebásica" : nivel === "Basica" ? "Básica" : nivel}
                                    </TableCell>
                                ))
                            )}
                        </TableRow>

                        {/* Fila 3: Sexos */}
                        <TableRow>
                            {Object.keys(estructuraColumnas).map(categoria =>
                                Object.keys(estructuraColumnas[categoria]).map(nivel =>
                                    estructuraColumnas[categoria][nivel].map(({ columna, sexo }) => (
                                        <TableCell
                                            key={columna}
                                            sx={{ fontWeight: "bold", backgroundColor: "#f8f8f8", textAlign: "center" }}
                                        >
                                            {sexo}
                                        </TableCell>
                                    ))
                                )
                            )}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {paginatedData.map((item, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{item.Periodo}</TableCell>
                                <TableCell>{item.Departamento}</TableCell>

                                {Object.keys(estructuraColumnas).map(categoria =>
                                    Object.keys(estructuraColumnas[categoria]).map(nivel =>
                                        estructuraColumnas[categoria][nivel].map(({ columna }) => (
                                            <TableCell key={`${columna}-${index}`} sx={{ textAlign: "center" }}>
                                                {item[columna] || "-"}
                                            </TableCell>
                                        ))
                                    )
                                )}
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
            {filteredData.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Mostrando {startIndex + 1}-{Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
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
    );
};

export default NivelesAcademicos;