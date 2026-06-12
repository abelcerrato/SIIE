import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Tooltip,
  alpha,
  Tabs,
  Tab,
  Paper,
  FormControl,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { Info, TrendingUp, LocationOn, School } from "@mui/icons-material";
import color from "../../../components/color";

// ==================== CONFIGURACIÓN DE TIPOS DE GRÁFICO ====================
const TIPO_GRAFICO = {
  TASAS_DEPARTAMENTO: "tasas_departamento",
  COBERTURA_NIVELES: "cobertura_niveles",
  ACCESO_PRIMER_GRADO_BASICA: "acceso_primer_grado",
  ACCESO_PRIMER_GRADO_BASICA_EDADES_SIMPLES: "acceso_obligatorio_primer_grado",
  ACCESO_PREBASICA_3: "acceso_prebasica_3",
  ESCOLARIZACION_EDADES: "escolarizacion_edades",
  VARIACION_INTERANUAL: "variacion_interanual",
  TASA_REPITENCIA: "tasa_repitencia",
  TASA_DESERCION: "tasa_desercion",
  TASA_APROBACION: "tasa_aprobacion",
  TASA_PROMOVIDOS: "tasa_promovidos",
  TASAS_POR_GRADO: "tasas_por_grado",
  TASAS_CICLOS: "tasas_ciclos",
  TASA_SUPERVIVENCIA: "tasa_supervivencia",
};

// ==================== CONFIGURACIÓN DE MÉTRICAS POR TIPO ====================
const CONFIGURACION_GRAFICOS = {
  [TIPO_GRAFICO.TASAS_DEPARTAMENTO]: {
    titulo: "Tasa Bruta y Neta por Departamento",
    metricasGenerales: {
      brutas: [{ key: "TasadeMatriculaBruta", label: "Tasa Bruta Total" }],
      netas: [{ key: "TasadeMatriculaNeta", label: "Tasa Neta Total" }],
    },
    metricasPorCategoria: {
      nivel: {
        brutas: [
          { key: "TasadecoberturaBrutaPrebasica", label: "Prebásica" },
          { key: "TasaCoberturaBrutaBasica", label: "Básica" },
          { key: "TasadecoberturaBrutaMedia", label: "Media" },
        ],
        netas: [
          { key: "TasadecoberturaNetaPrebasica", label: "Prebásica" },
          { key: "TasadecoberturaNetaBasica", label: "Básica" },
          { key: "TasadecoberturaNetaMedia", label: "Media" },
        ],
      },
      ciclo: {
        brutas: [
          { key: "TBMICiclo", label: "I Ciclo" },
          { key: "TBMIICiclo", label: "II Ciclo" },
          { key: "TBMIIICiclo", label: "III Ciclo" },
        ],
        netas: [
          { key: "TNMICiclo", label: "I Ciclo" },
          { key: "TNMIICiclo", label: "II Ciclo" },
          { key: "TNMIIICiclo", label: "III Ciclo" },
        ],
      },
      acessoObligatorio: {
        brutas: [
          { key: "TBA3PB", label: "Acceso Grado Obligatorio Pre Básica" },
        ],
        netas: [
          { key: "TNA3PB", label: "Acceso Grado Obligatorio Pre Básica" },
        ],
      },
    },
  },

[TIPO_GRAFICO.COBERTURA_NIVELES]: {
  titulo: "Cobertura Bruta y Neta por Nivel Educativo",
  esNacional: true,
  procesarDatos: (data) => {
    const añoMap = new Map();
    data.forEach((item) => {
      const año = item.Año;
      const nivel = item.nivel;
      
      if (!añoMap.has(año)) {
        añoMap.set(año, { año });
      }
      const entry = añoMap.get(año);
      entry[`tasa_neta_${nivel}`] = item.tasa_cobertura_neta * 100;
      entry[`tasa_bruta_${nivel}`] = item.tasa_cobertura_bruta * 100;
    });
    return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
  },
  obtenerMetricas: (data, tipoTasa) => {
    console.log("🔍 obtenerMetricas - tipoTasa:", tipoTasa);
    const niveles = [...new Set(data.map((item) => item.nivel))];
    
    const labels = {
      "1. PRE-BÁSICA": "Prebásica",
      "2. BÁSICA": "Básica",
      "3. MEDIA": "Media"
    };
    
    const colores = {
      "1. PRE-BÁSICA": "#2E86AB",
      "2. BÁSICA": "#A23B72",
      "3. MEDIA": "#F18F01"
    };
    
    // tipoTasa: 0 = Brutas, 1 = Netas
    const prefix = tipoTasa === 0 ? "tasa_bruta" : "tasa_neta";
    
    return niveles.map((nivel) => ({
      key: `${prefix}_${nivel}`,
      label: labels[nivel] || nivel,
      color: colores[nivel] || "#6A994E"
    }));
  },
},

  [TIPO_GRAFICO.ACCESO_PRIMER_GRADO_BASICA]: {
    titulo: "Tasa de Acceso al Primer Grado de Educación Básica",
    esNacional: true,
    procesarDatos: (data) => {
      return data
        .map((item) => ({
          año: item.Año,
          tasa_acceso_neta: parseFloat(item.tasa_acceso_primer_grado_neta) * 100,
          tasa_acceso_bruta: parseFloat(item.tasa_acceso_primer_grado_bruta) * 100,
          matricula_neta: item.Matricula_Neta,
          matricula_bruta: item.Matricula_Bruta,
        }))
            .sort((a, b) => a.año - b.año);
        },
    metricas: [
      { key: "tasa_acceso_neta", label: "Tasa Neta", color: "#2E86AB" },
      { key: "tasa_acceso_bruta", label: "Tasa Bruta", color: "#A23B72" },
    ],
  },

  [TIPO_GRAFICO.ACCESO_PREBASICA_3]: {
    titulo: "Tasa de Acceso al Grado Obligatorio (3ro) de Educación Pre Básica",
    esNacional: true,
    procesarDatos: (data) => {
      return data
        .map((item) => ({
          año: item.Año,
          tasa_acceso_neta: parseFloat(item.tasa_acceso_3_prebasica_neta) * 100, 
          tasa_acceso_bruta: parseFloat(item.tasa_acceso_3_prebasica_bruta) * 100, 
          matricula_neta: item.Matricula_Neta,
          matricula_bruta: item.Matricula_Bruta,
        }))
        .sort((a, b) => a.año - b.año);
    },
    metricas: [
      { key: "tasa_acceso_neta", label: "Tasa Neta", color: "#6A994E" },
      { key: "tasa_acceso_bruta", label: "Tasa Bruta", color: "#BC4A6C" },
    ],
  },

  [TIPO_GRAFICO.VARIACION_INTERANUAL]: {
    titulo: "Variación Interanual - Prebásica/Grado Obligatorio",
    esNacional: true,
    procesarDatos: (data) => {
      return data
        .map((item) => ({
          año: item.Año,
          variacion: parseFloat(item.VIMAOPB) * 100,
          matricula_actual: item.matricula_actual,
          matricula_anterior: item.matricula_anterior,
        }))
        .sort((a, b) => a.año - b.año);
    },
    metricas: [{ key: "variacion", label: "Variación (%)", color: "#F18F01" }],
  },

  [TIPO_GRAFICO.ESCOLARIZACION_EDADES]: {
    titulo: "Tasa Específica de Escolarización por Edad",
    esNacional: true,
    procesarDatos: (data) => {
      if (!data || data.length === 0) return [];

      // Agrupar datos por año
      const añoMap = new Map();

      data.forEach((item) => {
        const año = item.Periodo;
        const edad = String(item.Edad);
        const tee = item.TEE;

        if (!año || !edad || tee === undefined) return;

        if (!añoMap.has(año)) {
          añoMap.set(año, { año });
        }

        const entry = añoMap.get(año);
        entry[`edad_${edad}`] = parseFloat(tee) * 100;
      });

      // Convertir a array y ordenar por año
      return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
    },
    obtenerMetricas: (data) => {
      if (!data || data.length === 0) return [];

      // Obtener todas las edades disponibles
      const edades = [...new Set(data.map((item) => String(item.Edad)))].sort(
        (a, b) => parseInt(a) - parseInt(b),
      );

      // Colores para diferentes edades
      const coloresEdades = [
        "#2E86AB",
        "#A23B72",
        "#F18F01",
        "#C73E1D",
        "#6A994E",
        "#BC4A6C",
        "#F4A261",
        "#2A9D8F",
        "#E76F51",
        "#8338EC",
        "#3A86FF",
        "#FB5607",
        "#9C89B8",
        "#70D6FF",
        "#FF70A6",
      ];

      return edades.map((edad, idx) => ({
        key: `edad_${edad}`,
        label: `${edad}`,
        color: coloresEdades[idx % coloresEdades.length],
      }));
    },
  },

  [TIPO_GRAFICO.ACCESO_PRIMER_GRADO_BASICA_EDADES_SIMPLES]: {
    titulo: "Tasa de Acceso al Primer Grado de Educación Básica por Edad Simple",
    esNacional: true,
    procesarDatos: (data) => {
      if (!data || data.length === 0) return [];

      const añoMap = new Map();

      data.forEach((item) => {
        const año = item.Periodo;
        // Extraer solo el número de la edad (ej: "7 Años" -> "7")
        const edadMatch = item.Edad?.match(/(\d+)/);
        const edad = edadMatch ? edadMatch[1] : null;
        const tasa = item.tasa_a1b;

        if (!año || !edad || tasa === undefined || tasa === null) return;

        if (!añoMap.has(año)) {
          añoMap.set(año, { año });
        }

        const entry = añoMap.get(año);
        entry[`edad_${edad}`] = parseFloat(tasa) * 100; // ← MULTIPLICAR POR 100
      });

      return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
    },
    obtenerMetricas: (data) => {
      if (!data || data.length === 0) return [];

      const edades = [...new Set(data.map((item) => {
        const edadMatch = item.Edad?.match(/(\d+)/);
        return edadMatch ? edadMatch[1] : null;
      }).filter(Boolean))].sort((a, b) => parseInt(a) - parseInt(b));

      const coloresEdades = [
        "#2E86AB", "#A23B72", "#F18F01", "#C73E1D", "#6A994E",
        "#BC4A6C", "#F4A261", "#2A9D8F", "#E76F51", "#8338EC"
      ];

      return edades.map((edad, idx) => ({
        key: `edad_${edad}`,
        label: `${edad} Años`,
        color: coloresEdades[idx % coloresEdades.length],
      }));
    },
  },

  [TIPO_GRAFICO.TASA_REPITENCIA]: {
    titulo: "Tasa de Repitencia por Nivel",
    esNacional: true,
    procesarDatos: (data) => {
      const añoMap = new Map();
      data.forEach((item) => {
        const año = item.Periodo;
        if (!añoMap.has(año)) {
          añoMap.set(año, { año });
        }
        const entry = añoMap.get(año);
        if (item.TasaRepitenciaBasica !== undefined) {
          entry.repitencia_basica = parseFloat(item.TasaRepitenciaBasica) * 100; 
        }
        if (item.TasaRepitenciaMedia !== undefined) {
          entry.repitencia_media = parseFloat(item.TasaRepitenciaMedia) * 100; 
        }
      });
      return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
    },
    metricas: [
      {
        key: "repitencia_basica",
        label: "Repitencia Básica",
        color: "#F18F01",
      },
      { key: "repitencia_media", label: "Repitencia Media", color: "#C73E1D" },
    ],
  },
  [TIPO_GRAFICO.TASA_DESERCION]: {
    titulo: "Tasa de Deserción por Nivel",
    esNacional: true,
    procesarDatos: (data) => {
      const añoMap = new Map();
      data.forEach((item) => {
        const año = item.Periodo;
        const nivel = item.NIVEL;
        if (!añoMap.has(año)) {
          añoMap.set(año, { año });
        }
        const entry = añoMap.get(año);
        if (nivel === "1.PRE-BÁSICA") {
          entry.desercion_prebasica = parseFloat(item.TasaDesercion) * 100; 
        } else if (nivel === "2.BÁSICA") {
          entry.desercion_basica = parseFloat(item.TasaDesercion) * 100; 
        } else if (nivel === "3.MEDIA") {
          entry.desercion_media = parseFloat(item.TasaDesercion) * 100; 
        }
      });
      return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
    },
    metricas: [
      {
        key: "desercion_prebasica",
        label: "Deserción Prebásica",
        color: "#6A994E",
      },
      { key: "desercion_basica", label: "Deserción Básica", color: "#BC4A6C" },
      { key: "desercion_media", label: "Deserción Media", color: "#F4A261" },
    ],
  },

  [TIPO_GRAFICO.TASA_APROBACION]: {
    titulo: "Tasa de Educando Aprobados por Nivel",
    esNacional: true,
    procesarDatos: (data) => {
      const añoMap = new Map();
      data.forEach((item) => {
        const año = item.Periodo;
        if (!añoMap.has(año)) {
          añoMap.set(año, { año });
        }
        const entry = añoMap.get(año);
        entry.aprobacion_prebasica = parseFloat(item.TasaAprobacionPreBasica) * 100;
        entry.aprobacion_basica = parseFloat(item.TasaAprobacionBasica) * 100;
        entry.aprobacion_media = parseFloat(item.TasaAprobacionMedia) * 100;
        entry.aprobacion_total = parseFloat(item.TasaAprobacionTotal) * 100;
      });
      return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
    },
    metricas: [
      {
        key: "aprobacion_prebasica",
        label: "Aprobación Prebásica",
        color: "#2E86AB",
      },
      {
        key: "aprobacion_basica",
        label: "Aprobación Básica",
        color: "#A23B72",
      },
      { key: "aprobacion_media", label: "Aprobación Media", color: "#F18F01" },
      { key: "aprobacion_total", label: "Aprobación Total", color: "#6A994E" },
    ],
  },

  [TIPO_GRAFICO.TASA_PROMOVIDOS]: {
    titulo: "Tasa de Educandos Promovidos por Nivel",
    esNacional: true,
    procesarDatos: (data) => {
      const añoMap = new Map();
      data.forEach((item) => {
        const año = item.Periodo;
        if (!añoMap.has(año)) {
          añoMap.set(año, { año });
        }
        const entry = añoMap.get(año);
        entry.promovidos_prebasica = parseFloat(item.TasaPromovidosPreBasica) * 100;
        entry.promovidos_basica = parseFloat(item.TasaPromovidosBasica) * 100;
        entry.promovidos_media = parseFloat(item.TasaPromovidosMedia) * 100;
        entry.promovidos_total = parseFloat(item.TasaPromovidosTotal) * 100;
      });
      return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
    },
    metricas: [
      {
        key: "promovidos_prebasica",
        label: "Promovidos Prebásica",
        color: "#2E86AB",
      },
      {
        key: "promovidos_basica",
        label: "Promovidos Básica",
        color: "#A23B72",
      },
      { key: "promovidos_media", label: "Promovidos Media", color: "#F18F01" },
      { key: "promovidos_total", label: "Promovidos Total", color: "#6A994E" },
    ],
  },

  [TIPO_GRAFICO.TASAS_POR_GRADO]: {
    titulo: "Tasas Brutas y Netas por Grado",
    esNacional: true,
    procesarDatos: (data) => {
      if (!data || data.length === 0) return [];

      const añoMap = new Map();

      data.forEach((item) => {
        const año = item.Periodo;
        const grado = item.Grado;

        if (!año) return;

        if (!añoMap.has(año)) {
          añoMap.set(año, { año });
        }

        const entry = añoMap.get(año);

        // Mapear grados según el código exacto
        let gradoKey = "";
        if (grado === "A1-PRIMER GRADO - PREBÁSICA") {
          gradoKey = "prebasica1";
        } else if (grado === "A2-SEGUNDO GRADO - PREBÁSICA") {
          gradoKey = "prebasica2";
        } else if (grado === "A3-TERCER GRADO - PREBÁSICA") {
          gradoKey = "prebasica3";
        } else if (grado === "G1-PRIMER GRADO") {
          gradoKey = "grado1";
        } else if (grado === "G2-SEGUNDO GRADO") {
          gradoKey = "grado2";
        } else if (grado === "G3-TERCER GRADO") {
          gradoKey = "grado3";
        } else if (grado === "G4-CUARTO GRADO") {
          gradoKey = "grado4";
        } else if (grado === "G5-QUINTO GRADO") {
          gradoKey = "grado5";
        } else if (grado === "G6-SEXTO GRADO") {
          gradoKey = "grado6";
        } else if (grado === "G7-SÉPTIMO GRADO") {
          gradoKey = "grado7";
        } else if (grado === "G8-OCTAVO GRADO") {
          gradoKey = "grado8";
        } else if (grado === "G9-NOVENO GRADO") {
          gradoKey = "grado9";
        } else if (grado === "M10-DÉCIMO GRADO") {
          gradoKey = "grado10";
        } else if (grado === "M11-UNDÉCIMO GRADO") {
          gradoKey = "grado11";
        } else if (grado === "M12-DUODÉCIMO GRADO") {
          gradoKey = "grado12";
        } else if (grado === "M13-DECIMOTERCER GRADO") {
          gradoKey = "grado13";
        }

        if (gradoKey && item.TasaMatriculaBruta && item.TasaMatriculaNeta) {
          // Multiplicar por 100 para convertir a porcentaje
          entry[`tasa_bruta_${gradoKey}`] = parseFloat(item.TasaMatriculaBruta) * 100;
          entry[`tasa_neta_${gradoKey}`] = parseFloat(item.TasaMatriculaNeta) * 100;
        }
      });

      return Array.from(añoMap.values()).sort((a, b) => parseInt(a.año) - parseInt(b.año));
    },
    obtenerMetricas: (data, tabValue) => {
      if (!data || data.length === 0) return [];

      const tipoTasa = tabValue === 0 ? "bruta" : "neta";

      // Definir los grados a mostrar (excluyendo grado13 que tiene valores muy bajos)
      const grados = [
        { key: "prebasica1", label: "Primer Grado - Pre Básica" },
        { key: "prebasica2", label: "Segundo Grado - Pre Básica" },
        { key: "prebasica3", label: "Tercer Grado - Pre Básica" },
        { key: "grado1", label: "Primer Grado" },
        { key: "grado2", label: "Segundo Grado" },
        { key: "grado3", label: "Tercer Grado" },
        { key: "grado4", label: "Cuarto Grado" },
        { key: "grado5", label: "Quinto Grado" },
        { key: "grado6", label: "Sexto Grado" },
        { key: "grado7", label: "Séptimo Grado" },
        { key: "grado8", label: "Octavo Grado" },
        { key: "grado9", label: "Noveno Grado" },
        { key: "grado10", label: "Décimo Grado" },
        { key: "grado11", label: "Undécimo Grado" },
        { key: "grado12", label: "Duodécimo Grado" },
      ];

      // Colores para diferentes grados
      const coloresGrados = [
        "#2E86AB", "#A23B72", "#F18F01", "#C73E1D", "#6A994E",
        "#BC4A6C", "#F4A261", "#2A9D8F", "#E76F51", "#8338EC",
        "#3A86FF", "#FB5607", "#9C89B8", "#70D6FF", "#FF70A6"
      ];

      return grados.map((grado, idx) => ({
        key: `tasa_${tipoTasa}_${grado.key}`,
        label: grado.label,
        color: coloresGrados[idx % coloresGrados.length],
      }));
    },
  },
  [TIPO_GRAFICO.TASAS_CICLOS]: {
  titulo: "Tasas Brutas y Netas por Ciclo",
  esNacional: true,
  procesarDatos: (data) => {
    if (!data || data.length === 0) return [];
    
    const añoMap = new Map();
    
    data.forEach((item) => {
      const año = item.Periodo;
      
      if (!año) return;
      
      if (!añoMap.has(año)) {
        añoMap.set(año, { año });
      }
      
      const entry = añoMap.get(año);
      
      // Ciclo I
      entry.tasa_neta_ciclo_I = parseFloat(item.tasa_neta_ciclo_I) * 100;
      entry.tasa_bruta_ciclo_I = parseFloat(item.tasa_bruta_ciclo_I) * 100;
      
      // Ciclo II
      entry.tasa_neta_ciclo_II = parseFloat(item.tasa_neta_ciclo_II) * 100;
      entry.tasa_bruta_ciclo_II = parseFloat(item.tasa_bruta_ciclo_II) * 100;
      
      // Ciclo III
      entry.tasa_neta_ciclo_III = parseFloat(item.tasa_neta_ciclo_III) * 100;
      entry.tasa_bruta_ciclo_III = parseFloat(item.tasa_bruta_ciclo_III) * 100;
    });
    
    return Array.from(añoMap.values()).sort((a, b) => a.año - b.año);
  },
  obtenerMetricas: (data, tipoTasa) => {
    const ciclos = [
      { key: "ciclo_I", label: "Ciclo I", color: "#2E86AB" },
      { key: "ciclo_II", label: "Ciclo II", color: "#A23B72" },
      { key: "ciclo_III", label: "Ciclo III", color: "#F18F01" },
    ];
    
    const prefix = tipoTasa === 0 ? "tasa_bruta" : "tasa_neta";
    
    return ciclos.map((ciclo) => ({
      key: `${prefix}_${ciclo.key}`,
      label: ciclo.label,
      color: ciclo.color
    }));
  },
},

[TIPO_GRAFICO.TASA_SUPERVIVENCIA]: {
  titulo: "Tasa de Supervivencia por Nivel Educativo",
  esNacional: true,
  procesarDatos: (data) => {
    if (!data || data.length === 0) return [];

    // Agrupar datos por año
    const añoMap = new Map();

    data.forEach((item) => {
      const año = item.Periodo;
      const nivel = item.NIVEL;
      
      if (!añoMap.has(año)) {
        añoMap.set(año, { año });
      }
      
      const entry = añoMap.get(año);
      
      // Mapear niveles
      let nivelKey = null;
      if (nivel === "1.PRE-BÁSICA") {
        nivelKey = "prebasica";
      } else if (nivel === "2.BÁSICA") {
        nivelKey = "basica";
      } else if (nivel === "3.MEDIA") {
        nivelKey = "media";
      } else if (nivel === "4.TOTAL") {
        nivelKey = "total";
      }
      
      if (nivelKey) {
        const tasa = parseFloat(item.TasaSupervivencia);
        entry[`tasa_supervivencia_${nivelKey}`] = isNaN(tasa) ? 0 : tasa * 100;
      }
    });

    // Convertir a array y ordenar por año
    return Array.from(añoMap.values()).sort((a, b) => parseInt(a.año) - parseInt(b.año));
  },
  obtenerMetricas: (data) => {
    if (!data || data.length === 0) return [];

    const niveles = [
      { key: "prebasica", label: "Prebásica", color: "#2E86AB" },
      { key: "basica", label: "Básica", color: "#A23B72" },
      { key: "media", label: "Media", color: "#F18F01" },
      { key: "total", label: "Total", color: "#6A994E" },
    ];

    return niveles.map((nivel) => ({
      key: `tasa_supervivencia_${nivel.key}`,
      label: nivel.label,
      color: nivel.color,
    }));
  },
},
};

// ==================== COMPONENTE PRINCIPAL ====================
const GraficoTasasCobertura = ({
  data,
  loading = false,
  tipo = TIPO_GRAFICO.TASAS_DEPARTAMENTO,
  tituloPersonalizado = null,
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [categoriaFiltro, setCategoriaFiltro] = useState("general");
  const [departamentoSeleccionado, setDepartamentoSeleccionado] =
    useState("Todos");
  const [hiddenLines, setHiddenLines] = useState({});

  const config = CONFIGURACION_GRAFICOS[tipo];

  const departamentosDisponibles = useMemo(() => {
    if (!data || data.length === 0 || config.esNacional) return ["Todos"];
    const deptos = new Set();
    data.forEach((item) => {
      if (item.Departamento) deptos.add(item.Departamento);
    });
    return ["Todos", ...Array.from(deptos).sort()];
  }, [data, config.esNacional]);

  const datosFiltrados = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (config.esNacional) return data;
    if (departamentoSeleccionado === "Todos") return data;
    return data.filter(
      (item) => item.Departamento === departamentoSeleccionado,
    );
  }, [data, departamentoSeleccionado, config.esNacional]);

const datosProcesados = useMemo(() => {
  if (!datosFiltrados || datosFiltrados.length === 0) return [];

  if (config.procesarDatos) {
    return config.procesarDatos(datosFiltrados);
  }


if (tipo === TIPO_GRAFICO.TASAS_POR_GRADO || 
    tipo === TIPO_GRAFICO.TASAS_CICLOS ||
    tipo === TIPO_GRAFICO.COBERTURA_NIVELES ||
    tipo === TIPO_GRAFICO.ACCESO_PRIMER_GRADO_BASICA ||
    tipo === TIPO_GRAFICO.ACCESO_PREBASICA_3 ||
    tipo === TIPO_GRAFICO.ESCOLARIZACION_EDADES ||
    tipo === TIPO_GRAFICO.VARIACION_INTERANUAL ||
    tipo === TIPO_GRAFICO.TASA_REPITENCIA ||
    tipo === TIPO_GRAFICO.TASA_DESERCION ||
    tipo === TIPO_GRAFICO.TASA_APROBACION ||
    tipo === TIPO_GRAFICO.TASA_PROMOVIDOS ||
    tipo === TIPO_GRAFICO.ACCESO_PRIMER_GRADO_BASICA_EDADES_SIMPLES ||
    tipo === TIPO_GRAFICO.TASA_SUPERVIVENCIA) {  
  // Los datos ya vienen en el formato correcto desde dataFetcher
  return datosFiltrados;
}

  // Procesamiento por defecto solo para TASAS_DEPARTAMENTO
  const añoMap = new Map();

  datosFiltrados.forEach((item) => {
    const año = item.Año || item.anio || item.periodo;
    if (!año) return;

    if (!añoMap.has(año)) {
      añoMap.set(año, { año, valores: {}, conteo: {} });
    }

    const entry = añoMap.get(año);

    const obtenerTasas = () => {
      if (tabValue === 0) {
        if (categoriaFiltro === "general") {
          return CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
            .metricasGenerales.brutas;
        }
        return (
          CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
            .metricasPorCategoria[categoriaFiltro]?.brutas || []
        );
      } else {
        if (categoriaFiltro === "general") {
          return CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
            .metricasGenerales.netas;
        }
        return (
          CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
            .metricasPorCategoria[categoriaFiltro]?.netas || []
        );
      }
    };

    const tasas = obtenerTasas();
    tasas.forEach((tasa) => {
      let valor = parseFloat(item[tasa.key]);
      if (!isNaN(valor)) {
        if (!entry.valores[tasa.key]) {
          entry.valores[tasa.key] = 0;
          entry.conteo[tasa.key] = 0;
        }
        entry.valores[tasa.key] += valor * 100;
        entry.conteo[tasa.key] += 1;
      }
    });
  });

  return Array.from(añoMap.values())
    .map((entry) => {
      const resultadoItem = { año: entry.año };
      Object.keys(entry.valores).forEach((key) => {
        resultadoItem[key] = entry.valores[key] / entry.conteo[key];
      });
      return resultadoItem;
    })
    .sort((a, b) => a.año - b.año);
}, [datosFiltrados, tabValue, categoriaFiltro, tipo, config]);

const metricasAMostrar = useMemo(() => {
  if (config.metricas) return config.metricas;
  if (config.obtenerMetricas) {
   
    return config.obtenerMetricas(datosFiltrados, tabValue);
  }

  if (tipo === TIPO_GRAFICO.TASAS_DEPARTAMENTO) {
    if (tabValue === 0) {
      if (categoriaFiltro === "general") {
        return CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
          .metricasGenerales.brutas;
      }
      return (
        CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
          .metricasPorCategoria[categoriaFiltro]?.brutas || []
      );
    } else {
      if (categoriaFiltro === "general") {
        return CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
          .metricasGenerales.netas;
      }
      return (
        CONFIGURACION_GRAFICOS[TIPO_GRAFICO.TASAS_DEPARTAMENTO]
          .metricasPorCategoria[categoriaFiltro]?.netas || []
      );
    }
  }
  return [];
}, [tipo, tabValue, categoriaFiltro, datosFiltrados, config]);

  const colores = [
    "#2E86AB",
    "#A23B72",
    "#F18F01",
    "#C73E1D",
    "#6A994E",
    "#BC4A6C",
    "#F4A261",
    "#2A9D8F",
    "#E76F51",
    "#8338EC",
    "#3A86FF",
    "#FB5607",
  ];

  const handleToggleLine = (dataKey) => {
    setHiddenLines((prev) => ({ ...prev, [dataKey]: !prev[dataKey] }));
  };

  const handleCategoryChange = (cat) => {
    setCategoriaFiltro(cat);
    setHiddenLines({});
  };

  if (loading) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box
            sx={{
              height: 400,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography>Cargando datos...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!datosProcesados.length) {
      console.log("❌ No hay datos procesados");
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography color="text.secondary">
              No hay datos disponibles
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3, height:"100%", width:"100%" }}>
      <CardContent>
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ mb: 3, flexWrap: "wrap", gap: 2 }}
        >
          {tipo === TIPO_GRAFICO.ESCOLARIZACION_EDADES ? (
            <School sx={{ color: color.primary }} />
          ) : (
            <TrendingUp sx={{ color: color.primary }} />
          )}
          <Typography
            variant="h6"
            sx={{ color: color.primary, fontWeight: "bold", flex: 1 }}
          >
            {tituloPersonalizado || config.titulo}
          </Typography>

          {/* Selector de departamento (solo si NO es nacional) */}
          {!config.esNacional && departamentosDisponibles.length > 1 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={departamentoSeleccionado}
                onChange={(e) => setDepartamentoSeleccionado(e.target.value)}
                startAdornment={
                  <LocationOn
                    sx={{ mr: 1, fontSize: 18, color: color.primary }}
                  />
                }
                sx={{ bgcolor: alpha(color.primary, 0.05), borderRadius: 2 }}
              >
                {departamentosDisponibles.map((depto) => (
                  <MenuItem key={depto} value={depto}>
                    {depto}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Tooltip title={config.titulo}>
            <Info
              sx={{
                fontSize: 18,
                color: color.primary,
                opacity: 0.7,
                cursor: "help",
              }}
            />
          </Tooltip>
        </Stack>

        {/* Categorías (solo para tasas por departamento) */}
        {tipo === TIPO_GRAFICO.TASAS_DEPARTAMENTO && (
          <Box sx={{ mb: 2 }}>
            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
              justifyContent="center"
            >
              {Object.entries({
                general: "General",
                nivel: "Por Nivel",
                ciclo: "Por Ciclo",
                acessoObligatorio: "Acceso Grado Obligatorio de Pre Básica",
              }).map(([cat, label]) => (
                <Paper
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  sx={{
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor:
                      categoriaFiltro === cat ? color.primary : "transparent",
                    color:
                      categoriaFiltro === cat ? "white" : color.contrastText,
                    "&:hover": {
                      bgcolor:
                        categoriaFiltro === cat
                          ? color.primary
                          : alpha(color.primary, 0.1),
                    },
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    {label}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* Tabs para Brutas/Netas */}
        {(tipo === TIPO_GRAFICO.TASAS_DEPARTAMENTO ||
          tipo === TIPO_GRAFICO.COBERTURA_NIVELES ||
          tipo === TIPO_GRAFICO.TASAS_POR_GRADO ||tipo === TIPO_GRAFICO.TASAS_CICLOS)&& (
          <Tabs
            value={tabValue}
            onChange={(e, v) => {
              setTabValue(v);
              setHiddenLines({});
            }}
            sx={{ mb: 3 }}
          >
            <Tab label="Tasas Brutas" />
            <Tab label="Tasas Netas" />
          </Tabs>
        )}

        {/* Leyenda */}
        {metricasAMostrar.length > 0 && (
          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            justifyContent="center"
            sx={{ mb: 3 }}
          >
            {metricasAMostrar.map((metrica, idx) => {
              const isHidden = hiddenLines[metrica.key];
              const metricColor =
                metrica.color || colores[idx % colores.length];
              return (
                <Chip
                  key={metrica.key}
                  label={metrica.label}
                  onClick={() => handleToggleLine(metrica.key)}
                  size="small"
                  sx={{
                    bgcolor: isHidden ? "#E0E0E0" : alpha(metricColor, 0.15),
                    color: isHidden ? "#9E9E9E" : metricColor,
                    border: `1px solid ${isHidden ? "#E0E0E0" : alpha(metricColor, 0.5)}`,
                    fontWeight: isHidden ? "normal" : "bold",
                    cursor: "pointer",
                  }}
                />
              );
            })}
          </Stack>
        )}

        {/* Gráfica - SOLO LINEAS */}
        <ResponsiveContainer width="100%" height={450}>
          <LineChart
            data={datosProcesados}
            margin={{ top: 30, right: 30, left: 10, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={alpha(color.contrastText, 0.1)}
            />
            <XAxis
              dataKey="año"
              tick={{ fill: color.contrastText, fontSize: 12 }}
              axisLine={{ stroke: color.primary }}
            />
            <YAxis
              tick={{ fill: color.contrastText, fontSize: 12 }}
              axisLine={{ stroke: color.primary }}
              domain={[0, 100]}
              tickFormatter={(value) => {
                // Convertir a número de forma segura
                const numValue = typeof value === 'number' ? value : parseFloat(value);
                if (isNaN(numValue)) return '0%';
                return `${numValue.toFixed(2)}%`;
              }}
              label={{
                value: "Porcentaje (%)",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <RechartsTooltip
              formatter={(value) => {
                // Convertir a número de forma segura
                const numValue = typeof value === 'number' ? value : parseFloat(value);
                // Verificar si es un número válido
                if (isNaN(numValue)) return '0%';
                return `${numValue.toFixed(2)}%`;
              }}
              labelFormatter={(label) => `Año: ${label}`}
            />
            {metricasAMostrar.map((metrica, idx) => {
              const tieneDatos = datosProcesados.some(
                (d) => d[metrica.key] !== undefined && d[metrica.key] > 0,
              );
              if (!tieneDatos) return null;
              return (
                !hiddenLines[metrica.key] && (
                  <Line
                    key={metrica.key}
                    type="monotone"
                    dataKey={metrica.key}
                    name={metrica.label}
                    stroke={metrica.color || colores[idx % colores.length]}
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    label={{
                      position: "top",
                      formatter: (value) => {
                        const numValue = typeof value === 'number' ? value : parseFloat(value);
                        if (isNaN(numValue)) return '0%';
                        return `${numValue.toFixed(2)}%`;
                      },
                      fontSize: 11,
                      fill: metrica.color || colores[idx % colores.length],
                    }}
                    activeDot={{ r: 8 }}
                  />
                )
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default GraficoTasasCobertura;
export { TIPO_GRAFICO };
