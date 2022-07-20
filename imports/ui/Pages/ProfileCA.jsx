import React from "react";

import "./app.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";
import { FileInput } from "./FileInput";
import { ListaJogosSemArbitros } from "./ListaJogosSemArbitros";
import { AtribuirJogos } from "./AtribuirJogos";
import { UserSettings } from "./UserSettings";
import { ContaNova } from "./ContaNova";

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
