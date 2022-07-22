import React from "react";

import { ConsultaPrivada } from "../ConsultaPrivada";

export function ProfileCA({ user }) {
  /**
   *  CASO O UTILIZADOR SEJA CONSELHO DE ARBITRAGEM (ADMIN)
   */

  return (
    <div id="profileCA">
      <div id="consultaPrivadaCA">
        <ConsultaPrivada user={user}></ConsultaPrivada>
      </div>

      {/* <div id="listaJogosSemArbitro" hidden>
            <ListaJogosSemArbitros></ListaJogosSemArbitros>
          </div> */}

      <div id="page-wrap-ca"></div>
    </div>
  );
}
