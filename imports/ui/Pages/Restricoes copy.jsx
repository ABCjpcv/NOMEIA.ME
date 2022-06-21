/**
 * 
 * UNUSED
 * 
 * 
 */




import React from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import { Table, Input, Dropdown, Select } from "antd";

import { listaClubesColumns } from "./listaClubesColumns";

const { Search } = Input;

const fetchData = async () => {
  const { data } = await axios.get("ClubesAVLnomes.json");
  return { data };
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchData: null,
      loading: false
    };
  }

  render() {
    return (
      <div>
        <div className="demo-app-main" style={{ overflow: "auto" }}>
          <form>
            <div>
              <label>
                Relações com clubes:
                <br></br>
                <Search
                  onChange={(e) => this.setState({ searchVal: e.target.value })}
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
              </label>
              <br /> <br />
              <Table
                columns={listaClubesColumns}
                dataSource={fetchData}
                onRow={(record) => ({
                  onClick: () => {
                    // TRATA DE ALTERACAO DE DADOS QUANDO ACONTECE CLICK NA TABELA
                    // this.selectRow(record);
                  }
                })}
              />
            </div>
            <input type="submit" value="Submeter" />
          </form>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("container"));
