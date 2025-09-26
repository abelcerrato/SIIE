import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route, useLocation } from "react-router-dom";

import INFOPTABLERO from "./views/Tableros/INFOP";
import SEDUC from "./views/Tableros/SEDUC";
import AcercaDe from "./views/AcercaDe";
import CONEANFOTABLERO from "./views/Tableros/CONEANFO";
import DESUNAH from "./views/Tableros/DesUnah";
import INICIO from "./views/Tableros/Inicio";
import Login from "./views/Sign-in";
import Layout from "./components/Layout";
import TablaSeguridad from "./views/Seguridad/Permisos/TablaPermisos";
import CrearRolyPermisos from "./views/Seguridad/Permisos/RolyPermisos";
import ModificarRolyPermisos from "./views/Seguridad/Permisos/ModificarRolyPermisos";
import "./App.css";

function App() {
  const location = useLocation();

  const rutasConLayoutPublico = [
    "/",
    "/ACERCA-DE",
    "/SEDUC",
    "/INFOP",
    "/CONEANFO",
    "/DES-UNAH",
  ];

  const mostrarLayoutPublico = rutasConLayoutPublico.includes(
    location.pathname
  );

  return (
    <div className="app">
      {mostrarLayoutPublico && <Navbar />}

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<INICIO />} />
        <Route path="/ACERCA-DE" element={<AcercaDe />} />
        <Route path="/SEDUC" element={<SEDUC />} />
        <Route path="/INFOP" element={<INFOPTABLERO />} />
        <Route path="/CONEANFO" element={<CONEANFOTABLERO />} />
        <Route path="/DES-UNAH" element={<DESUNAH />} />
        <Route path="/Login" element={<Login />} />

        {/* Rutas con Layout interno (Dashboard) */}
        <Route path="/Dashboard" element={<Layout />}>
          <Route path="Seguridad" element={<TablaSeguridad />} />
          <Route
            path="Seguridad/CrearRolyPermisos"
            element={<CrearRolyPermisos />}
          />
          <Route
            path="Seguridad/ModificarRolyPermisos/:id"
            element={<ModificarRolyPermisos />}
          />
        </Route>
      </Routes>

      {mostrarLayoutPublico && <Footer />}
    </div>
  );
}

export default App;
