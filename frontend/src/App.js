import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProtectedRoute from "./components/ProtectedRoute";
import { Routes, Route, useLocation } from "react-router-dom";

import AcercaDe from "./views/AcercaDe";
import INICIO from "./views/Tableros/Inicio";
import INFOPTABLERO from "./views/Tableros/INFOP";
import SEDUCTABLERO from "./views/Tableros/SEDUC";
import CONEANFOTABLERO from "./views/Tableros/CONEANFO";
import DESUNAHTABLERO from "./views/Tableros/DesUnah";

import Login from "./views/Sign-in";
import Layout from "./components/Layout";
import TablaSeguridad from "./views/Seguridad/Permisos/TablaPermisos";
import Usuarios from "./views/Seguridad/Usuarios/TablaUsuarios";

import SEDUCD from "./views/Descargas/SEDUC-D";
import INFOPD from "./views/Descargas/INFOP-D";
import DESUNAHD from "./views/Descargas/DESUNAH-D";
import CONEANFOD from "./views/Descargas/CONEANFO-D";
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
        <Route path="/SEDUC" element={<SEDUCTABLERO />} />
        <Route path="/INFOP" element={<INFOPTABLERO />} />
        <Route path="/CONEANFO" element={<CONEANFOTABLERO />} />
        <Route path="/DES-UNAH" element={<DESUNAHTABLERO />} />
        <Route path="/Login" element={<Login />} />

        {/* Rutas con Layout interno (Dashboard) */}
        <Route
          path="/Dashboard"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="Administracion/Usuarios" element={<Usuarios />} />
          <Route
            path="Administracion/RolesyPermisos"
            element={<TablaSeguridad />}
          />
          <Route path="Descargas/SEDU" element={<SEDUCD />} />
          <Route path="Descargas/INFOP" element={<INFOPD />} />
          <Route path="Descargas/DES-UNAH" element={<DESUNAHD />} />
          <Route path="Descargas/CONEANFO" element={<CONEANFOD />} />
        </Route>
      </Routes>

      {mostrarLayoutPublico && <Footer />}
    </div>
  );
}

export default App;
