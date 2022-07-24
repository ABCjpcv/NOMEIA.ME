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
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
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
