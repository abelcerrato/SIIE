import React from "react";

import Layout from "./Layout";
const PowerBIView = () => {
  return (

    <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
      <iframe
        title="Conexion_A_Base"
        width="100%"
        height="836"
        src="https://app.powerbi.com/view?r=eyJrIjoiYTVjNWU3NzgtMWY4Zi00NDM5LTk4NTUtNWJmNWM1NWFjYWViIiwidCI6IjI5MjY3MDJhLWZhZTctNDY5Yi04OWVmLTQwOGY2ZTJkMzliNiJ9"
        frameborder="0"
        allowFullScreen="true"
      ></iframe>
    </div>
  );
};

export default PowerBIView;
