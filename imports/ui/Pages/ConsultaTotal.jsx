import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { userColumns } from "./userColumns";
import { useTableSearch } from "./useTableSearch";
import "antd/dist/antd.css";

const { Search } = Input;

const fetchUsers = async () => {
  const { data } = await axios.get("Livro.json")

  console.log(data);

  return { data };
};

export function ConsultaTotal() {
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers
  });

  return (
    <>
      <Search
        onChange={(e) => setSearchVal(e.target.value)}
        placeholder="Search"
        enterButton
        style={{
          position: "sticky",
          top: "0",
          left: "0",
          width: "200px",
          marginTop: "2vh"
        }}
      />
      <br /> <br />
      <Table
        rowKey="name"
        dataSource={filteredData}
        columns={userColumns}
        loading={loading}
        pagination={false}
      />
    </>
  );
}