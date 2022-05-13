import React from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  let navigate = useNavigate();

  return (
    <div >
      <h1 className="blue">Bem-vindo</h1>
      <div>
        <div className="botao" onClick={() => navigate("/ConsultaNomeacoes")}>
          <p>Consulta de Nomeações</p>
        </div>
        <p></p>
        <div className="botao" onClick={() => navigate("/ContaNova")}>Criar Conta Nova</div>
        <p></p>
        <div className="botao" onClick={() => navigate("/Autenticar")}>Autenticar</div>
        <p></p>
        <div className="botao" onClick={() => navigate("/Sobre")}>Sobre</div>
      </div>
    </div>
  );
}
