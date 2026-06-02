import mapaHonduras from "../../../components/Mapas-JSon/mapahondurastopo";
import atlantida from "../../../components/Mapas-JSon/atlantida";
import cortes from "../../../components/Mapas-JSon/cortes";
import yoro from "../../../components/Mapas-JSon/yoro";
import elParaiso from "../../../components/Mapas-JSon/el_paraiso";
import colon from "../../../components/Mapas-JSon/colon";
import comayagua from "../../../components/Mapas-JSon/comayagua";
import copan from "../../../components/Mapas-JSon/copan";
import choluteca from "../../../components/Mapas-JSon/choluteca";
import franciscoMorazan from "../../../components/Mapas-JSon/francisco_morazan";
import graciasDios from "../../../components/Mapas-JSon/gracias_dios";
import intibuca from "../../../components/Mapas-JSon/intibuca";
import islasBahia from "../../../components/Mapas-JSon/islas_bahia";
import laPaz from "../../../components/Mapas-JSon/la_paz";
import lempira from "../../../components/Mapas-JSon/lempira";
import ocotepeque from "../../../components/Mapas-JSon/ocotepeque";
import olancho from "../../../components/Mapas-JSon/olancho";
import santaBarbara from "../../../components/Mapas-JSon/santa_barbara";
import valle from "../../../components/Mapas-JSon/valle";

// ==================== CONFIGURACIÓN DE REGIONES ====================
// Mapeo de regiones a colores
export const COLORES_POR_REGION = {
  "REGION LITORAL ATLANTICO": "#5aa9e6",   
  "REGION NOROCCIDENTAL": "#0e6ba8",     
  "REGION CENTRAL": "#1282a2",            
  "REGION SUR": "#244E9E",                
  "REGION OLANCHO": "#244E9E",           
  "OTRA": "#9E9E9E",                      
};

// Mapeo de departamentos a regiones
export const REGIONES_POR_DEPARTAMENTO = {
  "ATLÁNTIDA": "REGION LITORAL ATLANTICO",
  "COLÓN": "REGION LITORAL ATLANTICO",
  "GRACIAS A DIOS": "REGION LITORAL ATLANTICO",
  "ISLAS DE LA BAHÍA": "REGION LITORAL ATLANTICO",
  "YORO": "REGION LITORAL ATLANTICO",
  "CORTÉS": "REGION NOROCCIDENTAL",
  "SANTA BÁRBARA": "REGION NOROCCIDENTAL",
  "OCOTEPEQUE": "REGION NOROCCIDENTAL",
  "LEMPIRA": "REGION NOROCCIDENTAL",
  "INTIBUCÁ": "REGION NOROCCIDENTAL",
  "COPÁN": "REGION NOROCCIDENTAL",
  "FRANCISCO MORAZÁN": "REGION CENTRAL",
  "EL PARAÍSO": "REGION CENTRAL",
  "LA PAZ": "REGION CENTRAL",
  "COMAYAGUA": "REGION CENTRAL",
  "VALLE": "REGION SUR",
  "CHOLUTECA": "REGION SUR",
  "OLANCHO": "REGION OLANCHO",
};

// Lista de regiones disponibles
export const REGIONES_DISPONIBLES = [
  "REGION LITORAL ATLANTICO",
  "REGION NOROCCIDENTAL",
  "REGION CENTRAL",
  "REGION SUR",
  "REGION OLANCHO",
];

// Función para obtener la región de un departamento
export const obtenerRegionPorDepartamento = (departamento) => {
  if (!departamento) return "OTRA";
  return REGIONES_POR_DEPARTAMENTO[departamento.toUpperCase()] || "OTRA";
};

// Función para obtener el color de una región
export const obtenerColorRegion = (region) => {
  return COLORES_POR_REGION[region] || COLORES_POR_REGION["OTRA"];
};

// Normalizador de nombres para mapas (minúsculas, sin acentos, guiones bajos)
export const normalizarMapa = (texto) => {
  if (!texto) return "";
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\s]/g, "_")
    .replace(/[^a-z0-9_]/g, "");
};

// Normalizador para comparar nombres de municipios (mayúsculas, sin acentos, sin espacios)
export const normalizarNombre = (texto) => {
  if (!texto) return "";
  return texto
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
};

// Mapa de departamentos a sus archivos JSON
export const MAPAS_DEPARTAMENTALES = {
  "atlántida": atlantida,
  "atlantida": atlantida,
  "cortés": cortes,
  "cortes": cortes,
  "yoro": yoro,
  "el_paraíso": elParaiso,
  "el_paraiso": elParaiso,
  "colón": colon,
  "colon": colon,
  "comayagua": comayagua,
  "copán": copan,
  "copan": copan,
  "choluteca": choluteca,
  "francisco_morazán": franciscoMorazan,
  "francisco_morazan": franciscoMorazan,
  "gracias_a_dios": graciasDios,
  "intibucá": intibuca,
  "intibuca": intibuca,
  "islas_de_la_bahía": islasBahia,
  "islas_de_la_bahia": islasBahia,
  "la_paz": laPaz,
  "lempira": lempira,
  "ocotepeque": ocotepeque,
  "olancho": olancho,
  "santa_bárbara": santaBarbara,
  "santa_barbara": santaBarbara,
  "valle": valle,
};

// Mapa de Honduras completo
export const MAPA_HONDURAS = mapaHonduras;

// Función para obtener el mapa según el departamento seleccionado
export const obtenerMapa = (departamento) => {
  if (!departamento || departamento === "Todos") {
    return MAPA_HONDURAS;
  }
  
  const nombreNormalizado = normalizarMapa(departamento);
  return MAPAS_DEPARTAMENTALES[nombreNormalizado] || MAPA_HONDURAS;
};

// Función para obtener el objeto específico dentro del TopoJSON
export const obtenerObjetoMapa = (mapa, departamento) => {
  if (!departamento || departamento === "Todos") {
    return mapa.objects["mapa honduras"];
  }
  
  const objetos = Object.keys(mapa.objects);
  return mapa.objects[objetos[0]];
};