import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { colunasNomeacoes } from "../../../api/NaoAutenticado/colunasNomeacoes";
import { useTableSearch } from "../../../api/useTableSearch";
import "antd/dist/antd.css";
import { Header } from "../Geral/Header";

const { Search } = Input;

const fetchUsers = async () => {
  const { data } = await axios.get("Livro.json");
  return { data };
};

export function ConsultaTotal() {
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers,
  });

  return (
    <>
      <Header
        user={Meteor.user()}
        titulo={true}
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
        clubesAfiliadosAVL={true}
        consultaNomeacoesSemanais={false}
        forgotPasswordHeader={true}
        sobreHeader={true}
      />
      <div>
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="input">
            <label
              className="labels"
              style={{ display: "flex", alignSelf: "space-evenly" }}
            >
              <Search
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Pesquisa"
                enterButton
                style={{
                  position: "sticky",
                  width: "100%",
                }}
              />
            </label>
          </div>
        </div>
        <div
          style={{ marginTop: "0.5%", marginLeft: "0.5%", marginRight: "0.5%" }}
        >
          <Table
            rowKey="name"
            dataSource={filteredData}
            columns={colunasNomeacoes}
            loading={loading}
            pagination={false}
            scroll={{
              y: "70vh",
            }}
          />
        </div>
      </div>
    </>
  );
}
