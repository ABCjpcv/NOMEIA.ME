import React from "react";
import { Header } from "../Geral/Header";
import { ConsultaTotal } from "./ConsultaTotal";

export const ConsultaNomeacoes = () => {
  return (
    <>
      {/* <Header
        user={Meteor.user()}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={true}
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
      /> */}
      <div>
        <div id="consulta">
          <ConsultaTotal></ConsultaTotal>
        </div>
      </div>
    </>
  );
};
