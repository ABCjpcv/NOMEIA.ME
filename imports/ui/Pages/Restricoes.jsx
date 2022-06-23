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

const onChange = function (checkedValues) {
  currChange = checkedValues;
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

  let [data, setData] = useState(fetchData);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchData,
  });

  let [loaded, setLoaded] = useState(false);

console.log(loaded);
    console.log("ANTES DO IF");
    if(!loaded) {
      console.log("DENTRO DO IF");
      loadData();
      ()=>setLoaded(true);
    }

    console.log("DEPOIS DO IF");
  


  

  function loadData() {
    // Verifica se o utilizador loggado tem indisponibilidades guardadas na bd
    Meteor.call("carregaRestricoes", Meteor.user?.()?.username, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", { err });
      } else if (result) {

        console.log(" *** BANANA NA N BANANA NA ***");


        // TODO YET 

        console.log("RESULTS:::");

        let j = JSON.parse(JSON.stringify(result));

        console.log(result);


        let dataFromDB = j.relacoes.data;


        console.log("data from CHANGES guardadas");

        console.log(dataFromDB);

     //   key: {type: Number,optional: false},
  //   clube: {type: String,optional: false},
  //   restricao: { type: [Boolean],optional: false},
  //   descricao: { type:  String, optional: true}


        data = dataFromDB};
      
    });
  }

  

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
              className="tableRestricoes"
              columns={listaClubesColumns}
              dataSource={filteredData}
              loading={loading}
              // onChange={(e) => {
              //   setData(e.target.value);
              //   console.log(e);
              // }}
              onRow={(record) => {
                let k = 1;
                let boolAr = [false, false, false, false];
                let r;
                return {
                  onClick: (event) => {
                    // save row data to state

                    sleep(1000).then((r) => {
                      const curr = new Set(currChange);

                      console.log("CURR");
                      console.log(curr);
                      

                      if (Array.from(curr).includes("Atleta")) boolAr[0] = true;
                      if (Array.from(curr).includes("Dirigente"))
                        boolAr[1] = true;
                      if (Array.from(curr).includes("Treinador"))
                        boolAr[2] = true;
                      if (Array.from(curr).includes("Outra")) boolAr[3] = true;

                      console.log("boolAr AFTER CHANGES");
                      console.log(boolAr);

                      k = record.key;

                      console.log("VALOR DE K");
                      console.log(k);

                      let resultadoFinal;

                      data.then(resultado => 
                        {

                        let obj = resultado.data[k-1];
                        console.log("OBJ OBJ OBJ OBJ OBJ");
                        console.log(obj);

                        let j = JSON.parse(JSON.stringify(obj));
                      
                        j.Restricao = {
                          Atleta: boolAr[0],
                          Dirigente: boolAr[1],
                          Treinador: boolAr[2],
                          Outra: boolAr[3]
                        }

                        resultado.data[k-1] = j;

                        data = resultado;
  
                        
console.log("11111111111111111111111111111");
                        console.log(resultado);
                        
setData(resultado)
console.log("22222222222222222222222222");
                        console.log(data)

                        }
                        )
                    });


                    

                    
                  }, // click row
                };
              }}
            />
          </div>
          <input
            type="button"
            value="Submeter"
            onClick={() => {
              console.log("ADEUS ADEUS");

              console.log("FARMACIA *********************");
              
console.log(data);

              Meteor.call(
                "addRestricao",
                Meteor.user().username,
                data,
                (err, result) => {
                  console.log("CHEGASTE ATE AQUI?????");
                  if (err) {
                    //Fazer aparecer mensagem de texto de credenciais erradas.
                    console.log(err);
                  } else if (result) {
                    window.alert("Relações com clubes guardadas " + Meteor.user().username);

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


function updateJson(obj, keyString, newValue){
  // //let json = new JSONObject();
  // // get the keys of json object
  // let iterator = obj.keys();
  // let key = "";
  // while (iterator.hasNext()) {
  //     key = iterator.next();
  //     // if the key is a string, then update the value
  //     if ((obj.optJSONArray(key) == null) && (obj.optJSONObject(key) == null)) {
  //         if ((key.equals(keyString))) {
  //             // put new value
  console.log("OBJECTO OBJECTO");
  console.log(obj)
              obj.keyString = newValue;
              return obj;
  //         }
  //     }

  //     // if it's jsonobject
  //     if (obj.optJSONObject(key) != null) {
  //         updateJson(obj.getJSONObject(key), keyString, newValue);
  //     }

  //     // if it's jsonarray
  //     if (obj.optJSONArray(key) != null) {
  //          jArray = obj.getJSONArray(key);
  //         for (let i = 0; i < jArray.length(); i++) {
  //             updateJson(jArray.getJSONObject(i), keyString, newValue);
  //         }
  //     }
  // }
  // return obj;
}