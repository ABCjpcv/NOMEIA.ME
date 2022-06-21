import  React from "react";

export const listaClubesColumns = [
  {
    title: "Clube",
    dataIndex: "Clube",
    key: "Clube"
  },
  {
    title: "Restrição",
    dataIndex: "Restrição",
    key: "Restrição",
    render: () => (
      <div style={{ width: "auto" }}>
        <select name="restricao">
          <option value="Nenhuma"> </option>
          <option value="Treinador">Treinador</option>
          <option value="Atleta">Atleta</option>
          <option value="Dirigente">Dirigente</option>
          <option value="Outro">Outro</option>
        </select>
      </div>
    )
  },
  {
    title: "Descrição",
    dataIndex: "Descrição",
    key: "Descrição",
    render: () => (
      <div style={{ width: "auto" }}>
        <input type="text" name="descricao"></input>
      </div>
    )
  }
];