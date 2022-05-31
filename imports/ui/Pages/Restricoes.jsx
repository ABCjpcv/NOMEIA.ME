import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { listaClubesColumns } from "./listaClubesColumns";
import { useTableSearch } from "./useTableSearch";
import "antd/dist/antd.css";

const { Search } = Input;

const fetchUsers = async () => {
  const { data } = await axios.get("ClubesAVLnomes.json");
  return { data };
};

export function Restricoes() {
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers,
  });

  return (
    <div
      className="demo-app"
      style={{ height: "10%", width: "915px", float: "right" }}
    >
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>Marcação de Restrições:</h2>
        </div>
      </div>
      <div>
        <div className="demo-app-main" style={{ overflow: "auto" }}>
          <form>
            <div
              style={{
                paddingLeft: "40px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <label style={{ float: "left" }}>
                Emito Recibos Verdes:
                <input type="checkbox" id="check_recibos_sim" value={"SIM"} />
                Sim
                <input type="checkbox" id="check_recibos_nao" value={"NAO"} />
                Não
              </label>
              <br></br>
              <label>
                Tenho transporte próprio:
                <input
                  type="checkbox"
                  id="check_transporte_sim"
                  value={"SIM"}
                />
                Sim
                <input
                  type="checkbox"
                  id="check_transporte_nao"
                  value={"NAO"}
                />{" "}
                Não
              </label>
              <br></br>
              <label> Relações com clubes: </label>
              <Search
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Search"
                enterButton
                style={{
                  position: "sticky",
                  top: "0",
                  left: "0",
                  width: "200px",
                  marginTop: "2vh",
                }}
              />
              <br /> <br />
              <Table
                rowKey="name"
                dataSource={filteredData}
                columns={listaClubesColumns}
                loading={loading}
                pagination={false}
              />
            </div>

            <br></br>
            <input type="submit" value="Submeter" />
          </form>
        </div>
      </div>
    </div>
  );
}
