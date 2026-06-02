import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Stack,
  useMediaQuery,
  useTheme,
  Chip,
  Skeleton,
  alpha,
  styled,
} from "@mui/material";
import {
  BarChart,
  Bar,
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
} from "recharts";
import { Close, Info, Timeline, FilterAlt, School } from "@mui/icons-material";
import WcRoundedIcon from "@mui/icons-material/WcRounded";
import AreaChartRoundedIcon from "@mui/icons-material/AreaChartRounded";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import DataExplorationRoundedIcon from "@mui/icons-material/DataExplorationRounded";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import ElectricalServicesIcon from "@mui/icons-material/ElectricalServices";
import PlumbingIcon from "@mui/icons-material/Plumbing";
import BlindRoundedIcon from "@mui/icons-material/BlindRounded";
import MapaDinamico from "./MapaDinamico.jsx";
import color from "../../../components/color.js";
import MapIcon from "@mui/icons-material/Map";
import GraficoTasasCobertura, { TIPO_GRAFICO } from "./GraficoTasasCobertura.jsx";

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

// ==================== CONFIGURACIÓN ====================
const API_CONFIG = {
  SEDUC: {
    instituciones: "SEDUC",
    endpoints: {
      principal: `${process.env.REACT_APP_API_URL}/vistaresumenseduc`,
      niveles: `${process.env.REACT_APP_API_URL}/niveles`,
      docentes: `${process.env.REACT_APP_API_URL}/vistaresumenseducpuestodetrabajo`,
      centroeducativo: `${process.env.REACT_APP_API_URL}/vistaresumenseduccentroseducativos`,
      serviciosbasicos: `${process.env.REACT_APP_API_URL}/vistaresumenseducserviciosbasicos`,
      discapacidad: `${process.env.REACT_APP_API_URL}/vistaresumenseducpersonascondiscapacidad`,
      tasaBrutayNetaporDepartamento: `${process.env.REACT_APP_API_URL}/seduc1425`,
      tasasciclosporperiodo: `${process.env.REACT_APP_API_URL}/seductasanetabrutaciclos`,
      coberturaBrutayNetaNiveles: `${process.env.REACT_APP_API_URL}/seduccoberturanetabrutaniveleseducativos`,
      tasaBrutayNetaporGrado: `${process.env.REACT_APP_API_URL}/seductasamatriculanetabruta`,
      tasaprimergradobasicaporedadessimples: `${process.env.REACT_APP_API_URL}/seducaccesoprimergrado`,
      tasaBrutayNetaaccesoprimergradoBasica: `${process.env.REACT_APP_API_URL}/seductasanetabrutaaccesoprimergradobasica`,
      tasaescolarizacion: `${process.env.REACT_APP_API_URL}/seducescolarizcionporedades`,
      tasaesvariacion: `${process.env.REACT_APP_API_URL}/seducvariacioninteranualprebasicagradoobligatorio`,
      acceso3prebasica: `${process.env.REACT_APP_API_URL}/seductasanetabrutaacceso3prebasica`,
      tasarepitencias: `${process.env.REACT_APP_API_URL}/seductasarepitencianivel`,
      tasadesercion: `${process.env.REACT_APP_API_URL}/seductasadesercionnivel`,
      tasapromovidos: `${process.env.REACT_APP_API_URL}/seductasapromovidosnivel`,
      tasaaprobacion: `${process.env.REACT_APP_API_URL}/seductasaaprobacionnivel`,
      tasaSupervivencia: `${process.env.REACT_APP_API_URL}/seductasasupervivencianivel`,
    },
  },
};

// Métricas disponibles
const METRICAS_SEDUC = {
  matriculaInicial: "Matrícula Inicial",
  matriculaFinal: "Matrícula Final",
  desercion: "Deserción",
  reprobados: "Reprobados",
  aprobados: "Aprobados",
  repitencia: "Repitencia",
  cancelacion: "Cancelación",
  docentes: "Puestos de Trabajo",
  indicadores: "Indicadores",
  centroeducativo: "Centros Educativos",
  serviciosbasicos: "Acceso a los Servicios Básicos",
  discapacidad: "Personas con Discapacidad",
};

// Configuración de gráficos por métrica
const CONFIG_GRAFICOS_POR_METRICA = {
  matriculaInicial: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarNiveles: true,
  },
  matriculaFinal: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarNiveles: true,
  },
  desercion: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarNiveles: true,
  },
  reprobados: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarNiveles: true,
  },
  aprobados: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarNiveles: true,
  },
  repitencia: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarNiveles: true,
  },
  cancelacion: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarNiveles: true,
  },
  docentes: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: false,
    mostrarPeriodo: true,
    mostrarAdministracion: true,
    mostrarDocentesNiveles: true,
  },
  centroeducativo: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: false,
    mostrarZona: true,
    mostrarPeriodo: false,
    mostrarAdministracion: false,
    mostrarTablaNiveles: true,
    mostrarTablaAdministracion: true,
  },
  serviciosbasicos: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: false,
    mostrarZona: false,
    mostrarPeriodo: false,
    mostrarAdministracion: false,
    mostrarServiciosBasicos: true,
  },
  discapacidad: {
    mostrarMapaPorDepartamento: true,
    mostrarGenero: true,
    mostrarZona: true,
    mostrarPeriodo: true,
    mostrarAdministracion: false,
    mostrarDiscapacidadTipo: true,
    mostrarDiscapacidadNivel: true,
  },
  indicadores: {
    mostrarIndicadores: true,
  },
};

// Configuración de filtros por métrica
const CONFIG_FILTROS_POR_METRICA = {
  matriculaInicial: {
    mostrarMunicipio: true,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  matriculaFinal: {
    mostrarMunicipio: true,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  desercion: {
    mostrarMunicipio: true,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  reprobados: {
    mostrarMunicipio: true,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  aprobados: {
    mostrarMunicipio: true,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  repitencia: {
    mostrarMunicipio: true,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  cancelacion: {
    mostrarMunicipio: true,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  docentes: {
    mostrarMunicipio: false,
    mostrarAdministracion: true,
    mostrarZona: true,
    mostrarNivel: true,
    mostrarGenero: true,
  },
  centroeducativo: {
    mostrarMunicipio: false,
    mostrarAdministracion: false,
    mostrarZona: false,
    mostrarNivel: false,
    mostrarGenero: false,
  },
  serviciosbasicos: {
    mostrarMunicipio: true,
    mostrarAdministracion: false,
    mostrarZona: false,
    mostrarNivel: false,
    mostrarGenero: false,
  },
  discapacidad: {
    mostrarMunicipio: true,
    mostrarAdministracion: false,
    mostrarZona: true,
    mostrarNivel: false,
    mostrarGenero: true,
  },
  indicadores: {
    mostrarMunicipio: false,
    mostrarAdministracion: false,
    mostrarZona: false,
    mostrarNivel: false,
    mostrarGenero: false,
  },
};

const METRICAS_CON_ENDPOINT_ESPECIAL = [
  "discapacidad",
  "serviciosbasicos",
  "centroeducativo",
  "docentes",
  "indicadores",
];

// ==================== COMPONENTES ESTILIZADOS ====================
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  "&.MuiTableCell-head": {
    fontWeight: "bold",
    backgroundColor: color.primary,
    color: color.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(theme.palette.action.hover, 0.3),
  },
  "&:hover": {
    backgroundColor: alpha(theme.palette.action.hover, 0.5),
  },
}));

// ==================== FUNCIONES DE PROCESAMIENTO ====================

const procesarDatosGenerales = (data) => {
  const mapaDatos = new Map();
  const metricasKeys = [
    "matriculaInicial",
    "matriculaFinal",
    "repitencia",
    "reprobados",
    "aprobados",
    "desercion",
    "cancelacion",
  ];

  data.forEach((item) => {
    const periodo = item.periodo || item.Periodo;
    const departamento = item.departamento || item.Departamento;
    const municipio = item.municipio || item.Municipio;
    const zona = item.zona || item.Zona;
    const administracion = item.administracion || item.Administracion;
    const niveleducativo = item.niveleducativo || item.NivelEducativo;
    const key = `${periodo}|${departamento}|${municipio}|${zona}|${administracion}|${niveleducativo}`;

    if (!mapaDatos.has(key)) {
      mapaDatos.set(key, {
        anio: periodo,
        departamento: departamento,
        municipio: municipio || "Todos",
        zona: zona || "URBANA",
        administracion: administracion || "TODOS",
        niveleducativo: niveleducativo || "TODOS",
        datosPorGenero: { Femenino: {}, Masculino: {} },
      });
    }

    const entry = mapaDatos.get(key);

    ["Femenino", "Masculino"].forEach((genero) => {
      const prefijo = genero === "Femenino" ? "Mujeres" : "Hombres";
      metricasKeys.forEach((metrica) => {
        let campo;
        if (metrica === "matriculaInicial")
          campo = `MatriculaInicial${prefijo}SEDUC`;
        else if (metrica === "matriculaFinal")
          campo = `MatriculaFinal${prefijo}SEDUC`;
        else if (metrica === "repitencia")
          campo = `Repitencia${prefijo}SEDUC`;
        else if (metrica === "reprobados")
          campo = `Reprobados${prefijo}SEDUC`;
        else if (metrica === "aprobados")
          campo = `Aprobados${prefijo}SEDUC`;
        else if (metrica === "desercion")
          campo = `Desercion${prefijo}SEDUC`;
        else if (metrica === "cancelacion")
          campo = `Cancelacion${prefijo}SEDUC`;

        const valor = parseInt(item[campo]) || 0;
        if (!entry.datosPorGenero[genero][metrica]) {
          entry.datosPorGenero[genero][metrica] = 0;
        }
        entry.datosPorGenero[genero][metrica] += valor;
      });
    });
  });

  const datosAgrupados = [];

  for (const entry of mapaDatos.values()) {
    const registroFemenino = {
      anio: entry.anio,
      departamento: entry.departamento,
      municipio: entry.municipio,
      zona: entry.zona,
      administracion: entry.administracion,
      niveleducativo: entry.niveleducativo,
      genero: "Femenino",
      ...entry.datosPorGenero.Femenino,
    };

    const registroMasculino = {
      anio: entry.anio,
      departamento: entry.departamento,
      municipio: entry.municipio,
      zona: entry.zona,
      administracion: entry.administracion,
      niveleducativo: entry.niveleducativo,
      genero: "Masculino",
      ...entry.datosPorGenero.Masculino,
    };

    datosAgrupados.push(registroFemenino);
    datosAgrupados.push(registroMasculino);
  }

  return datosAgrupados;
};

const procesarDatosNiveles = (data) => {
  if (!data || data.length === 0) return [];

  const mapaDatos = new Map();
  const niveles = ["prebasica", "basica", "media"];
  const metricasNiveles = [
    "matriculaInicial",
    "matriculaFinal",
    "repitencia",
    "reprobados",
    "aprobados",
    "desercion",
    "cancelacion"
  ];

  data.forEach((item) => {
    const periodo = item.Periodo || item.periodo;
    const departamento = item.Departamento || item.departamento;
    if (!periodo) return;

    const key = `${periodo}|${departamento}`;
    if (!mapaDatos.has(key)) {
      mapaDatos.set(key, {
        anio: periodo,
        departamento: departamento,
        municipio: "Todos",
        zona: "URBANA",
        administracion: "TODOS",
        datosPorGenero: { Femenino: {}, Masculino: {} },
      });
    }

    const entry = mapaDatos.get(key);

    metricasNiveles.forEach((metrica) => {
      niveles.forEach((nivel) => {
        ["Femenino", "Masculino"].forEach((genero) => {
          let valor = 0;
          const prefijo = genero === "Femenino" ? "Mujer" : "Hombre";
          const nivelCapitalizado = nivel === "prebasica" ? "Prebasica" : (nivel === "basica" ? "Basica" : "Media");

          let metricaNombre = "";
          if (metrica === "matriculaInicial") {
            metricaNombre = "Matricula";
          } else if (metrica === "matriculaFinal") {
            metricaNombre = "MatriculaFinal";
          } else if (metrica === "repitencia") {
            metricaNombre = "Repitencias";
          } else if (metrica === "reprobados") {
            metricaNombre = "Reprobados";
          } else if (metrica === "aprobados") {
            metricaNombre = "Aprobados";
          } else if (metrica === "desercion") {
            metricaNombre = "Desercion";
          } else if (metrica === "cancelacion") {
            metricaNombre = "Cancelacion";
          }

          const campo = `${metricaNombre}${prefijo}${nivelCapitalizado}`;
          valor = parseInt(item[campo]) || 0;

          const keyMetrica = `${metrica}_${nivel}`;
          if (!entry.datosPorGenero[genero][keyMetrica]) {
            entry.datosPorGenero[genero][keyMetrica] = 0;
          }
          entry.datosPorGenero[genero][keyMetrica] += valor;
        });
      });
    });
  });

  const datosAgrupados = [];

  for (const entry of mapaDatos.values()) {
    ["Femenino", "Masculino"].forEach((genero) => {
      const registro = {
        anio: entry.anio,
        departamento: entry.departamento,
        municipio: entry.municipio,
        zona: entry.zona,
        administracion: entry.administracion,
        genero: genero,
        ...entry.datosPorGenero[genero],
      };
      datosAgrupados.push(registro);
    });
  }

  return datosAgrupados;
};

// ==================== FUNCIÓN PARA OBTENER DATOS ====================
const fetchGenericData = async (
  institucion,
  endpointKey = "principal",
  metricaSeleccionada = null,
  esModoMulti = false,
) => {
  const endpointUrl = API_CONFIG[institucion]?.endpoints[endpointKey];

  if (!endpointUrl) {
    console.error(`No se encontró el endpoint ${endpointKey} para ${institucion}`);
    return [];
  }

  try {
    const response = await fetch(endpointUrl);
    const result = await response.json();

    // Discapacidad
    if (endpointKey === "discapacidad") {
      let rawData = [];
      if (Array.isArray(result)) {
        rawData = result;
      } else if (result.ok && Array.isArray(result.data)) {
        rawData = result.data;
      } else {
        console.error("Formato no esperado para discapacidad:", result);
        return [];
      }

      return rawData.map((item) => ({
        periodo: String(item.periodo || item.Periodo || ""),
        departamento: item.departamento || item.Departamento || "",
        municipio: item.municipio || item.Municipio || "",
        zona: (item.zona || item.Zona || "URBANA").toUpperCase(),
        administracion: item.administracion || item.Administracion || "",
        niveleducativo: item.niveleducativo || item.NivelEducativo || "",
        tipodiscapacidad: item.tipodiscapacidad || item.TipoDiscapacidad || "",
        NiñasConDiscapacidad: parseInt(item.NiñasConDiscapacidad) || 0,
        NiñosConDiscapacidad: parseInt(item.NiñosConDiscapacidad) || 0,
        TotalConDiscapacidad: parseInt(item.TotalConDiscapacidad) || 0,
      }));
    }

    // Servicios Básicos
    if (endpointKey === "serviciosbasicos") {
      let rawData = [];
      if (Array.isArray(result)) {
        rawData = result;
      } else if (result.ok && Array.isArray(result.data)) {
        rawData = result.data;
      } else {
        console.error("Formato no esperado para serviciosbasicos:", result);
        return [];
      }

      return rawData.map((item) => ({
        periodo: String(item.periodo || item.Periodo || ""),
        departamento: item.departamento || item.Departamento || "",
        municipio: item.municipio || item.Municipio || "",
        zona: (item.zona || item.Zona || "URBANA").toUpperCase(),
        Plantel: parseInt(item.Plantel) || 0,
        CodigoSACE: parseInt(item.CodigoSACE) || 0,
        Electricidad: parseInt(item.ElectricidadSI) || 0,
        ElectricidadNO: parseInt(item.ElectricidadNO) || 0,
        AbastecimientoAgua: parseInt(item.AbastecimientoAguaSI) || 0,
        AbastecimientoAguaNO: parseInt(item.AbastecimientoAguaNO) || 0,
        EvacuacionAguas: parseInt(item.EvacuacionAguasSI) || 0,
        EvacuacionAguasNO: parseInt(item.EvacuacionAguasNO) || 0,
      }));
    }

    // Centro Educativo
    if (endpointKey === "centroeducativo") {
      let rawData = [];
      if (Array.isArray(result)) {
        rawData = result;
      } else if (result.ok && Array.isArray(result.data)) {
        rawData = result.data;
      } else {
        console.error("Formato no esperado para centroeducativo:", result);
        return [];
      }

      return rawData.map((item) => ({
        anio: item.periodo || item.Periodo,
        periodo: item.periodo || item.Periodo,
        departamento: item.departamento || item.Departamento,
        Prebasica: parseInt(item.TotalPrebasica) || 0,
        Basica: parseInt(item.TotalBasica) || 0,
        Media: parseInt(item.TotalMedia) || 0,
        Rural: parseInt(item.TotalZonaRural) || 0,
        Urbana: parseInt(item.TotalZonaUrbana) || 0,
        Gubernamental: parseInt(item.TotalAdiministracionGubernamental) || 0,
        NoGubernamental: parseInt(item.TotalAdiministracionNoGubernamental) || 0,
        totalCentros: (parseInt(item.TotalPrebasica) || 0) + (parseInt(item.TotalBasica) || 0) + (parseInt(item.TotalMedia) || 0),
      }));
    }

    // Docentes
    if (endpointKey === "docentes") {
      let rawData = [];
      if (Array.isArray(result)) {
        rawData = result;
      } else if (result.ok && Array.isArray(result.data)) {
        rawData = result.data;
      } else {
        console.error("Formato no esperado para docentes:", result);
        return [];
      }

      const processedData = [];
      rawData.forEach((item) => {
        const anio = item.periodo || item.Periodo;
        const departamento = item.departamento || item.Departamento;
        const municipio = item.municipio || item.Municipio;
        const zona = item.zona || item.Zona || "URBANA";
        const administracion = item.administracion || item.Administracion;
        const niveleducativo = item.niveleducativo || item.NivelEducativo;
        const totalDocentes = parseInt(item.TotalDocentes) || 0;

        processedData.push({
          anio,
          departamento,
          municipio,
          zona,
          administracion,
          niveleducativo,
          genero: "Femenino",
          TotalDocentes: totalDocentes,
          docentes: parseInt(item.DocentesMujer) || 0,
        });

        processedData.push({
          anio,
          departamento,
          municipio,
          zona,
          administracion,
          niveleducativo,
          genero: "Masculino",
          TotalDocentes: totalDocentes,
          docentes: parseInt(item.DocentesHombre) || 0,
        });
      });
      return processedData;
    }

    // Niveles
    if (endpointKey === "niveles") {
      if (Array.isArray(result)) {
        return procesarDatosNiveles(result);
      } else if (result.ok && Array.isArray(result.data)) {
        return procesarDatosNiveles(result.data);
      } else {
        console.error("Formato no esperado para niveles:", result);
        return [];
      }
    }

    // Principal
    if (endpointKey === "principal") {
      if (result.ok && Array.isArray(result.data)) {
        return procesarDatosGenerales(result.data);
      } else if (Array.isArray(result)) {
        return procesarDatosGenerales(result);
      }
    }

    // Para endpoints de indicadores, devolver los datos directamente
    return result;
  } catch (error) {
    console.error(`Error fetching data for ${institucion}/${endpointKey}:`, error);
    return [];
  }
};

// ==================== COMPONENTES DE GRÁFICOS ====================

const GraficoMetricasNiveles = ({
  data,
  metricaActual,
  metricaLabel,
  filtros,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tieneFiltroMunicipio = filtros?.municipio && filtros.municipio !== "Todos";

  const nivelesConfig = {
    prebasica: { label: "Prebásica", color: color.primary },
    basica: { label: "Básica", color: color.secondary },
    media: { label: "Media", color: color.contrastText },
  };

  const nivelLabels = {
    prebasica: "Prebásica",
    basica: "Básica",
    media: "Media",
  };

  const datosProcesados = useMemo(() => {
    if (!data || data.length === 0 || !metricaActual) return [];
    if (tieneFiltroMunicipio) return [];

    let datosFiltrados = data;

    if (filtros?.genero && filtros.genero !== "Todos") {
      datosFiltrados = data.filter((item) => item.genero === filtros.genero);
    } else {
      datosFiltrados = data.filter(
        (item) => item.genero === "Femenino" || item.genero === "Masculino",
      );
    }

    if (filtros?.departamento && filtros.departamento !== "Todos") {
      datosFiltrados = datosFiltrados.filter(
        (item) => normalizar(item.departamento) === normalizar(filtros.departamento),
      );
    }

    const agrupado = new Map();
    const niveles = ["prebasica", "basica", "media"];

    datosFiltrados.forEach((item) => {
      const anio = item.anio;
      if (!agrupado.has(anio)) {
        agrupado.set(anio, { anio, prebasica: 0, basica: 0, media: 0 });
      }
      const entry = agrupado.get(anio);
      niveles.forEach((nivel) => {
        const key = `${metricaActual}_${nivel}`;
        entry[nivel] += item[key] || 0;
      });
    });

    return Array.from(agrupado.values()).sort((a, b) => a.anio - b.anio);
  }, [data, metricaActual, filtros, tieneFiltroMunicipio]);

  const totalesPorNivel = useMemo(() => {
    if (!datosProcesados.length || tieneFiltroMunicipio) return {};
    const totales = { prebasica: 0, basica: 0, media: 0 };
    datosProcesados.forEach((item) => {
      totales.prebasica += item.prebasica;
      totales.basica += item.basica;
      totales.media += item.media;
    });
    return totales;
  }, [datosProcesados, tieneFiltroMunicipio]);

  if (loading) return <StyledCard><StyledCardContent><ChartSkeleton height={300} /></StyledCardContent></StyledCard>;
  if (tieneFiltroMunicipio) return <StyledCard><StyledCardContent><EmptyState message="Los datos por nivel educativo no están disponibles a nivel municipal" /></StyledCardContent></StyledCard>;
  if (!datosProcesados.length) return <StyledCard><StyledCardContent><EmptyState message={`No hay datos de ${metricaLabel?.toLowerCase()} por nivel educativo`} /></StyledCardContent></StyledCard>;

  return (
    <StyledCard>
      <StyledCardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <School sx={{ color: color.primary }} />
          <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Nivel Educativo</Typography>
        </Stack>
        <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
          {Object.entries(totalesPorNivel).map(([nivel, total]) => total > 0 && (
            <Chip key={nivel} label={`${nivelLabels[nivel]}: ${total.toLocaleString()}`} sx={{ bgcolor: alpha(nivelesConfig[nivel].color, 0.1), color: nivelesConfig[nivel].color, fontWeight: "bold" }} />
          ))}
        </Stack>
        <ResponsiveContainer width="100%" height={347}>
          <BarChart data={datosProcesados} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="anio" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} tickLine={false} />
            <YAxis hide />
            <RechartsTooltip formatter={(value, name) => [value.toLocaleString(), nivelLabels[name] || name]} />
            <Legend formatter={(value) => nivelLabels[value] || value} />
            {Object.entries(nivelesConfig).map(([nivel, config]) => {
              if (!datosProcesados.some(item => item[nivel] > 0)) return null;
              return (
                <Bar
                  key={nivel}
                  dataKey={nivel}
                  name={nivel}
                  fill={config.color}
                  radius={[4, 4, 0, 0]}
                  label={
                    isMobile
                      ? undefined
                      : {
                        position: (props) => {
                          return nivel === "basica" ? "inside" : "top";
                        },
                        angle: -90,
                        formatter: (value) => value.toLocaleString(),
                        fontSize: 12,
                        fill: nivel === "basica" ? color.white : color.third,
                        dy: nivel === "basica" ? 8 : -15,
                      }
                  }
                />
              );


            })}
          </BarChart>
        </ResponsiveContainer>
      </StyledCardContent>
    </StyledCard>
  );
};

const GraficoDocentesNiveles = ({ data, metricaLabel, loading = false }) => {
  const nombreANivel = { Prebásica: "prebasica", Básica: "basica", Media: "media" };
  const colores = { prebasica: color.primary, basica: color.secondary, media: color.contrastText };
  const nombres = { prebasica: "Prebásica", basica: "Básica", media: "Media" };

  return (
    <StyledCard>
      <StyledCardContent>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <School sx={{ color: color.primary }} />
          <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}>Por Nivel Educativo</Typography>
        </Stack>
        {loading ? <ChartSkeleton height={400} /> : !data.length ? <EmptyState message={`No hay datos de ${metricaLabel?.toLowerCase()} por nivel educativo`} /> : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 60, bottom: 10 }}>
              <XAxis dataKey="nivel" tick={{ fill: color.contrastText, fontSize: 12 }} tickLine={false} />
              <YAxis hide />
              <RechartsTooltip formatter={(value) => [value.toLocaleString(), "Puestos de Trabajo"]} />
              <Bar dataKey="valor" radius={[8, 8, 0, 0]} label={{ position: "top", formatter: (v) => v.toLocaleString(), fontSize: 12 }}>
                {data.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </StyledCardContent>
    </StyledCard>
  );
};

const GraficoServiciosBasicos = ({ data, loading = false, totalPlanteles = 0, onClearFilters }) => {
  const serviciosConSI_NO = useMemo(() => {
    if (!data.length) return [];
    const servicios = [
      { key: "Electricidad", label: "Electricidad", icon: <ElectricalServicesIcon />, color: "#ffc107", si: 0, no: 0 },
      { key: "AbastecimientoAgua", label: "Abastecimiento de Agua", icon: <WaterDropIcon />, color: "#2196f3", si: 0, no: 0 },
      { key: "EvacuacionAguas", label: "Evacuación de Agua", icon: <PlumbingIcon />, color: "#4caf50", si: 0, no: 0 },
    ];
    data.forEach(item => { servicios.forEach(servicio => { servicio.si += item[servicio.key] || 0; servicio.no += item[`${servicio.key}NO`] || 0; }); });
    return servicios;
  }, [data]);

  if (loading) return <StyledCard><StyledCardContent><ChartSkeleton height={600} /></StyledCardContent></StyledCard>;
  if (!serviciosConSI_NO.length || totalPlanteles === 0) return <StyledCard><StyledCardContent><EmptyState message="No hay datos de servicios básicos" onClearFilters={onClearFilters} /></StyledCardContent></StyledCard>;

  return (
    <Grid container spacing={3}>
      {serviciosConSI_NO.map((servicio) => {
        const total = servicio.si + servicio.no;
        const pctSI = total > 0 ? ((servicio.si / total) * 100).toFixed(1) : 0;
        const datosGrafica = [
          { name: "Sí", value: servicio.si, porcentaje: pctSI, color: color.primary },
          { name: "No", value: servicio.no, porcentaje: (100 - pctSI).toFixed(1), color: color.secondary },
        ];
        return (
          <Grid item size={{ xs: 12, md: 12 }} key={servicio.key}>
            <StyledCard><StyledCardContent>
              <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  {React.cloneElement(servicio.icon, { sx: { color: servicio.color, fontSize: 32 } })}
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: color.primary }}>{servicio.label}</Typography>
                </Stack>
              </Stack>
              <ResponsiveContainer width="100%" height={183}>
                <BarChart data={datosGrafica} layout="vertical" margin={{ top: 10, right: 30, left: 60, bottom: 20 }}>
                  <XAxis type="number" hide /><YAxis type="category" dataKey="name" tick={{ fontSize: 14, fontWeight: "bold" }} width={50} />
                  <RechartsTooltip formatter={(value) => [value.toLocaleString(), "Total"]} />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={40} label={{ position: "right", formatter: (v, entry) => `${v.toLocaleString()} (${entry.payload.porcentaje}%)`, fontSize: 12 }}>
                    {datosGrafica.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </StyledCardContent></StyledCard>
          </Grid>
        );
      })}
    </Grid>
  );
};

const GraficoDiscapacidadPorTipo = ({ data, loading = false, onClearFilters }) => {
  const datosPorTipo = useMemo(() => {
    if (!data.length) return [];
    const tiposMap = new Map();
    data.forEach(item => { const tipo = item.tipodiscapacidad; if (!tiposMap.has(tipo)) tiposMap.set(tipo, { tipo, Total: 0 }); tiposMap.get(tipo).Total += item.TotalConDiscapacidad || 0; });
    return Array.from(tiposMap.values()).sort((a, b) => b.Total - a.Total);
  }, [data]);

  return (
    <StyledCard><StyledCardContent>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><BlindRoundedIcon sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Tipo de Discapacidad</Typography></Stack>
      {loading ? <ChartSkeleton height={400} /> : !datosPorTipo.length ? <EmptyState message="No hay datos de discapacidad" onClearFilters={onClearFilters} /> : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={datosPorTipo} layout="vertical" margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
            <XAxis type="number" hide /><YAxis type="category" dataKey="tipo" tick={{ fontSize: 12 }} width={120} />
            <RechartsTooltip formatter={(value) => value.toLocaleString()} />
            <Bar dataKey="Total" fill={color.primary} radius={[0, 8, 8, 0]} barSize={30} label={{ position: "right", formatter: (v) => v.toLocaleString(), fontSize: 12 }} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </StyledCardContent></StyledCard>
  );
};

const GraficoDiscapacidadPorNivel = ({ data, loading = false, onClearFilters }) => {
  const datosPorNivel = useMemo(() => {
    if (!data.length) return [];
    const nivelMap = new Map();
    data.forEach(item => {
      const nivelOriginal = item.niveleducativo?.toUpperCase() || "";
      let nivel = "Otros";
      if (nivelOriginal.includes("PREBASICA")) nivel = "Prebásica";
      else if (nivelOriginal.includes("BÁSICA") || nivelOriginal.includes("BASICA")) nivel = "Básica";
      else if (nivelOriginal.includes("MEDIA")) nivel = "Media";
      if (!nivelMap.has(nivel)) nivelMap.set(nivel, { nivel, Mujeres: 0, Hombres: 0 });
      const entry = nivelMap.get(nivel);
      entry.Mujeres += item.NiñasConDiscapacidad || 0;
      entry.Hombres += item.NiñosConDiscapacidad || 0;
    });
    return Array.from(nivelMap.values());
  }, [data]);

  return (
    <StyledCard><StyledCardContent>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><School sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Nivel Educativo</Typography></Stack>
      {loading ? <ChartSkeleton height={300} /> : !datosPorNivel.length ? <EmptyState message="No hay datos por nivel educativo" onClearFilters={onClearFilters} /> : (
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={datosPorNivel} margin={{ top: 30, right: 30, left: 20, bottom: 10 }}>
            <XAxis dataKey="nivel" tick={{ fontSize: 12 }} /><YAxis hide />
            <RechartsTooltip formatter={(value, name) => [value.toLocaleString(), name]} />
            <Legend /><Bar dataKey="Mujeres" fill={color.primary} name="Mujeres" radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v.toLocaleString() }} />
            <Bar dataKey="Hombres" fill={color.secondary} name="Hombres" radius={[4, 4, 0, 0]} label={{ position: "top", formatter: (v) => v.toLocaleString() }} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </StyledCardContent></StyledCard>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const BaseTablero = ({ titulo }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const [coberturaData, setCoberturaData] = useState([]);
  const [accesoPrimerGradoBasica, setAccesoPrimerGradoBasica] = useState([]);
  const [accesoPrebasica3, setAccesoPrebasica3] = useState([]);
  const [escolarizacionData, setEscolarizacionData] = useState([]);
  const [tasasDepartamentoData, setTasasDepartamentoData] = useState([]);
  const [tasaRepitenciaData, setTasaRepitenciaData] = useState([]);
  const [tasaDesercionData, setTasaDesercionData] = useState([]);
  const [tasaAprobacionData, setTasaAprobacionData] = useState([]);
  const [tasaPromovidosData, setTasaPromovidosData] = useState([]);
  const [tasasCiclosData, setTasasCiclosData] = useState([]);
  const [variacionInteranualData, setVariacionInteranualData] = useState([]);
  const [tasaSupervivenciaData, setTasaSupervivenciaData] = useState([]);
  const [acessoPrimerGradoEdadesSimplesData, setAcessoPrimerGradoEdadesSimplesData] = useState([]);
  const [tasasPorGrado, setTasasPorGrado] = useState([]);

  const [data, setData] = useState([]);
  const [dataNiveles, setDataNiveles] = useState([]);
  const [dataServiciosBasicos, setDataServiciosBasicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState([]);
  const [datosDepto, setDatosDepto] = useState({});
  const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });

  const [selectedMetric, setSelectedMetric] = useState(() => Object.keys(METRICAS_SEDUC)[0] || "");

  const [filtros, setFiltros] = useState({
    anio: "Todos", genero: "Todos", departamento: "Todos", municipio: "Todos",
    zona: "Todos", administracion: "Todos", nivel: "Todos",
  });

  const METRICAS_LIST = useMemo(() => Object.entries(METRICAS_SEDUC).map(([id, label]) => ({ id, label })), []);

  const añosDisponibles = useMemo(() => {
    const añosSet = new Set();
    data.forEach(item => { if (item.anio) añosSet.add(String(item.anio)); });
    dataServiciosBasicos.forEach(item => { if (item.periodo) añosSet.add(String(item.periodo)); });
    return ["Todos", ...Array.from(añosSet).sort((a, b) => b - a)];
  }, [data, dataServiciosBasicos]);

  const deptosDisponibles = useMemo(() => ["Todos", ...Array.from(new Set(data.map(item => item.departamento).filter(Boolean))).sort()], [data]);

  const municipiosDisponibles = useMemo(() => {
    if (filtros.departamento === "Todos") return ["Todos"];
    return ["Todos", ...Array.from(new Set(data.filter(item => normalizar(item.departamento) === normalizar(filtros.departamento)).map(item => item.municipio).filter(Boolean))).sort()];
  }, [data, filtros.departamento]);

  const administracionesDisponibles = useMemo(() => ["Todos", ...Array.from(new Set(data.map(item => item.administracion).filter(Boolean))).sort()], [data]);

  const configGraficos = useMemo(() => CONFIG_GRAFICOS_POR_METRICA[selectedMetric] || CONFIG_GRAFICOS_POR_METRICA.matriculaInicial, [selectedMetric]);

  const filtersConfig = useMemo(() => {
    const cfg = CONFIG_FILTROS_POR_METRICA[selectedMetric] || CONFIG_FILTROS_POR_METRICA.matriculaInicial;
    const base = [{ key: "anio", label: "Año", options: añosDisponibles }, { key: "departamento", label: "Departamento", options: deptosDisponibles }];
    if (filtros.departamento !== "Todos" && cfg.mostrarMunicipio) base.push({ key: "municipio", label: "Municipio", options: municipiosDisponibles });
    if (cfg.mostrarGenero) base.push({ key: "genero", label: "Género", options: ["Todos", "Femenino", "Masculino"] });
    if (cfg.mostrarAdministracion) base.push({ key: "administracion", label: "Administración", options: administracionesDisponibles });
    if (cfg.mostrarZona) base.push({ key: "zona", label: "Zona", options: ["Todos", "URBANA", "RURAL"] });
    if (cfg.mostrarNivel) base.push({ key: "nivel", label: "Nivel Educativo", options: ["Todos", "Prebásica", "Básica", "Media"] });
    return base;
  }, [selectedMetric, filtros.departamento, añosDisponibles, deptosDisponibles, municipiosDisponibles, administracionesDisponibles]);

  const getEndpointForMetric = (metric) => METRICAS_CON_ENDPOINT_ESPECIAL.includes(metric) ? metric : "principal";

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const endpoint = getEndpointForMetric(selectedMetric);
        const dataFetched = await fetchGenericData("SEDUC", endpoint, null, false);
        setData(dataFetched);
        if (selectedMetric === "serviciosbasicos") setDataServiciosBasicos(await fetchGenericData("SEDUC", "serviciosbasicos", null, false));
        if (!["docentes", "centroeducativo", "serviciosbasicos", "discapacidad", "indicadores"].includes(selectedMetric)) {
          setDataNiveles(await fetchGenericData("SEDUC", "niveles", selectedMetric, false));
        }
      } catch (error) { console.error("Error loading data:", error); setData([]); }
      finally { setLoading(false); }
    };
    loadData();
  }, [selectedMetric]);

  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("map-container");
      if (container) {
        const w = container.clientWidth;
        setDimensions({ width: w, height: isMobile ? w * 0.5 : (isTablet ? 500 : 600) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile, isTablet]);

  useEffect(() => {
    if (!data.length) { setFilteredData([]); setDatosDepto({}); return; }
    let filtrado = data.filter(d => {
      const cumpleAnio = filtros.anio === "Todos" || d.anio === filtros.anio || d.periodo === filtros.anio;
      const cumpleDepto = filtros.departamento === "Todos" || normalizar(d.departamento) === normalizar(filtros.departamento);
      const cumpleMunicipio = filtros.municipio === "Todos" || normalizar(d.municipio) === normalizar(filtros.municipio);
      const cumpleGenero = filtros.genero === "Todos" || d.genero === filtros.genero;
      const cumpleZona = filtros.zona === "Todos" || d.zona === filtros.zona;
      const cumpleAdmin = filtros.administracion === "Todos" || d.administracion === filtros.administracion;
      let nivelData = "";
      const nivelOriginal = d.niveleducativo?.toUpperCase() || "";
      if (nivelOriginal.includes("PREBASICA")) nivelData = "Prebásica";
      else if (nivelOriginal.includes("BÁSICA") || nivelOriginal.includes("BASICA")) nivelData = "Básica";
      else if (nivelOriginal.includes("MEDIA")) nivelData = "Media";
      const cumpleNivel = filtros.nivel === "Todos" || nivelData === filtros.nivel;
      return cumpleAnio && cumpleGenero && cumpleDepto && cumpleMunicipio && cumpleZona && cumpleAdmin && cumpleNivel;
    });
    setFilteredData(filtrado);
    let datosMapa = selectedMetric === "serviciosbasicos" ? dataServiciosBasicos : (selectedMetric === "docentes" ? filtrado.filter(d => d.genero === "Femenino") : filtrado);
    const mapa = {};
    datosMapa.forEach(row => {
      let clave = (filtros.municipio !== "Todos" || filtros.departamento !== "Todos") ? row.municipio : row.departamento;
      if (clave && clave !== "Todos") {
        let valor = 0;
        if (selectedMetric === "docentes") valor = row.TotalDocentes || 0;
        else if (selectedMetric === "centroeducativo") valor = (row.Rural || 0) + (row.Urbana || 0);
        else if (selectedMetric === "serviciosbasicos") valor = parseInt(row.Plantel) || 0;
        else if (selectedMetric === "discapacidad") valor = row.TotalConDiscapacidad || 0;
        else valor = row[selectedMetric] || 0;
        const norm = normalizar(clave);
        mapa[norm] = { valor: (mapa[norm]?.valor || 0) + valor, nivel: "departamento" };
      }
    });
    setDatosDepto(mapa);
  }, [data, dataServiciosBasicos, filtros, selectedMetric]);

  const totalGeneral = useMemo(() => {
    if (!filteredData.length) return 0;
    if (selectedMetric === "centroeducativo") return filteredData.reduce((s, r) => s + ((r.Rural || 0) + (r.Urbana || 0)), 0);
    if (selectedMetric === "discapacidad") return filteredData.reduce((s, r) => s + (r.TotalConDiscapacidad || 0), 0);
    return filteredData.filter(r => r.genero === "Femenino" || r.genero === "Masculino").reduce((s, r) => s + (r[selectedMetric] || 0), 0);
  }, [filteredData, selectedMetric]);

  useEffect(() => {
    const loadIndicadores = async () => {
      if (selectedMetric === "indicadores") {
        try {
          setCoberturaData(await fetchGenericData("SEDUC", "coberturaBrutayNetaNiveles") || []);
          setAccesoPrimerGradoBasica(await fetchGenericData("SEDUC", "tasaBrutayNetaaccesoprimergradoBasica") || []);
          setAccesoPrebasica3(await fetchGenericData("SEDUC", "acceso3prebasica") || []);
          setEscolarizacionData(await fetchGenericData("SEDUC", "tasaescolarizacion") || []);
          setTasasDepartamentoData(await fetchGenericData("SEDUC", "tasaBrutayNetaporDepartamento") || []);
          setTasaRepitenciaData(await fetchGenericData("SEDUC", "tasarepitencias") || []);
          setTasaDesercionData(await fetchGenericData("SEDUC", "tasadesercion") || []);
          setTasaAprobacionData(await fetchGenericData("SEDUC", "tasaaprobacion") || []);
          setTasaPromovidosData(await fetchGenericData("SEDUC", "tasapromovidos") || []);
          setVariacionInteranualData(await fetchGenericData("SEDUC", "tasaesvariacion") || []);
          setTasasPorGrado(await fetchGenericData("SEDUC", "tasaBrutayNetaporGrado") || []);
          setAcessoPrimerGradoEdadesSimplesData(await fetchGenericData("SEDUC", "tasaprimergradobasicaporedadessimples") || []);
          setTasasCiclosData(await fetchGenericData("SEDUC", "tasasciclosporperiodo") || []);
          setTasaSupervivenciaData(await fetchGenericData("SEDUC", "tasaSupervivencia") || []);
        } catch (error) { console.error("Error loading indicadores:", error); }
      }
    };
    loadIndicadores();
  }, [selectedMetric]);

  const datosGenero = useMemo(() => {
    const agrupado = { Femenino: 0, Masculino: 0 };
    filteredData.forEach(item => {
      if (selectedMetric === "discapacidad") { agrupado.Femenino += item.NiñasConDiscapacidad || 0; agrupado.Masculino += item.NiñosConDiscapacidad || 0; }
      else if (selectedMetric === "docentes") { if (item.genero === "Femenino") agrupado.Femenino += item.docentes || 0; else if (item.genero === "Masculino") agrupado.Masculino += item.docentes || 0; }
      else if (item.genero === "Femenino" || item.genero === "Masculino") agrupado[item.genero] += item[selectedMetric] || 0;
    });
    return [{ name: "Femenino", value: agrupado.Femenino }, { name: "Masculino", value: agrupado.Masculino }];
  }, [filteredData, selectedMetric]);

  const datosAdministracion = useMemo(() => {
    const agrupado = {};
    filteredData.forEach(item => {
      const admin = item.administracion;
      if (admin && admin !== "Todos") {
        let valor = selectedMetric === "docentes" ? (item.genero === "Femenino" ? item.TotalDocentes || 0 : 0) : (item[selectedMetric] || 0);
        if (valor) agrupado[admin] = (agrupado[admin] || 0) + valor;
      }
    });
    return Object.entries(agrupado).map(([name, value]) => ({ name: name.length > 20 ? name.substring(0, 17) + "..." : name, value }));
  }, [filteredData, selectedMetric]);

  const datosLineaPeriodo = useMemo(() => {
    const mapa = new Map();
    const datos = selectedMetric === "docentes" ? filteredData.filter(i => i.genero === "Femenino") : filteredData;
    datos.forEach(item => {
      const periodo = item.anio;
      let valor = selectedMetric === "docentes" ? (item.TotalDocentes || 0) : (selectedMetric === "discapacidad" ? (item.TotalConDiscapacidad || 0) : (item[selectedMetric] || 0));
      if (!mapa.has(periodo)) mapa.set(periodo, { periodo, total: 0 });
      mapa.get(periodo).total += valor;
    });
    return Array.from(mapa.values()).sort((a, b) => a.periodo - b.periodo);
  }, [filteredData, selectedMetric]);

  const datosZonaPorPeriodo = useMemo(() => {
    const mapa = new Map();
    const datos = selectedMetric === "docentes" ? filteredData.filter(i => i.genero === "Femenino") : filteredData;
    datos.forEach(item => {
      const periodo = item.anio;
      if (!periodo) return;
      if (!mapa.has(periodo)) mapa.set(periodo, { periodo, rural: 0, urbana: 0, total: 0 });
      const entry = mapa.get(periodo);
      if (selectedMetric === "centroeducativo") { entry.rural += item.Rural || 0; entry.urbana += item.Urbana || 0; }
      else {
        const zona = item.zona;
        const valor = selectedMetric === "docentes" ? (item.TotalDocentes || 0) : (item[selectedMetric] || 0);
        if (zona === "RURAL") entry.rural += valor;
        else if (zona === "URBANA") entry.urbana += valor;
      }
      entry.total = entry.rural + entry.urbana;
    });
    return Array.from(mapa.values()).sort((a, b) => a.periodo - b.periodo);
  }, [filteredData, selectedMetric]);

  const datosServiciosGrafico = useMemo(() => {
    if (selectedMetric !== "serviciosbasicos") return {};
    const totales = { ElectricidadSI: 0, ElectricidadNO: 0, AbastecimientoAguaSI: 0, AbastecimientoAguaNO: 0, EvacuacionAguasSI: 0, EvacuacionAguasNO: 0, Plantel: 0, CodigoSACE: 0 };
    let filtrados = [...dataServiciosBasicos];
    if (filtros.anio && filtros.anio !== "Todos") filtrados = filtrados.filter(i => String(i.periodo) === String(filtros.anio));
    if (filtros.departamento && filtros.departamento !== "Todos") filtrados = filtrados.filter(i => normalizar(i.departamento) === normalizar(filtros.departamento));
    if (filtros.municipio && filtros.municipio !== "Todos") filtrados = filtrados.filter(i => normalizar(i.municipio) === normalizar(filtros.municipio));
    if (filtros.zona && filtros.zona !== "Todos") filtrados = filtrados.filter(i => i.zona?.toUpperCase() === filtros.zona?.toUpperCase());
    filtrados.forEach(i => {
      totales.ElectricidadSI += parseInt(i.Electricidad) || 0;
      totales.ElectricidadNO += parseInt(i.ElectricidadNO) || 0;
      totales.AbastecimientoAguaSI += parseInt(i.AbastecimientoAgua) || 0;
      totales.AbastecimientoAguaNO += parseInt(i.AbastecimientoAguaNO) || 0;
      totales.EvacuacionAguasSI += parseInt(i.EvacuacionAguas) || 0;
      totales.EvacuacionAguasNO += parseInt(i.EvacuacionAguasNO) || 0;
      totales.Plantel += parseInt(i.Plantel) || 0;
      totales.CodigoSACE += parseInt(i.CodigoSACE) || 0;
    });
    return { totales, totalPlanteles: totales.Plantel, totalCodigoSACE: totales.CodigoSACE };
  }, [selectedMetric, dataServiciosBasicos, filtros.anio, filtros.departamento, filtros.municipio, filtros.zona]);

  const datosDocentesPorNivel = useMemo(() => {
    if (selectedMetric !== "docentes") return [];
    const nivelMap = { "EDUCACION PREBASICA": "prebasica", "EDUCACION BASICA": "basica", "EDUCACION MEDIA": "media", PREBASICA: "prebasica", BASICA: "basica", MEDIA: "media" };
    const acum = { prebasica: 0, basica: 0, media: 0 };
    filteredData.filter(i => i.genero === "Femenino").forEach(i => { const key = nivelMap[i.niveleducativo?.toUpperCase() || ""]; if (key) acum[key] += i.TotalDocentes || 0; });
    const colores = { prebasica: color.primary, basica: color.secondary, media: color.contrastText };
    const nombres = { prebasica: "Prebásica", basica: "Básica", media: "Media" };
    return Object.entries(acum).filter(([_, v]) => v > 0).map(([k, v]) => ({ nivel: nombres[k], valor: v, color: colores[k] }));
  }, [filteredData, selectedMetric]);

  const datosCentroEducativo = useMemo(() => {
    if (selectedMetric !== "centroeducativo") return [];
    const agrupado = new Map();
    filteredData.forEach(item => {
      const periodo = item.anio;
      if (!periodo) return;
      if (!agrupado.has(periodo)) agrupado.set(periodo, { periodo, Prebasica: 0, Basica: 0, Media: 0, Rural: 0, Urbana: 0, Gubernamental: 0, NoGubernamental: 0, total: 0 });
      const e = agrupado.get(periodo);
      e.Prebasica += item.Prebasica || 0;
      e.Basica += item.Basica || 0;
      e.Media += item.Media || 0;
      e.Rural += item.Rural || 0;
      e.Urbana += item.Urbana || 0;
      e.Gubernamental += item.Gubernamental || 0;
      e.NoGubernamental += item.NoGubernamental || 0;
      e.total = e.Rural + e.Urbana;
    });
    return Array.from(agrupado.values()).sort((a, b) => a.periodo - b.periodo);
  }, [filteredData, selectedMetric]);

  const handleFilterChange = useCallback((key, value) => setFiltros(prev => ({ ...prev, [key]: value })), []);
  const handleRemoveFilter = useCallback((key) => setFiltros(prev => ({ ...prev, [key]: "Todos" })), []);
  const handleClearAllFilters = useCallback(() => setFiltros({ anio: "Todos", genero: "Todos", departamento: "Todos", municipio: "Todos", zona: "Todos", administracion: "Todos", nivel: "Todos" }), []);
  useEffect(() => { if (filtros.municipio !== "Todos") setFiltros(prev => ({ ...prev, municipio: "Todos" })); }, [filtros.departamento]);

  const hasData = loading ? true : filteredData.length > 0;
  const hasGenderData = datosGenero.some(i => i.value > 0);

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <ScrollReveal direction="right" duration={0.8}>
        <Typography sx={{ textAlign: "center", color: color.secondary, fontWeight: "bold", fontSize: "clamp(1.2rem, 4vw, 2.5rem)", position: "relative", display: "inline-block", width: "100%", mb: 4, "&::after": { content: '""', position: "absolute", left: "50%", bottom: -8, transform: "translateX(-50%)", width: "60px", height: "4px", background: color.secondary, borderRadius: 2, transition: "0.3s" }, "&:hover::after": { width: "120px" } }}>{titulo}</Typography>
      </ScrollReveal>

      <ScrollReveal direction="left" delay={0.1}>
        <Stack direction="row" sx={{ flexWrap: "wrap", justifyContent: "center", gap: 1, mb: 3, px: { xs: 1, sm: 2 } }}>
          {METRICAS_LIST.map(metric => (
            <Tooltip key={metric.id} title={`Ver datos por ${metric.label}`}>
              <Chip label={metric.label} onClick={() => setSelectedMetric(metric.id)} variant={selectedMetric === metric.id ? "filled" : "outlined"} sx={{ transition: "all 0.2s ease", backgroundColor: selectedMetric === metric.id ? color.primary : "transparent", color: selectedMetric === metric.id ? color.white : color.primary, borderColor: color.primary, "&:hover": { transform: "translateY(-2px)", boxShadow: 1, backgroundColor: selectedMetric === metric.id ? color.primary : `${color.primary}15` } }} />
            </Tooltip>
          ))}
        </Stack>
      </ScrollReveal>

      <FiltrosActivos filtros={filtros} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />

      {selectedMetric !== "indicadores" && (
        <ScrollReveal direction="up" delay={0.2}>
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 3 }}>
            {filtersConfig.map(filter => (<Grid key={filter.key} size="auto"><FiltroSelect label={filter.label} value={filtros[filter.key]} options={filter.options} onChange={(e) => handleFilterChange(filter.key, e.target.value)} /></Grid>))}
          </Grid>
        </ScrollReveal>
      )}

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {configGraficos.mostrarMapaPorDepartamento && (
          <Grid item size={{ xs: 12, md: selectedMetric === "centroeducativo" ? 12 : 7 }} sx={{ order: { xs: 1, md: 2 } }}>
            <ScrollReveal direction="up" delay={0.3}>
              <StyledCard sx={{ position: "relative", overflow: "visible", height: "885px" }}>
                <StyledCardContent sx={{ position: "relative" }}>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                    <MapIcon sx={{ color: color.primary }} />
                    <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>{selectedMetric === "centroeducativo" || selectedMetric === "serviciosbasicos" ? "Por Departamento" : (filtros.departamento !== "Todos" || filtros.municipio !== "Todos") ? "Por Municipio" : "Por Departamento"}</Typography>
                  </Stack>
                  <Box id="map-container" sx={{ width: "100%" }}>
                    {loading ? <Skeleton variant="rectangular" width="100%" height={dimensions.height || 700} sx={{ borderRadius: 2 }} animation="wave" /> : !hasData ? <EmptyState onClearFilters={handleClearAllFilters} /> : <MapaDinamico datosDepto={datosDepto} dimensions={dimensions} isMobile={isMobile} filtroDepartamento={filtros.departamento} filtroMunicipio={filtros.municipio} esCentroEducativo={selectedMetric === "centroeducativo"} esMetricaDocente={selectedMetric === "docentes"} modoSimple={false} esServiciosBasicos={selectedMetric === "serviciosbasicos"} />}
                  </Box>
                </StyledCardContent>
                <Box sx={{ position: "absolute", top: { xs: 50, sm: 50, md: 60, lg: 20 }, left: 20, zIndex: 1300, width: { xs: "calc(100% - 40px)", sm: "100px", md: "250px" } }}>
                  {selectedMetric !== "serviciosbasicos" && (
                    <ScrollReveal direction="left" delay={0.4}>
                      <StyledCard sx={{ background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`, width: "220px" }}>
                        <StyledCardContent>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}><DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} /><Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold" }}>Total {METRICAS_LIST.find(m => m.id === selectedMetric)?.label || selectedMetric}</Typography></Stack>
                          <Typography variant="h3" sx={{ color: color.secondary, fontWeight: "bold", fontSize: "clamp(2rem, 6vw, 2rem)", mb: 1 }}>{loading ? <Skeleton width="80%" /> : <AnimatedCounter value={totalGeneral} />}</Typography>
                          {(filtros.municipio !== "Todos" || filtros.departamento !== "Todos") && <Chip label={filtros.municipio !== "Todos" ? filtros.municipio : filtros.departamento} size="small" sx={{ mt: 1, bgcolor: color.secondary, color: "white" }} />}
                        </StyledCardContent>
                      </StyledCard>
                    </ScrollReveal>
                  )}
                  {selectedMetric === "serviciosbasicos" && (
                    <>
                      <ScrollReveal direction="left" delay={0.4}><Chip icon={<School sx={{ color: color.primary, fontSize: 18 }} />} label={`Centros Educativos: ${loading ? "..." : (datosServiciosGrafico.totalCodigoSACE || 0).toLocaleString()}`} sx={{ bgcolor: alpha(color.primary, 0.1), color: color.primary, fontWeight: "bold", py: 2, mb: 2 }} /></ScrollReveal>
                      <ScrollReveal direction="left" delay={0.5}><Chip icon={<ElectricalServicesIcon sx={{ color: color.primary, fontSize: 18 }} />} label={`Planteles con Servicios: ${loading ? "..." : (datosServiciosGrafico.totalPlanteles || 0).toLocaleString()}`} sx={{ bgcolor: alpha(color.primary, 0.1), color: color.primary, fontWeight: "bold", py: 2 }} /></ScrollReveal>
                    </>
                  )}
                </Box>
              </StyledCard>
            </ScrollReveal>
          </Grid>
        )}

        {configGraficos.mostrarServiciosBasicos && (
          <Grid item size={{ xs: 12, md: 5 }} sx={{ order: { xs: 3, md: 3 } }}>
            <ScrollReveal direction="up" delay={0.3}><GraficoServiciosBasicos data={dataServiciosBasicos} loading={loading} totalPlanteles={datosServiciosGrafico.totalPlanteles || 0} onClearFilters={handleClearAllFilters} /></ScrollReveal>
          </Grid>
        )}

        <Grid item size={{ xs: 12, md: selectedMetric === "centroeducativo" ? 4 : 5 }} sx={{ order: { xs: 2, md: 3 } }}>
          <Grid container spacing={2}>
            {configGraficos.mostrarGenero && (
              <Grid item size={{ xs: 12, md: 12 }}>
                <ScrollReveal direction="left" delay={0.3}>
                  <StyledCard><StyledCardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><WcRoundedIcon sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Género</Typography></Stack>
                    {loading ? <ChartSkeleton height={280} /> : !hasGenderData ? <EmptyState onClearFilters={handleClearAllFilters} /> : (
                      <ResponsiveContainer width="100%" height={280}>
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
                              <Cell key={idx} fill={entry.name === "Femenino" ? color.primary : color.secondary} />
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
                  </StyledCardContent></StyledCard>
                </ScrollReveal>
              </Grid>
            )}

            {configGraficos.mostrarZona && hasData && (
              <Grid item size={{ xs: 12, md: 12 }}>
                <ScrollReveal direction="up" delay={0.3}>
                  <StyledCard><StyledCardContent>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><AreaChartRoundedIcon sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Zona</Typography></Stack>
                    {loading ? <ChartSkeleton height={300} /> : !hasData ? <EmptyState onClearFilters={handleClearAllFilters} /> : (
                      <TableContainer component={Paper} sx={{ maxHeight: 400 }}><Table stickyHeader size="small"><TableHead><TableRow><StyledTableCell>Periodo</StyledTableCell><StyledTableCell align="right">Rural</StyledTableCell><StyledTableCell align="right">Urbana</StyledTableCell><StyledTableCell align="right">Total</StyledTableCell></TableRow></TableHead><TableBody>{datosZonaPorPeriodo.map(row => (<StyledTableRow key={row.periodo} hover><TableCell>{row.periodo}</TableCell><TableCell align="right">{row.rural.toLocaleString()}</TableCell><TableCell align="right">{row.urbana.toLocaleString()}</TableCell><TableCell align="right" sx={{ fontWeight: "bold" }}>{row.total.toLocaleString()}</TableCell></StyledTableRow>))}</TableBody></Table></TableContainer>
                    )}
                  </StyledCardContent></StyledCard>
                </ScrollReveal>
              </Grid>
            )}

            {configGraficos.mostrarDocentesNiveles && (
              <Grid item size={{ xs: 12, md: 12 }} sx={{ order: { xs: 5, md: 4 } }}>
                <ScrollReveal direction="left" delay={0.5}><GraficoDocentesNiveles data={datosDocentesPorNivel} metricaLabel="Docentes" loading={loading} /></ScrollReveal>
              </Grid>
            )}
          </Grid>
        </Grid>

        {configGraficos.mostrarPeriodo && hasGenderData && (
          <Grid item size={{ xs: 12, md: selectedMetric === "discapacidad" ? 12 : 7 }} sx={{ order: { xs: 3, md: 3 } }}>
            <ScrollReveal direction="up" delay={0.6}>
              <StyledCard sx={{ mt: 3 }}><StyledCardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><Timeline sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Periodo</Typography></Stack>
                {loading ? <ChartSkeleton height={375} /> : !hasData ? <EmptyState onClearFilters={handleClearAllFilters} /> : (
                  <ResponsiveContainer width="100%" height={375}><LineChart data={datosLineaPeriodo} margin={{ top: 30, right: 40, left: 40, bottom: 20 }}><XAxis dataKey="periodo" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} tickLine={false} /><YAxis hide /><RechartsTooltip formatter={(value) => value.toLocaleString()} /><Line type="monotone" dataKey="total" stroke={color.primary} strokeWidth={3} dot={{ fill: color.primary, r: 5, strokeWidth: 2, stroke: color.white }} activeDot={{ r: 7 }} label={!isMobile ? { position: "top", fill: color.third, fontSize: 11, formatter: (v) => v.toLocaleString() } : undefined} /></LineChart></ResponsiveContainer>
                )}
              </StyledCardContent></StyledCard>
            </ScrollReveal>
          </Grid>
        )}

        {configGraficos.mostrarAdministracion && datosAdministracion.length > 0 && (
          <Grid item size={{ xs: 12, md: 5 }} sx={{ order: { xs: 4, md: 3 } }}>
            <ScrollReveal direction="up" delay={0.7}>
              <StyledCard sx={{ mt: 3 }}><StyledCardContent>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><AccountBalanceRoundedIcon sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Administración</Typography></Stack>
                {loading ? <ChartSkeleton height={300} /> : !hasData ? <EmptyState onClearFilters={handleClearAllFilters} /> : (
                  <ResponsiveContainer width="100%" height={375}><BarChart data={datosAdministracion} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}><XAxis dataKey="name" tick={{ fill: color.contrastText, fontSize: 12 }} axisLine={{ stroke: color.primary }} tickLine={false} /><YAxis hide /><RechartsTooltip formatter={(value) => value.toLocaleString()} /><Bar dataKey="value" fill={color.primary} radius={[8, 8, 0, 0]} label={{ position: "top", formatter: (v) => v.toLocaleString() }} /></BarChart></ResponsiveContainer>
                )}
              </StyledCardContent></StyledCard>
            </ScrollReveal>
          </Grid>
        )}

        {configGraficos.mostrarDiscapacidadTipo && hasData && (
          <>
            <Grid item size={{ xs: 12, md: 6 }} sx={{ order: { xs: 7, md: 4 } }}><GraficoDiscapacidadPorTipo data={filteredData} loading={loading} onClearFilters={handleClearAllFilters} /></Grid>
            <Grid item size={{ xs: 12, md: 6 }} sx={{ order: { xs: 4, md: 5 } }}><GraficoDiscapacidadPorNivel data={filteredData} loading={loading} onClearFilters={handleClearAllFilters} /></Grid>
          </>
        )}

        {configGraficos.mostrarTablaNiveles && (
          <>
            <Grid item size={{ xs: 12, md: 4 }} sx={{ order: { xs: 7, md: 7 } }}>
              <ScrollReveal direction="up" delay={0.3}><StyledCard><StyledCardContent><Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><School sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Nivel Educativo</Typography></Stack>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}><Table stickyHeader size="small"><TableHead><TableRow><StyledTableCell>Periodo</StyledTableCell><StyledTableCell align="right">Prebásica</StyledTableCell><StyledTableCell align="right">Básica</StyledTableCell><StyledTableCell align="right">Media</StyledTableCell><StyledTableCell align="right">Total</StyledTableCell></TableRow></TableHead><TableBody>{datosCentroEducativo.map(row => (<StyledTableRow key={row.periodo} hover><TableCell>{row.periodo}</TableCell><TableCell align="right">{row.Prebasica?.toLocaleString() || 0}</TableCell><TableCell align="right">{row.Basica?.toLocaleString() || 0}</TableCell><TableCell align="right">{row.Media?.toLocaleString() || 0}</TableCell><TableCell align="right" sx={{ fontWeight: "bold" }}>{row.total?.toLocaleString() || 0}</TableCell></StyledTableRow>))}</TableBody></Table></TableContainer>
              </StyledCardContent></StyledCard></ScrollReveal>
            </Grid>
            <Grid item size={{ xs: 12, md: 4 }} sx={{ order: { xs: 8, md: 8 } }}>
              <ScrollReveal direction="up" delay={0.3}><StyledCard><StyledCardContent><Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}><AccountBalanceRoundedIcon sx={{ color: color.primary }} /><Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>Por Administración</Typography></Stack>
                <TableContainer component={Paper} sx={{ maxHeight: 400 }}><Table stickyHeader size="small"><TableHead><TableRow><StyledTableCell>Periodo</StyledTableCell><StyledTableCell align="right">Gubernamental</StyledTableCell><StyledTableCell align="right">No Gubernamental</StyledTableCell><StyledTableCell align="right">Total</StyledTableCell></TableRow></TableHead><TableBody>{datosCentroEducativo.map(row => (<StyledTableRow key={row.periodo} hover><TableCell>{row.periodo}</TableCell><TableCell align="right">{row.Gubernamental?.toLocaleString() || 0}</TableCell><TableCell align="right">{row.NoGubernamental?.toLocaleString() || 0}</TableCell><TableCell align="right" sx={{ fontWeight: "bold" }}>{row.total?.toLocaleString() || 0}</TableCell></StyledTableRow>))}</TableBody></Table></TableContainer>
              </StyledCardContent></StyledCard></ScrollReveal>
            </Grid>
          </>
        )}

        {configGraficos.mostrarNiveles && (
          <Grid item size={{ xs: 12, md: 12 }} sx={{ order: { xs: 5, md: 4 } }}>
            <ScrollReveal direction="right" delay={0.8}><GraficoMetricasNiveles data={dataNiveles} metricaActual={selectedMetric} metricaLabel={METRICAS_LIST.find(m => m.id === selectedMetric)?.label} filtros={filtros} loading={loading} /></ScrollReveal>
          </Grid>
        )}

        {configGraficos.mostrarIndicadores && (
          <Grid item size={{ xs: 12, md: 12 }}>
            <Typography variant="h5" sx={{ color: color.primary, fontWeight: "bold", textAlign: "center", mt: 2, mb: 1 }}>Indicadores Educativos</Typography>
            <Grid container spacing={2}>
              {tasasDepartamentoData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasasDepartamentoData} tipo={TIPO_GRAFICO.TASAS_DEPARTAMENTO} loading={loading} /></Grid>}
              {accesoPrebasica3.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={accesoPrebasica3} tipo={TIPO_GRAFICO.ACCESO_PREBASICA_3} loading={loading} /></Grid>}
              {acessoPrimerGradoEdadesSimplesData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={acessoPrimerGradoEdadesSimplesData} tipo={TIPO_GRAFICO.ACCESO_PRIMER_GRADO_BASICA_EDADES_SIMPLES} loading={loading} /></Grid>}
              {variacionInteranualData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={variacionInteranualData} tipo={TIPO_GRAFICO.VARIACION_INTERANUAL} loading={loading} /></Grid>}
              {accesoPrimerGradoBasica.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={accesoPrimerGradoBasica} tipo={TIPO_GRAFICO.ACCESO_PRIMER_GRADO_BASICA} loading={loading} /></Grid>}
              {coberturaData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={coberturaData} tipo={TIPO_GRAFICO.COBERTURA_NIVELES} loading={loading} /></Grid>}
              {tasasCiclosData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasasCiclosData} tipo={TIPO_GRAFICO.TASAS_CICLOS} loading={loading} /></Grid>}
              {escolarizacionData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={escolarizacionData} tipo={TIPO_GRAFICO.ESCOLARIZACION_EDADES} loading={loading} /></Grid>}
              {tasasPorGrado.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasasPorGrado} tipo={TIPO_GRAFICO.TASAS_POR_GRADO} loading={loading} /></Grid>}
              {tasaRepitenciaData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasaRepitenciaData} tipo={TIPO_GRAFICO.TASA_REPITENCIA} loading={loading} /></Grid>}
              {tasaDesercionData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasaDesercionData} tipo={TIPO_GRAFICO.TASA_DESERCION} loading={loading} /></Grid>}
              {tasaAprobacionData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasaAprobacionData} tipo={TIPO_GRAFICO.TASA_APROBACION} loading={loading} /></Grid>}
              {tasaPromovidosData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasaPromovidosData} tipo={TIPO_GRAFICO.TASA_PROMOVIDOS} loading={loading} /></Grid>}
              {tasaSupervivenciaData.length > 0 && <Grid item size={{ xs: 12, md: 6 }}><GraficoTasasCobertura data={tasaSupervivenciaData} tipo={TIPO_GRAFICO.TASA_SUPERVIVENCIA} loading={loading} /></Grid>}
              {!coberturaData.length && !accesoPrimerGradoBasica.length && !accesoPrebasica3.length && !escolarizacionData.length && !tasasDepartamentoData.length && !loading && (<Box sx={{ textAlign: "center", py: 4 }}><Typography color="text.secondary">No hay datos de indicadores disponibles</Typography></Box>)}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default BaseTablero;