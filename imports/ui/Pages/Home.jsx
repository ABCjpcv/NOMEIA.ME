import React from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  let navigate = useNavigate();

  function mostraTitulo() {
    try {
      document.getElementById("titulo").hidden = false;
      document.getElementById("nomeacoesPrivadas").hidden = true;
      document.getElementById("indisponibilidadePrivadas").hidden = true;
      document.getElementById("restricoesPrivadas").hidden = true;
    } catch (error) {}
  }

  return (
    <div>
      <h1 className="blue">Bem-vindo</h1>
      <div>
        <div
          className="botao"
          onClick={() => {
            mostraTitulo(), navigate("/ConsultaNomeacoes");
          }}
        >
          Consulta de Nomeações
        </div>
        <p></p>
        <div
          className="botao"
          onClick={() => {
            mostraTitulo(), navigate("/Clubes_da_AVL");
          }}
        >
          Clubes Afiliados à AVL
        </div>
        <p></p>
        <div
          className="botao"
          onClick={() => {
            mostraTitulo(), navigate("/Autenticar");
          }}
        >
          Autenticar
        </div>
        <p></p>
        <div
          className="botao"
          onClick={() => {
            mostraTitulo(), navigate("/Sobre");
          }}
        >
          Sobre
        </div>
      </div>
    </div>
  );
}
