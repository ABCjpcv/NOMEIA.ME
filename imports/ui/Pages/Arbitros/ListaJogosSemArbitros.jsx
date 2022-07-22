import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { useTableSearch } from "../../../api/useTableSearch";
import "antd/dist/antd.css";

const { Search } = Input;

const fetchLeftOverGames = async () => {
  const { data } = await axios.get("Livro.json");
  return { data };
};

export function listaJogosSemArbitros() {
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchLeftOverGames,
  });

  return (
    <>
      <div>
        <h1 className="blue"> Jogos sem árbitro </h1>
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
