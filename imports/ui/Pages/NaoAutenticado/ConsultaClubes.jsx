import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { colunasClubesAfiliados } from "../../../api/NaoAutenticado/colunasClubesAfiliados";
import { useTableSearch } from "../../../api/useTableSearch";
import "antd/dist/antd.css";

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
      <div>
        <h1 className="blue"> Clubes Afiliados à AVL </h1>
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
          columns={colunasClubesAfiliados}
          loading={loading}
          pagination={false}
        />
      </div>
    </>
  );
}
