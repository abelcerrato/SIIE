import React from "react";

const PowerBIView = () => {
  return (
    <div style={{ padding: "2rem", display: "flex", justifyContent: "center" }}>
      <iframe
        title="PrimerPowerBI"
        width="100%"
        height="800"
        src="https://app.powerbi.com/view?r=eyJrIjoiNjA0NGY2NjgtZjUzMy00MmU4LWFjZjctZjQzZDY0ODgzMTMxIiwidCI6IjI5MjY3MDJhLWZhZTctNDY5Yi04OWVmLTQwOGY2ZTJkMzliNiJ9"
        frameborder="0"
        allowFullScreen="true"
      ></iframe>
    </div>
  );
};

export default PowerBIView;
