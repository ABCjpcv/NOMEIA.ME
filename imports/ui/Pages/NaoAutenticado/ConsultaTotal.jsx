import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { colunasNomeacoes } from "../../../api/NaoAutenticado/colunasNomeacoes";
import { useTableSearch } from "../../../api/useTableSearch";
import "antd/dist/antd.css";
import { Header } from "../Geral/Header";

const { Search } = Input;

let fetchUsers = async () => {
  const { data } = await axios.get("Livro.json");
  return { data };
};

export function ConsultaTotal() {
  const [searchVal, setSearchVal] = useState(null);

  const [dataSource, setDataSource] = useState([]);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: { dataSource },
  });

  function loadData() {
    user = Meteor.user();
    let email = user.emails[0].address;

    //console.log("email", email);
    Meteor.call("carregaNomeacoesTotal", (err, result) => {
      //console.log("resultado de carregaNomeacoes da BD:", result);
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result) {
        if (result.length > 0) {
          let resultadosFromDB = [];

          result.forEach((element) => {
            let nomeacoes = element.nomeacoesPrivadas;
            nomeacoes.forEach((element) => {
              resultadosFromDB.push(element);
            });
          });

          setDataSource(resultadosFromDB);
        }
      } else {
        setDataSource([]);
      }
    });
  }

  if (dataSource.length == 0) loadData();

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
        historico={true}
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
