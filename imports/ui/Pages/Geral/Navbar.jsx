import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function Navbar() {
  let navigate = useNavigate();

  // function mostraTitulo() {
  //   try {
  //     document.getElementById("titulo").hidden = false;
  //     document.getElementById("nomeacoesPrivadas").hidden = true;
  //     document.getElementById("indisponibilidadePrivadas").hidden = true;
  //     document.getElementById("restricoesPrivadas").hidden = true;
  //   } catch (error) {}
  // }

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
