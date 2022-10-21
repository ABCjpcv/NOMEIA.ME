import React from "react";
import { Header } from "../Geral/Header";

export const Sobre = () => {
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
      <h1 className="blue" style={{ fontWeight: "100", fontSize: "22px" }}>
        Sobre:
      </h1>
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          width: "45%",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <img
            className="criador"
            style={{ width: "30%" }}
            src="criador.jpg"
          ></img>
          <h4 style={{ marginLeft: "2%" }}>
            <p style={{ textAlign: "start" }}>
              André Brás Correia, 24 anos, árbitro de voleibol <i>indoor</i>.{" "}
              <h6></h6>Licenciado em Engenharia Informática na Faculdade de
              Ciências da Universidade de Lisboa, apostou numa tese autoproposta
              de nomeação de árbitros para a reforma do atual sistema de
              nomeação.
            </p>
            <p style={{ textAlign: "end" }}>
              A ausência de automatização nas nomeações de árbitros de voleibol
              dificulda a tarefa aos responsáveis que as implementam
              manulamnete, sem grande adaptação tecnológica com o risco de
              existirem jogos sem árbitros. <h6></h6> Existem alterações
              realizadas com frequência, das equipas ou do próprio pavilhão e
              considerar a deslocação dos árbitros aos jogos, as suas
              disponibilidades e restrições.
            </p>
          </h4>
          <h6></h6>
        </div>
        <div>
          <h4 style={{ textAlign: "justify" }}>
            <p>Isto torna o processo de nomeação exaustivo de gerir.</p>
            <h6></h6> O objetivo? Uma plataforma online, web e mobile que ajude
            a automatizar este processo.{" "}
            <b>
              'Nomeia.Me - Plataforma Online de Nomeação de Árbitros de
              Voleibol'
            </b>{" "}
            oferece uma melhor gestão e controlo da nomeação de árbitros,
            permitindo alertas e confirmação das entidades associadas ao jogo
            desenvolvendo a modalidade que tanto gostamos.
          </h4>
        </div>
      </div>
    </div>
  );
};
