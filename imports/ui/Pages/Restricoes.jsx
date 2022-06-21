import React from "react";
import "antd/dist/antd.css";
import { Table, Input, Dropdown, Select } from "antd";

import { useTableSearch } from "./useTableSearch";
import { listaClubesColumns } from "./listaClubesColumns";

const { Search } = Input;

export class Restricoes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchVal: "",
      loading: false,
      loaded: false,
      currentData: [],
    };
  }

  componentDidMount() {
    if (!this.state.loaded) {
      this.loadData();
    }
  }
 

  render() {
    const searchValue = this.state.searchVal;

    const usefetchData = async () => {
      const { data } = await axios.get("ClubesAVLnomes.json");
      return { data };
    };

    
    const { filteredData, loading } = useTableSearch({
      searchValue,
      retrieve: usefetchData,
    });

    return (
      <div>
        <div className="demo-app-main" style={{ overflow: "auto" }}>
          <form>
            <div>
              <label>
                Relações com clubes:
                <Search
                  onChange={(e) =>
                    this.setState({ searchData: e.target.value })
                  }
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
              </label>
              <br /> <br />
              <Table
                columns={listaClubesColumns}
                dataSource={filteredData}
                loading={loading}
                onRow={(record) => ({
                  onClick: () => {
                    // TRATA DE ALTERACAO DE DADOS QUANDO ACONTECE CLICK NA TABELA
                    // this.selectRow(record);
                  },
                })}
              />
            </div>
            <input type="submit" value="Submeter" />
          </form>
        </div>
      </div>
    );
  }

  loadData() {
    const  data = null;
    async () => {
      data = await axios.get("ClubesAVLnomes.json");
    };
    const { state: currentState } = this;
      const newState = { ...currentState, currentData: data, loaded: true };
      this.setState(newState);
  }
}
