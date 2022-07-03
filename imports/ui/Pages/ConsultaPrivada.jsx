import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { colunasNomeacoesPrivadas } from "./colunasNomeacoesPrivadas";
import { useTableSearch } from "./useTableSearch";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";

const fetchData = async () => {
  const { data } = await axios.get("Livro.json");
  return { data };
};

export function ConsultaPrivada() {
  let [searchVal] = useState(
    Meteor.user() == undefined ? "" : Meteor.user().username
  );

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchData,
  });

  return (
    <div
      className="demo-app"
      style={{ height: "10%", width: "auto", alignSelf: "center" }}
    >
      <div className="demo-app-sidebar"></div>
      <div>
        <div className="demo-app-main" style={{ overflow: "auto" }}>
          <div className="container">
            <div className="table-responsive">
              <br />
              <Table
                rowKey="name"
                dataSource={filteredData}
                columns={colunasNomeacoesPrivadas}
                loading={loading}
                pagination={false}
              />
              <span
                style={{
                  marginLeft: 8,
                }}
              >
                
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
