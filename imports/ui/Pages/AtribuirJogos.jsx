import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Select, Table, Tag } from "antd";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";

const StyledTable = styled((props) => <Table {...props} />)`
  && tbody > tr:hover > td {
    background: rgba(224, 248, 232, 1);
  }
`;

// Requiring the lodash library
const _ = require("lodash");

function comparaAminhaLindaString(a, b) {
  let x = 0;

  try {
    a.length;
  } catch (error) {
    console.log("O ERRO FOI: -> a", a);
  }

  let tamanho = a.length > b.length ? b.length : a.length;
  for (let index = 0; index < tamanho; index++) {
    posA = a.charCodeAt(index);
    posB = b.charCodeAt(index);
    if (posA != posB) {
      x = posB - posA;
      break;
    }
  }
  if (x != 0) return x;
  else return b.length - a.length;
}

function comparaAminhaLindaData(a, b) {
  let x = 0;
  let dataSplitada1 = a.split("/");
  let dataSplitada2 = b.split("/");
  for (let index = dataSplitada1.length - 1; index >= 0; index--) {
    // PROF, DESCULPE, A MINHA SA4NIDADE MENTAL SE FOI...
    let res = comparaAminhaLindaString(
      dataSplitada1[index],
      dataSplitada2[index]
    );
    if (res != 0) {
      return res;
    }
  }
  return 0;
}

let currJogo = {};

function handleChange(value) {
  console.log("currJogo: ", currJogo);

  let nomeArbitro = value;
  console.log("nomeArbitro: ", nomeArbitro);
  let diaDeJogo = currJogo.Dia;
  console.log("currJogo Dia: ", currJogo.Dia);
  let horaDeJogo = currJogo.Hora;
  console.log("currJogo Dia: ", currJogo.Dia);
  let titulo =
    currJogo.Prova +
    " Serie " +
    currJogo.Serie +
    " " +
    currJogo.Equipas +
    " " +
    currJogo.Pavilhao;
  console.log("titulo: ", titulo);

  Meteor.call("verificaRestricoes", nomeArbitro, (err, result) => {});

  Meteor.call(
    "addNomeacaoCalendarioArbitro",
    nomeArbitro,
    titulo,
    diaDeJogo,
    horaDeJogo,
    (err, result) => {
      console.log("RESULTADO", result);

      if (err) {
        console.error(err);
      } else if (result) {
        console.log(result);
      }
    }
  );
}

export function AtribuirJogos() {
  const colunasNomeacoesPrivadas = [
    {
      title: "Jogo",
      dataIndex: "Jogo",
      key: "Jogo",
      sorter: (a, b) => a.Jogo - b.Jogo,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Dia",
      dataIndex: "Dia",
      key: "Dia",
      sorter: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Hora",
      dataIndex: "Hora",
      key: "Hora",
      sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Prova",
      dataIndex: "Prova",
      key: "Prova",
      sorter: (a, b) => comparaAminhaLindaString(a.Prova, b.Prova),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      sorter: (a, b) => comparaAminhaLindaString(a.Serie, b.Serie),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Equipas",
      dataIndex: "Equipas",
      key: "Equipas",
      sorter: (a, b) => comparaAminhaLindaString(a.Equipas, b.Equipas),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Pavilhao",
      dataIndex: "Pavilhao",
      key: "Pavilhao",
      sorter: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Arbitro1",
      dataIndex: "Arbitro1",
      key: "Arbitro1",
      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro1, b.Arbitro1),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              name="select_arbitro1"
              style={{ width: "150px" }}
              key="select_arbitro1"
              type="select"
              onChange={handleChange}
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option
                    value={arb}
                    key={"option_arbitro1" + _.uniqueId()}
                  >
                    {arb}
                  </Select.Option>
                );
              })}
            </Select>
          </>
        ) : null,
    },
    {
      title: "Arbitro2",
      dataIndex: "Arbitro2",
      key: "Arbitro2",
      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro2, b.Arbitro2),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              name="select_arbitro2"
              style={{ width: "150px" }}
              key="select_arbitro2"
              type="select"
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option
                    value={arb}
                    key={"option_arbitro2" + _.uniqueId()}
                  >
                    {arb}
                  </Select.Option>
                );
              })}
            </Select>
          </>
        ) : null,
    },
    {
      title: "JL",
      dataIndex: "JL1",
      key: "JL1",
      sorter: (a, b) => comparaAminhaLindaString(a.JL1, b.JL1),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              name="select_jl1"
              style={{ width: "150px" }}
              key="select_jl1"
              type="select"
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_jl1" + _.uniqueId()}>
                    {arb}
                  </Select.Option>
                );
              })}
            </Select>
          </>
        ) : null,
    },
    {
      title: "JL",
      dataIndex: "JL2",
      key: "JL2",
      sorter: (a, b) => comparaAminhaLindaString(a.JL2, b.JL2),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              name="select_jl2"
              style={{ width: "150px" }}
              key="select_jl2"
              type="select"
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_jl2" + _.uniqueId()}>
                    {arb}
                  </Select.Option>
                );
              })}
            </Select>
          </>
        ) : null,
    },
    {
      title: "JL",
      dataIndex: "JL3",
      key: "JL3",
      sorter: (a, b) => comparaAminhaLindaString(a.JL3, b.JL3),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              name="select_jl3"
              style={{ width: "150px" }}
              key="select_jl3"
              type="select"
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_jl3" + _.uniqueId()}>
                    {arb}
                  </Select.Option>
                );
              })}
            </Select>
          </>
        ) : null,
    },
    {
      title: "JL",
      dataIndex: "JL4",
      key: "JL4",
      sorter: (a, b) => comparaAminhaLindaString(a.JL4, b.JL4),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              name="select_jl4"
              style={{ width: "150px" }}
              key="select_jl4"
              type="select"
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_jl4" + _.uniqueId()}>
                    {arb}
                  </Select.Option>
                );
              })}
            </Select>
          </>
        ) : null,
    },
  ];

  /**
   *
   *
   * ATRIBUICAO DOS ESTADOS (STATES)
   *
   *
   */

  const [arbitrosDisponiveis, setArbitrosDisponiveis] = useState([]);

  const [dataSource, setDataSource] = useState([]);

  function handleSubmissionConfirmation(data) {
    let confirmacoes = [];

    for (let index = 0; index < data.length; index++) {
      confirmacoes.push(data[index]);
    }

    Meteor.call("carregaJogosComNomeacoes", (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", { err });
      }
    });

    let email = Meteor.user().emails[0].address;

    Meteor.call("", email, data, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", { err });
      } else {
        window.alert("Confirmações submetidas " + Meteor.user().username);
      }
    });
  }

  function loadData() {
    let email = Meteor.user().emails[0].address;
    Meteor.call("carregaJogosSemanais", email, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result.length > 0) {
        let dataFromDB = [];

        for (let index = 0; index < result.length; index++) {
          let jogoLido = result[index];
          let obj = {
            Jogo: jogoLido.id,
            Dia: jogoLido.dia,
            Hora: jogoLido.hora,
            Prova: jogoLido.prova,
            Serie: jogoLido.serie,
            Equipas: jogoLido.equipas,
            Pavilhao: jogoLido.pavilhao,
            Arbitro1: jogoLido.arbitro_1,
            Arbitro2: jogoLido.arbitro_2,
            JL1: jogoLido.juiz_linha_1,
            JL2: jogoLido.juiz_linha_2,
            JL3: jogoLido.juiz_linha_3,
            JL4: jogoLido.juiz_linha_4,
            key: jogoLido.key,
            tags: jogoLido.tags,
          };

          dataFromDB.push(obj);
        }
        return setDataSource(dataFromDB);
      } else {
        return setDataSource([]);
      }
    });
  }

  useEffect(() => {
    loadData();
  }, [dataSource]);

  return (
    <div
      className="demo-app"
      style={{ height: "10%", width: "auto", alignSelf: "center" }}
    >
      <div className="demo-app-sidebar"></div>
      <div>
        <div className="demo-app-main" style={{ overflow: "auto" }}>
          <div className="container">
            <div className="table-responsive">
              <br />
              <h1 className="blue"> Arbitros disponiveis: </h1>
              <ul>
                {arbitrosDisponiveis.map((arb) => {
                  return arb + "\n";
                })}
              </ul>

              <br></br>
              <StyledTable
                //bordered
                rowClassName={(record, index) =>
                  index % 2 === 0 ? "table-row-light" : "table-row-dark"
                }
                dataSource={dataSource}
                columns={colunasNomeacoesPrivadas}
                pagination={false}
                onRow={(record) => {
                  let k = record.key;

                  return {
                    onClick: (event) => {
                      console.log("event", event);
                      console.log("event.target.value", event.target.value);
                      if (event.target != "div.ant-select-selector") {
                        Meteor.call(
                          "arbitrosDisponiveis",
                          record,
                          (err, result) => {
                            console.log("result: ", result);
                            if (err) {
                              console.log("ERRRRROOOOO", { err });
                            } else if (result.length != 0) {
                              return setArbitrosDisponiveis(result);
                            }
                          }
                        );
                        currJogo = record;
                      }
                      if (event.key === "Enter") {
                        console.log("event.target.value", event.target.value);
                      }
                      // console.log("arbitrosDisponiveis",arbitrosDisponiveis);
                    },

                    onChange: (event) => {
                      // save row data to state
                      console.log("MUDEI O EVENTO!", event);

                      //  if (event.target.value === undefined) {
                      //    // nothing to do
                      //  }

                      //  if (event.target.type === "text") {
                      //       adicionaDescricao(k, event.target.value);
                      //     } else if (record.Descricao != "") {
                      //       adicionaDescricao(k, record.Descricao);
                      //     }

                      //     if (event.target.type === "checkbox") {
                      //       if (event.target.value === "Atleta") {
                      //         adicionaRestricao(k, 0, event.target.checked);
                      //       }
                      //       if (event.target.value === "Dirigente") {
                      //         adicionaRestricao(k, 1, event.target.checked);
                      //       }
                      //       if (event.target.value === "Treinador") {
                      //         adicionaRestricao(k, 2, event.target.checked);
                      //       }
                      //       if (event.target.value === "Outra") {
                      //         adicionaRestricao(k, 3, event.target.checked);
                      //       }
                      //     }
                    },
                  };
                }}
              />
              <br></br>
              <Button
                onClick={handleSubmissionConfirmation}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Submeter e enviar nomeações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
