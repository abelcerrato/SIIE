import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    Box,
    Typography,
    Grid,
    Tooltip,
    Stack,
    useMediaQuery,
    useTheme,
    Chip,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    Tabs,
    Tab,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import {
    Info,
    Timeline,
    Category,
    People,
    School,
    Agriculture,
    Handshake,
    ChildCare,
    Psychology,
    PieChart as PieChartIcon,
    TableChart,
    Map as MapIcon,
    Users,
    TrendingUp,
} from "@mui/icons-material";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import Groups2Icon from '@mui/icons-material/Groups2';
import ComputerIcon from '@mui/icons-material/Computer';
import DataExplorationRoundedIcon from "@mui/icons-material/DataExplorationRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import {
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    BarChart,
    Bar,
    CartesianGrid,
} from "recharts";
import color from "../../../components/color";
import {
    StyledCard,
    StyledCardContent,
    AnimatedCounter,
    ScrollReveal,
    FiltrosActivos,
    FiltroSelect,
    EmptyState,
    normalizar,
    ChartSkeleton,
} from "../../../components/shared/index.js";
import MapaDinamico from "./MapaDinamico.jsx";
import BlindRoundedIcon from "@mui/icons-material/BlindRounded";


// ==================== CONFIGURACIÓN DE MÉTRICAS PRINCIPALES ====================
const METRICAS_PRINCIPALES = {
    matricula: {
        label: "Matrícula",
        icon: <HistoryEduIcon />,
        color: color.primary,
        tieneSubmetricas: true,
        submetricas: ["departamento", "modalidadCineIngreso", "campos"],
    },
    graduados: {
        label: "Graduados",
        icon: <School />,
        color: color.secondary,
        tieneSubmetricas: false,
    },
    docentes: {
        label: "Docentes",
        icon: <Groups2Icon />,
        color: color.primary,
        tieneSubmetricas: false,
    },
    indicadores: {
        label: "Indicadores",
        icon: <TrendingUp />,
        color: color.secondary,
        tieneSubmetricas: true,
        submetricas: ["tasaMatricula", "graduadosIndicadores", "estudiantesInternacionales", "personasQueIngresan", "nuevosIngresos", "primerTitulo", "primerTituloXHabitante"],
    },
};

// ==================== CONFIGURACIÓN DE SUB-MÉTRICAS ====================
const SUBMETRICAS_CONFIG = {
    // Para Matrícula
    departamento: {
        label: "Por Departamento",
        api: `${process.env.REACT_APP_API_URL}/vistaresumendesmatriculadepartamento`,
        visualizaciones: ["mapa", "universidades", "genero", "gradoAcademico", "etnia", "programas", "administracion", "periodo", "discapacidad", "rangoEtario"],
    },
    modalidadCineIngreso: {
        label: "Modalidad, CINE y Tipo Ingreso",
        api: `${process.env.REACT_APP_API_URL}/vistaresumendesmatriculaModCineIngreso`,
        visualizaciones: ["mapa", "universidades", "genero", "gradoAcademico", "jornada", "administracion", "periodo", "modalidad", "expresion"],
    },
    campos: {
        label: "Campos Académicos",
        api: `${process.env.REACT_APP_API_URL}/vistaresumendesmatriculaCampos`,
        visualizaciones: ["mapa", "universidades", "genero", "periodo", "tablaCampos"],
    },
    // Para Indicadores
    tasaMatricula: {
        label: "Tasa de Matrícula",
        api: null,
        subApis: {
            bruta: `${process.env.REACT_APP_API_URL}/destasabrutamatricula`,
            neta: `${process.env.REACT_APP_API_URL}/destasanetamatricula`,
        },
        visualizaciones: ["tasaBruta", "tasaNeta"],
    },
    primerTitulo: {
        label: "Estudiantes de Primer Título de Educación Superior",
        api: `${process.env.REACT_APP_API_URL}/desestudiantesprimertitulo`,
        visualizaciones: ["periodo", "genero", "rangoEdad", "cine", "sectorGestion"],
    },
    personasQueIngresan: {
        label: "Personas que Ingresan",
        api: `${process.env.REACT_APP_API_URL}/despersonasqueingresan`,
        visualizaciones: ["periodo", "genero", "rangoEdad", "cine", "sectorGestion"],
    },
    graduadosIndicadores: {
        label: "Graduados",
        api: `${process.env.REACT_APP_API_URL}/desgraduados`,
        visualizaciones: ["periodo", "genero", "rangoEdad", "cine", "sectorGestion"],
    },
    estudiantesInternacionales: {
        label: "Estudiantes Internacionales",
        api: `${process.env.REACT_APP_API_URL}/desestudiantesinternacionales`,
        visualizaciones: ["cicloCompleto", "genero", "rangoEdad", "cine", "sectorGestion"],
    },
    nuevosIngresos: {
        label: "Nuevos Ingresos",
        api: `${process.env.REACT_APP_API_URL}/desnuevosingresosiniciarprograma`,
        visualizaciones: ["genero", "rangoEdad", "cine", "sectorGestion", "gradoAcademico"],
    },
    primerTituloXHabitante: {
        label: "Estudiantes De Primer Título De Educación Superior Por Cada Diez Mil Habitantes",
        api: `${process.env.REACT_APP_API_URL}/desestudiantesprimertitulox10milhabitantes`,
        visualizaciones: ["periodo", "genero", "rangoEdad", "cine", "sectorGestion"],
    },
};

// ==================== FUNCIONES AUXILIARES ====================
const normalizarDatos = (datos, config = {}) => {
    if (!datos || !Array.isArray(datos)) return [];
    return datos.map((item) => {
        const toNumber = (val) => {
            if (val === undefined || val === null || val === "") return 0;
            const num = Number(val);
            return isNaN(num) ? 0 : num;
        };

        return {
            ...item,
            anio: item.anio || item.AÑO,
            total: toNumber(item.matriculades) || toNumber(item.docentesdes) || toNumber(item.graduados) ||
                toNumber(item["CANTIDAD DE EGRESADOS"]) ||
                toNumber(item["TOTAL DE ESTUDIANTES DE PRIMER TÍTULO"]) ||
                toNumber(item["PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR"]) ||
                toNumber(item["NUEVOS INGRESOS"]) ||
                toNumber(item["ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO"]) || 0,
            femenino: toNumber(item.femenino),
            masculino: toNumber(item.masculino),
        };
    });
};

const cargarDatosGenerales = async (apiUrl) => {
    if (!apiUrl) return [];
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const datosArray = Array.isArray(data) ? data : data.data || [];
        return normalizarDatos(datosArray);
    } catch (error) {
        console.error(`Error cargando datos de ${apiUrl}:`, error);
        return [];
    }
};

// ==================== HOOK PERSONALIZADO PARA FILTROS CONECTADOS (VERSIÓN DEFINITIVA) ====================
const useFiltrosConectados = (data, initialFilters, fieldMapping) => {
    const [filtros, setFiltros] = useState(initialFilters);
    const [opcionesDisponibles, setOpcionesDisponibles] = useState({});

    // Función para obtener opciones de un filtro específico basado en otros filtros
    const obtenerOpcionesParaFiltro = useCallback((filtroKey, filtrosActuales) => {
        if (!data.length) return ["Todos"];

        // Construir filtros excluyendo el filtro actual
        const otrosFiltros = {};
        Object.entries(filtrosActuales).forEach(([key, value]) => {
            if (key !== filtroKey && value !== "Todos") {
                otrosFiltros[key] = value;
            }
        });

        // Filtrar datos con los otros filtros
        let datosFiltrados = data;
        Object.entries(otrosFiltros).forEach(([key, value]) => {
            const campo = fieldMapping[key];
            if (campo) {
                datosFiltrados = datosFiltrados.filter(item => {
                    const itemValue = item[campo];
                    return itemValue && itemValue !== "null" && normalizar(itemValue) === normalizar(value);
                });
            }
        });

        // Obtener valores únicos para el filtro actual
        const campoActual = fieldMapping[filtroKey];
        const opcionesSet = new Set();
        datosFiltrados.forEach(item => {
            const valor = item[campoActual];
            if (valor && valor !== "null" && valor !== "") {
                opcionesSet.add(valor);
            }
        });

        const opciones = ["Todos", ...Array.from(opcionesSet).sort((a, b) => {
            if (!isNaN(a) && !isNaN(b)) return Number(b) - Number(a);
            return String(a).localeCompare(String(b));
        })];

        return opciones;
    }, [data, fieldMapping]);

    // Actualizar todas las opciones
    const actualizarTodasOpciones = useCallback((filtrosActuales) => {
        const nuevasOpciones = {};
        Object.keys(fieldMapping).forEach(key => {
            nuevasOpciones[key] = obtenerOpcionesParaFiltro(key, filtrosActuales);
        });
        setOpcionesDisponibles(nuevasOpciones);
    }, [fieldMapping, obtenerOpcionesParaFiltro]);

    // Cambiar un filtro
    const cambiarFiltro = useCallback((key, value) => {
        setFiltros(prev => {
            const nuevosFiltros = { ...prev, [key]: value };
            // Actualizar opciones después del cambio
            setTimeout(() => actualizarTodasOpciones(nuevosFiltros), 0);
            return nuevosFiltros;
        });
    }, [actualizarTodasOpciones]);

    // Limpiar todos los filtros
    const limpiarFiltros = useCallback(() => {
        const filtrosLimpios = {};
        Object.keys(initialFilters).forEach(key => {
            filtrosLimpios[key] = "Todos";
        });
        setFiltros(filtrosLimpios);
        actualizarTodasOpciones(filtrosLimpios);
    }, [initialFilters, actualizarTodasOpciones]);

    // Inicializar opciones cuando cambian los datos
    useEffect(() => {
        if (data.length) {
            actualizarTodasOpciones(filtros);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    // Datos filtrados
    const datosFiltrados = useMemo(() => {
        if (!data.length) return [];
        
        return data.filter(item => {
            return Object.entries(filtros).every(([key, value]) => {
                if (value === "Todos") return true;
                const campo = fieldMapping[key];
                if (!campo) return true;
                const itemValue = item[campo];
                if (!itemValue || itemValue === "null" || itemValue === "") return true;
                return normalizar(itemValue) === normalizar(value);
            });
        });
    }, [data, filtros, fieldMapping]);

    return {
        filtros,
        opcionesDisponibles,
        cambiarFiltro,
        limpiarFiltros,
        datosFiltrados
    };
};
// ==================== COMPONENTE DE TABLA SIMPLE ====================
const SimpleTable = ({ data, nameKey, valueKey, title, onSort, orderDirection, loading, nameWidth = "auto" }) => {
    const [localOrder, setLocalOrder] = useState("desc");

    const handleSort = () => {
        const newOrder = localOrder === "asc" ? "desc" : "asc";
        setLocalOrder(newOrder);
        if (onSort) onSort(newOrder);
    };

    const sortedData = [...data].sort((a, b) => {
        if (localOrder === "asc") return a[valueKey] - b[valueKey];
        return b[valueKey] - a[valueKey];
    });

    if (loading) {
        return (
            <TableContainer component={Paper}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ backgroundColor: color.primary, color: color.white, width: nameWidth }}>{title}</TableCell>
                            <TableCell align="right" sx={{ backgroundColor: color.primary, color: color.white, width: 120 }}>Total</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton variant="text" width="90%" /></TableCell>
                                <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{
                            fontWeight: "bold",
                            backgroundColor: color.primary,
                            color: color.white,
                            position: "sticky",
                            top: 0,
                            width: nameWidth,
                            maxWidth: nameWidth,
                            minWidth: nameWidth === "auto" ? undefined : nameWidth
                        }}>
                            {title}
                        </TableCell>
                        <TableCell align="right" sx={{
                            fontWeight: "bold",
                            backgroundColor: color.primary,
                            color: color.white,
                            position: "sticky",
                            top: 0,
                            width: 120
                        }}>
                            <TableSortLabel
                                active={true}
                                direction={localOrder}
                                onClick={handleSort}
                                sx={{
                                    color: `${color.white} !important`,
                                    "& .MuiTableSortLabel-icon": {
                                        color: `${color.white} !important`,
                                    },
                                }}
                            >
                                Total
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((item, idx) => (
                        <TableRow key={idx} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" } }}>
                            <TableCell sx={{
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                maxWidth: nameWidth !== "auto" ? nameWidth : 300,
                                minWidth: nameWidth !== "auto" ? nameWidth : undefined
                            }}>
                                {item[nameKey]}
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: "bold" }}>{item[valueKey]?.toLocaleString() || 0}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// ==================== COMPONENTE PARA MÉTRICA MATRÍCULA - DEPARTAMENTO ====================
const MatriculaDepartamento = ({ data, loading, nombreMetrica }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

    const fieldMapping = {
        anio: "anio",
        departamento: "departamento",
        institucion: "institucion",
        sede: "sede",
        administracion: "administracion",
        gradoacademico: "gradoacademico"
    };

    const initialFilters = {
        anio: "Todos",
        departamento: "Todos",
        institucion: "Todos",
        sede: "Todos",
        administracion: "Todos",
        gradoacademico: "Todos"
    };

    const {
        filtros,
        opcionesDisponibles,
        cambiarFiltro,
        limpiarFiltros,
        datosFiltrados
    } = useFiltrosConectados(data, initialFilters, fieldMapping);

    const hasActiveFilters = useMemo(() => {
        return Object.values(filtros).some(value => value !== "Todos");
    }, [filtros]);

    const handleRemoveFilter = (key) => {
        cambiarFiltro(key, "Todos");
    };

    const datosMapa = useMemo(() => {
        const mapa = {};
        datosFiltrados.forEach((row) => {
            const clave = row.departamento;
            if (clave && clave !== "Todos" && clave !== "null") {
                const claveNormalizada = normalizar(clave);
                if (!mapa[claveNormalizada]) {
                    mapa[claveNormalizada] = { valor: 0, nombre: clave };
                }
                mapa[claveNormalizada].valor += (row.total || 0);
            }
        });
        return mapa;
    }, [datosFiltrados]);

    const datosUniversidades = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const inst = item.institucion;
            if (inst && inst !== "null") {
                const valor = Number(item.total) || 0;
                if (!mapa.has(inst)) {
                    mapa.set(inst, {
                        nombre: inst,
                        siglas: item.siglas || inst,
                        valor: 0
                    });
                }
                mapa.get(inst).valor += valor;
            }
        });
        return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosGenero = useMemo(() => {
        let mujeres = 0, hombres = 0;
        datosFiltrados.forEach((item) => {
            mujeres += item.femenino || 0;
            hombres += item.masculino || 0;
        });
        return [{ name: "Femenino", value: mujeres }, { name: "Masculino", value: hombres }];
    }, [datosFiltrados]);

    const datosGradoAcademico = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const grado = item.gradoacademico;
            if (grado && grado !== "null") {
                mapa.set(grado, (mapa.get(grado) || 0) + (item.total || 0));
            }
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosEtnia = useMemo(() => {
        const mapa = new Map();
        const excluir = new Set([
            "NO SABE", "NO", "NADA", "NULL", "", "SIN DISPONIBILIDAD",
            "NO APLICA", "NO DISPONIBLE", "NINGUNA", "184", "ADVENTISTA DEL SÉPTIMO DÍA",
            "NICARAGUENSE", "225", "HIJO DE EMPLEADO", "LATINO",
        ]);

        datosFiltrados.forEach((item) => {
            const raw = item.etnia;
            if (raw === null || raw === undefined) return;
            const etnia = String(raw).trim().toUpperCase();
            if (excluir.has(etnia)) return;
            mapa.set(etnia, (mapa.get(etnia) || 0) + (item.total || 0));
        });

        return Array.from(mapa.entries())
            .map(([nombre, valor]) => ({ nombre, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosProgramas = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const programa = item.programa;
            if (programa && programa !== "null") {
                mapa.set(programa, (mapa.get(programa) || 0) + (item.total || 0));
            }
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosAdministracion = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const adm = item.administracion;
            if (adm && adm !== "null") {
                mapa.set(adm, (mapa.get(adm) || 0) + (item.total || 0));
            }
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosPeriodo = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const anio = item.anio;
            if (anio) {
                mapa.set(anio, (mapa.get(anio) || 0) + (item.total || 0));
            }
        });
        return Array.from(mapa.entries()).map(([periodo, total]) => ({ periodo, total })).sort((a, b) => a.periodo - b.periodo);
    }, [datosFiltrados]);

    const datosDiscapacidad = useMemo(() => {
        const mapa = new Map();
        const formatearDiscapacidad = (texto) => {
            return texto.split(' ')
                .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase())
                .join(' ');
        };
        const excluir = new Set([
            "", "null", "No", "NO", "NO DISPONIBLE", "NO APLICA", "NINGUNA",
            "SIN DISPONIBILIDAD", "SIN REGISTRO", "PUBLICA", "ANEMIA", "ALERGIA A LA PENICILINA",
        ]);

        datosFiltrados.forEach((item) => {
            const raw = item.discapacidad;
            if (raw === null || raw === undefined) return;
            const discOriginal = String(raw).trim();
            const discUpper = discOriginal.toUpperCase();
            if (excluir.has(discUpper)) return;
            const nombreFormateado = formatearDiscapacidad(discOriginal);
            mapa.set(nombreFormateado, (mapa.get(nombreFormateado) || 0) + (item.total || 0));
        });

        return Array.from(mapa.entries())
            .map(([nombre, valor]) => ({ nombre, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosRangoEtario = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const rango = item.rangoedad;
            if (rango && rango !== "null" && rango !== "") {
                mapa.set(rango, (mapa.get(rango) || 0) + (item.total || 0));
            }
        });
        const order = ["15 AÑOS O MENOS", "15 A 20 AÑOS", "20 A 25 AÑOS", "25 A 30 AÑOS", "30 A 35 AÑOS", "35 A 40 AÑOS", "40 A 45 AÑOS", "45 A 50 AÑOS", "50 A 55 AÑOS", "55 A 60 AÑOS", "60 A 65 AÑOS", "65 A 70 AÑOS", "70 AÑOS O MAS"];
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => order.indexOf(a.nombre) - order.indexOf(b.nombre));
    }, [datosFiltrados]);

    const totalGeneral = useMemo(() => datosFiltrados.reduce((sum, item) => sum + (item.total || 0), 0), [datosFiltrados]);
    const hasData = datosFiltrados.length > 0;

    const filtersConfig = [
        { key: "anio", label: "Año", options: opcionesDisponibles.anio || ["Todos"] },
        { key: "departamento", label: "Departamento", options: opcionesDisponibles.departamento || ["Todos"] },
        { key: "institucion", label: "Institución", options: opcionesDisponibles.institucion || ["Todos"] },
        { key: "sede", label: "SEDE", options: opcionesDisponibles.sede || ["Todos"] },
        { key: "administracion", label: "Administración", options: opcionesDisponibles.administracion || ["Todos"] },
        { key: "gradoacademico", label: "Grado Académico", options: opcionesDisponibles.gradoacademico || ["Todos"] },
    ];

    useEffect(() => {
        const updateDimensions = () => {
            const container = document.getElementById("map-container-desunah");
            if (container) {
                const containerWidth = container.clientWidth;
                let height = isMobile ? containerWidth * 0.5 : isTablet ? 500 : 600;
                setDimensions({ width: containerWidth, height: Math.max(height, 400) });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [isMobile, isTablet]);

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    {hasActiveFilters && (
                        <FiltrosActivos
                            filtros={filtros}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={limpiarFiltros}
                        />
                    )}
                </Grid>

                {filtersConfig.map((filter) => (
                    <Grid key={filter.key} size="auto">
                        <FiltroSelect
                            label={filter.label}
                            value={filtros[filter.key] || "Todos"}
                            options={filter.options}
                            onChange={(e) => cambiarFiltro(filter.key, e.target.value)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item size={{ xs: 12 }}>
                    <StyledCard sx={{ position: "relative", overflow: "hidden" }}>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                                <MapIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Departamento</Typography>
                            </Stack>
                            <Box id="map-container-desunah" sx={{ width: "100%", height: dimensions.height }}>
                                {loading ? (
                                    <Skeleton variant="rectangular" width="100%" height="100%" />
                                ) : !hasData ? (
                                    <EmptyState onClearFilters={limpiarFiltros} />
                                ) : (
                                    <MapaDinamico
                                        datosDepto={datosMapa}
                                        dimensions={dimensions}
                                        isMobile={isMobile}
                                        esCentroEducativo={false}
                                        esMetricaDocente={false}
                                        modoSimple={false}
                                        selectedDimension="departamento"
                                    />
                                )}
                            </Box>
                        </StyledCardContent>
                        <Box sx={{ position: "absolute", top: 20, left: 20, zIndex: 10, maxWidth: "calc(100% - 40px)" }}>
                            <StyledCard sx={{ background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`, width: 200 }}>
                                <StyledCardContent>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                                        <Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                            Total Matrícula
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h3" sx={{ color: color.secondary, fontWeight: "bold", fontSize: "clamp(2rem, 6vw, 2rem)", mb: 1 }}>
                                        {loading ? <Skeleton width="80%" /> : <AnimatedCounter value={totalGeneral} />}
                                    </Typography>
                                </StyledCardContent>
                            </StyledCard>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Universidad</Typography>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosUniversidades.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={datosUniversidades} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                        <XAxis angle={-45} dataKey="siglas" type="category" tick={{ fontSize: 10 }} textAnchor="end" interval={0} />
                                        <YAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <WcRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Género</Typography>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosGenero.every(d => d.value === 0) ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie
                                            data={datosGenero}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius="60%"
                                            outerRadius="90%"
                                            paddingAngle={5}
                                            labelLine={false}
                                            label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                                return (
                                                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">
                                                        {`${(percent * 100).toFixed(2)}%`}
                                                    </text>
                                                );
                                            }}
                                        >
                                            {datosGenero.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.name === "Femenino" ? color.secondary : color.primary} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value, name) => {
                                            const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                            const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                            return [`${value?.toLocaleString()} (${percent}%)`, name];
                                        }} />
                                        <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 8 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <School sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Grado Académico</Typography>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosGradoAcademico.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={datosGradoAcademico} margin={{ top: 10, right: 10, left: 30, bottom: 20 }}>
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={90} interval={0} tick={{ fontSize: 10 }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Diversity3Icon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Etnia</Typography>
                                <Tooltip title="Distribución por grupo étnico">
                                    <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                </Tooltip>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosEtnia.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <Box sx={{ height: 400, overflowY: "auto" }}>
                                    <ResponsiveContainer width="100%" height={Math.max(datosEtnia.length * 30, 400)}>
                                        <BarChart data={datosEtnia} layout="vertical" margin={{ top: 10, right: 10, left: 2, bottom: 10 }}>
                                            <XAxis hide type="number" />
                                            <YAxis dataKey="nombre" type="category" width={120} tick={{ fontSize: 10 }} />
                                            <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                            <Bar dataKey="valor" fill={color.secondary} radius={[0, 4, 4, 0]} label={(props) => {
                                                const { x, y, width, height, value } = props;
                                                const inside = width > 60;
                                                return (
                                                    <text x={inside ? x + width - 8 : x + width + 5} y={y + height / 2}
                                                        fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                        dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                        {value?.toLocaleString()}
                                                    </text>
                                                );
                                            }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Programa</Typography>
                            <SimpleTable data={datosProgramas} nameKey="nombre" valueKey="valor" title="Programa" loading={loading} />
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Administración</Typography>
                                <Tooltip title="Distribución por tipo de administración">
                                    <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                </Tooltip>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosAdministracion.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosAdministracion}>
                                        <XAxis dataKey="nombre" width={100} tick={{ fill: color.contrastText, fontSize: 11 }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (value) => value?.toLocaleString(), fontSize: 11, fontWeight: "bold" }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 8 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <BlindRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Tipo de Discapacidad</Typography>
                                <Tooltip title="Distribución por tipo de discapacidad">
                                    <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                </Tooltip>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosDiscapacidad.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={datosDiscapacidad} margin={{ top: 10, right: 10, left: 10, bottom: 25 }}>
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 10 }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Timeline sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Periodo</Typography>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={200} />
                            ) : datosPeriodo.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={datosPeriodo} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                                        <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Line type="monotone" dataKey="total" stroke={color.primary} strokeWidth={3}
                                            dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }} activeDot={{ r: 7 }}
                                            label={!isMobile ? (props) => {
                                                const { x, y, value, index } = props;
                                                const isTop = index % 2 === 0;
                                                return (
                                                    <text x={x} y={isTop ? y - 10 : y + 20} fill={color.third} fontSize={11} textAnchor="middle">
                                                        {value.toLocaleString()}
                                                    </text>
                                                );
                                            } : undefined}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <ElderlyWomanIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Rango Etario</Typography>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosRangoEtario.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={datosRangoEtario} margin={{ top: 10, right: 10, left: 40, bottom: 10 }}>
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} interval={0} tick={{ fontSize: 10 }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

// ==================== COMPONENTE PARA MATRÍCULA - MODALIDAD/CINE/INGRESO ====================
const MatriculaModalidadCineIngreso = ({ data, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

    const fieldMapping = {
        anio: "anio",
        departamento: "departamento",
        institucion: "institucion",
        sede: "sede"
    };

    const initialFilters = {
        anio: "Todos",
        departamento: "Todos",
        institucion: "Todos",
        sede: "Todos"
    };

    const {
        filtros,
        opcionesDisponibles,
        cambiarFiltro,
        limpiarFiltros,
        datosFiltrados
    } = useFiltrosConectados(data, initialFilters, fieldMapping);

    const hasActiveFilters = useMemo(() => {
        return Object.values(filtros).some(value => value !== "Todos");
    }, [filtros]);

    const handleRemoveFilter = (key) => {
        cambiarFiltro(key, "Todos");
    };

    const datosMapa = useMemo(() => {
        const mapa = {};
        datosFiltrados.forEach((row) => {
            const clave = row.departamento;
            if (clave && clave !== "Todos" && clave !== "null") {
                const claveNormalizada = normalizar(clave);
                if (!mapa[claveNormalizada]) {
                    mapa[claveNormalizada] = { valor: 0, nombre: clave };
                }
                mapa[claveNormalizada].valor += (row.total || 0);
            }
        });
        return mapa;
    }, [datosFiltrados]);

    const datosUniversidades = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const inst = item.institucion;
            if (inst && inst !== "null") {
                const valor = Number(item.total) || 0;
                if (!mapa.has(inst)) {
                    mapa.set(inst, {
                        nombre: inst,
                        siglas: item.siglas || inst,
                        valor: 0
                    });
                }
                mapa.get(inst).valor += valor;
            }
        });
        return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosGenero = useMemo(() => {
        let mujeres = 0, hombres = 0;
        datosFiltrados.forEach((item) => {
            mujeres += item.femenino || 0;
            hombres += item.masculino || 0;
        });
        return [{ name: "Femenino", value: mujeres }, { name: "Masculino", value: hombres }];
    }, [datosFiltrados]);

    const datosGradoAcademico = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const grado = item.gradoacademico;
            if (grado && grado !== "null") mapa.set(grado, (mapa.get(grado) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosJornada = useMemo(() => {
        const mapa = new Map();
        const excluir = new Set(["X", "NULL", "", "NO APLICA"]);

        datosFiltrados.forEach((item) => {
            const raw = item.jornada;
            if (raw === null || raw === undefined) return;
            const jornada = String(raw).trim().toUpperCase();
            if (excluir.has(jornada)) return;
            mapa.set(jornada, (mapa.get(jornada) || 0) + (item.total || 0));
        });

        return Array.from(mapa.entries())
            .map(([nombre, valor]) => ({ nombre, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosPeriodo = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const anio = item.anio;
            if (anio) mapa.set(anio, (mapa.get(anio) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([periodo, total]) => ({ periodo, total })).sort((a, b) => a.periodo - b.periodo);
    }, [datosFiltrados]);

    const datosModalidad = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const modalidad = item.modalidad;
            if (modalidad && modalidad !== "null") mapa.set(modalidad, (mapa.get(modalidad) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosExpresion = useMemo(() => {
        const mapa = new Map();
        const excluir = new Set(["NO", "NULL", "", "NO APLICA", "SIN DATOS", "NADA", "MESTIZO", "NINGUNA", "41611035"]);

        datosFiltrados.forEach((item) => {
            const raw = item.expresion;
            if (raw === null || raw === undefined) return;
            const expresion = String(raw).trim().toUpperCase();
            if (excluir.has(expresion)) return;
            mapa.set(expresion, (mapa.get(expresion) || 0) + (item.total || 0));
        });

        return Array.from(mapa.entries())
            .map(([nombre, valor]) => ({ nombre, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosTipoIngreso = useMemo(() => {
        const mapa = new Map();
        const excluir = new Set(["X", "NULL", "", "NO APLICA", "SIN DATOS", "NADA"]);

        datosFiltrados.forEach((item) => {
            const raw = item.tipoingreso;
            if (raw === null || raw === undefined) return;
            const tipoIngreso = String(raw).trim().toUpperCase();
            if (excluir.has(tipoIngreso)) return;
            mapa.set(tipoIngreso, (mapa.get(tipoIngreso) || 0) + (item.total || 0));
        });

        return Array.from(mapa.entries())
            .map(([nombre, valor]) => ({ nombre, valor }))
            .sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const totalGeneral = useMemo(() => datosFiltrados.reduce((sum, item) => sum + (item.total || 0), 0), [datosFiltrados]);
    const hasData = datosFiltrados.length > 0;

    const filtersConfig = [
        { key: "anio", label: "Año", options: opcionesDisponibles.anio || ["Todos"] },
        { key: "departamento", label: "Departamento", options: opcionesDisponibles.departamento || ["Todos"] },
        { key: "institucion", label: "Institución", options: opcionesDisponibles.institucion || ["Todos"] },
        { key: "sede", label: "SEDE", options: opcionesDisponibles.sede || ["Todos"] },
    ];

    useEffect(() => {
        const updateDimensions = () => {
            const container = document.getElementById("map-container-modalidad");
            if (container) {
                const containerWidth = container.clientWidth;
                let height = isMobile ? containerWidth * 0.5 : isTablet ? 500 : 600;
                setDimensions({ width: containerWidth, height: Math.max(height, 400) });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [isMobile, isTablet]);

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    {hasActiveFilters && (
                        <FiltrosActivos
                            filtros={filtros}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={limpiarFiltros}
                        />
                    )}
                </Grid>
                {filtersConfig.map((filter) => (
                    <Grid key={filter.key} size="auto">
                        <FiltroSelect
                            label={filter.label}
                            value={filtros[filter.key] || "Todos"}
                            options={filter.options}
                            onChange={(e) => cambiarFiltro(filter.key, e.target.value)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item size={{ xs: 12 }}>
                    <StyledCard sx={{ position: "relative", overflow: "hidden" }}>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                                <MapIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Departamento</Typography>
                            </Stack>
                            <Box id="map-container-modalidad" sx={{ width: "100%", height: dimensions.height }}>
                                {loading ? <Skeleton variant="rectangular" width="100%" height="100%" /> : !hasData ? <EmptyState onClearFilters={limpiarFiltros} /> : (
                                    <MapaDinamico
                                        datosDepto={datosMapa}
                                        dimensions={dimensions}
                                        isMobile={isMobile}
                                        esCentroEducativo={false}
                                        esMetricaDocente={false}
                                        modoSimple={false}
                                        selectedDimension="departamento"
                                    />
                                )}
                            </Box>
                        </StyledCardContent>
                        <Box sx={{
                            position: "absolute",
                            top: { xs: 50, sm: 50, md: 60, lg: 20 },
                            left: 20,
                            zIndex: 10,
                            maxWidth: "calc(100% - 40px)",
                        }}>
                            <ScrollReveal direction="left" delay={0.4}>
                                <StyledCard sx={{ background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`, width: "220px" }}>
                                    <StyledCardContent>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                            <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                                            <Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                                Total Matrícula
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h3" sx={{ color: color.secondary, fontWeight: "bold", fontSize: "clamp(2rem, 6vw, 2rem)", mb: 1 }}>
                                            {loading ? <Skeleton width="80%" /> : <AnimatedCounter value={totalGeneral} />}
                                        </Typography>
                                    </StyledCardContent>
                                </StyledCard>
                            </ScrollReveal>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Universidad</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={datosUniversidades} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                        <XAxis angle={-45} dataKey="siglas" type="category" tick={{ fontSize: 10 }} textAnchor="end" interval={0} />
                                        <YAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <School sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Grado Académico</Typography>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosGradoAcademico.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={datosGradoAcademico} layout="vertical" margin={{ top: 10, right: 10, bottom: 10 }}>
                                        <XAxis hide type="number" />
                                        <YAxis dataKey="nombre" type="category" width={100} tick={{ fontSize: 10 }} />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[0, 4, 4, 0]} label={(props) => {
                                            const { x, y, width, height, value } = props;
                                            const inside = width > 60;
                                            return (
                                                <text x={inside ? x + width - 8 : x + width + 5} y={y + height / 2}
                                                    fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                    dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                    {value?.toLocaleString()}
                                                </text>
                                            );
                                        }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <WcRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Género</Typography>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosGenero.every(d => d.value === 0) ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie data={datosGenero} dataKey="value" cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={5}
                                            labelLine={false} label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                                return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">{`${(percent * 100).toFixed(2)}%`}</text>;
                                            }}>
                                            {datosGenero.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.name === "Femenino" ? color.secondary : color.primary} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value, name) => {
                                            const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                            const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                            return [`${value?.toLocaleString()} (${percent}%)`, name];
                                        }} />
                                        <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Brightness4Icon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Jornada</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosJornada} layout="vertical" margin={{ left: 10 }}>
                                        <XAxis hide type="number" />
                                        <YAxis dataKey="nombre" type="category" width={100} tick={{ fill: color.contrastText, fontSize: 11 }} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[0, 4, 4, 0]} label={(props) => {
                                            const { x, y, width, height, value } = props;
                                            const inside = width > 60;
                                            return (
                                                <text x={inside ? x + width - 8 : x + width + 5} y={y + height / 2}
                                                    fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                    dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                    {value?.toLocaleString()}
                                                </text>
                                            );
                                        }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <ComputerIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Modalidad</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={datosModalidad} layout="vertical" margin={{ top: 10, right: 10, bottom: 10 }}>
                                        <XAxis hide type="number" />
                                        <YAxis dataKey="nombre" type="category" width={100} tick={{ fontSize: 10 }} />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[0, 4, 4, 0]} label={(props) => {
                                            const { x, y, width, height, value } = props;
                                            const inside = width > 60;
                                            return (
                                                <text x={inside ? x + width - 8 : x + width + 5} y={y + height / 2}
                                                    fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                    dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                    {value?.toLocaleString()}
                                                </text>
                                            );
                                        }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Tipo de Ingreso</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : datosTipoIngreso.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosTipoIngreso} layout="vertical" margin={{ top: 10, right: 10, bottom: 10 }}>
                                        <XAxis hide type="number" />
                                        <YAxis dataKey="nombre" type="category" width={80} tick={{ fontSize: 10 }} />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[0, 4, 4, 0]} label={(props) => {
                                            const { x, y, width, height, value } = props;
                                            const inside = width > 60;
                                            return (
                                                <text x={inside ? x + width - 8 : x + width + 5} y={y + height / 2}
                                                    fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                    dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                    {value?.toLocaleString()}
                                                </text>
                                            );
                                        }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <ComputerIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Expresión</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={datosExpresion} layout="vertical" margin={{ top: 10, right: 10, bottom: 10 }} barSize={15}>
                                        <XAxis hide type="number" />
                                        <YAxis dataKey="nombre" type="category" width={100} tick={{ fontSize: 10 }} />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[0, 4, 4, 0]} label={(props) => {
                                            const { x, y, width, height, value } = props;
                                            const inside = width > 60;
                                            return (
                                                <text x={inside ? x + width - 8 : x + width + 5} y={y + height / 2}
                                                    fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                    dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                    {value?.toLocaleString()}
                                                </text>
                                            );
                                        }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Timeline sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Periodo</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={datosPeriodo} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                                        <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Line type="monotone" dataKey="total" stroke={color.primary} strokeWidth={3}
                                            dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }} activeDot={{ r: 7 }}
                                            label={!isMobile ? (props) => {
                                                const { x, y, value, index } = props;
                                                const isTop = index % 2 === 0;
                                                return <text x={x} y={isTop ? y - 10 : y + 20} fill={color.third} fontSize={11} textAnchor="middle">{value.toLocaleString()}</text>;
                                            } : undefined}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

// ==================== COMPONENTE PARA MATRÍCULA - CAMPOS ====================
const MatriculaCampos = ({ data, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });
    const [orderAmplio, setOrderAmplio] = useState("desc");
    const [orderEspecifico, setOrderEspecifico] = useState("desc");
    const [orderDetallado, setOrderDetallado] = useState("desc");

    const fieldMapping = {
        anio: "anio",
        departamento: "departamento",
        institucion: "institucion",
        sede: "sede",
        campoamplio: "campoamplio",
        campoespecifico: "campoespecifico",
        campodetallado: "campodetallado"
    };

    const initialFilters = {
        anio: "Todos",
        departamento: "Todos",
        institucion: "Todos",
        sede: "Todos",
        campoamplio: "Todos",
        campoespecifico: "Todos",
        campodetallado: "Todos"
    };

    const {
        filtros,
        opcionesDisponibles,
        cambiarFiltro,
        limpiarFiltros,
        datosFiltrados
    } = useFiltrosConectados(data, initialFilters, fieldMapping);

    const hasActiveFilters = useMemo(() => {
        return Object.values(filtros).some(value => value !== "Todos");
    }, [filtros]);

    const handleRemoveFilter = (key) => {
        cambiarFiltro(key, "Todos");
    };

    const datosMapa = useMemo(() => {
        const mapa = {};
        datosFiltrados.forEach((row) => {
            const clave = row.departamento;
            if (clave && clave !== "Todos" && clave !== "null") {
                const claveNormalizada = normalizar(clave);
                if (!mapa[claveNormalizada]) {
                    mapa[claveNormalizada] = { valor: 0, nombre: clave };
                }
                mapa[claveNormalizada].valor += (row.total || 0);
            }
        });
        return mapa;
    }, [datosFiltrados]);

    const datosCampoAmplio = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const campo = item.campoamplio;
            if (campo && campo !== "null") mapa.set(campo, (mapa.get(campo) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosCampoEspecifico = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const campo = item.campoespecifico;
            if (campo && campo !== "null") mapa.set(campo, (mapa.get(campo) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosCampoDetallado = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const campo = item.campodetallado;
            if (campo && campo !== "null") mapa.set(campo, (mapa.get(campo) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosUniversidades = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const inst = item.institucion;
            if (inst && inst !== "null") {
                const valor = Number(item.total) || 0;
                if (!mapa.has(inst)) {
                    mapa.set(inst, {
                        nombre: inst,
                        siglas: item.siglas || inst,
                        valor: 0
                    });
                }
                mapa.get(inst).valor += valor;
            }
        });
        return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosGenero = useMemo(() => {
        let mujeres = 0, hombres = 0;
        datosFiltrados.forEach((item) => {
            mujeres += item.femenino || 0;
            hombres += item.masculino || 0;
        });
        return [{ name: "Femenino", value: mujeres }, { name: "Masculino", value: hombres }];
    }, [datosFiltrados]);

    const datosPeriodo = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const anio = item.anio;
            if (anio) mapa.set(anio, (mapa.get(anio) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([periodo, total]) => ({ periodo, total })).sort((a, b) => a.periodo - b.periodo);
    }, [datosFiltrados]);

    const sortedAmplio = [...datosCampoAmplio].sort((a, b) => orderAmplio === "asc" ? a.valor - b.valor : b.valor - a.valor);
    const sortedEspecifico = [...datosCampoEspecifico].sort((a, b) => orderEspecifico === "asc" ? a.valor - b.valor : b.valor - a.valor);
    const sortedDetallado = [...datosCampoDetallado].sort((a, b) => orderDetallado === "asc" ? a.valor - b.valor : b.valor - a.valor);

    const totalGeneral = useMemo(() => datosFiltrados.reduce((sum, item) => sum + (item.total || 0), 0), [datosFiltrados]);
    const hasData = datosFiltrados.length > 0;

    const filtersConfig = [
        { key: "anio", label: "Año", options: opcionesDisponibles.anio || ["Todos"] },
        { key: "departamento", label: "Departamento", options: opcionesDisponibles.departamento || ["Todos"] },
        { key: "institucion", label: "Institución", options: opcionesDisponibles.institucion || ["Todos"] },
        { key: "sede", label: "SEDE", options: opcionesDisponibles.sede || ["Todos"] },
        { key: "campoamplio", label: "Campo Amplio", options: opcionesDisponibles.campoamplio || ["Todos"] },
        { key: "campoespecifico", label: "Campo Específico", options: opcionesDisponibles.campoespecifico || ["Todos"] },
        { key: "campodetallado", label: "Campo Detallado", options: opcionesDisponibles.campodetallado || ["Todos"] },
    ];

    useEffect(() => {
        const updateDimensions = () => {
            const container = document.getElementById("map-container-campos");
            if (container) {
                const containerWidth = container.clientWidth;
                let height = isMobile ? containerWidth * 0.5 : isTablet ? 500 : 600;
                setDimensions({ width: containerWidth, height: Math.max(height, 400) });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [isMobile, isTablet]);

    const renderTable = (data, title, valueKey, order, setOrder) => (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: color.primary, color: color.white }}>{title}</TableCell>
                        <TableCell align="right" sx={{ backgroundColor: color.primary, color: color.white }}>
                            <TableSortLabel active direction={order} onClick={() => setOrder(order === "asc" ? "desc" : "asc")} sx={{
                                color: "#fff !important",
                                "& .MuiTableSortLabel-icon": {
                                    color: "#fff !important",
                                },
                            }}>
                                Total
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{item.nombre}</TableCell>
                            <TableCell align="right">{item[valueKey]?.toLocaleString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    {hasActiveFilters && (
                        <FiltrosActivos
                            filtros={filtros}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={limpiarFiltros}
                        />
                    )}
                </Grid>
                {filtersConfig.map((filter) => (
                    <Grid key={filter.key} size="auto">
                        <FiltroSelect
                            label={filter.label}
                            value={filtros[filter.key] || "Todos"}
                            options={filter.options}
                            onChange={(e) => cambiarFiltro(filter.key, e.target.value)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item size={{ xs: 12 }}>
                    <StyledCard sx={{ position: "relative", overflow: "hidden" }}>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                                <MapIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Departamento</Typography>
                            </Stack>
                            <Box id="map-container-campos" sx={{ width: "100%", height: dimensions.height }}>
                                {loading ? (
                                    <Skeleton variant="rectangular" width="100%" height="100%" />
                                ) : !hasData ? (
                                    <EmptyState onClearFilters={limpiarFiltros} />
                                ) : (
                                    <MapaDinamico
                                        datosDepto={datosMapa}
                                        dimensions={dimensions}
                                        isMobile={isMobile}
                                        esCentroEducativo={false}
                                        esMetricaDocente={false}
                                        modoSimple={false}
                                        selectedDimension="departamento"
                                    />
                                )}
                            </Box>
                        </StyledCardContent>
                        <Box sx={{
                            position: "absolute",
                            top: 20,
                            left: 20,
                            zIndex: 10,
                            maxWidth: "calc(100% - 40px)",
                        }}>
                            <StyledCard sx={{ background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`, width: 200 }}>
                                <StyledCardContent>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                                        <Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                            Total Matrícula
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h3" sx={{ color: color.secondary, fontWeight: "bold", fontSize: "clamp(2rem, 6vw, 2rem)", mb: 1 }}>
                                        {loading ? <Skeleton width="80%" /> : <AnimatedCounter value={totalGeneral} />}
                                    </Typography>
                                </StyledCardContent>
                            </StyledCard>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Universidad</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={datosUniversidades} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                        <XAxis angle={-45} dataKey="siglas" type="category" tick={{ fontSize: 10 }} textAnchor="end" interval={0} />
                                        <YAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Matrícula"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <WcRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Género</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={250} /> : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={datosGenero} dataKey="value" cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={5}
                                            labelLine={false} label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                                return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">{`${(percent * 100).toFixed(2)}%`}</text>;
                                            }}>
                                            {datosGenero.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.name === "Femenino" ? color.secondary : color.primary} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value, name) => {
                                            const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                            const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                            return [`${value?.toLocaleString()} (${percent}%)`, name];
                                        }} />
                                        <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 8 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Timeline sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Periodo</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={250} /> : (
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={datosPeriodo} margin={{ top: 20, right: 30, left: 30, bottom: 10 }}>
                                        <XAxis dataKey="periodo" />
                                        <YAxis hide />
                                        <Line type="monotone" dataKey="total" stroke={color.primary} strokeWidth={3}
                                            dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }} activeDot={{ r: 7 }}
                                            label={!isMobile ? (props) => {
                                                const { x, y, value, index } = props;
                                                const isTop = index % 2 === 0;
                                                return <text x={x} y={isTop ? y - 10 : y + 20} fill={color.third} fontSize={11} textAnchor="middle">{value.toLocaleString()}</text>;
                                            } : undefined}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Campo Amplio</Typography>
                            {loading ? <ChartSkeleton height={400} /> : renderTable(sortedAmplio, "Campo Amplio", "valor", orderAmplio, setOrderAmplio)}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Campo Específico</Typography>
                            {loading ? <ChartSkeleton height={400} /> : renderTable(sortedEspecifico, "Campo Específico", "valor", orderEspecifico, setOrderEspecifico)}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Campo Detallado</Typography>
                            {loading ? <ChartSkeleton height={400} /> : renderTable(sortedDetallado, "Campo Detallado", "valor", orderDetallado, setOrderDetallado)}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

// ==================== COMPONENTE PARA GRADUADOS ====================
const GraduadosComponent = ({ data, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

    const fieldMapping = {
        anio: "anio",
        departamento: "departamento",
        institucion: "institucion",
        administracion: "administracion",
        sede: "sede",
        titulo: "titulo"
    };

    const initialFilters = {
        anio: "Todos",
        departamento: "Todos",
        institucion: "Todos",
        administracion: "Todos",
        sede: "Todos",
        titulo: "Todos"
    };

    const {
        filtros,
        opcionesDisponibles,
        cambiarFiltro,
        limpiarFiltros,
        datosFiltrados
    } = useFiltrosConectados(data, initialFilters, fieldMapping);

    const hasActiveFilters = useMemo(() => {
        return Object.values(filtros).some(value => value !== "Todos");
    }, [filtros]);

    const handleRemoveFilter = (key) => {
        cambiarFiltro(key, "Todos");
    };

    const datosMapa = useMemo(() => {
        const mapa = {};
        datosFiltrados.forEach((row) => {
            const clave = row.departamento;
            if (clave && clave !== "Todos" && clave !== "null") {
                const claveNormalizada = normalizar(clave);
                if (!mapa[claveNormalizada]) {
                    mapa[claveNormalizada] = { valor: 0, nombre: clave };
                }
                mapa[claveNormalizada].valor += (row.total || 0);
            }
        });
        return mapa;
    }, [datosFiltrados]);

    const datosUniversidades = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const inst = item.institucion;
            if (inst && inst !== "null") {
                const valor = Number(item.total) || 0;
                if (!mapa.has(inst)) {
                    mapa.set(inst, {
                        nombre: inst,
                        siglas: item.siglas || inst,
                        valor: 0
                    });
                }
                mapa.get(inst).valor += valor;
            }
        });
        return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosGenero = useMemo(() => {
        let mujeres = 0, hombres = 0;
        datosFiltrados.forEach((item) => {
            mujeres += item.femenino || 0;
            hombres += item.masculino || 0;
        });
        return [{ name: "Femenino", value: mujeres }, { name: "Masculino", value: hombres }];
    }, [datosFiltrados]);

    const datosExpresion = useMemo(() => {
        const mapa = new Map();
        const excluir = new Set(["SIN DATOS", "NULL", "", "NO APLICA", "NO"]);

        datosFiltrados.forEach((item) => {
            const raw = item.expresion;
            if (raw === null || raw === undefined) return;
            const expresion = String(raw).trim().toUpperCase();
            if (excluir.has(expresion)) return;
            mapa.set(expresion, (mapa.get(expresion) || 0) + (item.total || 0));
        });

        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosGradoAcademico = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const grado = item.gradoacademico;
            if (grado && grado !== "null") mapa.set(grado, (mapa.get(grado) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosModalidad = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const modalidad = item.modalidad;
            if (modalidad && modalidad !== "null") mapa.set(modalidad, (mapa.get(modalidad) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosTitulos = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const titulo = item.titulo;
            if (titulo && titulo !== "null" && titulo.trim() !== "") {
                const tituloLimpio = titulo.trim().replace(/\s+/g, ' ');
                mapa.set(tituloLimpio, (mapa.get(tituloLimpio) || 0) + (item.total || 0));
            }
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosAdministracion = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const adm = item.administracion;
            if (adm && adm !== "null") mapa.set(adm, (mapa.get(adm) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosPeriodo = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const anio = item.anio;
            if (anio) mapa.set(anio, (mapa.get(anio) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([periodo, total]) => ({ periodo, total })).sort((a, b) => a.periodo - b.periodo);
    }, [datosFiltrados]);

    const datosRangoEtario = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const rango = item.rangoedad;
            if (rango && rango !== "null" && rango !== "") mapa.set(rango, (mapa.get(rango) || 0) + (item.total || 0));
        });
        const order = ["<18", "18 a 24", "25 a 34", "35 a 44", "45 a 54", "55 a 64", "65+"];
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => order.indexOf(a.nombre) - order.indexOf(b.nombre));
    }, [datosFiltrados]);

    const totalGeneral = useMemo(() => datosFiltrados.reduce((sum, item) => sum + (item.total || 0), 0), [datosFiltrados]);
    const hasData = datosFiltrados.length > 0;

    const filtersConfig = [
        { key: "anio", label: "Año", options: opcionesDisponibles.anio || ["Todos"] },
        { key: "departamento", label: "Departamento", options: opcionesDisponibles.departamento || ["Todos"] },
        { key: "institucion", label: "Institución", options: opcionesDisponibles.institucion || ["Todos"] },
        { key: "sede", label: "SEDE", options: opcionesDisponibles.sede || ["Todos"] },
        { key: "titulo", label: "Título", options: opcionesDisponibles.titulo || ["Todos"] },
        { key: "administracion", label: "Administración", options: opcionesDisponibles.administracion || ["Todos"] },
    ];

    useEffect(() => {
        const updateDimensions = () => {
            const container = document.getElementById("map-container-graduados");
            if (container) {
                const containerWidth = container.clientWidth;
                let height = isMobile ? containerWidth * 0.5 : isTablet ? 500 : 600;
                setDimensions({ width: containerWidth, height: Math.max(height, 400) });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [isMobile, isTablet]);

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    {hasActiveFilters && (
                        <FiltrosActivos
                            filtros={filtros}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={limpiarFiltros}
                        />
                    )}
                </Grid>
                {filtersConfig.map((filter) => (
                    <Grid key={filter.key} size="auto">
                        <FiltroSelect
                            label={filter.label}
                            value={filtros[filter.key] || "Todos"}
                            options={filter.options}
                            onChange={(e) => cambiarFiltro(filter.key, e.target.value)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item size={{ xs: 12 }}>
                    <StyledCard sx={{ position: "relative", overflow: "hidden" }}>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                                <MapIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Graduados por Departamento</Typography>
                            </Stack>
                            <Box id="map-container-graduados" sx={{ width: "100%", height: dimensions.height }}>
                                {loading ? <Skeleton variant="rectangular" width="100%" height="100%" /> : !hasData ? <EmptyState onClearFilters={limpiarFiltros} /> : (
                                    <MapaDinamico
                                        datosDepto={datosMapa}
                                        dimensions={dimensions}
                                        isMobile={isMobile}
                                        esCentroEducativo={false}
                                        esMetricaDocente={false}
                                        modoSimple={false}
                                        selectedDimension="departamento"
                                    />
                                )}
                            </Box>
                        </StyledCardContent>
                        <Box sx={{ position: "absolute", top: { xs: 50, sm: 50, md: 60, lg: 20 }, left: 20, zIndex: 1300 }}>
                            <ScrollReveal direction="left" delay={0.4}>
                                <StyledCard sx={{ background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`, width: "220px" }}>
                                    <StyledCardContent>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                            <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                                            <Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                                Total Graduados
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h3" sx={{ color: color.secondary, fontWeight: "bold", fontSize: "clamp(2rem, 6vw, 2rem)", mb: 1 }}>
                                            {loading ? <Skeleton width="80%" /> : <AnimatedCounter value={totalGeneral} />}
                                        </Typography>
                                    </StyledCardContent>
                                </StyledCard>
                            </ScrollReveal>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Universidad</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={200} /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={datosUniversidades} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                        <XAxis angle={-45} dataKey="siglas" type="category" tick={{ fontSize: 10 }} textAnchor="end" interval={0} />
                                        <YAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Graduados"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <WcRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Género</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : datosGenero.every(d => d.value === 0) ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie data={datosGenero} dataKey="value" cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={5}
                                            labelLine={false} label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                                return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">{`${(percent * 100).toFixed(2)}%`}</text>;
                                            }}>
                                            {datosGenero.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.name === "Femenino" ? color.secondary : color.primary} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value, name) => {
                                            const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                            const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                            return [`${value?.toLocaleString()} (${percent}%)`, name];
                                        }} />
                                        <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <ComputerIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Expresión</Typography>
                                <Tooltip title="Distribución por grupo étnico">
                                    <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                </Tooltip>
                            </Stack>
                            {loading ? (
                                <ChartSkeleton height={300} />
                            ) : datosExpresion.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <Box sx={{ width: "100%", height: 350, overflowY: "auto" }}>
                                    <ResponsiveContainer width="100%" height={Math.max(datosExpresion.length * 90, 350)}>
                                        <BarChart data={datosExpresion} layout="vertical" margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
                                            <XAxis hide type="number" />
                                            <YAxis dataKey="nombre" type="category" width={90} height={130} tick={{ fontSize: 11 }} />
                                            <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Graduados"]} />
                                            <Bar dataKey="valor" fill={color.secondary} radius={[0, 6, 6, 0]} barSize={30}
                                                label={(props) => {
                                                    if (!props) return null;
                                                    const { x, y, width, height, value } = props;
                                                    const inside = width > 60;
                                                    return (
                                                        <text x={inside ? x + width - 8 : x + width + 6} y={y + height / 2}
                                                            fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                            dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                            {value?.toLocaleString()}
                                                        </text>
                                                    );
                                                }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Box>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Administración</Typography>
                                <Tooltip title="Distribución por tipo de administración">
                                    <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                </Tooltip>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosAdministracion}>
                                        <XAxis dataKey="nombre" type="category" tick={{ fontSize: 10 }} />
                                        <YAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Graduados"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]}
                                            label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <School sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Grado Académico</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={datosGradoAcademico} layout="vertical" margin={{ left: 10 }}>
                                        <XAxis hide type="number" />
                                        <YAxis dataKey="nombre" type="category" width={100} height={130} tick={{ fontSize: 11 }} />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Graduados"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[0, 6, 6, 0]} barSize={30}
                                            label={(props) => {
                                                if (!props) return null;
                                                const { x, y, width, height, value } = props;
                                                const inside = width > 60;
                                                return (
                                                    <text x={inside ? x + width - 8 : x + width + 6} y={y + height / 2}
                                                        fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                        dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                        {value?.toLocaleString()}
                                                    </text>
                                                );
                                            }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Modalidad</Typography>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosModalidad} layout="vertical" margin={{ left: 10 }}>
                                        <XAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Graduados"]} />
                                        <YAxis dataKey="nombre" type="category" width={120} tick={{ fontSize: 11 }} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[0, 6, 6, 0]} barSize={30}
                                            label={(props) => {
                                                if (!props) return null;
                                                const { x, y, width, height, value } = props;
                                                const inside = width > 60;
                                                return (
                                                    <text x={inside ? x + width - 8 : x + width + 6} y={y + height / 2}
                                                        fill={inside ? "#fff" : color.contrastText} textAnchor={inside ? "end" : "start"}
                                                        dominantBaseline="middle" fontSize={11} fontWeight="bold">
                                                        {value?.toLocaleString()}
                                                    </text>
                                                );
                                            }}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Timeline sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Periodo</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={datosPeriodo} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                                        <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Graduados"]} />
                                        <Line type="monotone" dataKey="total" stroke={color.primary} strokeWidth={3}
                                            dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }} activeDot={{ r: 7 }}
                                            label={!isMobile ? (props) => {
                                                const { x, y, value, index } = props;
                                                const isTop = index % 2 === 0;
                                                return <text x={x} y={isTop ? y - 10 : y + 20} fill={color.third} fontSize={11} textAnchor="middle">{value.toLocaleString()}</text>;
                                            } : undefined}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <ElderlyWomanIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Rango Etario</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={datosRangoEtario} margin={{ bottom: 40, left: 30 }}>
                                        <XAxis angle={-45} dataKey="nombre" type="category" tick={{ fontSize: 10 }} textAnchor="end" interval={0} />
                                        <YAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Graduados"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]}
                                            label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Títulos</Typography>
                            <SimpleTable data={datosTitulos} nameKey="nombre" valueKey="valor" title="Título" loading={loading} />
                        </StyledCardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

// ==================== COMPONENTE PARA DOCENTES ====================
const DocentesComponent = ({ data, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

    const fieldMapping = {
        anio: "anio",
        departamento: "departamento",
        institucion: "institucion",
        sede: "sede"
    };

    const initialFilters = {
        anio: "Todos",
        departamento: "Todos",
        institucion: "Todos",
        sede: "Todos"
    };

    const {
        filtros,
        opcionesDisponibles,
        cambiarFiltro,
        limpiarFiltros,
        datosFiltrados
    } = useFiltrosConectados(data, initialFilters, fieldMapping);

    const hasActiveFilters = useMemo(() => {
        return Object.values(filtros).some(value => value !== "Todos");
    }, [filtros]);

    const handleRemoveFilter = (key) => {
        cambiarFiltro(key, "Todos");
    };

    const datosMapa = useMemo(() => {
        const mapa = {};
        datosFiltrados.forEach((row) => {
            const clave = row.departamento;
            if (clave && clave !== "Todos" && clave !== "null") {
                const claveNormalizada = normalizar(clave);
                if (!mapa[claveNormalizada]) {
                    mapa[claveNormalizada] = { valor: 0, nombre: clave };
                }
                mapa[claveNormalizada].valor += (row.total || 0);
            }
        });
        return mapa;
    }, [datosFiltrados]);

    const datosUniversidades = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const inst = item.institucion;
            if (inst && inst !== "null") {
                const valor = Number(item.total) || 0;
                if (!mapa.has(inst)) {
                    mapa.set(inst, {
                        nombre: inst,
                        siglas: item.siglas || inst,
                        valor: 0
                    });
                }
                mapa.get(inst).valor += valor;
            }
        });
        return Array.from(mapa.values()).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosGenero = useMemo(() => {
        let mujeres = 0, hombres = 0;
        datosFiltrados.forEach((item) => {
            mujeres += item.femenino || 0;
            hombres += item.masculino || 0;
        });
        return [{ name: "Femenino", value: mujeres }, { name: "Masculino", value: hombres }];
    }, [datosFiltrados]);

    const datosAdministracion = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const adm = item.administracion;
            if (adm && adm !== "null") mapa.set(adm, (mapa.get(adm) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosRangoEtario = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const rango = item.rangoedad;
            if (rango && rango !== "null" && rango !== "") mapa.set(rango, (mapa.get(rango) || 0) + (item.total || 0));
        });
        const order = ["25 A 30 AÑOS", "30 A 35 AÑOS", "35 A 40 AÑOS", "40 A 45 AÑOS", "45 A 50 AÑOS", "50 A 55 AÑOS", "55 A 60 AÑOS", "60 A 65 AÑOS", "65 A 70 AÑOS", "70+"];
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => order.indexOf(a.nombre) - order.indexOf(b.nombre));
    }, [datosFiltrados]);

    const datosPeriodo = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const anio = item.anio;
            if (anio) mapa.set(anio, (mapa.get(anio) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([periodo, total]) => ({ periodo, total })).sort((a, b) => a.periodo - b.periodo);
    }, [datosFiltrados]);

    const datosDedicacion = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const dedicacion = item.dedicacion;
            if (dedicacion && dedicacion !== "null") mapa.set(dedicacion, (mapa.get(dedicacion) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
    }, [datosFiltrados]);

    const datosDepartamentos = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const depto = item.nombredepartamento;
            if (depto && depto !== "null" && depto !== "") {
                mapa.set(depto, (mapa.get(depto) || 0) + (item.total || 0));
            }
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosCargo = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const cargo = item.cargoprincipal;
            if (cargo && cargo !== "null" && cargo !== "") {
                mapa.set(cargo, (mapa.get(cargo) || 0) + (item.total || 0));
            }
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosGradoPrograma = useMemo(() => {
        const mapa = new Map();
        datosFiltrados.forEach((item) => {
            const grado = item.gradoprogramaprincipal;
            if (grado && grado !== "null" && grado !== "") mapa.set(grado, (mapa.get(grado) || 0) + (item.total || 0));
        });
        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const datosContrato = useMemo(() => {
        const mapa = new Map();
        const excluir = new Set(["", "null", "SIN DATOS", "NO APLICA", "NINGUNO"]);

        datosFiltrados.forEach((item) => {
            const raw = item.contrato;
            if (raw === null || raw === undefined) return;
            const contrato = String(raw).trim().toUpperCase();
            if (excluir.has(contrato)) return;
            mapa.set(contrato, (mapa.get(contrato) || 0) + (item.total || 0));
        });

        return Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor })).sort((a, b) => b.valor - a.valor);
    }, [datosFiltrados]);

    const totalGeneral = useMemo(() => datosFiltrados.reduce((sum, item) => sum + (item.total || 0), 0), [datosFiltrados]);
    const hasData = datosFiltrados.length > 0;

    const filtersConfig = [
        { key: "anio", label: "Año", options: opcionesDisponibles.anio || ["Todos"] },
        { key: "departamento", label: "Departamento", options: opcionesDisponibles.departamento || ["Todos"] },
        { key: "institucion", label: "Institución", options: opcionesDisponibles.institucion || ["Todos"] },
        { key: "sede", label: "SEDE", options: opcionesDisponibles.sede || ["Todos"] }
    ];

    useEffect(() => {
        const updateDimensions = () => {
            const container = document.getElementById("map-container-docentes");
            if (container) {
                const containerWidth = container.clientWidth;
                let height = isMobile ? containerWidth * 0.5 : isTablet ? 500 : 600;
                setDimensions({ width: containerWidth, height: Math.max(height, 400) });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [isMobile, isTablet]);

    return (
        <Box>
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    {hasActiveFilters && (
                        <FiltrosActivos
                            filtros={filtros}
                            onRemoveFilter={handleRemoveFilter}
                            onClearAll={limpiarFiltros}
                        />
                    )}
                </Grid>
                {filtersConfig.map((filter) => (
                    <Grid key={filter.key} size="auto">
                        <FiltroSelect
                            label={filter.label}
                            value={filtros[filter.key] || "Todos"}
                            options={filter.options}
                            onChange={(e) => cambiarFiltro(filter.key, e.target.value)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item size={{ xs: 12 }}>
                    <StyledCard sx={{ position: "relative", overflow: "hidden" }}>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                                <MapIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Docentes por Departamento</Typography>
                            </Stack>
                            <Box id="map-container-docentes" sx={{ width: "100%", height: dimensions.height }}>
                                {loading ? <Skeleton variant="rectangular" width="100%" height="100%" /> : !hasData ? <EmptyState onClearFilters={limpiarFiltros} /> : (
                                    <MapaDinamico
                                        datosDepto={datosMapa}
                                        dimensions={dimensions}
                                        isMobile={isMobile}
                                        esCentroEducativo={false}
                                        esMetricaDocente={false}
                                        modoSimple={false}
                                        selectedDimension="departamento"
                                    />
                                )}
                            </Box>
                        </StyledCardContent>
                        <Box sx={{ position: "absolute", top: 20, left: 20 }}>
                            <StyledCard sx={{ background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`, width: 200 }}>
                                <StyledCardContent>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                        <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                                        <Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                                            Total Docentes
                                        </Typography>
                                    </Stack>
                                    <Typography variant="h3" sx={{ color: color.secondary, fontWeight: "bold", fontSize: "clamp(2rem, 6vw, 2rem)", mb: 1 }}>
                                        {loading ? <Skeleton width="80%" /> : <AnimatedCounter value={totalGeneral} />}
                                    </Typography>
                                </StyledCardContent>
                            </StyledCard>
                        </Box>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Universidad</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={datosUniversidades} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                        <XAxis angle={-45} dataKey="siglas" type="category" tick={{ fontSize: 10 }} textAnchor="end" interval={0} />
                                        <YAxis hide type="number" />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Docentes"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <WcRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Género</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : datosGenero.every(d => d.value === 0) ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <PieChart>
                                        <Pie data={datosGenero} dataKey="value" cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" paddingAngle={5}
                                            labelLine={false} label={({ name, percent, cx, cy, midAngle, innerRadius, outerRadius }) => {
                                                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
                                                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);
                                                return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle" fontSize={12} fontWeight="bold">{`${(percent * 100).toFixed(2)}%`}</text>;
                                            }}>
                                            {datosGenero.map((entry, idx) => (
                                                <Cell key={idx} fill={entry.name === "Femenino" ? color.secondary : color.primary} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip formatter={(value, name) => {
                                            const total = datosGenero.reduce((sum, d) => sum + d.value, 0);
                                            const percent = total > 0 ? ((value / total) * 100).toFixed(2) : 0;
                                            return [`${value?.toLocaleString()} (${percent}%)`, name];
                                        }} />
                                        <Legend iconType="circle" verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: 10 }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AccountBalanceRoundedIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Administración</Typography>
                                <Tooltip title="Distribución por tipo de administración">
                                    <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                </Tooltip>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosAdministracion}>
                                        <XAxis dataKey="nombre" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Docentes"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Departamentos</Typography>
                            <SimpleTable data={datosDepartamentos} nameKey="nombre" valueKey="valor" title="Departamento" loading={loading} />
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Cargo Principal</Typography>
                            <SimpleTable data={datosCargo} nameKey="nombre" valueKey="valor" title="Cargo" loading={loading} />
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Grado Programa Principal</Typography>
                            <SimpleTable data={datosGradoPrograma} nameKey="nombre" valueKey="valor" title="Grado" loading={loading} />
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Tipo de Dedicación</Typography>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosDedicacion} margin={{ bottom: 10, left: 40, top: 20 }}>
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Docentes"]} />
                                        <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <ElderlyWomanIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Rango Etario</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : (
                                <ResponsiveContainer width="100%" height={350}>
                                    <BarChart data={datosRangoEtario} margin={{ bottom: 10, left: 50 }}>
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Docentes"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <AssignmentIcon sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Tipo de Contrato</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={300} /> : datosContrato.length === 0 ? (
                                <EmptyState onClearFilters={limpiarFiltros} />
                            ) : (
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={datosContrato} margin={{ bottom: 80, left: 30, top: 20 }}>
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Docentes"]} />
                                        <Bar dataKey="valor" fill={color.secondary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 11, fontWeight: "bold" }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>

                <Grid item size={{ xs: 12, md: 12 }}>
                    <StyledCard>
                        <StyledCardContent>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                <Timeline sx={{ color: color.primary }} />
                                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Por Periodo</Typography>
                            </Stack>
                            {loading ? <ChartSkeleton height={200} /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <LineChart data={datosPeriodo} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                                        <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                                        <YAxis hide />
                                        <RechartsTooltip formatter={(value) => [value?.toLocaleString(), "Docentes"]} />
                                        <Line type="monotone" dataKey="total" stroke={color.primary} strokeWidth={3}
                                            dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }} activeDot={{ r: 7 }}
                                            label={!isMobile ? (props) => {
                                                const { x, y, value, index } = props;
                                                const isTop = index % 2 === 0;
                                                return <text x={x} y={isTop ? y - 10 : y + 20} fill={color.third} fontSize={11} textAnchor="middle">{value.toLocaleString()}</text>;
                                            } : undefined}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}
                        </StyledCardContent>
                    </StyledCard>
                </Grid>
            </Grid>
        </Box>
    );
};

// ==================== COMPONENTE PARA INDICADORES - TASA MATRÍCULA ====================
const IndicadorTasaMatricula = ({ dataBruta, dataNeta, loading }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const datosCombinados = useMemo(() => {
        const mapa = new Map();

        if (dataBruta && dataBruta.length) {
            dataBruta.forEach(item => {
                const anio = item.AÑO || item.anio;
                if (anio) {
                    if (!mapa.has(anio)) mapa.set(anio, {});
                    mapa.get(anio).tasaBruta = item["TASA BRUTA DE MATRÍCULA"] || 0;
                    mapa.get(anio).anio = anio;
                }
            });
        }

        if (dataNeta && dataNeta.length) {
            dataNeta.forEach(item => {
                const anio = item.AÑO || item.anio;
                if (anio) {
                    if (!mapa.has(anio)) mapa.set(anio, {});
                    mapa.get(anio).tasaNeta = item["TASA NETA DE MATRÍCULA"] || 0;
                    mapa.get(anio).anio = anio;
                }
            });
        }

        return Array.from(mapa.values()).sort((a, b) => a.anio - b.anio);
    }, [dataBruta, dataNeta]);

    const formatPercent = (value) => {
        if (value === undefined || value === null) return "N/A";
        return `${(value * 100).toFixed(2)}%`;
    };

    return (
        <Grid container spacing={3}>
            <Grid item size={{ xs: 12 }}>
                <StyledCard>
                    <StyledCardContent>
                        <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>Tasa de Matrícula</Typography>
                        {loading ? <ChartSkeleton height={350} /> : (
                            <ResponsiveContainer width="100%" height={350}>
                                <LineChart data={datosCombinados} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                                    <XAxis dataKey="anio" />
                                    <YAxis tickFormatter={(value) => `${(value * 100).toFixed(0)}%`} domain={[0, 'auto']} hide />
                                    <RechartsTooltip formatter={(value) => formatPercent(value)} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="tasaBruta"
                                        name="Tasa Bruta"
                                        stroke={color.primary}
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                        label={
                                            !isMobile
                                                ? {
                                                    position: "top",
                                                    fill: color.third,
                                                    fontSize: 11,
                                                    fontWeight: "bold",
                                                    formatter: (value) => `${(value * 100).toFixed(2)}%`,
                                                }
                                                : undefined
                                        }
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="tasaNeta"
                                        name="Tasa Neta"
                                        stroke={color.secondary}
                                        strokeWidth={3}
                                        dot={{ r: 5 }}
                                        label={
                                            !isMobile
                                                ? {
                                                    position: "top",
                                                    fill: color.third,
                                                    fontSize: 11,
                                                    fontWeight: "bold",
                                                    formatter: (value) => `${(value * 100).toFixed(2)}%`,
                                                }
                                                : undefined
                                        }
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </StyledCardContent>
                </StyledCard>
            </Grid>
        </Grid>
    );
};

// ==================== COMPONENTE PARA INDICADORES CON MÚLTIPLES LÍNEAS ====================
const IndicadorMultipleLineas = ({ data, title, groupBy, valueKey, xKey = "AÑO", loading }) => {
    const [processedData, setProcessedData] = useState([]);
    const [lines, setLines] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    
    useEffect(() => {
        if (!data || !data.length) {
            setProcessedData([]);
            setLines([]);
            return;
        }

        const grupos = new Map();
        const categorias = new Set();

        data.forEach(item => {
            let anio = item[xKey] || item.anio;
            const categoria = item[groupBy];
            let valor = Number(item[valueKey]) || 0;

            if (valueKey === "GRADUADOS" && !valor) {
                valor = Number(item.graduados) || 0;
            }

            if (valueKey === "CANTIDAD DE EGRESADOS" && !valor) {
                valor = Number(item["CANTIDAD DE EGRESADOS"]) || 0;
            }

            if (!anio || !categoria || valor === 0) return;

            categoria.toString().trim();
            categorias.add(categoria);

            if (!grupos.has(anio)) grupos.set(anio, new Map());
            const anioMap = grupos.get(anio);
            anioMap.set(categoria, (anioMap.get(categoria) || 0) + valor);
        });

        const result = Array.from(grupos.entries()).map(([anio, catMap]) => {
            const obj = { [xKey]: anio };
            catMap.forEach((valor, categoria) => {
                obj[categoria] = valor;
            });
            return obj;
        }).sort((a, b) => String(a[xKey]).localeCompare(String(b[xKey])));

        setProcessedData(result);
        const categoriasList = Array.from(categorias).sort();
        setLines(categoriasList.map(cat => ({ key: cat, name: cat })));
    }, [data, groupBy, valueKey, xKey]);

    if (loading) return <ChartSkeleton height={350} />;
    if (processedData.length === 0 || lines.length === 0) {
        return (
            <StyledCard>
                <StyledCardContent>
                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>{title}</Typography>
                    <EmptyState message="No hay datos disponibles para esta categoría" />
                </StyledCardContent>
            </StyledCard>
        );
    }

    const colors = [color.primary, color.secondary, "#4caf50", "#ff9800", "#9c27b0", "#f44336", "#2196f3", "#ff5722"];

    return (
        <StyledCard>
            <StyledCardContent>
                <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", mb: 2 }}>{title}</Typography>
                <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={processedData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                        <XAxis dataKey={xKey} tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                        <YAxis hide />
                        <RechartsTooltip formatter={(value) => value?.toLocaleString()} />
                        <Legend />
                        {lines.map((line, idx) => (
                            <Line
                                key={line.key}
                                type="monotone"
                                dataKey={line.key}
                                name={line.name}
                                stroke={colors[idx % colors.length]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                                label={
                                    !isMobile
                                        ? {
                                            position: "top",
                                            fill: color.third,
                                            fontSize: 11,
                                            fontWeight: "bold",
                                            formatter: (value) => value.toLocaleString(),
                                        }
                                        : undefined
                                }
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </StyledCardContent>
        </StyledCard>
    );
};

// ==================== COMPONENTE UNIFICADO PARA GRÁFICO DE PERIODO ====================
const IndicadorPeriodo = ({ data, loading, title, tooltipText, valueKey, strokeColor, name, formatValue = null }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const datosPeriodo = useMemo(() => {
        const mapa = new Map();
        if (!data || !data.length) return [];

        data.forEach(item => {
            const anio = item.AÑO || item.anio;
            let valor = Number(item[valueKey]) || 0;

            if (anio && valor > 0) {
                if (valueKey === "indicador_4_2_por_10000_hab") {
                    valor = Number(valor.toFixed(6));
                }
                mapa.set(anio, (mapa.get(anio) || 0) + valor);
            }
        });

        let result = Array.from(mapa.entries())
            .map(([periodo, total]) => ({ periodo, total }))
            .sort((a, b) => a.periodo - b.periodo);

        if (valueKey === "indicador_4_2_por_10000_hab") {
            result = result.map(item => ({
                ...item,
                total: parseFloat(item.total.toFixed(6))
            }));
        }

        return result;
    }, [data, valueKey]);

    const formatearValor = (value) => {
        if (value === undefined || value === null) return "N/A";
        if (formatValue) return formatValue(value);
        if (valueKey === "indicador_4_2_por_10000_hab") {
            return parseFloat(value.toFixed(6)).toString();
        }
        return value?.toLocaleString();
    };

    if (loading) return <ChartSkeleton height={200} />;
    if (datosPeriodo.length === 0) return <EmptyState message="No hay datos disponibles" />;

    return (
        <StyledCard>
            <StyledCardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <Timeline sx={{ color: color.primary }} />
                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>
                        {title}
                    </Typography>
                    <Tooltip title={tooltipText}>
                        <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                    </Tooltip>
                </Stack>
                <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={datosPeriodo} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                        <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                        <YAxis hide />
                        <RechartsTooltip formatter={(value) => [formatearValor(value), name]} />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="total"
                            name={name}
                            stroke={color.primary}
                            strokeWidth={3}
                            dot={{
                                fill: color.primary,
                                r: 5,
                                strokeWidth: 2,
                                stroke: color.white,
                            }}
                            activeDot={{ r: 7 }}
                            label={
                                !isMobile
                                    ? (props) => {
                                        const { x, y, value, index } = props;
                                        const isTop = index % 2 === 0;
                                        return (
                                            <text
                                                x={x}
                                                y={isTop ? y - 10 : y + 20}
                                                fill={color.third}
                                                fontSize={11}
                                                textAnchor="middle"
                                            >
                                                {value.toLocaleString()}
                                            </text>
                                        );
                                    }
                                    : undefined
                            }
                        />
                    </LineChart>
                </ResponsiveContainer>
            </StyledCardContent>
        </StyledCard>
    );
};

// ==================== COMPONENTE PARA INDICADORES CON FILTROS ====================
const IndicadoresComponent = ({
    tasaMatriculaBruta, tasaMatriculaNeta,
    graduadosData, estudiantesInternacionalesData,
    personasQueIngresanData, nuevosIngresosData,
    primerTituloData, primerTituloXHabitanteData,
    loading
}) => {
    const [activeSubmetric, setActiveSubmetric] = useState("tasaMatricula");
    const [filtrosIndicadores, setFiltrosIndicadores] = useState({
        cine: "Todos",
        sexo: "Todos",
        sectorGestion: "Todos",
        campoEducacion: "Todos",
        modalidad: "Todos",
        rangoEdad: "Todos",
        nombrePrograma: "Todos",
        tipoIngreso: "Todos",
        gradoAcademico: "Todos",
        nacionalidad: "Todos",
        tituloEdMedia: "Todos",
    });

    const obtenerOpciones = (data, campo) => {
        if (!data || !data.length) return ["Todos"];
        const opciones = new Set();
        data.forEach(item => {
            const valor = item[campo];
            if (valor && valor !== "null" && valor !== "") {
                opciones.add(valor);
            }
        });
        return ["Todos", ...Array.from(opciones).sort()];
    };

    const filtrarDatos = (data, filtrosAplicar) => {
        if (!data || !data.length) return [];

        return data.filter(item => {
            const cumpleCine = filtrosAplicar.cine === "Todos" || item.CINE === filtrosAplicar.cine;
            const cumpleSexo = filtrosAplicar.sexo === "Todos" || item.SEXO === filtrosAplicar.sexo;
            const cumpleSector = filtrosAplicar.sectorGestion === "Todos" || item["SECTOR DE GESTIÓN"] === filtrosAplicar.sectorGestion;
            const cumpleCampo = filtrosAplicar.campoEducacion === "Todos" || item["CAMPO DE EDUCACIÓN Y CAPACITACIÓN"] === filtrosAplicar.campoEducacion;
            const cumpleModalidad = filtrosAplicar.modalidad === "Todos" || item.MODALIDAD === filtrosAplicar.modalidad;
            const cumpleRangoEdad = filtrosAplicar.rangoEdad === "Todos" || item["RANGO DE EDAD"] === filtrosAplicar.rangoEdad;
            const cumplePrograma = filtrosAplicar.nombrePrograma === "Todos" || item["NOMBRE PROGRAMA"] === filtrosAplicar.nombrePrograma;
            const cumpleTipoIngreso = filtrosAplicar.tipoIngreso === "Todos" || item.TIPO_INGRESO === filtrosAplicar.tipoIngreso;
            const cumpleGrado = filtrosAplicar.gradoAcademico === "Todos" || item.GRADO_ACADEMICO === filtrosAplicar.gradoAcademico;
            const cumpleNacionalidad = filtrosAplicar.nacionalidad === "Todos" || item.NACIONALIDAD === filtrosAplicar.nacionalidad;
            const cumpleTituloEdMedia = filtrosAplicar.tituloEdMedia === "Todos" || item.TITULO_EDMEDIA === filtrosAplicar.tituloEdMedia;

            return cumpleCine && cumpleSexo && cumpleSector && cumpleCampo &&
                cumpleModalidad && cumpleRangoEdad && cumplePrograma &&
                cumpleTipoIngreso && cumpleGrado && cumpleNacionalidad && cumpleTituloEdMedia;
        });
    };

    const primerTituloFiltrado = useMemo(() => {
        return filtrarDatos(primerTituloData, filtrosIndicadores);
    }, [primerTituloData, filtrosIndicadores]);

    const primerTituloXHabitanteFiltrado = useMemo(() => {
        return filtrarDatos(primerTituloXHabitanteData, filtrosIndicadores);
    }, [primerTituloXHabitanteData, filtrosIndicadores]);

    const personasQueIngresanFiltrado = useMemo(() => {
        return filtrarDatos(personasQueIngresanData, filtrosIndicadores);
    }, [personasQueIngresanData, filtrosIndicadores]);

    const nuevosIngresosFiltrado = useMemo(() => {
        return filtrarDatos(nuevosIngresosData, filtrosIndicadores);
    }, [nuevosIngresosData, filtrosIndicadores]);

    const graduadosFiltrado = useMemo(() => {
        return filtrarDatos(graduadosData, filtrosIndicadores);
    }, [graduadosData, filtrosIndicadores]);

    const estudiantesInternacionalesFiltrado = useMemo(() => {
        return filtrarDatos(estudiantesInternacionalesData, filtrosIndicadores);
    }, [estudiantesInternacionalesData, filtrosIndicadores]);

    const hasActiveFilters = useMemo(() => {
        return Object.values(filtrosIndicadores).some(value => value !== "Todos");
    }, [filtrosIndicadores]);

    const handleRemoveFilter = (key) => {
        setFiltrosIndicadores(prev => ({ ...prev, [key]: "Todos" }));
    };

    const handleClearAllFilters = () => {
        setFiltrosIndicadores({
            cine: "Todos",
            sexo: "Todos",
            sectorGestion: "Todos",
            campoEducacion: "Todos",
            modalidad: "Todos",
            rangoEdad: "Todos",
            nombrePrograma: "Todos",
            tipoIngreso: "Todos",
            gradoAcademico: "Todos",
            nacionalidad: "Todos",
            tituloEdMedia: "Todos",
        });
    };

    const submetricas = [
        { id: "tasaMatricula", label: "Tasa de Matrícula" },
        { id: "primerTitulo", label: "Primer Título de Educación Superior" },
        { id: "primerTituloXHabitante", label: "Estudiantes De Primer Título De Educación Superior Por Cada Diez Mil Habitantes" },
        { id: "personasQueIngresan", label: "Personas que Ingresan a la Educación Superior" },
        { id: "nuevosIngresos", label: "Nuevos Ingresos en Condiciones de Iniciar el Programa" },
        { id: "graduados", label: "Graduados" },
        { id: "estudiantesInternacionales", label: "Estudiantes Internacionales" },
    ];

    const FiltrosIndicadores = () => {
        const getOpcionesPorSubmetrica = () => {
            let dataSource = [];
            switch (activeSubmetric) {
                case "primerTitulo":
                case "primerTituloXHabitante":
                    dataSource = primerTituloData;
                    break;
                case "personasQueIngresan":
                    dataSource = personasQueIngresanData;
                    break;
                case "nuevosIngresos":
                    dataSource = nuevosIngresosData;
                    break;
                case "graduados":
                    dataSource = graduadosData;
                    break;
                case "estudiantesInternacionales":
                    dataSource = estudiantesInternacionalesData;
                    break;
                default:
                    return {};
            }

            return {
                cine: obtenerOpciones(dataSource, "CINE"),
                sexo: obtenerOpciones(dataSource, "SEXO"),
                sectorGestion: obtenerOpciones(dataSource, "SECTOR DE GESTIÓN"),
                campoEducacion: obtenerOpciones(dataSource, "CAMPO DE EDUCACIÓN Y CAPACITACIÓN"),
                modalidad: obtenerOpciones(dataSource, "MODALIDAD"),
                rangoEdad: obtenerOpciones(dataSource, "RANGO DE EDAD"),
                nombrePrograma: obtenerOpciones(dataSource, "NOMBRE PROGRAMA"),
                tipoIngreso: obtenerOpciones(dataSource, "TIPO_INGRESO"),
                gradoAcademico: obtenerOpciones(dataSource, "GRADO_ACADEMICO"),
                nacionalidad: obtenerOpciones(dataSource, "NACIONALIDAD"),
                tituloEdMedia: obtenerOpciones(dataSource, "TITULO_EDMEDIA"),
            };
        };

        const opciones = getOpcionesPorSubmetrica();

        const filtrosConfig = [];

        if (activeSubmetric === "primerTitulo" || activeSubmetric === "primerTituloXHabitante") {
            filtrosConfig.push(
                { key: "cine", label: "CINE", options: opciones.cine },
                { key: "sexo", label: "Género", options: opciones.sexo },
                { key: "sectorGestion", label: "Sector de Gestión", options: opciones.sectorGestion },
                { key: "campoEducacion", label: "Campo de Educación", options: opciones.campoEducacion },
                { key: "modalidad", label: "Modalidad", options: opciones.modalidad },
                { key: "rangoEdad", label: "Rango de Edad", options: opciones.rangoEdad }
            );
        }

        if (activeSubmetric === "personasQueIngresan") {
            filtrosConfig.push(
                { key: "nombrePrograma", label: "Programa", options: opciones.nombrePrograma },
                { key: "tipoIngreso", label: "Tipo de Ingreso", options: opciones.tipoIngreso },
                { key: "cine", label: "CINE", options: opciones.cine },
                { key: "sexo", label: "Género", options: opciones.sexo },
                { key: "sectorGestion", label: "Sector de Gestión", options: opciones.sectorGestion },
                { key: "campoEducacion", label: "Campo de Educación", options: opciones.campoEducacion },
                { key: "modalidad", label: "Modalidad", options: opciones.modalidad },
                { key: "rangoEdad", label: "Rango de Edad", options: opciones.rangoEdad }
            );
        }

        if (activeSubmetric === "nuevosIngresos") {
            filtrosConfig.push(
                { key: "nombrePrograma", label: "Programa", options: opciones.nombrePrograma },
                { key: "gradoAcademico", label: "Grado Académico", options: opciones.gradoAcademico },
                { key: "cine", label: "CINE", options: opciones.cine },
                { key: "sexo", label: "Género", options: opciones.sexo },
                { key: "sectorGestion", label: "Sector de Gestión", options: opciones.sectorGestion },
                { key: "campoEducacion", label: "Campo de Educación", options: opciones.campoEducacion },
                { key: "modalidad", label: "Modalidad", options: opciones.modalidad },
                { key: "rangoEdad", label: "Rango de Edad", options: opciones.rangoEdad }
            );
        }

        if (activeSubmetric === "graduados") {
            filtrosConfig.push(
                { key: "nombrePrograma", label: "Programa", options: opciones.nombrePrograma },
                { key: "gradoAcademico", label: "Grado Académico", options: opciones.gradoAcademico },
                { key: "cine", label: "CINE", options: opciones.cine },
                { key: "sexo", label: "Género", options: opciones.sexo },
                { key: "sectorGestion", label: "Sector de Gestión", options: opciones.sectorGestion },
                { key: "modalidad", label: "Modalidad", options: opciones.modalidad },
                { key: "rangoEdad", label: "Rango de Edad", options: opciones.rangoEdad }
            );
        }

        if (activeSubmetric === "estudiantesInternacionales") {
            filtrosConfig.push(
                { key: "nacionalidad", label: "Nacionalidad", options: opciones.nacionalidad },
                { key: "tituloEdMedia", label: "Título Educación Media", options: opciones.tituloEdMedia },
                { key: "cine", label: "CINE", options: opciones.cine },
                { key: "sexo", label: "Género", options: opciones.sexo },
                { key: "sectorGestion", label: "Sector de Gestión", options: opciones.sectorGestion },
                { key: "campoEducacion", label: "Campo de Educación", options: opciones.campoEducacion },
                { key: "modalidad", label: "Modalidad", options: opciones.modalidad },
                { key: "rangoEdad", label: "Rango de Edad", options: opciones.rangoEdad }
            );
        }

        if (filtrosConfig.length === 0) return null;

        return (
            <Grid container spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                {filtrosConfig.map((filtro) => (
                    <Grid key={filtro.key} size="auto">
                        <FiltroSelect
                            label={filtro.label}
                            value={filtrosIndicadores[filtro.key] || "Todos"}
                            options={filtro.options}
                            onChange={(e) => setFiltrosIndicadores(prev => ({ ...prev, [filtro.key]: e.target.value }))}
                        />
                    </Grid>
                ))}
            </Grid>
        );
    };

    const renderContent = () => {
        switch (activeSubmetric) {
            case "tasaMatricula":
                return <IndicadorTasaMatricula dataBruta={tasaMatriculaBruta} dataNeta={tasaMatriculaNeta} loading={loading} />;

            case "estudiantesInternacionales":
                if (!estudiantesInternacionalesFiltrado || estudiantesInternacionalesFiltrado.length === 0) {
                    return <EmptyState message="No hay datos de estudiantes internacionales disponibles" />;
                }
                return (
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <IndicadorPeriodo data={estudiantesInternacionalesFiltrado}
                                loading={loading}
                                title="Por Periodo"
                                tooltipText="Tendencia histórica de estudiantes internacionales"
                                valueKey="ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO"
                                strokeColor={color.secondary}
                                name="Estudiantes Internacionales" />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={estudiantesInternacionalesFiltrado} title="Por Género" groupBy="SEXO" valueKey="ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={estudiantesInternacionalesFiltrado} title="Por Rango de Edad" groupBy="RANGO DE EDAD" valueKey="ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={estudiantesInternacionalesFiltrado} title="Por CINE" groupBy="CINE" valueKey="ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={estudiantesInternacionalesFiltrado} title="Por Sector de Gestión" groupBy="SECTOR DE GESTIÓN" valueKey="ESTUDIANTES INTERNACIONALES DE CICLO COMPLETO" loading={loading} />
                        </Grid>
                    </Grid>
                );

            case "personasQueIngresan":
                if (!personasQueIngresanFiltrado || personasQueIngresanFiltrado.length === 0) {
                    return <EmptyState message="No hay datos de personas que ingresan disponibles" />;
                }
                return (
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <IndicadorPeriodo data={personasQueIngresanFiltrado} loading={loading} title="Por Periodo"
                                tooltipText="Tendencia histórica de personas que ingresan"
                                valueKey="PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR"
                                strokeColor={color.primary}
                                name="Personas que Ingresan" />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={personasQueIngresanFiltrado} title="Personas que Ingresan por Género" groupBy="SEXO" valueKey="PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={personasQueIngresanFiltrado} title="Por Rango de Edad" groupBy="RANGO DE EDAD" valueKey="PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={personasQueIngresanFiltrado} title="Por CINE" groupBy="CINE" valueKey="PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={personasQueIngresanFiltrado} title="Por Sector de Gestión" groupBy="SECTOR DE GESTIÓN" valueKey="PERSONAS QUE INGRESAN A LA EDUCACIÓN SUPERIOR" loading={loading} />
                        </Grid>
                    </Grid>
                );

            case "nuevosIngresos":
                if (!nuevosIngresosFiltrado || nuevosIngresosFiltrado.length === 0) {
                    return <EmptyState message="No hay datos de nuevos ingresos disponibles" />;
                }
                return (
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <IndicadorPeriodo data={nuevosIngresosFiltrado} loading={loading} title="Por Periodo"
                                tooltipText="Tendencia histórica de nuevos ingresos"
                                valueKey="NUEVOS INGRESOS"
                                strokeColor={color.secondary}
                                name="Nuevos Ingresos" />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={nuevosIngresosFiltrado} title="Por Género" groupBy="SEXO" valueKey="NUEVOS INGRESOS" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={nuevosIngresosFiltrado} title="Por Rango de Edad" groupBy="RANGO DE EDAD" valueKey="NUEVOS INGRESOS" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={nuevosIngresosFiltrado} title="Por CINE" groupBy="CINE" valueKey="NUEVOS INGRESOS" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={nuevosIngresosFiltrado} title="Por Sector de Gestión" groupBy="SECTOR DE GESTIÓN" valueKey="NUEVOS INGRESOS" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <IndicadorMultipleLineas data={nuevosIngresosFiltrado} title="Por Grado Académico" groupBy="GRADO_ACADEMICO" valueKey="NUEVOS INGRESOS" loading={loading} />
                        </Grid>
                    </Grid>
                );

            case "primerTitulo":
                if (!primerTituloFiltrado || primerTituloFiltrado.length === 0) {
                    return <EmptyState message="No hay datos de primer título disponibles" />;
                }
                return (
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <IndicadorPeriodo data={primerTituloFiltrado} loading={loading} title="Por Periodo"
                                tooltipText="Tendencia histórica de estudiantes de primer título"
                                valueKey="TOTAL DE ESTUDIANTES DE PRIMER TÍTULO"
                                strokeColor={color.primary}
                                name="Estudiantes de Primer Título" />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloFiltrado} title="Por Género" groupBy="SEXO" valueKey="TOTAL DE ESTUDIANTES DE PRIMER TÍTULO" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloFiltrado} title="Por Rango de Edad" groupBy="RANGO DE EDAD" valueKey="TOTAL DE ESTUDIANTES DE PRIMER TÍTULO" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloFiltrado} title="Por CINE" groupBy="CINE" valueKey="TOTAL DE ESTUDIANTES DE PRIMER TÍTULO" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloFiltrado} title="Por Sector de Gestión" groupBy="SECTOR DE GESTIÓN" valueKey="TOTAL DE ESTUDIANTES DE PRIMER TÍTULO" loading={loading} />
                        </Grid>
                    </Grid>
                );

            case "primerTituloXHabitante":
                if (!primerTituloXHabitanteFiltrado || primerTituloXHabitanteFiltrado.length === 0) {
                    return <EmptyState message="No hay datos de primer título por habitante disponibles" />;
                }
                return (
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <IndicadorPeriodo
                                data={primerTituloXHabitanteFiltrado}
                                loading={loading}
                                title="Por Periodo"
                                tooltipText="Tendencia histórica del indicador de primer título por cada 10,000 habitantes"
                                valueKey="indicador_4_2_por_10000_hab"
                                strokeColor={color.secondary}
                                name="Estudiantes x 10mil Hab."
                            />                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloXHabitanteFiltrado} title="Por Género" groupBy="SEXO" valueKey="indicador_4_2_por_10000_hab" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloXHabitanteFiltrado} title="Por Rango de Edad" groupBy="RANGO DE EDAD" valueKey="indicador_4_2_por_10000_hab" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloXHabitanteFiltrado} title="Por CINE" groupBy="CINE" valueKey="indicador_4_2_por_10000_hab" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={primerTituloXHabitanteFiltrado} title="Por Sector de Gestión" groupBy="SECTOR DE GESTIÓN" valueKey="indicador_4_2_por_10000_hab" loading={loading} />
                        </Grid>
                    </Grid>
                );

            case "graduados":
                if (!graduadosFiltrado || graduadosFiltrado.length === 0) {
                    return <EmptyState message="No hay datos de graduados disponibles" />;
                }
                return (
                    <Grid container spacing={3}>
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <IndicadorPeriodo data={graduadosFiltrado} loading={loading} title="Por Periodo"
                                tooltipText="Tendencia histórica de graduados"
                                valueKey="CANTIDAD DE EGRESADOS"
                                strokeColor={color.primary}
                                name="Graduados" />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={graduadosFiltrado} title="Graduados por Género" groupBy="SEXO" valueKey="CANTIDAD DE EGRESADOS" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={graduadosFiltrado} title="Graduados por Rango de Edad" groupBy="RANGO DE EDAD" valueKey="CANTIDAD DE EGRESADOS" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={graduadosFiltrado} title="Graduados por CINE" groupBy="CINE" valueKey="CANTIDAD DE EGRESADOS" loading={loading} />
                        </Grid>
                        <Grid item size={{ xs: 12, md: 6 }}>
                            <IndicadorMultipleLineas data={graduadosFiltrado} title="Graduados por Sector de Gestión" groupBy="SECTOR DE GESTIÓN" valueKey="CANTIDAD DE EGRESADOS" loading={loading} />
                        </Grid>
                    </Grid>
                );
            default:
                return null;
        }
    };

    return (
        <Box>
            <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1, mb: 3 }}>
                {submetricas.map((sub) => (
                    <Chip
                        key={sub.id}
                        label={sub.label}
                        onClick={() => setActiveSubmetric(sub.id)}
                        sx={{
                            transition: "all 0.2s ease",
                            backgroundColor: activeSubmetric === sub.id ? color.secondary : "transparent",
                            color: activeSubmetric === sub.id ? color.white : color.secondary,
                            border: "none",
                            "& .MuiChip-icon": {
                                color: activeSubmetric === sub.id ? color.white : color.secondary,
                            },
                            "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: 1,
                                backgroundColor: activeSubmetric === sub.id ? color.secondary : `${color.secondary}15`,
                            },
                        }}
                    />
                ))}
            </Stack>
            
            {hasActiveFilters && (
                <FiltrosActivos
                    filtros={filtrosIndicadores}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleClearAllFilters}
                />
            )}

            <FiltrosIndicadores />

            {renderContent()}
        </Box>
    );
};

// ==================== COMPONENTE PRINCIPAL ====================
const DESUNAHTablero = ({ titulo = "DES-UNAH" }) => {
    const [selectedMetric, setSelectedMetric] = useState("matricula");
    const [selectedSubmetric, setSelectedSubmetric] = useState("departamento");

    const [matriculaData, setMatriculaData] = useState([]);
    const [matriculaModCineData, setMatriculaModCineData] = useState([]);
    const [matriculaCamposData, setMatriculaCamposData] = useState([]);
    const [graduadosData, setGraduadosData] = useState([]);
    const [docentesData, setDocentesData] = useState([]);

    const [tasaMatriculaBruta, setTasaMatriculaBruta] = useState([]);
    const [tasaMatriculaNeta, setTasaMatriculaNeta] = useState([]);
    const [graduadosIndicadoresData, setGraduadosIndicadoresData] = useState([]);
    const [estudiantesInternacionalesData, setEstudiantesInternacionalesData] = useState([]);
    const [personasQueIngresanData, setPersonasQueIngresanData] = useState([]);
    const [nuevosIngresosData, setNuevosIngresosData] = useState([]);
    const [primerTituloData, setPrimerTituloData] = useState([]);
    const [primerTituloXHabitanteData, setPrimerTituloXHabitanteData] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);

            if (selectedMetric === "matricula") {
                if (selectedSubmetric === "departamento") {
                    const data = await cargarDatosGenerales(SUBMETRICAS_CONFIG.departamento.api);
                    setMatriculaData(data);
                } else if (selectedSubmetric === "modalidadCineIngreso") {
                    const data = await cargarDatosGenerales(SUBMETRICAS_CONFIG.modalidadCineIngreso.api);
                    setMatriculaModCineData(data);
                } else if (selectedSubmetric === "campos") {
                    const data = await cargarDatosGenerales(SUBMETRICAS_CONFIG.campos.api);
                    setMatriculaCamposData(data);
                }
            } else if (selectedMetric === "graduados") {
                const data = await cargarDatosGenerales(`${process.env.REACT_APP_API_URL}/vistaresumendesgraduadosdepartamento`);
                setGraduadosData(data);
            } else if (selectedMetric === "docentes") {
                const data = await cargarDatosGenerales(`${process.env.REACT_APP_API_URL}/vistaresumendesdocentesdepartamento`);
                setDocentesData(data);
            } else if (selectedMetric === "indicadores") {
                const [bruta, neta, graduados, internacionales, ingresan, nuevos, primerTit, primerTitXHab] = await Promise.all([
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.tasaMatricula.subApis.bruta),
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.tasaMatricula.subApis.neta),
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.graduadosIndicadores.api),
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.estudiantesInternacionales.api),
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.personasQueIngresan.api),
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.nuevosIngresos.api),
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.primerTitulo.api),
                    cargarDatosGenerales(SUBMETRICAS_CONFIG.primerTituloXHabitante.api),
                ]);

                setTasaMatriculaBruta(bruta);
                setTasaMatriculaNeta(neta);
                setGraduadosIndicadoresData(graduados);
                setEstudiantesInternacionalesData(internacionales);
                setPersonasQueIngresanData(ingresan);
                setNuevosIngresosData(nuevos);
                setPrimerTituloData(primerTit);
                setPrimerTituloXHabitanteData(primerTitXHab);
            }

            setLoading(false);
        };

        loadData();
    }, [selectedMetric, selectedSubmetric]);

    const metricasPrincipales = Object.entries(METRICAS_PRINCIPALES).map(([id, config]) => ({
        id,
        label: config.label,
        icon: config.icon,
    }));

    const submetricas = useMemo(() => {
        if (selectedMetric === "matricula") {
            return [
                { id: "departamento", label: "Por Departamento" },
                { id: "modalidadCineIngreso", label: "Modalidad, CINE y Tipo Ingreso" },
                { id: "campos", label: "Campos Académicos" },
            ];
        }
        return [];
    }, [selectedMetric]);

    const renderContent = () => {
        if (selectedMetric === "matricula") {
            if (selectedSubmetric === "departamento") {
                return (
                    <MatriculaDepartamento
                        data={matriculaData}
                        loading={loading}
                        nombreMetrica="Matrícula"
                    />
                );
            } else if (selectedSubmetric === "modalidadCineIngreso") {
                return (
                    <MatriculaModalidadCineIngreso
                        data={matriculaModCineData}
                        loading={loading}
                    />
                );
            } else if (selectedSubmetric === "campos") {
                return (
                    <MatriculaCampos
                        data={matriculaCamposData}
                        loading={loading}
                    />
                );
            }
        } else if (selectedMetric === "graduados") {
            return (
                <GraduadosComponent
                    data={graduadosData}
                    loading={loading}
                />
            );
        } else if (selectedMetric === "docentes") {
            return (
                <DocentesComponent
                    data={docentesData}
                    loading={loading}
                />
            );
        } else if (selectedMetric === "indicadores") {
            return (
                <IndicadoresComponent
                    tasaMatriculaBruta={tasaMatriculaBruta}
                    tasaMatriculaNeta={tasaMatriculaNeta}
                    primerTituloData={primerTituloData}
                    primerTituloXHabitanteData={primerTituloXHabitanteData}
                    personasQueIngresanData={personasQueIngresanData}
                    nuevosIngresosData={nuevosIngresosData}
                    graduadosData={graduadosIndicadoresData}
                    estudiantesInternacionalesData={estudiantesInternacionalesData}
                    loading={loading}
                />
            );
        }

        return null;
    };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <ScrollReveal direction="right" duration={0.8}>
                <Typography
                    sx={{
                        textAlign: "center",
                        color: color.secondary,
                        fontWeight: "bold",
                        fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
                        position: "relative",
                        display: "inline-block",
                        width: "100%",
                        mb: 4,
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            left: "50%",
                            bottom: -8,
                            transform: "translateX(-50%)",
                            width: "60px",
                            height: "4px",
                            background: color.secondary,
                            borderRadius: 2,
                        },
                    }}
                >
                    {titulo}
                </Typography>
            </ScrollReveal>

            <ScrollReveal direction="left" delay={0.05}>
                <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1, mb: 2 }}>
                    {metricasPrincipales.map((metric) => (
                        <Tooltip key={metric.id} title={`Ver datos de ${metric.label}`}>
                            <Chip
                                icon={metric.icon}
                                label={metric.label}
                                variant={selectedMetric === metric.id ? "filled" : "outlined"}
                                onClick={() => {
                                    setSelectedMetric(metric.id);
                                    if (metric.id === "matricula") setSelectedSubmetric("departamento");
                                    if (metric.id === "indicadores") setSelectedSubmetric("tasaMatricula");
                                }}
                                sx={{
                                    transition: "all 0.2s ease",
                                    backgroundColor: selectedMetric === metric.id ? color.primary : "transparent",
                                    color: selectedMetric === metric.id ? color.white : color.primary,
                                    borderColor: color.primary,
                                    "& .MuiChip-icon": {
                                        color: selectedMetric === metric.id ? color.white : color.primary,
                                    },
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: 1,
                                        backgroundColor: selectedMetric === metric.id ? color.primary : `${color.primary}15`,
                                    },
                                }}
                            />
                        </Tooltip>
                    ))}
                </Stack>
            </ScrollReveal>

            {submetricas.length > 0 && (
                <ScrollReveal direction="left" delay={0.1}>
                    <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1, mb: 3 }}>
                        {submetricas.map((sub) => (
                            <Chip
                                key={sub.id}
                                label={sub.label}
                                onClick={() => setSelectedSubmetric(sub.id)}
                                variant={selectedSubmetric === sub.id ? "filled" : "outlined"}
                                sx={{
                                    transition: "all 0.2s ease",
                                    backgroundColor: selectedSubmetric === sub.id ? color.secondary : "transparent",
                                    color: selectedSubmetric === sub.id ? color.white : color.secondary,
                                    border: "none",
                                    "& .MuiChip-icon": {
                                        color: selectedSubmetric === sub.id ? color.white : color.secondary,
                                    },
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: 1,
                                        backgroundColor: selectedSubmetric === sub.id ? color.secondary : `${color.secondary}15`,
                                    },
                                }}
                            />
                        ))}
                    </Stack>
                </ScrollReveal>
            )}

            {renderContent()}
        </Box>
    );
};

export default DESUNAHTablero;