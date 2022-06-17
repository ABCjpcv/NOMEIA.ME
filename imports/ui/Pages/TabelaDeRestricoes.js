import React from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import axios from "axios";
import { Table } from 'antd';
import {listaClubesColumns} from './listaClubesColumns';

const columns = listaClubesColumns;

const data = async () => {
  const { data } = await axios.get("ClubesAVLnomes.json");
  return { data };
};

class TabelaDeRestricoes extends React.Component {
  state = {
    selectedRowKeys: []
  };
  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    if (selectedRowKeys.indexOf(record.key) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
    } else {
      selectedRowKeys.push(record.key);
    }
    this.setState({ selectedRowKeys });
  }
  onSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  }
  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectedRowKeysChange,
    };
    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => {
            this.selectRow(record);
          },
        })}
      />
    );
  }
}

          