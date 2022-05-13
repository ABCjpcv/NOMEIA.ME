import React from "react";

export class EscolhaArbitros extends React.Component {
  render() {
    return (
      <div>
        Jogos:
        <div>
          {" "}
          AQUI VÃO ESTAR OS JOGOS LISTADOS, O CA ESCOLHE UM JOGO E A LISTA DE
          ARBITROS MUDA CONFORME AS NECESSIDADES DO CA{" "}
        </div>
        Filtros:
        <div>
          Nível de árbitro:
          <select id="nivelArbitro" name="clubes">
            <option value="I">I</option>
            <option value="II">II</option>
            <option value="III">III</option>
          </select>
        </div>
        <div>
          Trasnsporte Próprio:
          <input type="checkbox" id="tem_transporte_sim" value={"SIM"} /> Sim
          <input type="checkbox" id="tem_transporte_nao" value={"NAO"} /> Não
        </div>
        <div>
          AQUI VAI ESTAR LISTAGEM DOS ÁRBITROS DISPONIVEIS CONFORME O JOGO
          ESCOLHIDO
        </div>
      </div>
    );
  }
}
