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
import LogoCONED from "../../img/logos-CONED.png";
import LogoSIIE from "../../img/SIIE.png";

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


const ReportesSeduc = () => {
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
            value: "seduc1425",
            label: "SEDUC 2014 - 2025",
            endpoint: "/seduc1425",
            config: {
                titulo: "Reporte SEDUC 2014 - 2025",
                filtros: ["Año", "Departamento"],
                columnasBase: ["Año",
                    "Departamento",
                    "PrebasicaBruta",
                    "BasicaBruta",
                    "MediaBruta",
                    "PrebasicaNeta",
                    "BasicaNeta",
                    "MediaNeta",
                    "GradoObligatorioPrebasica",
                    "GOP5años",
                    "ICicloBruta",
                    "IICicloBruta",
                    "IIICicloGruta",
                    "ICicloNeta",
                    "IICicloNeta",
                    "IIICicloNeta",
                    "ICicloEdadOportuna",
                    "IICicloEdadOportuna",
                    "IIICicloEdadOportuna",
                    "MediaEdadOportuna",
                    "IGrado",
                    "2doGrado",
                    "3erGrado",
                    "4toGrado",
                    "5toGrado",
                    "6toGrado",
                    "7voGrado",
                    "8ToGrado",
                    "9noGrado",
                    "10moGrado",
                    "11moGrado",
                    "12voGrado",
                    "IGradoEdadOportuna",
                    "2doGradoEdadOportuna",
                    "3erGradoEdadOportuna",
                    "4toGradoEdadOportuna",
                    "5toGradoEdadOportuna",
                    "6toGradoEdadOportuna",
                    "7voGradoEdadOportuna",
                    "8ToGradoEdadOportuna",
                    "9noGradoEdadOportuna",
                    "10moGradoEdadOportuna",
                    "11moGradoEdadOportuna",
                    "12GradoEdadOportuna",
                    "EdadPrebasica",
                    "EdadBásica",
                    "EdadMedia",
                    "EdadICiclo",
                    "EdadIICiclo",
                    "EdadIIICiclo",
                    "Edad5años",
                    "Edad6años",
                    "Edad7años",
                    "Edad8años",
                    "Edad9años",
                    "Edad10años",
                    "Edad11años",
                    "Edad12años",
                    "Edad13años",
                    "Edad14años",
                    "Edad15años",
                    "Edad16años",
                    "Edad17años",
                    "MatriculaBruta",
                    "MatriculaNeta",
                    "EdadMatriculatotal",
                ],


                encabezados: {
                    "Año": "Año",
                    "Departamento": "Departamento",
                    "PrebasicaBruta": "Prebásica Bruta",
                    "PrebasicaNeta": "Prebásica Neta",
                    "BasicaBruta": "Básica Bruta",
                    "BasicaNeta": "Básica Neta",
                    "MediaBruta": "Media Bruta",
                    "MediaNeta": "Media Neta",
                    "GradoObligatorioPrebasica": "Grado Obligatorio Prebásica",
                    "GOP5años": "Grado Obligatorio (5 años)",
                    "ICicloBruta": "I Ciclo Bruta",
                    "IICicloBruta": "II Ciclo Bruta",
                    "IIICicloGruta": "III Ciclo Bruta",


                    "ICicloNeta": "I Ciclo Neta",
                    "IICicloNeta": "II Ciclo Neta",
                    "IIICicloNeta": "III Ciclo Neta",

                    "ICicloEdadOportuna": "I Ciclo Edad Oportuna",
                    "IICicloEdadOportuna": "II Ciclo Edad Oportuna",
                    "IIICicloEdadOportuna": "III Ciclo Edad Oportuna",
                    "MediaEdadOportuna": "Media Edad Oportuna",
                    "IGrado": "1er Grado",
                    "2doGrado": "2do Grado",
                    "3erGrado": "3er Grado",
                    "4toGrado": "4to Grado",
                    "5toGrado": "5to Grado",
                    "6toGrado": "6to Grado",
                    "7voGrado": "7mo Grado",
                    "8ToGrado": "8vo Grado",
                    "9noGrado": "9no Grado",
                    "10moGrado": "10mo Grado",
                    "11moGrado": "11mo Grado",
                    "12voGrado": "12vo Grado",
                    "IGradoEdadOportuna": "1er Grado Edad Oportuna",
                    "2doGradoEdadOportuna": "2do Grado Edad Oportuna",
                    "3erGradoEdadOportuna": "3er Grado Edad Oportuna",
                    "4toGradoEdadOportuna": "4to Grado Edad Oportuna",
                    "5toGradoEdadOportuna": "5to Grado Edad Oportuna",
                    "6toGradoEdadOportuna": "6to Grado Edad Oportuna",
                    "7voGradoEdadOportuna": "7mo Grado Edad Oportuna",
                    "8ToGradoEdadOportuna": "8vo Grado Edad Oportuna",
                    "9noGradoEdadOportuna": "9no Grado Edad Oportuna",
                    "10moGradoEdadOportuna": "10mo Grado Edad Oportuna",
                    "11moGradoEdadOportuna": "11mo Grado Edad Oportuna",
                    "12GradoEdadOportuna": "12vo Grado Edad Oportuna",
                    "EdadPrebasica": "Edad Prebásica",
                    "EdadBásica": "Edad Básica",
                    "EdadMedia": "Edad Media",
                    "EdadICiclo": "Edad I Ciclo",
                    "EdadIICiclo": "Edad II Ciclo",
                    "EdadIIICiclo": "Edad III Ciclo",
                    "Edad5años": "Edad 5 años",
                    "Edad6años": "Edad 6 años",
                    "Edad7años": "Edad 7 años",
                    "Edad8años": "Edad 8 años",
                    "Edad9años": "Edad 9 años",
                    "Edad10años": "Edad 10 años",
                    "Edad11años": "Edad 11 años",
                    "Edad12años": "Edad 12 años",
                    "Edad13años": "Edad 13 años",
                    "Edad14años": "Edad 14 años",
                    "Edad15años": "Edad 15 años",
                    "Edad16años": "Edad 16 años",
                    "Edad17años": "Edad 17 años",
                    "MatriculaBruta": "Matrícula Bruta",
                    "MatriculaNeta": "Matrícula Neta",
                    "EdadMatriculatotal": "Edad Matrícula Total",
                }
            }
        },
        {
            value: "centros",
            label: "Centros Educativos",
            endpoint: "/centros",
            config: {
                titulo: "Centros Educativos",
                filtros: ["periodo", "departamento"],
                columnasBase: ["periodo", "departamento", "prebasica", "basica", "media", "total_por_nivel", "urbana", "rural", "total_zona", "gubernamental", "no_gubernamental", "total_administracion"],
                encabezados: {
                    "periodo": "Periodo",
                    "departamento": "Departamento",
                    "prebasica": "Prebásica",
                    "basica": "Básica",
                    "media": "Media",
                    "total_por_nivel": "Total por Nivel",
                    "urbana": "Urbana",
                    "rural": "Rural",
                    "total_zona": "Total Zona",
                    "gubernamental": "Gubernamental",
                    "no_gubernamental": "No Gubernamental",
                    "total_administracion": "Total Administración"
                },
                opcionesFiltros: {
                    zona: [
                        { value: "", label: "Todas" },
                        { value: "urbana", label: "Urbana" },
                        { value: "rural", label: "Rural" }
                    ],
                    administracion: [
                        { value: "", label: "Todas" },
                        { value: "gubernamental", label: "Gubernamental" },
                        { value: "no_gubernamental", label: "No Gubernamental" }
                    ]
                }
            }
        },
        {
            value: "matricula-edad",
            label: "Matrícula por Edad",
            endpoint: "/matricula-edad",
            config: {
                titulo: "Matrícula por Edad y Grado",
                filtros: ["Periodo", "Grado"],
                columnasBase: ["Periodo", "Grado", "<3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", ">18"],
                encabezados: {
                    "Periodo": "Periodo",
                    "Grado": "Grado",
                    "<3": "Menor a 3 años",
                    "4": "4 años",
                    "5": "5 años",
                    "6": "6 años",
                    "7": "7 años",
                    "8": "8 años",
                    "9": "9 años",
                    "10": "10 años",
                    "11": "11 años",
                    "12": "12 años",
                    "13": "13 años",
                    "14": "14 años",
                    "15": "15 años",
                    "16": "16 años",
                    "17": "17 años",
                    ">18": "Mayor a 18 años"
                },

            }
        },
        {
            value: "niveles",
            label: "Niveles Académicos",
            endpoint: "/niveles",
            esNivelesAcademicos: true
        },
        {
            value: "discapacidad",
            label: "Discapacidad",
            endpoint: "/discapacidad",
            config: {
                titulo: "Niños con Discapacidad",
                filtros: ["periodo", "departamento", "municipio", "aldea", "zona", "niveleducativo", "tipodiscapacidad", "administracion", "codigosace"],
                columnasBase: ["periodo", "departamento", "municipio", "aldea", "zona", "codigosace", "nombrecentro", "administracion", "grado", "cicloeducativo", "niveleducativo", "tipodiscapacidad", "niñascondiscapacidad", "niñoscondiscapacidad", "totaldiscapacidad"],
                encabezados: {
                    "periodo": "Periodo",
                    "departamento": "Departamento",
                    "municipio": "Municipio",
                    "aldea": "Aldea",
                    "zona": "Zona",
                    "codigosace": "Código SACE",
                    "nombrecentro": "Nombre Centro",
                    "administracion": "Administración",
                    "grado": "Grado",
                    "cicloeducativo": "Ciclo Educativo",
                    "niveleducativo": "Nivel Educativo",
                    "tipodiscapacidad": "Tipo Discapacidad",
                    "niñascondiscapacidad": "Niñas con Discapacidad",
                    "niñoscondiscapacidad": "Niños con Discapacidad",
                    "totaldiscapacidad": "Total Discapacidad"
                },
                filtrosTexto: ["codigosace"]
            }
        },
        {
            value: "repitencia",
            label: "Repitencia",
            endpoint: "/repitencia",
            config: {
                titulo: "Repitencia por Grado y Edad",
                filtros: ["Periodo", "Grado"],
                columnasBase: ["Periodo", "Grado", "<3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", ">18"],
                encabezados: {
                    "Periodo": "Periodo",
                    "Grado": "Grado",
                    "<3": "Menor a 3 años",
                    "4": "4 años",
                    "5": "5 años",
                    "6": "6 años",
                    "7": "7 años",
                    "8": "8 años",
                    "9": "9 años",
                    "10": "10 años",
                    "11": "11 años",
                    "12": "12 años",
                    "13": "13 años",
                    "14": "14 años",
                    "15": "15 años",
                    "16": "16 años",
                    "17": "17 años",
                    ">18": "Mayor a 18 años"
                },

            }
        },
        {
            value: "servicios",
            label: "Servicios Básicos",
            endpoint: "/servicios",
            config: {
                titulo: "Servicios Básicos en Centros Educativos",
                filtros: ["Periodo", "Departamento", "Zona", "Electricidad", "AbastecimientoAgua", "EvacuacionAguas", "Plantel", "CodigoSACE",],
                columnasBase: ["Periodo", "Departamento", "Plantel", "CodigoSACE", "Nombre", "Electricidad", "AbastecimientoAgua", "EvacuacionAguas", "Zona"],
                encabezados: {
                    "Periodo": "Periodo",
                    "Departamento": "Departamento",
                    "Plantel": "Plantel",
                    "CodigoSACE": "Código SACE",
                    "Nombre": "Nombre",
                    "Electricidad": "Electricidad",
                    "AbastecimientoAgua": "Abastecimiento Agua",
                    "EvacuacionAguas": "Evacuación Aguas",
                    "Zona": "Zona"
                },

                filtrosTexto: ["Plantel", "CodigoSACE"]
            }
        },
        {
            value: "docentes",
            label: "Docentes",
            endpoint: "/docentes",
            config: {
                titulo: "Servicios Docentes",
                filtros: ["AÑOESCOLAR", "DEPARTAMENTO", "MUNICIPIO", "NIVELEDUCATIVO", "ADMINSTRACION", "TIPODECENTRO", "CODIGOCENTRO"],
                columnasBase: ["AÑOESCOLAR", "DEPARTAMENTO", "MUNICIPIO", "CODIGOCENTRO", "NOMBRECENTRO", "NIVELEDUCATIVO", "ADMINSTRACION", "TIPODECENTRO", "DOCENTESMUJER", "DOCENTESHOMBRE", "TOTALDOCENTES"],
                encabezados: {
                    "AÑOESCOLAR": "Año Escolar",
                    "DEPARTAMENTO": "Departamento",
                    "MUNICIPIO": "Municipio",
                    "CODIGOCENTRO": "Código Centro",
                    "NOMBRECENTRO": "Nombre Centro",
                    "NIVELEDUCATIVO": "Nivel Educativo",
                    "ADMINSTRACION": "Administración",
                    "TIPODECENTRO": "Tipo de Centro",
                    "DOCENTESMUJER": "Docentes Mujer",
                    "DOCENTESHOMBRE": "Docentes Hombre",
                    "TOTALDOCENTES": "Total Docentes"
                },
                filtrosTexto: ["CODIGOCENTRO"],

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

            if (reporteSeleccionado === "niveles") {
                nuevosFiltros.periodo = "";
                nuevosFiltros.departamento = "";
                nuevosFiltros.nivel = "";
                nuevosFiltros.categoria = "";
                nuevosFiltros.sexo = "";
                nuevosFiltros.valor = "";
            } else {
                config.filtros?.forEach(filtro => {
                    nuevosFiltros[filtro] = "";
                });
                nuevosFiltros.valor = "";
            }

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

    // Obtener valores únicos para los filtros
    // Obtener valores únicos para los filtros
    const getValoresUnicos = (campo) => {
        return [...new Set(data.map(item => item[campo]))]
            .filter(val => val != null && val !== "") // Filtrar null, undefined y vacíos
            .sort();
    };



    // ========== LÓGICA ESPECÍFICA PARA NIVELES ACADÉMICOS ==========
    const niveles = ["", "Prebasica", "Basica", "Media", "General"];
    const categorias = ["", "Matricula", "Desercion", "Cancelacion", "MatriculaFinal", "Reprobados", "Aprobados", "Repitencias"];
    const sexos = ["", "Mujer", "Hombre", "Total"];

    // Función para determinar qué columnas mostrar para niveles académicos
    const getColumnasAMostrarNiveles = () => {
        const columnasBase = ["Periodo", "Departamento"];

        if (!filters.nivel && !filters.categoria && !filters.sexo) {
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
                // CORRECCIÓN: Separar Matricula de MatriculaFinal
                if (filters.categoria === "Matricula") {
                    if (col.startsWith("Matricula") && !col.startsWith("MatriculaFinal")) {
                        columnasFiltradas.push(col);
                    }
                } else if (filters.categoria === "MatriculaFinal") {
                    if (col.startsWith("MatriculaFinal")) {
                        columnasFiltradas.push(col);
                    }
                } else {
                    if (col.startsWith(filters.categoria)) {
                        columnasFiltradas.push(col);
                    }
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


    // Función para agrupar columnas por categoría y nivel
    const getEstructuraColumnasNiveles = () => {
        const estructura = {};
        const columnasAMostrar = getColumnasAMostrarNiveles();

        columnasAMostrar.forEach(columna => {
            if (columna === "Periodo" || columna === "Departamento") return;

            let categoria, sexo, nivel;

            // Manejar columnas que terminan con "General"
            if (columna.endsWith("TotalGeneral")) {
                categoria = columna.replace("TotalGeneral", "");
                sexo = "Total";
                nivel = "General";
            }
            // Manejar columnas de MatriculaFinal (ej: "MatriculaFinalMujerPrebasica")
            else if (columna.startsWith("MatriculaFinal")) {
                categoria = "MatriculaFinal";
                const resto = columna.replace("MatriculaFinal", "");

                // Buscar el nivel en el resto de la cadena
                for (const niv of niveles.filter(n => n && n !== "General")) {
                    if (resto.endsWith(niv)) {
                        nivel = niv;
                        sexo = resto.replace(niv, "");
                        break;
                    }
                }

                // Si no se encontró nivel específico, es General
                if (!nivel) {
                    nivel = "General";
                    sexo = resto;
                }
            }
            // Manejar otras categorías normales
            else {
                for (const cat of categorias.filter(c => c && c !== "MatriculaFinal")) {
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

                        // Si no se encontró nivel específico, es General
                        if (!nivel && resto === "TotalGeneral") {
                            nivel = "General";
                            sexo = "Total";
                        }
                        break;
                    }
                }
            }

            if (!categoria || !nivel || !sexo) {
                console.log("Columna no procesada:", columna);
                return;
            }

            if (!estructura[categoria]) estructura[categoria] = {};
            if (!estructura[categoria][nivel]) estructura[categoria][nivel] = [];

            // Evitar duplicados
            if (!estructura[categoria][nivel].some(item => item.columna === columna)) {
                estructura[categoria][nivel].push({ columna, sexo });
            }
        });

        return estructura;
    };

    // Filtrar datos para niveles académicos
    const aplicarFiltroValorNiveles = (item) => {
        if (!filters.valor) return true;

        const columnasAMostrar = getColumnasAMostrarNiveles();

        return columnasAMostrar.some(columna => {
            if (columna === "Periodo" || columna === "Departamento") return false;

            const valor = item[columna];
            return valor !== null && valor !== undefined &&
                valor.toString().includes(filters.valor);
        });
    };

    const filteredDataNiveles = data.filter(item => {
        // Validar que el item y sus propiedades existen
        if (!item) return false;

        const matchesPeriodo = !filters.periodo || (item.Periodo && item.Periodo.includes(filters.periodo));
        const matchesDepartamento = !filters.departamento || (item.Departamento && item.Departamento.includes(filters.departamento));
        const matchesValor = !filters.valor || aplicarFiltroValorNiveles(item);

        return matchesPeriodo && matchesDepartamento && matchesValor;
    });

    // ========== LÓGICA PARA OTROS REPORTES ==========

    const filteredData = data.filter(item => {
        return Object.keys(filters).every(key => {
            // Si no hay filtro o es 'valor', no aplicar
            if (key === "valor" || !filters[key]) return true;

            const valor = item[key];
            if (valor == null || valor === "") return false;

            // Normalizamos ambos valores
            const valorStr = valor.toString().trim().toLowerCase();
            const filtroStr = filters[key].toString().trim().toLowerCase();

            //  Comparación exacta para todos los casos
            return valorStr === filtroStr;
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

        if (reporteSeleccionado === "niveles") {
            nuevosFiltros.periodo = "";
            nuevosFiltros.departamento = "";
            nuevosFiltros.nivel = "";
            nuevosFiltros.categoria = "";
            nuevosFiltros.sexo = "";
            nuevosFiltros.valor = "";
        } else {
            config.filtros?.forEach(filtro => {
                nuevosFiltros[filtro] = "";
            });
            nuevosFiltros.valor = "";
        }

        setFilters(nuevosFiltros);
        setPage(1);
    };

    // Paginación
    const getPaginatedData = () => {
        const dataToUse = reporteSeleccionado === "niveles" ? filteredDataNiveles : filteredData;
        const startIndex = (page - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return dataToUse.slice(startIndex, endIndex);
    };

    const getTotalPages = () => {
        const dataToUse = reporteSeleccionado === "niveles" ? filteredDataNiveles : filteredData;
        return Math.ceil(dataToUse.length / rowsPerPage);
    };

    const totalPages = getTotalPages();
    const paginatedData = getPaginatedData();
    const dataToUse = reporteSeleccionado === "niveles" ? filteredDataNiveles : filteredData;


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

        // 🔹 Reporte de niveles
        if (reporteSeleccionado === "niveles") {
            const columnasAMostrar = getColumnasAMostrarNiveles();
            datosParaExcel = filteredDataNiveles.map((item) => {
                const fila = {};
                columnasAMostrar.forEach((col) => (fila[col] = item[col]));
                return fila;
            });
            nombreArchivo = "niveles_academicos.xlsx";
            nombreHoja = "Niveles Académicos";
            tituloReporte = "Reporte de Niveles Académicos";
        } else {
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
        }

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
        saveAs(new Blob([buffer]), "SEDUC_" + nombreArchivo);
    };


    const activeFiltersCount = Object.values(filters).filter(val => val !== "").length;


    // Renderizar filtros dinámicamente para reportes normales
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

    // Renderizar vista de niveles académicos
    const renderNivelesAcademicos = () => {
        const periodos = [...new Set(data.map(item => item.Periodo))].sort();
        const departamentos = [...new Set(data.map(item => item.Departamento))].sort();
        const estructuraColumnas = getEstructuraColumnasNiveles();


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
                <Tooltip title="Volver">
                    <IconButton
                        aria-label="Volver"

                        onClick={() => {
                            setReporteSeleccionado("");
                            setData([]);
                            setFilters({});
                        }}>
                        <ArrowCircleLeftOutlined sx={{ fontSize: 40, color: "red" }} />
                    </IconButton>
                </Tooltip>

                <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", color: "#88CFE0", textAlign: 'center' }}>
                    Niveles Académicos por Departamento
                </Typography>

                {/* Filtros para niveles académicos */}
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
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Periodo</InputLabel>
                                <Select
                                    value={filters.periodo || ""}
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

                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Departamento</InputLabel>
                                <Select
                                    value={filters.departamento || ""}
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

                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Nivel</InputLabel>
                                <Select
                                    value={filters.nivel || ""}
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

                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Categoría</InputLabel>
                                <Select
                                    value={filters.categoria || ""}
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

                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Sexo</InputLabel>
                                <Select
                                    value={filters.sexo || ""}
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


                    </Grid>
                </Paper>

                {/* Controles */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2, mb: 2 }}>
                    <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Mostrando {filteredDataNiveles.length} registros • Página {page} de {totalPages}
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

                {filteredDataNiveles.length === 0 && (
                    <Box textAlign="center" py={4}>
                        <Typography variant="h6" color="text.secondary">
                            No se encontraron resultados con los filtros aplicados
                        </Typography>
                    </Box>
                )}

                {/* Paginación inferior */}
                {filteredDataNiveles.length > 0 && totalPages > 1 && (
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                        <Typography variant="body2" color="text.secondary">
                            Mostrando {((page - 1) * rowsPerPage) + 1}-{Math.min(page * rowsPerPage, filteredDataNiveles.length)} de {filteredDataNiveles.length} registros
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

    // Renderizar vista para reportes normales
    const renderReporteNormal = () => {
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
                            Mostrando {dataToUse.length} registros • Página {page} de {totalPages}
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

                    {dataToUse.length === 0 && (
                        <Box textAlign="center" py={4}>
                            <Typography variant="h6" color="text.secondary">
                                No se encontraron resultados con los filtros aplicados
                            </Typography>
                        </Box>
                    )}

                    {/* Paginación inferior */}
                    {dataToUse.length > 0 && totalPages > 1 && (
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
                                {Math.min(page * rowsPerPage, dataToUse.length)} de{" "}
                                {dataToUse.length} registros
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
            {tienePermiso(1) && (
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
                            <Grid container spacing={2} justifyContent="center">
                                {reportes.map((reporte) => (
                                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={reporte.value}>
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

                    {/* Vista del Reporte de Niveles Académicos */}
                    {reporteSeleccionado === "niveles" && renderNivelesAcademicos()}

                    {/* Vista para otros reportes */}
                    {reporteSeleccionado && reporteSeleccionado !== "niveles" && renderReporteNormal()}
                </Paper>
            )}
        </>
    );
};

export default ReportesSeduc;