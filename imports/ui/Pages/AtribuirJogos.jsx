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

let currChange = "";
const onChangeCheckbox = function (e) {
  currChange = e.target.value;
  return currChange;
};

let currText = "";
const onChangeText = function (e) {
  currText = e.target.value;
  return currText;
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
    render: (_, { Restricao }) => (
      <div style={{ width: "auto" }}>
        <input
          type="checkbox"
          value="Atleta"
          onChange={onChangeCheckbox}
          defaultChecked={Restricao[0]}
        />{" "}
        Atleta
        <input
          type="checkbox"
          value="Dirigente"
          onChange={onChangeCheckbox}
          defaultChecked={Restricao[1]}
        />{" "}
        Dirigente
        <input
          type="checkbox"
          value="Treinador"
          onChange={onChangeCheckbox}
          defaultChecked={Restricao[2]}
        />
        Treinador
        <input
          type="checkbox"
          value="Outra"
          onChange={onChangeCheckbox}
          defaultChecked={Restricao[3]}
        />{" "}
        Outra
      </div>
    ),
  },
  {
    title: "Descrição",
    dataIndex: "Descrição",
    key: "Descrição",
    render: (_, {Descricao}) => (
      <input
        type="text"
        name="descricao"
        style={{ width: "auto" }}
        onChange={onChangeText}
        defaultValue={Descricao }
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
          reject(err)
        } else if (result) {          
          let j = JSON.parse(JSON.stringify(result));
          
          let dataFromDB = j.relacoes;

          if(dataFromDB == ''){
            resolve(fetchData())
          }
          else{

            resolve({data: dataFromDB});
          }
          
        }
      }
    );
  })
}

export function AtribuirJogos() {

  const [searchVal, setSearchVal] = useState(null);

  
  let [data, setData] = useState(fetchData);

  
  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: loadData 
  });
  
    useEffect(() => {

      }, [data]);
      
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
            {/* <Table
              className="tableRestricoes"
              columns={listaClubesColumns}
              dataSource={filteredData}
              loading={loading}
              onRow={(record) => {
                let k = 1;
                let boolAr = [false, false, false, false];

                return {
                  onClick: (event) => {
                    // save row data to state

                    sleep(5500).then((r) => {
                      const curr = $("input[type=checkbox]:checked")
                        .map(function (_, el) {
                          return $(el).val();
                        })
                        .get();

                      console.log("curr");
                      console.log(curr);

                      if (Array.from(curr).includes("Atleta")) boolAr[0] = true;
                      if (Array.from(curr).includes("Dirigente"))
                        boolAr[1] = true;
                      if (Array.from(curr).includes("Treinador"))
                        boolAr[2] = true;
                      if (Array.from(curr).includes("Outra")) boolAr[3] = true;

                      k = record.key;

                      const analyzer = Promise.resolve(data);
                      analyzer.then((resultado) => {
                        console.log("RESULTADO");
                        console.log(resultado);

                        let obj = resultado.data[k - 1];

                        let j = JSON.parse(JSON.stringify(obj));

                        console.log(j);

                        j.Restricao = boolAr;
                        j.Descricao = currText;

                        console.log(j);

                        resultado.data[k - 1] = j;

                        setData(Promise.resolve(resultado));

                        currText = "";
                      });
                    });
                  },
                };
              }}
            /> */}
          </div>
          <input
            type="button"
            value="Submeter"
            // onClick={() => {
            //   let dataParaBD = Promise.resolve(data);
            //   dataParaBD.then((resultado) => {
            //     Meteor.call(
            //       "addRestricao",
            //       Meteor.user().username,
            //       resultado.data,
            //       (err, result) => {
            //         if (err) {
            //           //Fazer aparecer mensagem de texto de credenciais erradas.
            //           console.log(err);
            //         } else if (result) {
            //           window.alert(
            //             "Relações com clubes guardadas " +
            //               Meteor.user().username
            //           );
            //         }
            //       }
            //     );
            //   });
            // }}
          />
        </form>
      </div>
    </div>
  );
}
