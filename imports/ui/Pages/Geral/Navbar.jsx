import { Button } from "antd";
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
        clubesAfiliadosAVL={true}
        consultaNomeacoesSemanais={true}
        forgotPasswordHeader={true}
        sobreHeader={true}
      />
      <div style={{ marginTop: "1%" }}>
        <Button
          style={{ display: "flex" }}
          shape="round"
          size="large"
          className="botao"
          onClick={() => {
            navigate("/ConsultaNomeacoes");
          }}
        >
          Consulta de Nomeações
        </Button>
        <p></p>
        <Button
          style={{ display: "flex" }}
          shape="round"
          size="large"
          className="botao"
          onClick={() => {
            navigate("/Clubes_da_AVL");
          }}
        >
          Clubes Afiliados à AVL
        </Button>
        <p></p>
        <Button
          style={{ display: "flex" }}
          shape="round"
          size="large"
          className="botao"
          onClick={() => {
            navigate("/Autenticar");
          }}
        >
          Autenticar
        </Button>
        <p></p>
        <Button
          style={{ display: "flex" }}
          shape="round"
          size="large"
          className="botao"
          onClick={() => {
            navigate("/Sobre");
          }}
        >
          Sobre
        </Button>
      </div>
    </div>
  );
}
