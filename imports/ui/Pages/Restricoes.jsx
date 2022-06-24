import React, { useState, useEffect } from "react";
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

let sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

import { Checkbox } from "antd";

let currChange = "";
const onChangeCheckbox = function (checkedValues) {
  currChange = checkedValues;
  return checkedValues;
};

let currChangeText = "";
const onChangeText = function (e) {
  currChangeText = e.target.value;
  return currChangeText;
};

export const listaClubesColumns =  [
    {
      title: "Clube",
      dataIndex: "Clube",
      key: "Clube",
    },
    {
      title: "Restrição",
      dataIndex: "Restrição",
      key: "Restrição",
      render: (_, record) => (
        <div style={{ width: "auto" }}>
          <>
            <Checkbox.Group onChange={onChangeCheckbox}>
              <Checkbox value="Atleta" checked={record.Atleta}>
                Atleta
              </Checkbox>
              <Checkbox value="Dirigente" checked={record.Dirigente}>
                Dirigente
              </Checkbox>
              <Checkbox value="Treinador" checked={record.Treinador}>
                Treinador
              </Checkbox>
              <Checkbox value="Outra" checked={record.Outra}>
                Outra
              </Checkbox>
            </Checkbox.Group>
          </>
        </div>
      ),
    },
    {
      title: "Descrição",
      dataIndex: "Descrição",
      key: "Descrição",
      render: () => (
        <div style={{ width: "auto" }}>
          <input type="text" name="descricao" onChange={onChangeText}></input>
        </div>
      ),
    },
  ];

export function Restricoes() {
  const [searchVal, setSearchVal] = useState(null);

  let [data, setData] = useState(fetchData);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchData,
  });

  let [loaded, setLoaded] = useState(false);

  if (!loaded) {
    loadData();
    () => setLoaded(true);
  }

  function loadData() {
    // Verifica se o utilizador loggado tem restricoes guardadas na bd
    Meteor.call(
      "carregaRestricoes",
      Meteor.user?.()?.username,
      (err, result) => {
        if (err) {
          console.log("ERRRRROOOOO", { err });
        } else if (result) {
          // TODO YET

          console.log("RESULT:::::::::::::::");
          console.log(result);

          let j = JSON.parse(JSON.stringify(result));

          console.log("J");
          console.log(j);

          let dataFromDB = j.relacoes.data;

          console.log("dataFROMDB");
          console.log(dataFromDB);

          //   key: {type: Number,optional: false},
          //   clube: {type: String,optional: false},
          //   restricao: { type: [Boolean],optional: false},
          //   descricao: { type:  String, optional: true}

          console.log("DATA antes de dar update com a info da BD");
          console.log(data);

          setData(dataFromDB);

          console.log("DATA depois do update com a info da BD");
          console.log(data);
        }
      }
    );
  }

  // vou testar aqui o que é o filteredData:

  console.log("********************************************************");
  console.log(filteredData);

  // 

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
              className="tableRestricoes"
              columns={listaClubesColumns}
              dataSource={filteredData.relacoes}
              loading={loading}
              onRow={(record) => {
                let k = 1;
                let boolAr = [false, false, false, false];

                return {
                  onClick: (event) => {
                    // save row data to state

                    sleep(2500).then((r) => {
                      const curr = new Set(currChange);

                      if (Array.from(curr).includes("Atleta")) boolAr[0] = true;
                      if (Array.from(curr).includes("Dirigente"))
                        boolAr[1] = true;
                      if (Array.from(curr).includes("Treinador"))
                        boolAr[2] = true;
                      if (Array.from(curr).includes("Outra")) boolAr[3] = true;

                      k = record.key;

                      const currText = currChangeText;

                      const analyzer = Promise.resolve(data);

                      analyzer.then((resultado) => {
                        let obj = resultado.data[k - 1];

                        let j = JSON.parse(JSON.stringify(obj));

                        j.Restricao = {
                          Atleta: boolAr[0],
                          Dirigente: boolAr[1],
                          Treinador: boolAr[2],
                          Outra: boolAr[3],
                        };

                        j.Descricao = currText;
                        resultado.data[k - 1] = j;

                        setData(resultado);
                      });
                    });
                  },
                };
              }}
            />
          </div>
          <input
            type="button"
            value="Submeter"
            onClick={() => {
              Meteor.call(
                "addRestricao",
                Meteor.user().username,
                data,
                (err, result) => {
                  if (err) {
                    //Fazer aparecer mensagem de texto de credenciais erradas.
                    console.log(err);
                  } else if (result) {
                    window.alert(
                      "Relações com clubes guardadas " + Meteor.user().username
                    );
                  }
                }
              );
            }}
          />
        </form>
      </div>
    </div>
  );
}
