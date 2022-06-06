import React, { useState } from "react";
import { Table, Input } from "antd";
import axios from "axios";
import { userColumns } from "./userColumns";
import { useTableSearch } from "./useTableSearch";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";

const fetchUsers = async () => {
  const { data } = await axios.get("Livro.json");
  return { data };
};

export function ConsultaPrivada() {
  let [searchVal] = useState(
    Meteor.users.findOne(Meteor.userId).username.valueOf()
  );

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers,
  });

  return (
    <div
      className="demo-app"
      style={{ height: "10%", width: "auto", alignSelf: "center" }}
    >
      <div className="demo-app-sidebar">
        
      </div>
      <div>
        <div className="demo-app-main" style={{ overflow: "auto" }}>
          <div className="container">
            <div className="table-responsive">
              <br />
              <Table
                rowKey="name"
                dataSource={filteredData}
                columns={userColumns}
                loading={loading}
                pagination={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
