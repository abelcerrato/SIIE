import React from "react";
import Sidebar from "./Sidebar";

const MainContent = () => {
  return (
    <div className="main-container">
      <main className="content">
        <h2>Contenido Principal</h2>
        <p>¡Bienvenido a mi aplicación React!</p>
      </main>
      <Sidebar />
    </div>
  );
};

export default MainContent;
