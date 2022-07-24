import React from "react";
import { Button, Result } from "antd";

import { useNavigate } from "react-router-dom";
import { Header } from "./Header";

export function NotFoundPage() {
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
      <div
        style={{
          width: "50%",
          height: "50%",
          display: "flex",
          alignContent: "space-evenly",
          marginLeft: "35%",
          marginTop: "-3%",
        }}
      >
        <Result
          width="10%"
          status="404"
          title="404"
          subTitle="Desculpe, a página que tentou visitar não existe."
          extra={
            <Button
              type="primary"
              onClick={() => {
                navigate("/");
              }}
            >
              Voltar à página inicial
            </Button>
          }
        />
      </div>
    </div>
  );
}
