import React from "react";
import { useNavigate } from "react-router-dom";

export const ConsultaNomeacoes = () => {
  
  let navigate = useNavigate();

  return (
    <div>
      <h1 className="blue"> Nomeações Semanais: </h1>
      <div>
        <button onClick={() => navigate("/")}>HomePage 🏠</button>
        <input type={"text"}></input>
        <button>Pesquisar 🔎</button>
      </div>
    </div>
  );
};
