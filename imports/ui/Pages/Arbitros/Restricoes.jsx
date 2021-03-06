import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Table, Input, Button, message } from "antd";
import axios from "axios";
import { useTableSearch } from "../../../api/useTableSearch";

import { Meteor } from "meteor/meteor";
import { Header } from "../Geral/Header";

const { Search } = Input;

let dbInfo = "";
const fetchData = () => {
  let query = [];
  Meteor.call("carregaRestricoes", Meteor.user?.()?.username, (err, result) => {
    if (err) {
      console.log("ERRRRROOOOO", { err });
      reject(err);
    } else if (result) {
      let j = JSON.parse(JSON.stringify(result));
      let dataFromDB = j.relacoes;

      if (dataFromDB != undefined) {
        query = dataFromDB;
        return { query };
      } else {
        Meteor.call("getClubesDisponiveis", (err, result) => {
          console.log("result", result);
          if (result) {
            query = result;
            return { query };
          }
        });
      }
    }
  });
  console.log("query", query);
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
      <div
        style={{
          width: "auto",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          Atleta
          {"            "}
          <input
            type="checkbox"
            value="Atleta"
            defaultChecked={Restricao != undefined ? Restricao[0] : false}
            style={{ height: "25px", width: "25px" }}
          />
        </div>
        <div>
          Dirigente
          {"            "}
          <input
            type="checkbox"
            value="Dirigente"
            defaultChecked={Restricao != undefined ? Restricao[1] : false}
            style={{ height: "25px", width: "25px" }}
          />
        </div>
        <div>
          Treinador
          {"            "}
          <input
            type="checkbox"
            value="Treinador"
            defaultChecked={Restricao != undefined ? Restricao[2] : false}
            style={{ height: "25px", width: "25px" }}
          />
        </div>
        <div>
          Outro
          {"            "}
          <input
            type="checkbox"
            value="Outra"
            defaultChecked={Restricao != undefined ? Restricao[3] : false}
            style={{ height: "25px", width: "25px" }}
          />
        </div>
      </div>
    ),
  },
  {
    title: "Informa????o adicional",
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

export function Restricoes({ user }) {
  const [searchVal, setSearchVal] = useState(null);

  let [data, setData] = useState([]);

  let isCA = Meteor.call("isAdmin", user, true, (err, result) => {
    if (result) {
      return result;
    }
  });

  // const { filteredData, loading } = useTableSearch({
  //   searchVal,
  //   retrieve: loadData,
  // });

  useEffect(() => {
    console.log("NOVA DATA: ", data);
  }, [data]);

  function loadData() {
    // Verifica se o utilizador loggado tem restricoes guardadas na bd
    //return new Promise((resolve, reject) => {
    Meteor.call(
      "carregaRestricoes",
      Meteor.user?.()?.username,
      (err, result) => {
        if (err) {
          console.log("ERRRRROOOOO", { err });
          // reject(err);
        } else if (result) {
          let j = JSON.parse(JSON.stringify(result));
          let dataFromDB = j.relacoes;

          console.log("data from db", dataFromDB);

          if (dataFromDB.length != 0) {
            setData(dataFromDB);
          } else {
            Meteor.call("getClubesDisponiveis", (err, result) => {
              console.log("result", result);
              if (result) {
                setData(result);
              }
            });
          }

          // O PROBLEMA EST?? AQUI

          // dbInfo = dataFromDB;
          // // ISTO N??O EST?? A FUNCIONAR
          // resolve(fetchData());

          //PK ACIMA TENHO: resolve(fetchData()) que me devolve ()=>Promise<{data}>
          //AQUI TENHO {data: dataFromDB}, ou seja nao eh uma ()=>Promise<{data}>
        }
      }
    );
  }

  function adicionaRestricao(index, valorRestricao, isChecked) {
    let newData = data;

    // const analyzer = Promise.resolve(data);
    // analyzer.then((resultado) => {
    //   if (resultado.data != undefined) {

    console.log("index", index);
    console.log("data[index]", data[index]);

    let obj = newData[index];
    //let j = JSON.parse(JSON.stringify(obj));

    console.log("obj", obj);

    obj.Restricao[valorRestricao] = isChecked;
    //resultado.data[key - 1] = j;
    newData[index] = obj;

    //changedLine = resultado.data[key - 1];

    changedLine = newData[index];

    setData(newData);

    // } else {
    //   let obj = resultado[key - 1];
    //   let j = JSON.parse(JSON.stringify(obj));

    //   j.Restricao[valorRestricao] = isChecked;
    //   resultado[key - 1] = j;

    //   changedLine = resultado[key - 1];

    //   var d = Promise.resolve(data);
    //   d.then(function (v) {
    //     const i = v.map((obj) => {
    //       return obj;
    //     });
    //     console.log("iiiiiiiiii");
    //     console.log(i);

    //     const newState = v.map((obj) => {
    //       // ??????? if id equals 2 replace object
    //       if (obj.key === key) {
    //         return changedLine;
    //       }
    //       // ??????? otherwise return object as is
    //       return obj;
    //     });

    //   console.log("ATUALIZACAO DE DATA - adicionado Cargo:");
    //   console.log(newState);

    //   setData(newState);
    // });
    // }
    // });
  }

  function adicionaDescricao(index, valorDescricao) {
    if (valorDescricao != "") {
      let newData = data;

      // const analyzer = Promise.resolve(data);
      // analyzer.then((resultado) => {
      //   if (resultado.data != undefined) {

      let obj = newData[index];
      //let j = JSON.parse(JSON.stringify(obj));

      console.log("VALOR DA DESCRICAO ", valorDescricao);
      obj.Descricao = valorDescricao;
      newData[index] = obj;

      changedLine = newData[index];

      // var d = Promise.resolve(data);
      // d.then(function (v) {
      // const newState = data.map((obj) => {
      //   // ??????? if id equals 2 replace object
      //   if (obj.key === key) {
      //     return changedLine;
      //   }
      //   // ??????? otherwise return object as is
      //   return obj;
      // });

      console.log("ATUALIZACAO DE DATA - adicionada info:");
      //console.log(newState);
      setData(newData);

      //   } else {
      //     let obj = resultado[key - 1];
      //     let j = JSON.parse(JSON.stringify(obj));

      //     j.Descricao = valorDescricao;
      //     resultado[key - 1] = j;

      //     changedLine = resultado[key - 1];

      //     var d = Promise.resolve(data);
      //     d.then(function (v) {
      //       const newState = v.map((obj) => {
      //         // ??????? if equals key replace object
      //         if (obj.key === key) {
      //           return changedLine;
      //         }
      //         // ??????? otherwise return object as it is
      //         return obj;
      //       });

      //       setData(newState);
      //     });
      //   }
      // });
    }
  }

  return (
    <div>
      <Header
        user={user}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={isCA}
        menuPrivadoCA={!isCA}
        atribuirArbitros={true}
        carregarJogos={false}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={false}
        definicoes={true}
      />
      {data.length === 0 ? loadData() : null}
      <div className="demo-a  pp-main" style={{ overflow: "auto" }}>
        <form>
          <div>
            <br></br>
            <Table
              className="tableRestricoes"
              columns={listaClubesColumns}
              dataSource={data}
              // loading={loading}
              onRow={(record, index) => {
                let k = record.key;

                return {
                  onClick: (event) => {
                    if (event.target.type === "text") {
                      adicionaDescricao(k, event.target.value);
                    }
                  },

                  onChange: (event) => {
                    console.log("record", record);
                    console.log("index", index);
                    // save row data to state

                    if (event.target.value === undefined) {
                      // nothing to do
                    }

                    if (event.target.type === "text") {
                      adicionaDescricao(index, event.target.value);
                    } else if (record.Descricao != "") {
                      adicionaDescricao(index, record.Descricao);
                    }

                    if (event.target.type === "checkbox") {
                      if (event.target.value === "Atleta") {
                        adicionaRestricao(index, 0, event.target.checked);
                      }
                      if (event.target.value === "Dirigente") {
                        adicionaRestricao(index, 1, event.target.checked);
                      }
                      if (event.target.value === "Treinador") {
                        adicionaRestricao(index, 2, event.target.checked);
                      }
                      if (event.target.value === "Outra") {
                        adicionaRestricao(index, 3, event.target.checked);
                      }
                    }
                  },
                };
              }}
            />
          </div>
          <Button
            style={{
              marginBottom: 16,
            }}
            value="Instru????es"
            onClick={() =>
              message.info(
                "Indique se possui algum cargo num clube ou adicione informa????o relativo ??s suas restri????es como ??rbitro num clube. \n Se quiser procurar por um clube em espec??fico pode faz??-lo na barra de pesquisa.  \nQuando terminar carregue no bot??o 'Submeter relaco??es com clubes'.",
                10
              )
            }
          >
            {" "}
            Instru????es{" "}
          </Button>
          {/* <Search
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Pesquise aqui por um Clube"
            enterButton
            style={{
              position: "sticky",
              top: "0",
              left: "0",
              width: "250px",
            }}
          /> */}

          <Button
            onClick={() => {
              if (data[0] === undefined) {
                message.warn(
                  "Nenhuma altera????o detetada " + Meteor.user().username
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
                      message.success(
                        "Rela????es com clubes guardadas " +
                          Meteor.user().username +
                          "!"
                      );
                    }
                  }
                );
              }
            }}
            type="primary"
            style={{
              marginBottom: 16,
            }}
          >
            Submeter rela????es com clubes
          </Button>
        </form>
      </div>
    </div>
  );
}
