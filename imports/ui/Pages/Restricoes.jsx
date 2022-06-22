import React, { useState } from "react";
import "antd/dist/antd.css";
import { Table, Input } from "antd";
import axios from "axios";
import { useTableSearch } from "./useTableSearch";

import { Meteor } from "meteor/meteor";

const { Search } = Input;

const fetchData = async () => {
  const { data } = await axios.get("ClubesAVLnomes.json");
  return { data };
};

import { Checkbox } from "antd";

const onChange = function (checkedValues) {
  console.log("checked = " + checkedValues);
  return checkedValues;
};

export const listaClubesColumns = [
  {
    title: "Clube",
    dataIndex: "Clube",
    key: "Clube",
  },
  {
    title: "Restrição",
    dataIndex: "Restrição",
    key: "Restrição",
    render: (record) => (
      <div style={{ width: "auto" }}>
        <>
          <Checkbox.Group onChange={onChange}>
            <Checkbox value="Atleta">Atleta</Checkbox>
            <Checkbox value="Dirigente">Dirigente</Checkbox>
            <Checkbox value="Treinador">Treinador</Checkbox>
            <Checkbox value="Outra">Outra</Checkbox>
          </Checkbox.Group>
        </>
      </div>

      // <select name="restricao" defaultValue={"Nenhuma"}>
      //   <option value="Nenhuma"> </option>
      //   <option value="Treinador">Treinador</option>
      //   <option value="Atleta">Atleta</option>
      //   <option value="Dirigente">Dirigente</option>
      //   <option value="Outro">Outro</option>
      // </select>
    ),
  },
  {
    title: "Descrição",
    dataIndex: "Descrição",
    key: "Descrição",
    render: () => (
      <div style={{ width: "auto" }}>
        <input type="text" name="descricao"></input>
      </div>
    ),
  },
];

export function Restricoes() {
  const [searchVal, setSearchVal] = useState(null);

  const [data, setData] = useState(fetchData);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchData,
  });

  // const [state, useState] = useState({});

  return (
    <div>
      <div className="demo-app-main" style={{ overflow: "auto" }}>
        <form>
          <div>
            <label>
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
            </label>
            <br /> <br />
            <Table
              columns={listaClubesColumns}
              dataSource={filteredData}
              loading={loading}
              // onChange={(e) => {
              //   setData(e.target.value);
              //   console.log(e);
              // }}
              onRow={(record) => {
                 return {
                  onClick: (event) => {
                     // save row data to state
                     console.log("RECORD");
                     console.log(record);
                     console.log("EVENTO:");
                     console.log(event);
                     console.log();
                   }, // click row
                 };
               }}
            />
          </div>
          <input
            type="button"
            value="Submeter"
            onClick={() => {
              let curr = data;
              let eventos = [];
              // curr.map((evento) =>
              //   eventos.push({
              //     id: evento.id,
              //     start: evento.startStr,
              //     end: evento.endStr,
              //   })
              // );

              // Meteor.call(
              //   "addRestricao",
              //   Meteor.user().username,
              //   eventos,
              //   (err, result) => {
              //     if (err) {
              //       //Fazer aparecer mensagem de texto de credenciais erradas.
              //       console.log(err);
              //     } else if (result) {
              window.alert(
                "Restrições registadas " + Meteor.user().username
              );
              //   }
              // }
              //);
            }}
          />
        </form>
      </div>
    </div>
  );
}
function submitRelacoes() {
  //ARRANJAR MANEIRA DE GUARDAR VALORES NA BD
  window.alert("Relações com clubes guardadas " + Meteor.user().username);
}
