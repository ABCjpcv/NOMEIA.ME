import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { colunasNomeacoes } from "../../../api/NaoAutenticado/colunasNomeacoes";
import { useTableSearch } from "../../../api/useTableSearch";
import "antd/dist/antd.css";

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
      <div>
        <h1 className="blue">Nomeações Semanais</h1>
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
          columns={colunasNomeacoes}
          loading={loading}
          pagination={false}
        />
      </div>
    </>
  );
}
