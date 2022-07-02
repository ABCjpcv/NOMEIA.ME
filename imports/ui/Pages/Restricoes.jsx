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

let bdInfo;
const fetchDataFromDB = () => {
  const { data } = bdInfo;
  return { data };
}

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
        <input
          type="checkbox"
          value="Atleta"
          defaultChecked={Restricao[0]}
        />{" "}
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

          console.log("dataFromDB: ");
          console.log(dataFromDB);

          // Nao ha data na base de dados
          if (dataFromDB.length = 0) {
            resolve(fetchData());
          } 

          // O PROBLEMA ESTÁ AQUI
          
          
          else {
            //bd = dataFromDB;
            //resolve(fetchDataFromDB())

            // ISTO NÃO ESTÁ A FUNCIONAR
            resolve({data: dataFromDB});
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
      // console.log("RESULTADO");
      // console.log(resultado.data);

      // console.log("RESULTADO DATA [K-1]");
      // console.log(resultado.data[key - 1]);

      let obj = resultado.data[key - 1];
      let j = JSON.parse(JSON.stringify(obj));

      j.Restricao[valorRestricao] = isChecked;

     // console.log("After changes resultado.data[key-1]");

      resultado.data[key - 1] = j;

      //console.log(resultado.data[key - 1]);

      changedLine = resultado.data[key - 1];

      // HOW TO SET DATA WITHOUT SETTING FULL TABLE VALUES
      //setData(data[k-1] = resultado.data[k-1])

      //   Promise.resolve(resultado));
    

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
    //console.log("RESULTADO");
      //  console.log(resultado);

     //   console.log("RESULTADO DATA [K-1]");
       // console.log(resultado[key - 1]);

        let obj = resultado[key - 1];
        let j = JSON.parse(JSON.stringify(obj));

//        console.log("J before changes");
  //      console.log(j);

        j.Restricao[valorRestricao] = isChecked;
        resultado[key - 1] = j;

 //       console.log("After changes resultado[k-1]");
   //     console.log(resultado[key - 1]);

        changedLine = resultado[key - 1];

        // HOW TO SET DATA WITHOUT SETTING FULL TABLE VALUES
        //setData(data[k-1] = resultado.data[k-1])

        //   Promise.resolve(resultado));

        var d = Promise.resolve(data);

       

        d.then(function (v) {

          const i = v.map( (obj) =>{
            return obj
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
    //    console.log("RESULTADO");
    //    console.log(resultado);

    //    console.log("RESULTADO DATA [K-1]");
    //    console.log(resultado.data[key - 1]);

        let obj = resultado.data[key - 1];
        let j = JSON.parse(JSON.stringify(obj));

    //    console.log("J before changes");
    //    console.log(j);

        j.Descricao = valorDescricao;
        resultado.data[key - 1] = j;

    //    console.log("After changes resultado.data[k-1]");
    //    console.log(resultado.data[key - 1]);

        changedLine = resultado.data[key - 1];

        // HOW TO SET DATA WITHOUT SETTING FULL TABLE VALUES
        //setData(data[k-1] = resultado.data[k-1])

        //   Promise.resolve(resultado));

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
    //    console.log("RESULTADO");
    //    console.log(resultado);

     //   console.log("RESULTADO DATA [K-1]");
     //   console.log(resultado[key - 1]);

        let obj = resultado[key - 1];
        let j = JSON.parse(JSON.stringify(obj));

     //   console.log("J before changes");
     //   console.log(j);

        j.Descricao = valorDescricao;
        resultado[key - 1] = j;

     //   console.log("After changes resultado[k-1]");
     //   console.log(resultado[key - 1]);

        changedLine = resultado[key - 1];

        // HOW TO SET DATA WITHOUT SETTING FULL TABLE VALUES
        //setData(data[k-1] = resultado.data[k-1])

        //   Promise.resolve(resultado));

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
                    
                    if(event.target.type === 'text') {
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
                    } else if(record.Descricao != ""){
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
              console.log("esta é a data que vou mandar para a base de dados...");
              console.log(data);

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
              }}
          />
        </form>
      </div>
    </div>
  );
}
