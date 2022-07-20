import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Select, Table, Tag } from "antd";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";

const { Option } = Select;

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
  let dataSplitada1 = a.toString().split("/");
  let dataSplitada2 = b.toString().split("/");
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

let currNomeArbitro = "";

function handleChangeSelecaoArbitro(value, key) {
  console.log("value", value);
  console.log("key", key);

  let titulo =
    "Jogo nº " +
    currJogo.Jogo +
    " " +
    currJogo.Prova +
    " Serie " +
    currJogo.Serie +
    " " +
    currJogo.Equipas +
    " " +
    currJogo.Pavilhao;

  //console.log("currNomeArbitro", currNomeArbitro);

  //console.log("value.length", value.length);

  if (value.length === 1) {
    // remover a nomeacao anterior
    Meteor.call(
      "removeNomeacaoCalendarioArbitro",
      currNomeArbitro,
      titulo,
      currJogo,
      key.key,
      (err, result) => {
        //console.log("RESULTADO", result);

        if (err) {
          console.error(err);
        } else if (result) {
          // console.log(result);
        }
      }
    );
  } else {
    currNomeArbitro = value;
    // console.log("nomeArbitro: ", currNomeArbitro);

    Meteor.call("verificaRestricoes", currNomeArbitro, (err, result) => {
      let condicoesArbitro = JSON.parse(JSON.stringify(result));
      let temCarro = condicoesArbitro.temCarro;
      let emiteRecibo = condicoesArbitro.emiteRecibo;
      let relacoes = condicoesArbitro.relacaoComEquipas;

      let mensagemRestricoes =
        currNomeArbitro +
        (!temCarro ? " não tem carro." : " tem carro.") +
        "\n" +
        currNomeArbitro +
        (!emiteRecibo ? " não emite recibo." : " emite recibo.") +
        "\n";

      let mensagemRelacoesClubes = currNomeArbitro;
      if (relacoes.length > 0) {
        for (let index = 0; index < relacoes.length; index++) {
          let cargo = relacoes[index].cargo;
          let clube = relacoes[index].clube;
          mensagemRelacoesClubes =
            mensagemRelacoesClubes + " é " + cargo + " do clube " + clube + ".";
        }
      } else {
        mensagemRelacoesClubes =
          mensagemRelacoesClubes + " não tem relações com clubes.";
      }

      let mensagemTotal = mensagemRestricoes + mensagemRelacoesClubes;

      window.alert(mensagemTotal);
    });

    //console.log("key", key);

    Meteor.call(
      "addNomeacaoCalendarioArbitro",
      currNomeArbitro,
      currJogo,
      key.key,
      (err, result) => {
        //console.log("RESULTADO", result);

        if (err) {
          console.error(err);
        } else if (result) {
          //console.log(result);
        }
      }
    );
  }
}

export function AtribuirJogos(props) {
  const colunasNomeacoesPrivadas = [
    {
      title: "Jogo",
      dataIndex: "Jogo",
      key: "Jogo",
      sorter: (a, b) => a.key - b.key,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Dia",
      dataIndex: "Dia",
      key: "Dia",
      sorter: (a, b) => comparaAminhaLindaData(a.key, b.key),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Hora",
      dataIndex: "Hora",
      key: "Hora",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Prova",
      dataIndex: "Prova",
      key: "Prova",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Equipas",
      dataIndex: "Equipas",
      key: "Equipas",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Pavilhao",
      dataIndex: "Pavilhao",
      key: "Pavilhao",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Arbitro1",
      dataIndex: "Arbitro1",
      key: "Arbitro1",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: () =>
        dataSource.length >= 1 ? (
          <>
            <Select
              showSearch
              mode="single"
              name="select_arbitro1"
              style={{ width: "180px" }}
              key="select_arbitro1"
              type="select"
              onChange={
                //setSelectedOptions(o),
                handleChangeSelecaoArbitro
              }

              //value={getInitialValueA1}
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option
                    value={arb}
                    key={"option_1_arbitro" + _.uniqueId()}
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
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              showSearch
              mode="single"
              name="select_arbitro2"
              style={{ width: "180px" }}
              key="select_arbitro2"
              type="select"
              onChange={handleChangeSelecaoArbitro}
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option
                    value={arb}
                    key={"option_2_arbitro" + _.uniqueId()}
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
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              showSearch
              mode="single"
              name="select_jl1"
              style={{ width: "180px" }}
              key="select_jl1"
              type="select"
              onChange={handleChangeSelecaoArbitro}
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_1_jl" + _.uniqueId()}>
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
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              showSearch
              mode="single"
              name="select_jl2"
              style={{ width: "180px" }}
              key="select_jl2"
              type="select"
              onChange={handleChangeSelecaoArbitro}
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_2_jl" + _.uniqueId()}>
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
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              showSearch
              mode="single"
              name="select_jl3"
              style={{ width: "180px" }}
              key="select_jl3"
              type="select"
              onChange={handleChangeSelecaoArbitro}
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_3_jl" + _.uniqueId()}>
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
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: (record) =>
        dataSource.length >= 1 ? (
          <>
            <Select
              showSearch
              mode="single"
              name="select_jl4"
              style={{ width: "180px" }}
              key="select_jl4"
              type="select"
              onChange={handleChangeSelecaoArbitro}
            >
              {arbitrosDisponiveis.map((arb) => {
                return (
                  <Select.Option value={arb} key={"option_4_jl" + _.uniqueId()}>
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
   * ATRIBUICAO DOS ESTADOS (STATES)
   */

  const [selectedOptions, setSelectedOptions] = React.useState([]);

  const [arbitrosDisponiveis, setArbitrosDisponiveis] = useState([]);

  const [clubesDisponiveis, setClubesDisponiveis] = useState([]);

  const [dataSource, setDataSource] = useState([]);

  let [temRecibo, setTemRecibo] = useState(false);
  let [naoTemRecibo, setNaoTemRecibo] = useState(false);
  let [temTransporte, setTemTransporte] = useState(false);
  let [naoTemTransporte, setNaoTemTransporte] = useState(false);
  let [clubesRelacionados, setClubesRelacionados] = useState([]);

  let [nivelDeArbitro, setNivelDeArbitro] = useState(0);

  function handleSubmissionConfirmation() {
    Meteor.call("getPreNomeacoesRealizadas", Meteor.user(), (err, result) => {
      if (err) {
        console.log(err);
      } else if (result) {
        console.log("result", result);

        let preNomeacoesRealizadas = result;

        Meteor.call(
          "submeteJogosComNomeacoes",
          preNomeacoesRealizadas,
          (err, result) => {
            if (err) {
              console.log("ERRRRROOOOO", { err });
            }
            if (result) {
              console.log("Success");
            }
          }
        );
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
        //console.log("dataFromDB: ", dataFromDB);
        return setDataSource(dataFromDB);
      } else {
        return setDataSource([]);
      }
    });
  }

  function reloadData() {
    //console.log("Entrei no metodo!! ");

    // Carrega pela primeira vez
    if (dataSource.length === 0) {
      loadData();
    }
    // Caso o CA carregue jogos novos: DataSource != 0 mas tem de ser carregado novamente
    else {
      Meteor.call(
        "jogosForamUpdated",
        Meteor.user(),
        dataSource,
        (err, result) => {
          //console.log("jogos atualizados???", result);
          if (result === true) {
            loadData();
          }
        }
      );
    }
  }

  function handleChangeClubes(value) {
    setClubesRelacionados(value);
  }

  function handleChangeNivel(value) {
    console.log("value nivel", value);
    if (value === " ") {
      setNivelDeArbitro(0);
    } else {
      setNivelDeArbitro(value);
    }
  }

  return (
    <>
      {reloadData()}

      <div
        className="demo-app"
        style={{ height: "10%", width: "auto", alignSelf: "center" }}
      >
        <div className="demo-app-sidebar"></div>
        <div>
          <div className="demo-app-main" style={{ overflow: "auto" }}>
            <div className="container">
              <div className="table-responsive" style={{ display: "flex" }}>
                <br />
                <div
                  style={{
                    backgroundColor: "white",
                    alignSelf: "flex-start",
                    marginTop: "5px",
                  }}
                >
                  <h2 className="blue">
                    {currJogo.Jogo != undefined
                      ? "Selecionado: Jogo nº " + currJogo.Jogo
                      : "Clique num jogo para o selecionar."}
                  </h2>
                  <div id="filtros">
                    <label className="labels" style={{ marginLeft: "5px" }}>
                      Tem Transporte próprio:
                      <input
                        className="inputt"
                        type={"checkbox"}
                        onChange={() => {
                          if (naoTemTransporte) {
                            window.alert(
                              "Selecione apenas uma das opções disponíveis sobre Transporte Próprio."
                            );
                          } else {
                            setTemTransporte(!temTransporte);
                          }
                        }}
                        style={{
                          marginLeft: "46px",
                          height: "30px",
                          width: "30px",
                        }}
                        checked={temTransporte}
                      ></input>
                    </label>
                    <label className="labels" style={{ marginLeft: "5px" }}>
                      Não tem transporte próprio:
                      <input
                        className="inputt"
                        type={"checkbox"}
                        onChange={() => {
                          if (temTransporte) {
                            window.alert(
                              "Selecione apenas uma das opções disponíveis sobre Transporte Próprio."
                            );
                          } else {
                            setNaoTemTransporte(!naoTemTransporte);
                          }
                        }}
                        style={{
                          marginLeft: "15px",
                          height: "30px",
                          width: "30px",
                        }}
                        checked={naoTemTransporte}
                      ></input>
                    </label>
                    <label className="labels" style={{ marginLeft: "5px" }}>
                      Emite Recibo Verde:
                      <input
                        className="inputt"
                        type={"checkbox"}
                        onChange={() => {
                          if (naoTemRecibo) {
                            window.alert(
                              "Selecione apenas uma das opções disponíveis sobre Emissão de Recibos."
                            );
                          } else {
                            setTemRecibo(!temRecibo);
                          }
                        }}
                        style={{
                          marginLeft: "85px",
                          height: "30px",
                          width: "30px",
                        }}
                        checked={temRecibo}
                      ></input>
                    </label>
                    <label className="labels" style={{ marginLeft: "5px" }}>
                      Não Emite Recibo Verde:
                      <input
                        className="inputt"
                        type={"checkbox"}
                        onChange={() => {
                          if (temRecibo) {
                            window.alert(
                              "Selecione apenas uma das opções disponíveis sobre Emissão de Recibos."
                            );
                          } else {
                            setNaoTemRecibo(!naoTemRecibo);
                          }
                        }}
                        style={{
                          marginLeft: "54px",
                          height: "30px",
                          width: "30px",
                        }}
                        checked={naoTemRecibo}
                      ></input>
                    </label>

                    <label className="labels" style={{ marginLeft: "5px" }}>
                      Árbitro de Nível:
                      <Select
                        className="inputt"
                        onChange={handleChangeNivel}
                        style={{
                          marginLeft: "60px",
                          height: "30px",
                          width: "70px",
                          borderRadius: "5px",
                          borderBlockColor: "rgba(255, 255, 255, 0.5)",
                          boxSizing: "border-box",
                          backgroundColor: "#f0f0f0",
                          fontWeight: "bold",
                          fontSize: "15px",
                        }}
                      >
                        <Option className="inputt-option" value={""}></Option>
                        <Option className="inputt-option" value={"1"}>
                          I
                        </Option>
                        <Option className="inputt-option" value={"2"}>
                          II
                        </Option>
                        <Option className="inputt-option" value={"3"}>
                          III
                        </Option>
                      </Select>
                    </label>

                    <label className="labels" style={{ marginLeft: "5px" }}>
                      Relação com clubes:
                    </label>
                    <label className="labels">
                      <br></br>
                      <br></br>
                      <Select
                        mode="multiple"
                        style={{
                          marginLeft: "5px",
                          width: "380px",
                        }}
                        defaultValue={[]}
                        placeholder="Selecione clubes"
                        onClick={() =>
                          Meteor.call("getClubesDisponiveis", (err, result) => {
                            console.log(result);
                            if (err) {
                              console.log(err);
                            } else if (result) {
                              return setClubesDisponiveis(result);
                            }
                          })
                        }
                        onChange={handleChangeClubes}
                        optionLabelProp="label"
                      >
                        {clubesDisponiveis.map((clube) => {
                          return (
                            <Select.Option
                              value={clube}
                              label={clube}
                              key={"option_clube" + _.uniqueId()}
                            >
                              <div className="demo-option-label-item">
                                {" "}
                                {clube}{" "}
                              </div>
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </label>

                    <label className="labels" style={{ marginLeft: "5px" }}>
                      Arbitros disponíveis:
                    </label>
                    <ul
                      style={{
                        marginTop: "0px",
                        height: "auto",
                      }}
                    >
                      {arbitrosDisponiveis.map((arb) => {
                        if (currJogo === {}) {
                          return "Clique num jogo para obter os Árbitros Disponíveis";
                        } else if (arbitrosDisponiveis.length === 1) {
                          return "SEM RESULTADOS";
                        } else if (arb != " ")
                          return (
                            <li style={{ textAlign: "initial" }}>
                              {" "}
                              {arb + "; \n"}{" "}
                            </li>
                          );
                      })}
                    </ul>
                  </div>
                  <Button
                    onClick={() => {
                      handleSubmissionConfirmation();
                      window.alert("Nomeações enviadas para os Árbitros.");
                    }}
                    type="primary"
                    style={{
                      marginBottom: 16,
                    }}
                  >
                    Submeter e enviar nomeações
                  </Button>
                </div>

                <StyledTable
                  //bordered
                  rowClassName={(record, index) =>
                    index % 2 === 0 ? "table-row-light" : "table-row-dark"
                  }
                  dataSource={dataSource}
                  columns={colunasNomeacoesPrivadas}
                  pagination={false}
                  style={{ marginLeft: "5px", marginTop: "5px" }}
                  onRow={(record) => {
                    return {
                      onClick: (event) => {
                        //console.log("event", event);
                        //console.log("event.target.value", event.target.value);

                        console.log("record eh:", record);

                        if (event.target != "div.ant-select-selector") {
                          Meteor.call(
                            "arbitrosDisponiveis",
                            record,
                            temRecibo,
                            naoTemRecibo,
                            temTransporte,
                            naoTemTransporte,
                            clubesRelacionados,
                            nivelDeArbitro,
                            (err, result) => {
                              console.log(
                                "result arbitros disponiveis: ",
                                result
                              );
                              if (err) {
                                console.log("ERRRRROOOOO", { err });
                              } else if (result.length != 0) {
                                return setArbitrosDisponiveis(result);
                              }
                            }
                          );
                          currJogo = record;
                        }
                      },
                    };
                  }}
                />
                <br></br>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
