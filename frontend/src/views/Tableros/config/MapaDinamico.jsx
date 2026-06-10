// components/MapaDinamico.jsx
import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import { Box, Typography } from "@mui/material";
import { obtenerMapa, obtenerObjetoMapa, normalizarNombre, obtenerRegionPorDepartamento, obtenerColorRegion } from "./mapas.config";
import color from "../../../components/color";

const normalizar = normalizarNombre;

const MapaDinamico = ({
  datosDepto,
  dimensions,
  isMobile,
  filtroDepartamento,
  filtroMunicipio,
  esCentroEducativo,
  esServiciosBasicos,
  esMetricaDocente,
  modoSimple = false,
  selectedDimension,
  formatValue,
  isTasaMode = false,
}) => {
  const svgRef = useRef();
  const containerRef = useRef();
  const [tooltip, setTooltip] = useState({
    visible: false,
    nombre: "",
    valor: 0,
    x: 0,
    y: 0,
  });

  const formatearValor = (valor) => {
    if (formatValue) {
      return formatValue(valor);
    }
    if (isTasaMode) {
      return `${(valor * 100).toFixed(2)}%`;
    }
    return valor?.toLocaleString() || 0;
  };

  useEffect(() => {
    if (!dimensions.width || !dimensions.height) return;

    let mapaActual;
    let objetoMapa;

    if (selectedDimension === "region" || selectedDimension === "modoFormacion" || selectedDimension === "sectorEconomico" || selectedDimension === "programa" || selectedDimension === "centroFormacion") {
      mapaActual = obtenerMapa("Todos");
      objetoMapa = obtenerObjetoMapa(mapaActual, "Todos");
    }
    else if (esCentroEducativo || esServiciosBasicos) {
      mapaActual = obtenerMapa("Todos");
      objetoMapa = obtenerObjetoMapa(mapaActual, "Todos");
    }
    else if (filtroMunicipio && filtroMunicipio !== "Todos") {
      mapaActual = obtenerMapa(filtroDepartamento);
      objetoMapa = obtenerObjetoMapa(mapaActual, filtroDepartamento);
    }
    else if (filtroDepartamento && filtroDepartamento !== "Todos") {
      mapaActual = obtenerMapa(filtroDepartamento);
      objetoMapa = obtenerObjetoMapa(mapaActual, filtroDepartamento);
    }
    else {
      mapaActual = obtenerMapa("Todos");
      objetoMapa = obtenerObjetoMapa(mapaActual, "Todos");
    }

    if (!mapaActual || !objetoMapa) {
      console.error("No se pudo cargar el mapa para:", filtroDepartamento);
      return;
    }

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    try {
      const geoData = feature(mapaActual, objetoMapa);

      const projection = d3
        .geoMercator()
        .fitSize([dimensions.width, dimensions.height], geoData);
      const path = d3.geoPath().projection(projection);

      const obtenerValor = (nombreDepartamento) => {
        if (!nombreDepartamento) return 0;
        
        if (selectedDimension === "region" || selectedDimension === "modoFormacion" || selectedDimension === "sectorEconomico" || selectedDimension === "programa" || selectedDimension === "centroFormacion") {
          const region = obtenerRegionPorDepartamento(nombreDepartamento);
          if (region) {
            const regionNormalizada = normalizar(region);
            return datosDepto[regionNormalizada]?.valor || 0;
          }
          return 0;
        }
        
        const nombreNormalizado = normalizar(nombreDepartamento);
        return datosDepto[nombreNormalizado]?.valor || 0;
      };

      const esModoRegion = selectedDimension === "region" || selectedDimension === "modoFormacion" || selectedDimension === "sectorEconomico" || selectedDimension === "programa" || selectedDimension === "centroFormacion";
      const hayFiltroRegion = filtroDepartamento && filtroDepartamento !== "Todos" && esModoRegion;

      const obtenerColorOriginal = (nombreRegion) => {
        if (esModoRegion) {
          const region = obtenerRegionPorDepartamento(nombreRegion);
          const colorRegion = obtenerColorRegion(region);
          
          if (hayFiltroRegion) {
            const esRegionSeleccionada = region === filtroDepartamento;
            if (esRegionSeleccionada) {
              return colorRegion;
            } else {
              return "#e0e0e0";
            }
          }
          
          return colorRegion;
        }
        
        const tieneDatos = obtenerValor(nombreRegion) > 0;
        
        if (filtroMunicipio && filtroMunicipio !== "Todos") {
          const esMunicipioSeleccionado = normalizar(nombreRegion) === normalizar(filtroMunicipio);
          if (esMunicipioSeleccionado) {
            return tieneDatos ? color.primary : "#e0e0e0";
          }
          return "#e0e0e0";
        }
        
        if (filtroDepartamento && filtroDepartamento !== "Todos") {
          return tieneDatos ? color.primary : "#e0e0e0";
        }
        
        return tieneDatos ? color.primary : "#e0e0e0";
      };

      svg
        .attr("width", dimensions.width)
        .attr("height", dimensions.height)
        .attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`)
        .style("display", "block")
        .style("margin", "0 auto")
        .selectAll("path")
        .data(geoData.features)
        .enter()
        .append("path")
        .attr("d", path)
        .attr("fill", (d) => {
          let nombreRegion = d.properties.name || d.properties.NOMBRE || d.properties.MUNICIPIO;
          if (!nombreRegion && d.properties.NOMBRE_MUN) nombreRegion = d.properties.NOMBRE_MUN;
          if (!nombreRegion && d.properties.NOMBRE_DEP) nombreRegion = d.properties.NOMBRE_DEP;
          
          return obtenerColorOriginal(nombreRegion);
        })
        .attr("stroke", color.white)
        .attr("stroke-width", isMobile ? 0.5 : 1)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          let nombreRegion = d.properties.name || d.properties.NOMBRE || d.properties.MUNICIPIO;
          if (!nombreRegion && d.properties.NOMBRE_MUN) nombreRegion = d.properties.NOMBRE_MUN;
          if (!nombreRegion && d.properties.NOMBRE_DEP) nombreRegion = d.properties.NOMBRE_DEP;
          
          const valor = obtenerValor(nombreRegion);
          
          // Obtener coordenadas del mouse relativas al SVG (sin viewBox)
          const [mouseX, mouseY] = d3.pointer(event);
          
          let tooltipText = nombreRegion;
          if (esModoRegion) {
            const region = obtenerRegionPorDepartamento(nombreRegion);
            if (region) {
              tooltipText = `${nombreRegion} (${region})`;
            }
          }
          
          d3.select(this)
            .attr("fill", color.secondary)
            .attr("stroke-width", isMobile ? 1.5 : 2.5);
          
          setTooltip({
            visible: true,
            nombre: tooltipText,
            valor: valor,
            x: mouseX,
            y: mouseY,
          });
        })
        .on("mouseout", function(event, d) {
          let nombreRegion = d.properties.name || d.properties.NOMBRE || d.properties.MUNICIPIO;
          if (!nombreRegion && d.properties.NOMBRE_MUN) nombreRegion = d.properties.NOMBRE_MUN;
          if (!nombreRegion && d.properties.NOMBRE_DEP) nombreRegion = d.properties.NOMBRE_DEP;
          
          const originalColor = obtenerColorOriginal(nombreRegion);
          
          d3.select(this)
            .attr("fill", originalColor)
            .attr("stroke-width", isMobile ? 0.5 : 1);

          setTooltip((prev) => ({ ...prev, visible: false }));
        })
        .on("mousemove", (event) => {
          if (tooltip.visible) {
            const [mouseX, mouseY] = d3.pointer(event);
            setTooltip((prev) => ({
              ...prev,
              x: mouseX,
              y: mouseY,
            }));
          }
        });

      // Resto del código de etiquetas...
      if (!isMobile) {
        const centroides = geoData.features
          .map((feature) => {
            try {
              const centroid = path.centroid(feature);
              if (isNaN(centroid[0]) || isNaN(centroid[1])) return null;
              
              let nombreRegion = feature.properties.name || feature.properties.NOMBRE || feature.properties.MUNICIPIO;
              if (!nombreRegion && feature.properties.NOMBRE_MUN) nombreRegion = feature.properties.NOMBRE_MUN;
              if (!nombreRegion && feature.properties.NOMBRE_DEP) nombreRegion = feature.properties.NOMBRE_DEP;
              
              const valor = obtenerValor(nombreRegion);
              
              let mostrarEtiqueta = false;
              
              if (hayFiltroRegion) {
                const region = obtenerRegionPorDepartamento(nombreRegion);
                const esRegionSeleccionada = region === filtroDepartamento;
                mostrarEtiqueta = esRegionSeleccionada && valor > 0;
              } else if (esModoRegion) {
                mostrarEtiqueta = valor > 0;
              } else if (filtroMunicipio && filtroMunicipio !== "Todos") {
                mostrarEtiqueta = normalizar(nombreRegion) === normalizar(filtroMunicipio);
              } else if (filtroDepartamento && filtroDepartamento !== "Todos") {
                mostrarEtiqueta = valor > 0;
              } else {
                mostrarEtiqueta = valor > 0;
              }
              
              if (!mostrarEtiqueta) return null;
              
              return {
                name: nombreRegion,
                x: centroid[0],
                y: centroid[1],
                hasData: valor > 0,
                valor: valor,
              };
            } catch (err) {
              return null;
            }
          })
          .filter(c => c !== null);

        const validCentroides = centroides.slice(0, 30);

        svg
          .selectAll("text")
          .data(validCentroides)
          .enter()
          .append("text")
          .attr("x", (d) => d.x)
          .attr("y", (d) => d.y)
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .attr("font-size", (d) => {
            if (selectedDimension === "region" || selectedDimension === "modoFormacion") return "9px";
            if (filtroMunicipio && filtroMunicipio !== "Todos") return "12px";
            if (filtroDepartamento && filtroDepartamento !== "Todos") return "10px";
            return "10px";
          })
          .attr("font-weight", "bold")
          .attr("fill", (d) => d.hasData ? color.white : "#999")
          .style("pointer-events", "none")
          .style("text-shadow", (d) => d.hasData ? "1px 1px 0px rgba(0,0,0,0.5)" : "none")
          .text((d) => d.name);
      }
    } catch (error) {
      console.error("Error al dibujar el mapa:", error);
    }
  }, [
    datosDepto,
    dimensions.width,
    dimensions.height,
    isMobile,
    filtroDepartamento,
    filtroMunicipio,
    esCentroEducativo,
    esServiciosBasicos,
    selectedDimension,
  ]);

  // Calcular posición del tooltip - AHORA usando coordenadas relativas al contenedor
  const calcularPosicionTooltip = () => {
    if (!containerRef.current || !svgRef.current) return { left: 10, top: 10 };

    const tooltipWidth = 200;
    const tooltipHeight = 80;
    const offset = 15;
    
    // Obtener el rectángulo del SVG
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    
    // tooltip.x y tooltip.y son coordenadas relativas al SVG (sin viewBox)
    // Convertir a coordenadas absolutas del viewport
    const absoluteX = svgRect.left + tooltip.x;
    const absoluteY = svgRect.top + tooltip.y;
    
    // Convertir a coordenadas relativas al contenedor
    let relativeX = absoluteX - containerRect.left;
    let relativeY = absoluteY - containerRect.top;
    
    // Posición inicial (cerca del cursor)
    let left = relativeX + offset;
    let top = relativeY - tooltipHeight / 2;
    
    // Ajustar horizontalmente para no salirse del contenedor
    if (left + tooltipWidth > containerRect.width) {
      left = relativeX - tooltipWidth - offset;
    }
    
    // Ajustar verticalmente para no salirse del contenedor
    if (top + tooltipHeight > containerRect.height) {
      top = containerRect.height - tooltipHeight - offset;
    }
    if (top < 0) {
      top = offset;
    }
    
    // Asegurar que no se salga por los bordes izquierdo y derecho
    if (left < 0) {
      left = offset;
    }
    if (left + tooltipWidth > containerRect.width) {
      left = containerRect.width - tooltipWidth - offset;
    }
    
    return { left, top };
  };

  const tooltipPosition = tooltip.visible ? calcularPosicionTooltip() : { left: 0, top: 0 };

  return (
    <Box
      ref={containerRef}
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <svg ref={svgRef} style={{ display: 'block' }}></svg>

      {tooltip.visible && (
        <Box
          sx={{
            position: "absolute",
            left: tooltipPosition.left,
            top: tooltipPosition.top,
            background: `linear-gradient(135deg, ${color.white} 0%, #f5f5f5 100%)`,
            p: { xs: 1, sm: 1.5 },
            borderRadius: 2,
            boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
            pointerEvents: "none",
            minWidth: 130,
            maxWidth: 200,
            borderLeft: `4px solid ${tooltip.valor > 0 ? color.secondary : "#999"}`,
            zIndex: 1000,
            whiteSpace: "normal",
            wordWrap: "break-word",
            transition: "all 0.1s ease",
          }}
        >
          <Typography
            fontWeight="bold"
            sx={{
              color: color.primary,
              fontSize: { xs: "0.75rem", sm: "0.875rem" },
            }}
          >
            {tooltip.nombre}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: tooltip.valor > 0 ? color.secondary : "#999",
              fontWeight: "bold",
              mt: 0.5,
              fontSize: { xs: "0.7rem", sm: "0.8rem" },
            }}
          >
            {tooltip.valor > 0
              ? `Total: ${formatearValor(tooltip.valor)}`
              : "Sin datos disponibles"}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default MapaDinamico;