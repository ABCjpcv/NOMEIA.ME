import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { colunasClubesAfiliados } from "../../../api/NaoAutenticado/colunasClubesAfiliados";
import { useTableSearch } from "../../../api/useTableSearch";
import "antd/dist/antd.css";
import { Header } from "../Geral/Header";

const { Search } = Input;

const fetchUsers = async () => {
  const { data } = await axios.get("ClubesAVL_info.json");
  console.log("data", data);
  return { data };
};

export function ConsultaClubes() {
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
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
        clubesAfiliadosAVL={false}
        consultaNomeacoesSemanais={true}
        forgotPasswordHeader={true}
        sobreHeader={true}
      />
      <div style={{ marginTop: "0.5%" }}>
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="input">
            <label className="labels">
              <Search
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Clube / Email / Contacto... "
                enterButton
                style={{
                  position: "sticky",
                  top: "0",
                  left: "0",
                  width: "300px",
                  marginTop: "0.5%",
                  flexDirection: "none",
                  justifyContent: "space-evenly",
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
            size="small"
            dataSource={filteredData}
            columns={colunasClubesAfiliados}
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
