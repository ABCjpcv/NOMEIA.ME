import React from "react";
import { Header } from "../../Geral/Header";
import { ConsultaPrivada } from "../ConsultaPrivada";

export function ProfileCA({ user }) {
  /**
   *  CASO O UTILIZADOR SEJA CONSELHO DE ARBITRAGEM (ADMIN)
   */

  return (
    <>
      <Header
        user={user}
        titulo={true}
        consultaPrivada={false}
        menuPrivado={true}
        menuPrivadoCA={false}
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
      <div id="profileCA">
        <div id="consultaPrivadaCA">
          <ConsultaPrivada user={user}></ConsultaPrivada>
        </div>

        {/* <div id="listaJogosSemArbitro" hidden>
            <ListaJogosSemArbitros></ListaJogosSemArbitros>
          </div> */}

        <div id="page-wrap-ca"></div>
      </div>
    </>
  );
}
