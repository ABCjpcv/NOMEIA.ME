import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function Navbar() {
  let navigate = useNavigate();
  let user = Meteor.user();
  if (user != null) {
    Meteor.logout();
  }
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
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
        clubesAfiliadosAVL={true}
        consultaNomeacoesSemanais={true}
        forgotPasswordHeader={true}
        sobreHeader={true}
      />
      <div>
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "space-evenly",
              width: "30%",
              marginTop: "1%",
            }}
          >
            <div className="input" style={{ justifyContent: "center" }}>
              <Button
                style={{ display: "flex", width: "100%" }}
                shape="round"
                size="large"
                className="botao"
                onClick={() => {
                  navigate("/ConsultaNomeacoes");
                }}
              >
                Consulta de Nomeações
              </Button>
            </div>

            <p></p>
            <div className="input" style={{ justifyContent: "flex-start" }}>
              <Button
                style={{ display: "flex", width: "100%" }}
                shape="round"
                size="large"
                className="botao"
                onClick={() => {
                  navigate("/Clubes_da_AVL");
                }}
              >
                Clubes Afiliados à AVL
              </Button>
            </div>
            <p></p>
            <div className="input" style={{ justifyContent: "flex-start" }}>
              <Button
                style={{ display: "flex", width: "100%" }}
                shape="round"
                size="large"
                className="botao"
                onClick={() => {
                  navigate("/Autenticar");
                }}
              >
                Autenticar
              </Button>
            </div>
            <p></p>
            <div className="input" style={{ justifyContent: "flex-start" }}>
              <Button
                style={{ display: "flex", width: "100%" }}
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
        </div>
      </div>
    </div>
  );
}
