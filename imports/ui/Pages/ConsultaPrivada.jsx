import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { userColumns } from "./userColumns";
import { useTableSearch } from "./useTableSearch";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";
import { useEffect } from "react/cjs/react.production.min";

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

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", selectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

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
                rowSelection={rowSelection}
                columns={userColumns}
                loading={loading}
                pagination={false}
              />
              <span
                style={{
                  marginLeft: 8,
                }}
              >
                <br></br>
                {hasSelected
                  ? `Confirmar ${selectedRowKeys.length} jogos selecionados?`
                  : "Nenhum jogo selecionado"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
