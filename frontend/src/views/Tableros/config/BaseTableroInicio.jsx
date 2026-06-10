import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  Stack,
  useMediaQuery,
  useTheme,
  Button,
  Chip,
  Skeleton,
  alpha,
  styled,
  Paper,
} from "@mui/material";
import { Close, FilterAlt } from "@mui/icons-material";
import DataExplorationRoundedIcon from "@mui/icons-material/DataExplorationRounded";
import MapIcon from "@mui/icons-material/Map";
import InfoIcon from "@mui/icons-material/Info";
import MapaDinamico from "./MapaDinamico.jsx";
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
// ==================== URLs DE LAS APIS ====================
const API_URLS = {
  SEDUC: `${process.env.REACT_APP_API_URL}/vistaresumenseduc`,
  INFOP: `${process.env.REACT_APP_API_URL}/vistaresumeninfopdepartamentosmunicipios`,
  CONEANFO: `${process.env.REACT_APP_API_URL}/vistaresumenconeanfoatencionesproyecto`,
  DESUNAH: `${process.env.REACT_APP_API_URL}/vistaresumendesmatriculadepartamento`,
};


// ==================== INSTITUCIONES CONFIG ====================
const CONFIG_INSTITUCIONES = {
  SEDUC: { nombre: "SEDUC", metrica: "Matrícula Inicial" },
  INFOP: { nombre: "INFOP", metrica: "Matrícula Inicial" },
  CONEANFO: { nombre: "CONEANFO", metrica: "Atenciones" },
  DESUNAH: { nombre: "DES-UNAH", metrica: "Matrícula Inicial" },
};

const INSTITUCIONES = ["SEDUC", "INFOP", "CONEANFO", "DESUNAH"];

// ==================== FUNCIONES PARA PROCESAR DATOS ====================

// Procesar datos de SEDUC - Usa MatriculaInicialTotalSEDUC
const procesarSEDUC = (data) => {
  const resultados = [];
  const mapaPorDepto = new Map();

  data.forEach(item => {
    const anio = item.periodo;
    const departamento = item.departamento;
    const valor = parseInt(item.MatriculaInicialTotalSEDUC) || 0;

    if (!departamento || departamento === "Total") return;

    const key = `${anio}|${departamento}`;

    if (!mapaPorDepto.has(key)) {
      mapaPorDepto.set(key, { anio, departamento, total: 0 });
    }
    mapaPorDepto.get(key).total += valor;
  });

  for (const entry of mapaPorDepto.values()) {
    resultados.push({
      anio: entry.anio,
      departamento: entry.departamento,
      municipio: "Todos",
      genero: "Total",
      matriculaInicial: entry.total,
    });
  }

  console.log(`📊 SEDUC: ${resultados.length} registros, Total: ${resultados.reduce((sum, r) => sum + r.matriculaInicial, 0).toLocaleString()}`);
  return resultados;
};

// Procesar datos de INFOP - Usa MatriculaInicialTotalINFOP
const procesarINFOP = (data) => {
  const resultados = [];
  const mapaPorDepto = new Map();

  data.forEach(item => {
    const anio = item.periodo;
    const departamento = item.departamento;
    const valor = parseInt(item.MatriculaInicialTotalINFOP) || 0;

    if (!departamento || departamento === "Total") return;

    const key = `${anio}|${departamento}`;

    if (!mapaPorDepto.has(key)) {
      mapaPorDepto.set(key, { anio, departamento, total: 0 });
    }
    mapaPorDepto.get(key).total += valor;
  });

  for (const entry of mapaPorDepto.values()) {
    resultados.push({
      anio: entry.anio,
      departamento: entry.departamento,
      municipio: "Todos",
      genero: "Total",
      matriculaInicial: entry.total,
    });
  }

  console.log(`📊 INFOP: ${resultados.length} registros, Total: ${resultados.reduce((sum, r) => sum + r.matriculaInicial, 0).toLocaleString()}`);
  return resultados;
};

// Procesar datos de CONEANFO - Usa AtencionesInicialTotalCONEANFO
const procesarCONEANFO = (data) => {
  const resultados = [];
  let totalGeneral = 0;

  data.forEach(item => {
    const anio = item.periodo;
    const departamento = item.departamento;

    // Saltar si no hay departamento
    if (!departamento) return;

    // Solo sumar AtencionesInicialTotalCONEANFO
    const valor = parseInt(item.AtencionesInicialTotalCONEANFO) || 0;

    if (valor > 0) {
      totalGeneral += valor;
      resultados.push({
        anio: anio,
        departamento: departamento,
        municipio: "Todos",
        genero: "Total",
        atenciones: valor,
        matriculaInicial: valor,
      });
    }
  });

  console.log(`📊 CONEANFO: ${resultados.length} registros procesados`);
  console.log(`📊 CONEANFO Total Atenciones: ${totalGeneral.toLocaleString()}`);

  return resultados;
};

// Procesar datos de DESUNAH - Usa matriculades
const procesarDESUNAH = (data) => {
  const resultados = [];
  const mapaPorDepto = new Map();

  data.forEach(item => {
    const anio = item.anio;
    const departamento = item.departamento;
    const valor = parseInt(item.matriculades) || 0;

    if (!departamento || departamento === "Total") return;

    const key = `${anio}|${departamento}`;

    if (!mapaPorDepto.has(key)) {
      mapaPorDepto.set(key, { anio, departamento, total: 0 });
    }
    mapaPorDepto.get(key).total += valor;
  });

  for (const entry of mapaPorDepto.values()) {
    resultados.push({
      anio: entry.anio,
      departamento: entry.departamento,
      municipio: "Todos",
      genero: "Total",
      matriculaInicial: entry.total,
      matriculades: entry.total,
    });
  }

  console.log(`📊 DESUNAH: ${resultados.length} registros, Total: ${resultados.reduce((sum, r) => sum + r.matriculaInicial, 0).toLocaleString()}`);
  return resultados;
};

// ==================== COMPONENTE PRINCIPAL ====================
const BaseTableroInicio = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [loading, setLoading] = useState(true);
  const [datosDepto, setDatosDepto] = useState({});
  const [totalesPorInstitucion, setTotalesPorInstitucion] = useState({});
  const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });
  const [filtros, setFiltros] = useState({ anio: "Todos", departamento: "Todos" });
  const [datosOriginales, setDatosOriginales] = useState({});

  // Opciones para filtros
  const [añosDisponibles, setAñosDisponibles] = useState(["Todos"]);
  const [deptosDisponibles, setDeptosDisponibles] = useState(["Todos"]);

  // Medir dimensiones del mapa
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("map-container-inicio");
      if (container) {
        const containerWidth = container.clientWidth;
        const height = isMobile ? containerWidth * 0.6 : isTablet ? 500 : 600;
        setDimensions({ width: containerWidth, height: Math.max(height, 400) });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile, isTablet]);

  // Función para obtener el valor según institución
  const getValor = (row, institucion) => {
    if (institucion === "CONEANFO") {
      return row.atenciones || row.matriculaInicial || 0;
    }
    return row.matriculaInicial || row.matriculades || 0;
  };

  // Cargar datos de todas las instituciones
  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);

      const totales = {};
      const datosPorInstitucion = {};
      const añosSet = new Set();
      const deptosSet = new Set();
      const datosMapaGlobal = {};

      for (const inst of INSTITUCIONES) {
        try {
          const url = API_URLS[inst];

          if (!url) {
            console.warn(`No hay URL configurada para ${inst}`);
            totales[inst] = 0;
            datosPorInstitucion[inst] = [];
            continue;
          }

          console.log(`📡 Cargando ${inst} desde: ${url}`);
          const response = await fetch(url);
          const result = await response.json();

          // Extraer el array de datos (puede venir como array directamente o dentro de .data)
          const data = Array.isArray(result) ? result : (result.data || []);

          let datosProcesados = [];

          // Procesar según la institución
          if (inst === "SEDUC") {
            datosProcesados = procesarSEDUC(data);
          } else if (inst === "INFOP") {
            datosProcesados = procesarINFOP(data);
          } else if (inst === "CONEANFO") {
            datosProcesados = procesarCONEANFO(data);
          } else if (inst === "DESUNAH") {
            datosProcesados = procesarDESUNAH(data);
          }

          console.log(`✅ ${inst}: ${datosProcesados.length} registros procesados`);

          // Calcular total y recolectar años/departamentos
          let totalInst = 0;
          datosProcesados.forEach(row => {
            const valor = getValor(row, inst);
            totalInst += valor;

            const año = row.anio;
            if (año && año !== "Todos" && año !== "Total") {
              añosSet.add(String(año));
            }

            const depto = row.departamento;
            if (depto && depto !== "Todos" && depto !== "Total" && depto !== "") {
              deptosSet.add(depto);
            }
          });

          totales[inst] = totalInst;
          datosPorInstitucion[inst] = datosProcesados;

          console.log(`📊 Total ${inst} (${CONFIG_INSTITUCIONES[inst].metrica}): ${totalInst.toLocaleString()}`);

          // Acumular para el mapa (sumar por departamento)
          datosProcesados.forEach(row => {
            const depto = row.departamento;
            if (depto && depto !== "Todos" && depto !== "Total" && depto !== "") {
              const clave = normalizar(depto);
              const valor = getValor(row, inst);
              if (!datosMapaGlobal[clave]) {
                datosMapaGlobal[clave] = { valor: 0 };
              }
              datosMapaGlobal[clave].valor += valor;
            }
          });

        } catch (error) {
          console.error(`Error cargando ${inst}:`, error);
          totales[inst] = 0;
          datosPorInstitucion[inst] = [];
        }
      }

      console.log("📊 Totales por institución:", totales);
      console.log("📊 Total General:", Object.values(totales).reduce((a, b) => a + b, 0).toLocaleString());
      console.log("📊 Datos para el mapa:", Object.keys(datosMapaGlobal).length, "departamentos");

      setTotalesPorInstitucion(totales);
      setDatosOriginales(datosPorInstitucion);
      setDatosDepto(datosMapaGlobal);
      setAñosDisponibles(["Todos", ...Array.from(añosSet).sort((a, b) => b - a)]);
      setDeptosDisponibles(["Todos", ...Array.from(deptosSet).sort()]);
      setLoading(false);
    };

    cargarDatos();
  }, []);

  // Filtrar datos cuando cambian los filtros
  useEffect(() => {
    if (Object.keys(datosOriginales).length === 0) return;

    // Recalcular totales por institución según filtros
    const nuevosTotales = {};
    const datosMapaFiltrado = {};

    for (const inst of INSTITUCIONES) {
      const datos = datosOriginales[inst] || [];
      let totalInst = 0;

      const datosFiltrados = datos.filter(row => {
        const cumpleAnio = filtros.anio === "Todos" ||
          String(row.anio) === String(filtros.anio);
        const cumpleDepto = filtros.departamento === "Todos" ||
          normalizar(row.departamento) === normalizar(filtros.departamento);

        return cumpleAnio && cumpleDepto;
      });

      // Calcular total para esta institución
      datosFiltrados.forEach(row => {
        const valor = getValor(row, inst);
        totalInst += valor;
      });

      nuevosTotales[inst] = totalInst;

      // Acumular para el mapa (por departamento, no por municipio)
      datosFiltrados.forEach(row => {
        const depto = row.departamento;
        if (depto && depto !== "Todos" && depto !== "Total" && depto !== "") {
          const clave = normalizar(depto);
          const valor = getValor(row, inst);
          if (!datosMapaFiltrado[clave]) {
            datosMapaFiltrado[clave] = { valor: 0 };
          }
          datosMapaFiltrado[clave].valor += valor;
        }
      });
    }

    setTotalesPorInstitucion(nuevosTotales);
    setDatosDepto(datosMapaFiltrado);
  }, [filtros, datosOriginales]);


  // Calcular total general
  const totalGeneral = Object.values(totalesPorInstitucion).reduce((a, b) => a + b, 0);

  // Handlers
  const handleFilterChange = (key, value) => setFiltros(prev => ({ ...prev, [key]: value }));
  const handleRemoveFilter = (key) => setFiltros(prev => ({ ...prev, [key]: "Todos" }));
  const handleClearAllFilters = () => setFiltros({ anio: "Todos", departamento: "Todos" });

  const filtersConfig = [
    { key: "anio", label: "Año", options: añosDisponibles },
    { key: "departamento", label: "Departamento", options: deptosDisponibles },
  ];

  const hasData = Object.keys(datosDepto).length > 0;

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 4 } }}>
      {/* Título */}
      <ScrollReveal direction="right" duration={0.8}>
        <Typography sx={{ textAlign: "center", color: color.secondary, fontWeight: "bold", fontSize: "clamp(1.2rem, 4vw, 2.5rem)", mb: 4, position: "relative", display: "inline-block", width: "100%", "&::after": { content: '""', position: "absolute", left: "50%", bottom: -8, transform: "translateX(-50%)", width: "60px", height: "4px", background: color.secondary, borderRadius: 2 } }}>
          Sector Educativo en Honduras
        </Typography>
      </ScrollReveal>

      {/* Filtros activos */}
      <FiltrosActivos filtros={filtros} onRemoveFilter={handleRemoveFilter} onClearAll={handleClearAllFilters} />

      {/* Filtros de búsqueda */}
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

      {/* Mapa y Cards */}
      <Grid container spacing={3} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {/* Mapa */}
        <Grid item size={{ xs: 12, md: 9 }}>
          <ScrollReveal direction="up" delay={0.3}>
            <StyledCard sx={{ position: "relative", overflow: "visible" }}>
              <StyledCardContent sx={{ position: "relative" }}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mb: 2 }}>
                  <MapIcon sx={{ color: color.primary }} />
                  <Typography variant="h6" sx={{ color: color.primary, fontWeight: "bold" }}>
                  Por Departamento
                  </Typography>
                </Stack>
                <Tooltip title="Mapa de totales por departamento">
                  <InfoIcon sx={{ fontSize: 18, color: color.primary, opacity: 0.7, position: "absolute", right: 16, top: 16, cursor: "help" }} />
                </Tooltip>

                <Box id="map-container-inicio" sx={{ width: "100%" }}>
                  {loading ? (
                    <Skeleton variant="rectangular" width="100%" height={dimensions.height || 500} sx={{ borderRadius: 2 }} animation="wave" />
                  ) : !hasData ? (
                    <EmptyState onClearFilters={handleClearAllFilters} />
                  ) : (
                    <MapaDinamico
                      datosDepto={datosDepto}
                      dimensions={dimensions}
                      isMobile={isMobile}
                      filtroDepartamento="Todos"
                      filtroMunicipio="Todos"
                      esCentroEducativo={false}
                      modoSimple={true}
                    />
                  )}
                </Box>
              </StyledCardContent>

              {/* Card de Total General flotante */}
              <Box sx={{ position: "absolute", top: { xs: 50, sm: 50, md: 60, lg: 20 }, left: 20, zIndex: 1300, width: { xs: "calc(100% - 40px)", sm: "200px", md: "250px" } }}>
                <ScrollReveal direction="left" delay={0.4}>
                  <StyledCard sx={{ background: `linear-gradient(135deg, ${color.primary}15 0%, ${color.secondary}05 100%)`, width: "220px" }}>
                    <StyledCardContent>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <DataExplorationRoundedIcon sx={{ color: color.primary, fontSize: 32 }} />
                        <Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold" }}>Total General</Typography>
                      </Stack>
                      <Typography variant="h3" sx={{ color: color.secondary, fontWeight: "bold", fontSize: "clamp(2rem, 6vw, 2rem)", mb: 1 }}>
                        {loading ? <Skeleton width="80%" /> : <AnimatedCounter value={totalGeneral} />}
                      </Typography>
                      <Typography variant="caption" sx={{ color: color.contrastText }}>Matrícula y Atenciones</Typography>
                      {filtros.departamento !== "Todos" && (
                        <Chip label={filtros.departamento} size="small" sx={{ mt: 1, bgcolor: color.secondary, color: "white" }} />
                      )}
                    </StyledCardContent>
                  </StyledCard>
                </ScrollReveal>
              </Box>
            </StyledCard>
          </ScrollReveal>
        </Grid>

        {/* Cards por Institución */}
        <Grid item size={{ xs: 12, md: 3 }}>
          <ScrollReveal direction="right" delay={0.4}>
            <Grid container spacing={2}>
              {INSTITUCIONES.map((inst) => {
                const valor = totalesPorInstitucion[inst] || 0;
                const config = CONFIG_INSTITUCIONES[inst];
                return (
                  <Grid item key={inst} size={{ xs: 12, sm: 6, md: 12 }}>
                    <StyledCard>
                      <StyledCardContent sx={{ textAlign: "center" }}>
                        <Typography variant="subtitle2" sx={{ color: color.primary, fontWeight: "bold" }}>{config.nombre}</Typography>
                        <Typography variant="h4" sx={{ color: color.secondary, fontWeight: "bold", my: 1, fontSize: "clamp(1.2rem, 4vw, 2rem)" }}>
                          {loading ? <Skeleton width="80%" sx={{ mx: "auto" }} /> : valor.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: color.contrastText }}>{config.metrica}</Typography>
                      </StyledCardContent>
                    </StyledCard>
                  </Grid>
                );
              })}
            </Grid>
          </ScrollReveal>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BaseTableroInicio;