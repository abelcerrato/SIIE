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
} from "@mui/material";
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
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import AddCommentIcon from '@mui/icons-material/AddComment';
import DataExplorationRoundedIcon from "@mui/icons-material/DataExplorationRounded";
import ElderlyWomanIcon from '@mui/icons-material/ElderlyWoman';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import BlindRoundedIcon from "@mui/icons-material/BlindRounded";
import Diversity3Icon from '@mui/icons-material/Diversity3';
import MapIcon from "@mui/icons-material/Map";
import MapaDinamico from "./MapaDinamico.jsx";
import color from "../../../components/color.js";
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

// ==================== CONFIGURACIÓN DE PROYECTOS ====================
const PROYECTOS = {
    general: {
        label: "General",
        icon: <Category />,
        esGeneral: true,
    },
    competenciasEmprendimiento: {
        label: "Competencias Laborales y Emprendimiento",
        icon: <Handshake />,
        atencionesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfocompetenciayemprendimiento`,
        participantesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfoparticipantescompetenciasemprendimiento`,
    },
    desarrolloSostenible: {
        label: "Educación al Desarrollo Sostenible",
        icon: <Agriculture />,
        atencionesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfodesarrollosostenible`,
        participantesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfoparticipantesdesarrollosostenible`,
    },
    formacionEducadores: {
        label: "Formación de Educadores",
        icon: <School />,
        atencionesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfoformacioneducadores`,
        participantesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfoparticipantesformacioneducadores`,
    },
    educacionInfantil: {
        label: "Educación Infantil Temprana",
        icon: <ChildCare />,
        atencionesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfoeducacioninfantil`,
        participantesApi: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfoparticipanteseducacioninfantil`,
    },
};

// ==================== CONFIGURACIÓN DE MÉTRICAS ====================
const METRICAS_CONFIG = {
    atenciones: {
        label: "Atenciones",
        icon: <AddCommentIcon />,
        campos: {
            total: "AtencionesInicialTotalCONEANFO",
            mujeres: "AtencionesMujeresCONEANFO",
            hombres: "AtencionesInicialHombresCONEANFO",
        },
    },
    participantes: {
        label: "Participantes",
        icon: <People />,
        campos: {
            total: "ParticipantesInicialTotalCONEANFO",
            mujeres: "ParticipantesMujeresCONEANFO",
            hombres: "ParticipantesInicialHombresCONEANFO",
        },
    },
};

// ==================== LISTA DE MÉTRICAS PARA CHIPS (CON ICONOS) ====================
const METRICAS_LIST = Object.entries(METRICAS_CONFIG).map(([id, config]) => ({
    id,
    label: config.label,
    icon: config.icon,
}));



// ==================== LISTA DE PROYECTOS PARA CHIPS ====================
const PROYECTOS_LIST = Object.entries(PROYECTOS).map(([id, config]) => ({
    id,
    label: config.label,
    icon: config.icon,
}));

// ==================== FUNCIÓN PARA OBTENER VALOR DE MÉTRICA ====================
const getMetricValue = (row, metricType, campo) => {
    const metricConfig = METRICAS_CONFIG[metricType];
    if (!metricConfig) return 0;

    let value = 0;
    switch (campo) {
        case "total":
            value = row[metricConfig.campos.total] || 0;
            break;
        case "mujeres":
            value = row[metricConfig.campos.mujeres] || 0;
            break;
        case "hombres":
            value = row[metricConfig.campos.hombres] || 0;
            break;
        default:
            value = row[metricConfig.campos.total] || 0;
    }
    return typeof value === "number" ? value : parseInt(value) || 0;
};

// ==================== FUNCIÓN PARA NORMALIZAR DATOS ====================
const normalizarDatosConeanfo = (datos, proyectoId, metricType) => {
    if (!datos || !Array.isArray(datos)) return [];

    return datos.map((item) => ({
        periodo: item.periodo,
        departamento: item.departamento,
        municipio: item.municipio,
        discapacidad: item.discapacidad,
        etnia: item.etnia,
        rangoetario: item.rangoetario,
        procesoeducativo: item.procesoeducativo,
        total: getMetricValue(item, metricType, "total"),
        mujeres: getMetricValue(item, metricType, "mujeres"),
        hombres: getMetricValue(item, metricType, "hombres"),
        proyectoId,
    }));
};

// ==================== FUNCIÓN PARA CARGAR DATOS ====================
const cargarDatosConeanfo = async (proyectoId, metricType) => {
    const proyecto = PROYECTOS[proyectoId];
    if (!proyecto) return [];

    // Para el proyecto general, cargar todos los proyectos
    if (proyecto.esGeneral) {
        const proyectosEspecificos = Object.keys(PROYECTOS).filter(
            (id) => id !== "general"
        );
        const todasPromesas = proyectosEspecificos.map(async (id) => {
            const proy = PROYECTOS[id];
            const url = metricType === "atenciones" ? proy.atencionesApi : proy.participantesApi;
            if (!url) return [];
            try {
                const response = await fetch(url);
                const data = await response.json();
                const datosArray = Array.isArray(data) ? data : data.data || [];
                return normalizarDatosConeanfo(datosArray, id, metricType);
            } catch (error) {
                console.error(`Error cargando datos para ${id}:`, error);
                return [];
            }
        });
        const resultados = await Promise.all(todasPromesas);
        return resultados.flat();
    }

    // Para proyectos específicos
    const url = metricType === "atenciones" ? proyecto.atencionesApi : proyecto.participantesApi;
    if (!url) return [];

    try {
        const response = await fetch(url);
        const data = await response.json();
        const datosArray = Array.isArray(data) ? data : data.data || [];
        return normalizarDatosConeanfo(datosArray, proyectoId, metricType);
    } catch (error) {
        console.error(`Error cargando datos para ${proyectoId}:`, error);
        return [];
    }
};

// ==================== COMPONENTE PRINCIPAL ====================
const BaseTableroConeanfo = ({ titulo }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const [dimensions, setDimensions] = useState({ width: 1000, height: 600 });

    // Estados principales
    const [selectedProject, setSelectedProject] = useState("general");
    const [selectedMetric, setSelectedMetric] = useState("atenciones");
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [datosMapa, setDatosMapa] = useState({});
    const [loading, setLoading] = useState(true);
    const [orderDirection, setOrderDirection] = useState("desc");

    // Estado para datos por proyecto (para las cards)
    const [datosPorProyecto, setDatosPorProyecto] = useState({});

    // Filtros
    const [filtros, setFiltros] = useState({
        periodo: "Todos",
        departamento: "Todos",
        //   municipio: "Todos",
        discapacidad: "Todos",
        etnia: "Todos",
        rangoetario: "Todos",
        procesoeducativo: "Todos",
    });

   // ==================== OPCIONES DINÁMICAS DEPENDIENTES ====================

// Función auxiliar para filtrar datos según filtros activos (excepto uno específico)
const getFilteredDataForOptions = (excludeFilter = null) => {
    let datosFiltrados = data;
    
    const filterConditions = [
        { key: "periodo", condition: filtros.periodo !== "Todos" },
        { key: "departamento", condition: filtros.departamento !== "Todos" },
        { key: "discapacidad", condition: filtros.discapacidad !== "Todos" },
        { key: "etnia", condition: filtros.etnia !== "Todos" },
        { key: "rangoetario", condition: filtros.rangoetario !== "Todos" },
        { key: "procesoeducativo", condition: filtros.procesoeducativo !== "Todos" && selectedProject !== "general" }
    ];
    
    filterConditions.forEach(({ key, condition }) => {
        if (condition && key !== excludeFilter) {
            datosFiltrados = datosFiltrados.filter(d => 
                normalizar(d[key]) === normalizar(filtros[key])
            );
        }
    });
    
    return datosFiltrados;
};

// Periodos disponibles (considerando otros filtros)
const periodosDisponibles = useMemo(() => {
    const datosFiltrados = getFilteredDataForOptions("periodo");
    const periodosSet = new Set();
    datosFiltrados.forEach((item) => {
        if (item.periodo) periodosSet.add(String(item.periodo));
    });
    return ["Todos", ...Array.from(periodosSet).sort((a, b) => b - a)];
}, [data, filtros.departamento, filtros.discapacidad, filtros.etnia, filtros.rangoetario, filtros.procesoeducativo]);

// Departamentos disponibles (considerando otros filtros)
const departamentosDisponibles = useMemo(() => {
    const datosFiltrados = getFilteredDataForOptions("departamento");
    const deptosSet = new Set();
    datosFiltrados.forEach((item) => {
        if (item.departamento && item.departamento !== "null") {
            deptosSet.add(item.departamento);
        }
    });
    return ["Todos", ...Array.from(deptosSet).sort()];
}, [data, filtros.periodo, filtros.discapacidad, filtros.etnia, filtros.rangoetario, filtros.procesoeducativo]);

// Discapacidades disponibles (considerando otros filtros)
const discapacidadesDisponibles = useMemo(() => {
    const datosFiltrados = getFilteredDataForOptions("discapacidad");
    const discSet = new Set();
    datosFiltrados.forEach((item) => {
        if (item.discapacidad && item.discapacidad !== "null" && item.discapacidad !== "") {
            discSet.add(item.discapacidad);
        }
    });
    const disponibles = Array.from(discSet).sort();
    return ["Todos", ...disponibles];
}, [data, filtros.periodo, filtros.departamento, filtros.etnia, filtros.rangoetario, filtros.procesoeducativo]);

// Etnias disponibles (considerando otros filtros)
const etniasDisponibles = useMemo(() => {
    const datosFiltrados = getFilteredDataForOptions("etnia");
    const etniasSet = new Set();
    datosFiltrados.forEach((item) => {
        if (item.etnia && item.etnia !== "null" && item.etnia !== "") {
            etniasSet.add(item.etnia);
        }
    });
    const disponibles = Array.from(etniasSet).sort();
    return ["Todos", ...disponibles];
}, [data, filtros.periodo, filtros.departamento, filtros.discapacidad, filtros.rangoetario, filtros.procesoeducativo]);

// Rangos etarios disponibles (considerando otros filtros)
const rangosEtariosDisponibles = useMemo(() => {
    const datosFiltrados = getFilteredDataForOptions("rangoetario");
    const rangosSet = new Set();
    datosFiltrados.forEach((item) => {
        if (item.rangoetario && item.rangoetario !== "null" && item.rangoetario !== "") {
            rangosSet.add(item.rangoetario);
        }
    });
    const rangosOrdenados = Array.from(rangosSet).sort((a, b) => {
        const inicioA = parseInt(a.match(/\d+/)?.[0] || 0, 10);
        const inicioB = parseInt(b.match(/\d+/)?.[0] || 0, 10);
        return inicioA - inicioB;
    });
    return ["Todos", ...rangosOrdenados];
}, [data, filtros.periodo, filtros.departamento, filtros.discapacidad, filtros.etnia, filtros.procesoeducativo]);

// Procesos educativos disponibles (solo para proyectos específicos)
const procesosEducativosDisponibles = useMemo(() => {
    if (selectedProject === "general") return ["Todos"];
    
    const datosFiltrados = getFilteredDataForOptions("procesoeducativo");
    const procesosSet = new Set();
    datosFiltrados.forEach((item) => {
        if (item.procesoeducativo && item.procesoeducativo !== "null" && item.procesoeducativo !== "") {
            procesosSet.add(item.procesoeducativo);
        }
    });
    return ["Todos", ...Array.from(procesosSet).sort()];
}, [data, selectedProject, filtros.periodo, filtros.departamento, filtros.discapacidad, filtros.etnia, filtros.rangoetario]);

// ==================== HANDLER MEJORADO ====================
const handleFilterChange = useCallback((key, value) => {
    setFiltros(prev => {
        const nuevosFiltros = { ...prev, [key]: value };
        
        // IMPORTANTE: Cuando cambia un filtro, los demás se mantienen
        // pero el sistema automáticamente actualizará sus opciones
        // gracias a los useMemo que dependen de todos los filtros
        
        return nuevosFiltros;
    });
}, []);

    // ==================== CARGAR DATOS PRINCIPALES ====================
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const datos = await cargarDatosConeanfo(selectedProject, selectedMetric);
            setData(datos);
            setFiltros({
                periodo: "Todos",
                departamento: "Todos",
                municipio: "Todos",
                discapacidad: "Todos",
                etnia: "Todos",
                rangoetario: "Todos",
                procesoeducativo: "Todos",
            });
            setLoading(false);
        };
        loadData();
    }, [selectedProject, selectedMetric]);

    // ==================== CARGAR DATOS POR PROYECTO PARA CARDS (solo en General) ====================
    useEffect(() => {
        const loadDatosPorProyecto = async () => {
            if (selectedProject !== "general") return;

            const proyectosEspecificos = Object.keys(PROYECTOS).filter(id => id !== "general");
            const resultados = {};

            for (const id of proyectosEspecificos) {
                const datos = await cargarDatosConeanfo(id, selectedMetric);
                const total = datos.reduce((sum, item) => sum + (item.total || 0), 0);
                resultados[id] = total;
            }

            setDatosPorProyecto(resultados);
        };

        loadDatosPorProyecto();
    }, [selectedProject, selectedMetric]);

    // ==================== CONFIGURACIÓN DE FILTROS ====================
    const filtersConfig = useMemo(() => {
        const filtrosBase = [
            { key: "periodo", label: "Año", options: periodosDisponibles },
            { key: "departamento", label: "Departamento", options: departamentosDisponibles },
        ];



        filtrosBase.push(
            { key: "discapacidad", label: "Discapacidad", options: discapacidadesDisponibles },
            { key: "etnia", label: "Etnia", options: etniasDisponibles },
            { key: "rangoetario", label: "Rango Etario", options: rangosEtariosDisponibles }
        );

        // Solo mostrar filtro de proceso educativo si NO es proyecto general
        if (selectedProject !== "general") {
            filtrosBase.push({ key: "procesoeducativo", label: "Proceso Educativo", options: procesosEducativosDisponibles });
        }

        return filtrosBase;
    }, [
        periodosDisponibles,
        departamentosDisponibles,
        discapacidadesDisponibles,
        etniasDisponibles,
        rangosEtariosDisponibles,
        procesosEducativosDisponibles,
        selectedProject,
    ]);


    // ==================== FILTRAR DATOS ====================
    useEffect(() => {
        if (!data.length) {
            setFilteredData([]);
            setDatosMapa({});
            return;
        }

        let filtrado = data.filter((d) => {
            const cumplePeriodo = filtros.periodo === "Todos" || String(d.periodo) === String(filtros.periodo);
            const cumpleDepartamento = filtros.departamento === "Todos" || normalizar(d.departamento) === normalizar(filtros.departamento);
            const cumpleDiscapacidad = filtros.discapacidad === "Todos" || normalizar(d.discapacidad) === normalizar(filtros.discapacidad);
            const cumpleEtnia = filtros.etnia === "Todos" || normalizar(d.etnia) === normalizar(filtros.etnia);
            const cumpleRangoetario = filtros.rangoetario === "Todos" || normalizar(d.rangoetario) === normalizar(filtros.rangoetario);
            const cumpleProceso = filtros.procesoeducativo === "Todos" || normalizar(d.procesoeducativo) === normalizar(filtros.procesoeducativo);

            return cumplePeriodo && cumpleDepartamento && cumpleDiscapacidad && cumpleEtnia && cumpleRangoetario && cumpleProceso;
        });

        setFilteredData(filtrado);

        // Datos para el mapa - SIEMPRE por departamento, nunca por municipio
        const datosMapaGlobal = {};
        filtrado.forEach((row) => {
            // Siempre usar departamento, ignorar municipio
            const clave = row.departamento;
            const nombreMostrar = row.departamento;

            if (clave && clave !== "Todos" && clave !== "null" && clave !== null) {
                const claveNormalizada = normalizar(clave);
                const valor = row.total;
                if (valor > 0) {
                    if (!datosMapaGlobal[claveNormalizada]) {
                        datosMapaGlobal[claveNormalizada] = { valor: 0, nombre: nombreMostrar || clave };
                    }
                    datosMapaGlobal[claveNormalizada].valor += valor;
                }
            }
        });

        setDatosMapa(datosMapaGlobal);
    }, [data, filtros]);

    // ==================== MEDIR DIMENSIONES DEL MAPA ====================
    useEffect(() => {
        const updateDimensions = () => {
            const container = document.getElementById("map-container-coneanfo");
            if (container) {
                const containerWidth = container.clientWidth;
                let height;
                if (isMobile) {
                    height = containerWidth * 0.5;
                } else if (isTablet) {
                    height = 500;
                } else {
                    height = 600;
                }
                setDimensions({ width: containerWidth, height: Math.max(height, 400) });
            }
        };
        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [isMobile, isTablet]);

    // ==================== DATOS PARA GRÁFICOS ====================

    // Datos para gráfico de género
    const datosGenero = useMemo(() => {
        let mujeres = 0;
        let hombres = 0;
        filteredData.forEach((item) => {
            mujeres += item.mujeres || 0;
            hombres += item.hombres || 0;
        });
        return [
            { name: "Femenino", value: mujeres },
            { name: "Masculino", value: hombres },
        ];
    }, [filteredData]);

    // Datos para gráfico de discapacidad (barras verticales)
    const datosDiscapacidad = useMemo(() => {
        const mapa = new Map();

        filteredData.forEach((item) => {
            const disc = item.discapacidad?.trim();

            // Valores que no se deben mostrar
            const valoresExcluidos = [
                null,
                undefined,
                "",
                "null",
                "NINGUNA",
                "SIN DISCAPACIDAD",
            ];

            if (!valoresExcluidos.includes(disc)) {
                const valor = item.total;

                if (!mapa.has(disc)) mapa.set(disc, 0);

                mapa.set(disc, mapa.get(disc) + valor);
            }
        });

        const resultado = Array.from(mapa.entries()).map(([nombre, valor]) => ({
            nombre,
            valor,
        }));

        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));

        return resultado;
    }, [filteredData]);

    // Datos para gráfico de etnia (barras horizontales)
    const datosEtnia = useMemo(() => {
        const mapa = new Map();
        filteredData.forEach((item) => {
            const etnia = item.etnia;
            if (etnia && etnia !== "null" && etnia !== "") {
                const valor = item.total;
                if (!mapa.has(etnia)) mapa.set(etnia, 0);
                mapa.set(etnia, mapa.get(etnia) + valor);
            }
        });

        const resultado = Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));

        return resultado;
    }, [filteredData]);

    // Datos para gráfico de rango etario (barras verticales)
    const datosRangoEtario = useMemo(() => {
        const mapa = new Map();
        filteredData.forEach((item) => {
            const rango = item.rangoetario;
            if (rango && rango !== "null" && rango !== "") {
                const valor = item.total;
                if (!mapa.has(rango)) mapa.set(rango, 0);
                mapa.set(rango, mapa.get(rango) + valor);
            }
        });

        const resultado = Array.from(mapa.entries()).map(([nombre, valor]) => ({ nombre, valor }));
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));

        return resultado;
    }, [filteredData]);

    // Datos para gráfico de periodo (línea)
    const datosPeriodo = useMemo(() => {
        const mapa = new Map();
        filteredData.forEach((item) => {
            const periodo = item.periodo;
            if (periodo) {
                const valor = item.total;
                if (!mapa.has(periodo)) mapa.set(periodo, 0);
                mapa.set(periodo, mapa.get(periodo) + valor);
            }
        });
        return Array.from(mapa.entries())
            .map(([periodo, total]) => ({ periodo, total }))
            .sort((a, b) => a.periodo - b.periodo);
    }, [filteredData]);

    // Datos para la tabla (proceso educativo) - SOLO para proyectos específicos
    const datosTabla = useMemo(() => {
        if (selectedProject === "general") return [];

        const mapa = new Map();
        filteredData.forEach((item) => {
            const proceso = item.procesoeducativo;
            if (proceso && proceso !== "null" && proceso !== "") {
                const valor = item.total;
                if (!mapa.has(proceso)) mapa.set(proceso, 0);
                mapa.set(proceso, mapa.get(proceso) + valor);
            }
        });

        const resultado = Array.from(mapa.entries()).map(([proceso, valor]) => ({ proceso, valor }));
        resultado.sort((a, b) => {
            if (orderDirection === "asc") return a.valor - b.valor;
            return b.valor - a.valor;
        });

        return resultado;
    }, [filteredData, orderDirection, selectedProject]);

    // Total general
    const totalGeneral = useMemo(() => {
        return filteredData.reduce((sum, item) => sum + (item.total || 0), 0);
    }, [filteredData]);

    const hasData = useMemo(() => filteredData.length > 0, [filteredData]);
    const hasGenderData = useMemo(() => datosGenero.some((item) => item.value > 0), [datosGenero]);

   

    const handleRemoveFilter = useCallback((key) => {
        setFiltros((prev) => ({ ...prev, [key]: "Todos" }));
    }, []);

    const handleClearAllFilters = useCallback(() => {
        setFiltros({
            periodo: "Todos",
            departamento: "Todos",
            // municipio: "Todos",
            discapacidad: "Todos",
            etnia: "Todos",
            rangoetario: "Todos",
            procesoeducativo: "Todos",
        });
    }, []);

    const handleProjectChange = (projectId) => {
        setSelectedProject(projectId);
    };

    const handleSort = () => {
        setOrderDirection(orderDirection === "asc" ? "desc" : "asc");
    };

    const nombreMetrica = METRICAS_CONFIG[selectedMetric]?.label || selectedMetric;

    // Skeleton para la tabla
    const TablaSkeleton = () => (
        <TableContainer component={Paper}>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ backgroundColor: color.primary, color: color.white }}>
                            <Skeleton variant="text" width={200} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                        </TableCell>
                        <TableCell align="right" sx={{ backgroundColor: color.primary, color: color.white }}>
                            <Skeleton variant="text" width={100} sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                        <TableRow key={i}>
                            <TableCell><Skeleton variant="text" width="90%" /></TableCell>
                            <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // Componente de Tabla - SOLO para proyectos específicos
    const TablaComponente = () => {
        if (selectedProject === "general") return null;

        return (
            <StyledCard sx={{ height: "100%" }}>
                <StyledCardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                            Procesos Educativos
                        </Typography>
                        <Tooltip title="Listado de procesos educativos">
                            <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                        </Tooltip>
                    </Stack>

                    {loading ? (
                        <TablaSkeleton />
                    ) : !hasData ? (
                        <EmptyState onClearFilters={handleClearAllFilters} />
                    ) : (
                        <TableContainer component={Paper} sx={{ maxHeight: 500 }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                                            Proceso Educativo
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: "bold", backgroundColor: color.primary, color: color.white, position: "sticky", top: 0, zIndex: 10 }}>
                                            <TableSortLabel
                                                active={true}
                                                direction={orderDirection}
                                                onClick={handleSort}
                                                sx={{ color: `${color.white} !important`, "&.Mui-active": { color: `${color.white} !important` }, "& .MuiTableSortLabel-icon": { color: `${color.white} !important` } }}
                                            >
                                                {nombreMetrica}
                                            </TableSortLabel>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {datosTabla.map((item, index) => (
                                        <TableRow key={index} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f5f5f5" }, "&:hover": { backgroundColor: "#e0e0e0" } }}>
                                            <TableCell>{item.proceso}</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: "bold" }}>{item.valor?.toLocaleString() || 0}</TableCell>
                                        </TableRow>
                                    ))}
                                    {datosTabla.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={2} align="center">No hay datos disponibles</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </StyledCardContent>
            </StyledCard>
        );
    };

    // Cards de proyectos (solo para vista general)
    const CardsProyectos = () => {
        if (selectedProject !== "general") return null;

        const proyectosCards = [
            { id: "competenciasEmprendimiento", label: "Competencias Laborales y Emprendimiento", icon: <Handshake /> },
            { id: "desarrolloSostenible", label: "Educación al Desarrollo Sostenible", icon: <Agriculture /> },
            { id: "formacionEducadores", label: "Formación de Educadores", icon: <School /> },
            { id: "educacionInfantil", label: "Educación Infantil Temprana", icon: <ChildCare /> },
        ];

        return (
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {proyectosCards.map((proyecto) => (
                    <Grid item size={{ xs: 12, sm: 6, md: 3 }} key={proyecto.id}>
                        <StyledCard
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: 3,
                                }
                            }}
                            onClick={() => handleProjectChange(proyecto.id)}
                        >
                            <StyledCardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <Box sx={{ color: color.primary, fontSize: 40 }}>
                                        {proyecto.icon}
                                    </Box>
                                    <Stack>
                                        <Typography variant="caption" sx={{ color: color.primary, fontWeight: "bold" }}>
                                            {proyecto.label}
                                        </Typography>
                                        <Typography variant="h5" sx={{ color: color.secondary, fontWeight: "bold" }}>
                                            {loading ? (
                                                <Skeleton width={80} />
                                            ) : (
                                                <AnimatedCounter value={datosPorProyecto[proyecto.id] || 0} />
                                            )}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                                            {nombreMetrica}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </StyledCardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
        );
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
                            transition: "0.3s",
                        },
                        "&:hover::after": { width: "120px" },
                    }}
                >
                    {titulo}
                </Typography>
            </ScrollReveal>

            {/* Selector de Métrica - DORADO (secondary) como en INFOP */}
            <ScrollReveal direction="left" delay={0.05}>
                <Stack
                    direction="row"
                    sx={{
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 1,
                        mb: 2,
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    {METRICAS_LIST.map((metric) => (
                        <Tooltip key={metric.id} title={`Ver datos por ${metric.label}`}>
                            <Chip
                                icon={metric.icon}
                                label={metric.label}
                                onClick={() => setSelectedMetric(metric.id)}
                                variant={selectedMetric === metric.id ? "filled" : "outlined"}
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

            {/* Selector de Proyecto - AZUL (primary) como en INFOP */}
            <ScrollReveal direction="left" delay={0.1}>
                <Stack
                    direction="row"
                    sx={{
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 1,
                        mb: 3,
                        px: { xs: 1, sm: 2 },
                    }}
                >
                    {PROYECTOS_LIST.map((proyecto) => {
                        const isSelected = selectedProject === proyecto.id;
                        return (
                            <Tooltip key={proyecto.id} title={`Ver ${proyecto.label}`}>
                                <Chip
                                    //icon={proyecto.icon}
                                    label={proyecto.label}
                                    onClick={() => handleProjectChange(proyecto.id)}
                                    variant={isSelected ? "filled" : "outlined"}
                                    sx={{
                                        transition: "all 0.2s ease",
                                        backgroundColor: isSelected ? color.secondary : "transparent",
                                        color: isSelected ? color.white : color.secondary,
                                        borderColor: color.secondary,
                                        "& .MuiChip-icon": {
                                            color: isSelected ? color.white : color.secondary,
                                        },
                                        "&:hover": {
                                            transform: "translateY(-2px)",
                                            boxShadow: 1,
                                            backgroundColor: isSelected ? color.secondary : `${color.secondary}15`,
                                        },
                                    }}
                                />
                            </Tooltip>
                        );
                    })}
                </Stack>
            </ScrollReveal>



            {/* Filtros activos */}
            <FiltrosActivos
                filtros={Object.fromEntries(Object.entries(filtros).filter(([_, v]) => v !== "Todos"))}
                onRemoveFilter={handleRemoveFilter}
                onClearAll={handleClearAllFilters}
            />

            {/* Filtros dinámicos */}
            <ScrollReveal direction="up" delay={0.2}>
                <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
                    {filtersConfig.map((filter) => (
                        <Grid key={filter.key} size="auto">
                            <FiltroSelect
                                label={filter.label}
                                value={filtros[filter.key]}
                                options={filter.options}
                                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </ScrollReveal>


            <Grid container spacing={{ xs: 2, sm: 3 }}>
                <Grid item size={{ xs: 12, md: 12 }}>
                    <ScrollReveal direction="up" delay={0.3}>
                        <StyledCard sx={{ width: "100%", position: "relative", minHeight: 500 }}>
                            <StyledCardContent>
                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                                    <MapIcon sx={{ color: color.primary }} />
                                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>
                                        Por Departamento
                                    </Typography>
                                </Stack>
                                <Box id="map-container-coneanfo" sx={{ width: "100%", height: dimensions.height, position: "relative" }}>
                                    {loading ? (
                                        <Skeleton variant="rectangular" width="100%" height="100%" sx={{ borderRadius: 2 }} animation="wave" />
                                    ) : !hasData ? (
                                        <EmptyState onClearFilters={handleClearAllFilters} />
                                    ) : (
                                        <MapaDinamico
                                            datosDepto={datosMapa}
                                            dimensions={dimensions}
                                            isMobile={isMobile}
                                            //filtroDepartamento={filtros.departamento}
                                            // filtroMunicipio="Todos"
                                            esCentroEducativo={false}
                                            esMetricaDocente={false}
                                            modoSimple={false}
                                            esServiciosBasicos={false}
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
                                                    Total {nombreMetrica}
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
                    </ScrollReveal>



                </Grid>
                <Grid item size={{ xs: 12, md: 12 }} mt={3}>
                    {/* Cards de proyectos (solo en vista general) */}
                    <CardsProyectos />
                </Grid>
                {/* Gráfico de Periodo */}
                <Grid item size={{ xs: 12, md: 12 }}>
                    <ScrollReveal direction="up" delay={0.2}>
                        <StyledCard>
                            <StyledCardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <Timeline sx={{ color: color.primary }} />
                                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                                        Por Periodo
                                    </Typography>
                                    <Tooltip title="Tendencia histórica por periodo">
                                        <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                    </Tooltip>
                                </Stack>
                                {loading ? (
                                    <ChartSkeleton height={300} />
                                ) : datosPeriodo.length === 0 ? (
                                    <EmptyState onClearFilters={handleClearAllFilters} />
                                ) : (
                                    <ResponsiveContainer width="100%" height={300}>
                                        <LineChart    data={[...datosPeriodo].reverse()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                            <XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} />
                                            <YAxis
                                                hide
                                                domain={[
                                                    "dataMin - (dataMax - dataMin) * 0.2",
                                                    "dataMax + (dataMax - dataMin) * 0.1",
                                                ]}
                                            />
                                            <RechartsTooltip formatter={(value) => [value?.toLocaleString(), nombreMetrica]} />
                                            <Line
                                                type="monotone"
                                                dataKey="total"
                                                stroke={color.primary}
                                                strokeWidth={3}
                                                dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }}
                                                activeDot={{ r: 7 }}
                                                label={{ position: "top", fill: "#666", fontSize: 11, fontWeight: "bold", formatter: (v) => v?.toLocaleString() }}
                                            />
                                            
                                        </LineChart>
                                    </ResponsiveContainer>
                                )}
                            </StyledCardContent>
                        </StyledCard>
                    </ScrollReveal>
                </Grid>


                {/* Gráfico de Discapacidad - Barras Verticales */}
                <Grid item size={{ xs: 12, md: 12 }}>
                    <ScrollReveal direction="up" delay={0.3}>
                        <StyledCard>
                            <StyledCardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <BlindRoundedIcon sx={{ color: color.primary }} />
                                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                                        Por Tipo de Discapacidad
                                    </Typography>
                                    <Tooltip title="Distribución por tipo de discapacidad">
                                        <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                    </Tooltip>
                                </Stack>
                                {loading ? (
                                    <ChartSkeleton height={350} />
                                ) : datosDiscapacidad.length === 0 ? (
                                    <EmptyState onClearFilters={handleClearAllFilters} />
                                ) : (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={datosDiscapacidad} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                            <XAxis
                                                dataKey="nombre"
                                                angle={-45}
                                                textAnchor="end"
                                                height={80}
                                                interval={0}
                                                tick={{ fill: color.contrastText, fontSize: 10 }}
                                            />
                                            <YAxis hide tick={{ fill: color.contrastText, fontSize: 12 }} />
                                            <RechartsTooltip formatter={(value) => [value?.toLocaleString(), nombreMetrica]} />
                                            <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )}
                            </StyledCardContent>
                        </StyledCard>
                    </ScrollReveal>
                </Grid>



                {/* Gráfico de Etnia - Barras Horizontales */}
                <Grid item size={{ xs: 12, md: 6 }}>
                    <ScrollReveal direction="right" delay={0.3}>
                        <StyledCard>
                            <StyledCardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <Diversity3Icon sx={{ color: color.primary }} />
                                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                                        Por Etnia
                                    </Typography>
                                    <Tooltip title="Distribución por grupo étnico">
                                        <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                    </Tooltip>
                                </Stack>
                                {loading ? (
                                    <ChartSkeleton height={350} />
                                ) : datosEtnia.length === 0 ? (
                                    <EmptyState onClearFilters={handleClearAllFilters} />
                                ) : (
                                    <ResponsiveContainer width="100%" height={350}>
                                        <BarChart data={datosEtnia} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} layout="vertical">
                                            <XAxis hide type="number" tick={{ fill: color.contrastText, fontSize: 12 }} />
                                            <YAxis dataKey="nombre" type="category" width={100} tick={{ fill: color.contrastText, fontSize: 11 }} />
                                            <RechartsTooltip formatter={(value) => [value?.toLocaleString(), nombreMetrica]} />
                                            <Bar
                                                dataKey="valor"
                                                fill={color.secondary}
                                                radius={[0, 4, 4, 0]}
                                                label={(props) => {
                                                    const { x, y, width, height, value } = props;

                                                    // Si la barra es suficientemente grande
                                                    const inside = width > 60;

                                                    return (
                                                        <text
                                                            x={inside ? x + width - 8 : x + width + 5}
                                                            y={y + height / 2}
                                                            fill={inside ? "#fff" : color.contrastText}
                                                            textAnchor={inside ? "end" : "start"}
                                                            dominantBaseline="middle"
                                                            fontSize={11}
                                                            fontWeight="bold"
                                                        >
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
                    </ScrollReveal>
                </Grid>


                {/* Gráfico de Género */}
                <Grid item size={{ xs: 12, md: 6 }}>
                    <ScrollReveal direction="right" delay={0.2}>
                        <StyledCard>
                            <StyledCardContent>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <WcRoundedIcon sx={{ color: color.primary }} />
                                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                                        Por Género
                                    </Typography>
                                    <Tooltip title="Distribución por género">
                                        <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                    </Tooltip>
                                </Stack>
                                {loading ? (
                                    <ChartSkeleton height={350} />
                                ) : !hasGenderData ? (
                                    <EmptyState onClearFilters={handleClearAllFilters} />
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
                                                {datosGenero.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.name === "Femenino" ? color.secondary : color.primary} stroke={color.white} strokeWidth={2} />
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
                    </ScrollReveal>
                </Grid>

                {/* Gráfico de Rango Etario - Barras Verticales */}
                {selectedProject !== "general" && (
                    <Grid item size={{ xs: 12, md: 12 }}>
                        <ScrollReveal direction="up" delay={0.4}>
                            <StyledCard>
                                <StyledCardContent>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                        <ElderlyWomanIcon sx={{ color: color.primary }} />
                                        <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>
                                            Por Rango Etario
                                        </Typography>
                                        <Tooltip title="Distribución por rango de edad">
                                            <Info sx={{ fontSize: 18, color: color.primary, opacity: 0.7, cursor: "help" }} />
                                        </Tooltip>
                                    </Stack>
                                    {loading ? (
                                        <ChartSkeleton height={400} />
                                    ) : datosRangoEtario.length === 0 ? (
                                        <EmptyState onClearFilters={handleClearAllFilters} />
                                    ) : (
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={datosRangoEtario} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <XAxis
                                                    dataKey="nombre"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={80}
                                                    interval={0}
                                                    tick={{ fill: color.contrastText, fontSize: 10 }}
                                                />
                                                <YAxis tick={{ fill: color.contrastText, fontSize: 12 }} />
                                                <RechartsTooltip formatter={(value) => [value?.toLocaleString(), nombreMetrica]} />
                                                <Bar dataKey="valor" fill={color.primary} radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v?.toLocaleString(), fontSize: 10 }} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                </StyledCardContent>
                            </StyledCard>
                        </ScrollReveal>
                    </Grid>
                )}
                {/* Tabla - solo para proyectos específicos (no en general) */}
                <Grid item size={{ xs: 12, md: 12 }}>

                    {selectedProject !== "general" && (
                        <Grid item size={{ xs: 12, md: 12 }}>
                            <ScrollReveal direction="left" delay={0.3}>
                                <TablaComponente />
                            </ScrollReveal>
                        </Grid>
                    )}
                </Grid>
            </Grid>



        </Box >
    );
};

export default BaseTableroConeanfo;