import React from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  let navigate = useNavigate();

  function mostraTitulo(){
    document.getElementById("titulo").hidden = false;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("RestricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = true;
    
  }

  return (
    <div>
      <h1 className="blue">Bem-vindo</h1>
      <div>
        <div className="botao" onClick={() => {mostraTitulo(), navigate("/ConsultaNomeacoes")}}>
          <p>Consulta de Nomeações</p>
        </div>
        <p></p>
        <div className="botao" onClick={() => {mostraTitulo(), navigate("/ContaNova")}}>
          Criar Conta Nova
        </div>
        <p></p>
        <div className="botao" onClick={() => {mostraTitulo(), navigate("/Autenticar")}}>
          Autenticar
        </div>
        <p></p>
        <div className="botao" onClick={() => {mostraTitulo(), navigate("/Sobre")}}>
          Sobre
        </div>
      </div>
    </div>
  );
}
