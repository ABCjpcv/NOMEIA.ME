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

  // STATES
  const {selectedRowKeys, setSelectedRowKeys} = useState([]);

  let selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    setSelectedRowKeys({ selectedRowKeys });
  };
  let onSelectedRowKeysChange = (selectedRowKeys) => {
    setSelectedRowKeys({ selectedRowKeys });
  };




  let [searchVal] = useState(
    (Meteor.user() == undefined) ? "" : Meteor.user().username
  );

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchUsers,
  });

    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectedRowKeysChange
    };

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
                rowSelection={rowSelection}
                columns={userColumns}
                loading={loading}
                pagination={false}
                onRow={(record) => ({
                  onClick: () => {
                    selectRow(record);
                  }
                })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
