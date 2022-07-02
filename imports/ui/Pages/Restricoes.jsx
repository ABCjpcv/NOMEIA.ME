import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Table, Input } from "antd";
import axios from "axios";
import { useTableSearch } from "./useTableSearch";

import { Meteor } from "meteor/meteor";

const { Search } = Input;

let dbInfo = "";
const fetchData = async () => {
  let { data } = await axios.get("ClubesAVLnomes.json");
  if (dbInfo != "") {
    data = dbInfo;
    //dbInfo = ""; 
  }
  return { data };
};

export const listaClubesColumns = [
  {
    title: "Clube",
    dataIndex: "Clube",
    key: "Clube",
  },
  {
    title: "Cargo",
    dataIndex: "Cargo",
    key: "Cargo",
    render: (_, { Restricao }) => (
      <div style={{ width: "auto" }}>
        <input type="checkbox" value="Atleta" defaultChecked={Restricao[0]} />{" "}
        Atleta
        <input
          type="checkbox"
          value="Dirigente"
          defaultChecked={Restricao[1]}
        />{" "}
        Dirigente
        <input
          type="checkbox"
          value="Treinador"
          defaultChecked={Restricao[2]}
        />
        Treinador
        <input
          type="checkbox"
          value="Outra"
          defaultChecked={Restricao[3]}
        />{" "}
        Outra
      </div>
    ),
  },
  {
    title: "Informação adicional",
    dataIndex: "InformacaoAdicional",
    key: "InformacaoAdicional",
    render: (_, { Descricao }) => (
      <input
        type="text"
        name="descricao"
        style={{ width: "auto" }}
        defaultValue={Descricao}
      ></input>
    ),
  },
];
function loadData() {
  // Verifica se o utilizador loggado tem restricoes guardadas na bd
  return new Promise((resolve, reject) => {
    Meteor.call(
      "carregaRestricoes",
      Meteor.user?.()?.username,
      (err, result) => {
        if (err) {
          console.log("ERRRRROOOOO", { err });
          reject(err);
        } else if (result) {
          let j = JSON.parse(JSON.stringify(result));
          let dataFromDB = j.relacoes;

          // Nao ha data na base de dados
          if (dataFromDB.length == 0) {
            resolve(fetchData());
          }

          // O PROBLEMA ESTÁ AQUI
          else {
            dbInfo = dataFromDB;
            // ISTO NÃO ESTÁ A FUNCIONAR
            resolve(fetchData());

            //PK ACIMA TENHO: resolve(fetchData()) que me devolve ()=>Promise<{data}>
            //AQUI TENHO {data: dataFromDB}, ou seja nao eh uma ()=>Promise<{data}>
          }
        }
      }
    );
  });
}

export function Restricoes() {
  const [searchVal, setSearchVal] = useState(null);

  let [data, setData] = useState(fetchData);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: loadData,
  });

  useEffect(() => {
    console.log("NOVA DATA: ");
    console.log(data);
  }, [data]);

  function adicionaRestricao(key, valorRestricao, isChecked) {
    let changedLine;

    const analyzer = Promise.resolve(data);
    analyzer.then((resultado) => {
      if (resultado.data != undefined) {
        let obj = resultado.data[key - 1];
        let j = JSON.parse(JSON.stringify(obj));

        j.Restricao[valorRestricao] = isChecked;
        resultado.data[key - 1] = j;

        changedLine = resultado.data[key - 1];

        var d = Promise.resolve(data);
        d.then(function (v) {
          const newState = v.data.map((obj) => {
            // 👇️ if id equals 2 replace object
            if (obj.key === key) {
              return changedLine;
            }
            // 👇️ otherwise return object as is
            return obj;
          });

          setData(newState);
        });
      } else {
        let obj = resultado[key - 1];
        let j = JSON.parse(JSON.stringify(obj));

        j.Restricao[valorRestricao] = isChecked;
        resultado[key - 1] = j;

        changedLine = resultado[key - 1];

        var d = Promise.resolve(data);
        d.then(function (v) {
          const i = v.map((obj) => {
            return obj;
          });
          console.log("iiiiiiiiii");
          console.log(i);

          const newState = v.map((obj) => {
            // 👇️ if id equals 2 replace object
            if (obj.key === key) {
              return changedLine;
            }
            // 👇️ otherwise return object as is
            return obj;
          });

          console.log("ATUALIZACAO DE DATA - adicionado Cargo:");
          console.log(newState);

          setData(newState);
        });
      }
    });
  }

  function adicionaDescricao(key, valorDescricao) {
    let changedLine;

    const analyzer = Promise.resolve(data);
    analyzer.then((resultado) => {
      if (resultado.data != undefined) {
        let obj = resultado.data[key - 1];
        let j = JSON.parse(JSON.stringify(obj));

        j.Descricao = valorDescricao;
        resultado.data[key - 1] = j;

        changedLine = resultado.data[key - 1];

        var d = Promise.resolve(data);
        d.then(function (v) {
          const newState = v.data.map((obj) => {
            // 👇️ if id equals 2 replace object
            if (obj.key === key) {
              return changedLine;
            }
            // 👇️ otherwise return object as is
            return obj;
          });

          console.log("ATUALIZACAO DE DATA - adicionada info:");
          console.log(newState);
          setData(newState);
        });
      } else {
        let obj = resultado[key - 1];
        let j = JSON.parse(JSON.stringify(obj));

        j.Descricao = valorDescricao;
        resultado[key - 1] = j;

        changedLine = resultado[key - 1];

        var d = Promise.resolve(data);
        d.then(function (v) {
          const newState = v.map((obj) => {
            // 👇️ if equals key replace object
            if (obj.key === key) {
              return changedLine;
            }
            // 👇️ otherwise return object as it is
            return obj;
          });

          setData(newState);
        });
      }
    });
  }

  return (
    <div>
      <div className="demo-a  pp-main" style={{ overflow: "auto" }}>
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
              dataSource={filteredData}
              loading={loading}
              onRow={(record) => {
                let k = record.key;

                return {
                  onClick: (event) => {
                    if (event.target.type === "text") {
                      adicionaDescricao(k, event.target.value);
                    }
                  },

                  onChange: (event) => {
                    // save row data to state

                    if (event.target.value === undefined) {
                      // nothing to do
                    }

                    if (event.target.type === "text") {
                      adicionaDescricao(k, event.target.value);
                    } else if (record.Descricao != "") {
                      adicionaDescricao(k, record.Descricao);
                    }

                    if (event.target.type === "checkbox") {
                      if (event.target.value === "Atleta") {
                        adicionaRestricao(k, 0, event.target.checked);
                      }
                      if (event.target.value === "Dirigente") {
                        adicionaRestricao(k, 1, event.target.checked);
                      }
                      if (event.target.value === "Treinador") {
                        adicionaRestricao(k, 2, event.target.checked);
                      }
                      if (event.target.value === "Outra") {
                        adicionaRestricao(k, 3, event.target.checked);
                      }
                    }
                  },
                };
              }}
            />
          </div>
          <input
            type="button"
            value="Submeter"
            onClick={() => {
              console.log(
                "esta é a data que vou mandar para a base de dados..."
              );
              console.log(data);

              if (data[0] === undefined) {
                window.alert(
                  "Nenhuma alteração detetada " + Meteor.user().username
                );
              } else {
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
                        "Relações com clubes guardadas " +
                          Meteor.user().username
                      );
                    }
                  }
                );
              }
            }}
          />
        </form>
      </div>
    </div>
  );
}
