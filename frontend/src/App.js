import React from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import INFOPTABLERO from "./views/Tableros/INFOP";
import SEDUC from "./views/Tableros/SEDUC";
import AcercaDe from "./views/AcercaDe";
import CONEANFOTABLERO from "./views/Tableros/CONEANFO";
import DESUNAH from "./views/Tableros/DesUnah";
import INICIO from "./views/Tableros/Inicio";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
 
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
