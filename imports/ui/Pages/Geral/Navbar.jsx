import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function Navbar() {
  let navigate = useNavigate();
  return (
    <div>
      <Header
        user={Meteor.user()}
        titulo={false}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={true}
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
      />
      <div style={{ marginTop: "1%" }}>
        <div
          className="botao"
          onClick={() => {
            navigate("/ConsultaNomeacoes");
          }}
        >
          Consulta de Nomeações
        </div>
        <p></p>
        <div
          className="botao"
          onClick={() => {
            navigate("/Clubes_da_AVL");
          }}
        >
          Clubes Afiliados à AVL
        </div>
        <p></p>
        <div
          className="botao"
          onClick={() => {
            navigate("/Autenticar");
          }}
        >
          Autenticar
        </div>
        <p></p>
        <div
          className="botao"
          onClick={() => {
            navigate("/Sobre");
          }}
        >
          Sobre
        </div>
      </div>
    </div>
  );
}
