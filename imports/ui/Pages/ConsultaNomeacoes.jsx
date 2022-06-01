import React from "react";
import { useNavigate } from "react-router-dom";
import { ConsultaTotal } from "./ConsultaTotal";

export const ConsultaNomeacoes = () => {
  let navigate = useNavigate();

  return (
    <div>
      
      <div>
        <button onClick={() => navigate("/")}>HomePage 🏠</button>
      </div>
      <div id="consulta">
        <ConsultaTotal></ConsultaTotal>
      </div>
    </div>
  );
};
