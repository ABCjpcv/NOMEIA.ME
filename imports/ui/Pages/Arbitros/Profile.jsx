import React from "react";

import { Header } from "../Geral/Header";
import "../../../../imports/ui/Pages/app.css";
import { ConsultaPrivada } from "./ConsultaPrivada";

export function Profile({ user }) {
  return (
    <div>
      <Header
        user={user}
        titulo={true}
        consultaPrivada={false}
        menuPrivado={false}
        menuPrivadoCA={true}
        atribuirArbitrosAdesl={true}
        atribuirArbitrosCev={true}
        atribuirArbitrosCR_CN={true}
        carregarJogos={true}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
        forgotPasswordHeader={true}
      />
      <div id="profile">
        <div id="consultaPrivada">
          <ConsultaPrivada user={user}></ConsultaPrivada>
        </div>

        <div id="page-wrap"></div>
      </div>
    </div>
  );
}
