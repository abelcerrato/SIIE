import React from "react";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import INFOPTABLERO from "./vistas/INFOP";
import SEDUC from "./vistas/SEDUC";
import AcercaDe from "./vistas/AcercaDe";
import CONEANFOTABLERO from "./vistas/CONEANFO";
import DESUNAH from "./vistas/DesUnah";
import INICIO from "./vistas/Inicio";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      {/*<Header />*/}
      <Routes>
        <Route path="/" element={<INICIO />} />
        <Route path="/ACERCA-DE" element={<AcercaDe />} />
        <Route path="/SEDUC" element={<SEDUC />} />
        <Route path="/INFOP" element={<INFOPTABLERO />} />
        <Route path="/CONEANFO" element={<CONEANFOTABLERO />} />
        <Route path="/DES-UNAH" element={<DESUNAH />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
