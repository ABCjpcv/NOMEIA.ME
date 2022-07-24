import React from "react";
import { Header } from "../Geral/Header";
import { ConsultaClubes } from "./ConsultaClubes";

export const Clubes_da_AVL = () => {
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
        <div id="consultaClubes">
          <ConsultaClubes></ConsultaClubes>
        </div>
      </div>
    </>
  );
};
