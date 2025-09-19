import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        textAlign: "center",
        padding: "1rem",
        backgroundColor: "#88CFE0",
      }}
    >
      <p>
        &copy; {new Date().getFullYear()} Sistema Integrado de Información
        Educativa SIIE. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
