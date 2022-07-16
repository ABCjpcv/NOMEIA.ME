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
      <div id="carregarFicheiroJogos" hidden>
        <h1 className="blue"> Inserir ficheiro com tabela de jogos </h1>
        <FileInput></FileInput>
      </div>

      <div id="atribuirArbitrosAjogos" hidden>
        <AtribuirJogos user={user}></AtribuirJogos>
      </div>

      <div id="indisponibilidadesCA" hidden>
        <Indisponibilidades></Indisponibilidades>
      </div>

      <div id="restricoesCA" hidden>
        <Restricoes user={user}></Restricoes>
      </div>

      <div id="consultaPrivadaCA">
        <ConsultaPrivada user={user}></ConsultaPrivada>
      </div>

      <div id="definicoesCA" hidden>
        <UserSettings user={user}></UserSettings>
      </div>

      <div id="criarArbitro" hidden>
        <ContaNova></ContaNova>
      </div>

      {/* <div id="listaJogosSemArbitro" hidden>
            <ListaJogosSemArbitros></ListaJogosSemArbitros>
          </div> */}

      <div id="page-wrap-ca"></div>
    </div>
  );
}
