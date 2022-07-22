import React from "react";

export const Sobre = () => {
  return (
    <div>
      <h1 className="blue"> Sobre mim: </h1>
      <div style={{ margin: "auto", display: "flex", maxWidth: "1200px" }}>
        <div style={{ width: "30%" }}>
          <img className="criador" src="criador.jpg"></img>
        </div>
        <div className="right" style={{ width: "70%" }}>
          <p>
            {" "}
            André Brás Correia, de 24 anos de idade é árbitro federado de nível
            III de Voleibol de Pavilhão.
          </p>
          <p>
            {" "}
            Com licenciatura em Engenharia Informática na Faculdade de Ciências
            da Universidade de Lisboa, investiu numa tese auto-proposta para a
            reforma do sistema de nomeações atual./
          </p>
          <p>
            {" "}
            A ausência de automatização de nomeações de árbitros de voleibol
            provoca embaraços aos responsáveis que manualmente as implementam,
            sem grande adaptação tecnológica, correndo o risco de existirem
            jogos sem árbitro.
          </p>
          <p>
            {" "}
            O processo de nomeação é difícil de gerir quando alterações são
            frequentemente realizadas devido a cancelamentos de equipas ou do
            pavilhão sendo que a atribuição de árbitros aos jogos dependem das
            suas disponibilidades e condicionantes.
          </p>
          <p>
            {" "}
            O proposto com este trabalho é atingir uma plataforma online, web e
            mobile que irá automatizar este processo.
          </p>
          <p>
            {" "}
            A plataforma designada Nomeia.Me, oferecerá uma melhor gestão e
            controlo da nomeação dos árbitros, permitindo o alerta e a
            confirmação das várias entidades associadas ao jogo, resultando no
            desenvolvimento da modalidade desportiva.
          </p>
        </div>
      </div>
    </div>
  );
};
