import React, { useEffect, useState } from "react";
import { Button, message, Popconfirm, Select, Table, Tag } from "antd";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Header } from "../../Geral/Header";

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

export function AtribuirJogos({ user }) {
  let navigate = useNavigate();

  const colunasNomeacoesPrivadas = [
    {
      title: "Jogo",
      dataIndex: "Jogo",
      key: "Jogo",
      sorter: (a, b) => a.key - b.key,
      sortDirections: ["descend", "ascend"],
      width: "4%",
      fixed: "left",
    },
    {
      title: "Dia",
      dataIndex: "Dia",
      key: "Dia",
      sorter: (a, b) => comparaAminhaLindaData(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "6%",
    },
    {
      title: "Hora",
      dataIndex: "Hora",
      key: "Hora",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "4%",
    },
    {
      title: "Prova",
      dataIndex: "Prova",
      key: "Prova",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "6%",
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "4%",
    },
    {
      title: "Equipas",
      dataIndex: "Equipas",
      key: "Equipas",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "6%",
    },
    {
      title: "Pavilhao",
      dataIndex: "Pavilhao",
      key: "Pavilhao",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "7%",
    },
    {
      title: "Arbitro1",
      dataIndex: "Arbitro1",
      key: "Arbitro1",
      width: "10%",
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_arbitro1"
            style={{ width: "100%" }}
            key="select_arbitro1"
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Arbitro1 != "" ? record.Arbitro1 : null}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  value={arb + ""}
                  key={"option_1_arbitro" + _.uniqueId()}
                >
                  {arb + ""}
                </Select.Option>
              );
            })}
          </Select>
        </>
      ),
    },
    {
      title: "Arbitro2",
      dataIndex: "Arbitro2",
      key: "Arbitro2",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      width: "11%",
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_arbitro2"
            style={{ width: "100%" }}
            key="select_arbitro2"
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Arbitro2 != "" ? record.Arbitro2 : null}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  value={arb + ""}
                  key={"option_2_arbitro" + _.uniqueId()}
                >
                  {arb + ""}
                </Select.Option>
              );
            })}
          </Select>
        </>
      ),
    },
    {
      title: "JL1",
      dataIndex: "JL1",
      key: "JL1",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      width: "11%",
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_jl1"
            style={{ width: "100%" }}
            key="select_jl1"
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Jl1 != "" ? record.JL1 : null}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  value={arb + ""}
                  key={"option_1_jl" + _.uniqueId()}
                >
                  {arb + ""}
                </Select.Option>
              );
            })}
          </Select>
        </>
      ),
    },
    {
      title: "JL2",
      dataIndex: "JL2",
      key: "JL2",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      width: "11%",
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_jl2"
            style={{ width: "100%" }}
            key="select_jl2"
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Jl2 != "" ? record.JL2 : null}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  value={arb + ""}
                  key={"option_2_jl" + _.uniqueId()}
                >
                  {arb + ""}
                </Select.Option>
              );
            })}
          </Select>
        </>
      ),
    },
    {
      title: "JL3",
      dataIndex: "JL3",
      key: "JL3",
      width: "11%",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_jl3"
            style={{ width: "100%" }}
            key="select_jl3"
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Jl3 != "" ? record.JL3 : null}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  value={arb + ""}
                  key={"option_3_jl" + _.uniqueId()}
                >
                  {arb + ""}
                </Select.Option>
              );
            })}
          </Select>
        </>
      ),
    },
    {
      title: "JL4",
      dataIndex: "JL4",
      key: "JL4",
      width: "11%",
      sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
      sortDirections: ["descend", "ascend"],
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_jl4"
            style={{ width: "100%" }}
            key="select_jl4"
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Jl4 != "" ? record.JL4 : null}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  value={arb + ""}
                  key={"option_4_jl" + _.uniqueId()}
                >
                  {arb + ""}
                </Select.Option>
              );
            })}
          </Select>
        </>
      ),
    },
  ];

  /**
   * ATRIBUICAO DOS ESTADOS (STATES)
   */

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
              mensagemRelacoesClubes +
              " é " +
              cargo +
              " do clube " +
              clube +
              ".";
          }
        } else {
          mensagemRelacoesClubes =
            mensagemRelacoesClubes + " não tem relações com clubes.";
        }

        let mensagemTotal = mensagemRestricoes + mensagemRelacoesClubes;

        message.warn(mensagemTotal);
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

    loadData();
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
    if (value === "Todos") {
      setNivelDeArbitro(0);
    } else {
      setNivelDeArbitro(value);
    }
  }

  return (
    <>
      <Header
        user={user}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={false}
        atribuirArbitros={false}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
      />
      {reloadData()}

      {dataSource.length === 0 ? (
        <>
          <br></br>
          <h2 className="blue">Não carregou ainda o ficheiro de jogos.</h2>
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              navigate("/Conta/ProfileCA/Carregar_Novos_Jogos");
            }}
          >
            Carregar Jogos Novos
          </Button>
        </>
      ) : (
        <div
          className="demo-app"
          style={{ height: "10%", width: "auto", alignSelf: "center" }}
        >
          <div className="demo-app-sidebar">
            <div
              style={{
                backgroundColor: "white",
                alignSelf: "flex-start",
                marginTop: "0.5%",
                marginLeft: "0.5%",
                marginRight: "0.5%",
              }}
            >
              <h2 className="blue">
                {currJogo.Jogo != undefined
                  ? "Jogo nº: " + currJogo.Jogo
                  : "Clique num jogo para o selecionar."}
              </h2>
              <div id="filtros">
                <div
                  id="firstLineFilters"
                  style={{ display: "flex", marginLeft: "0.5%" }}
                >
                  {/* PRIMEIRA OPCAO FILTRO */}
                  <div>
                    <input
                      className="inputt"
                      type={"checkbox"}
                      onChange={() => {
                        if (naoTemTransporte) {
                          message.warn(
                            "Selecione apenas uma das opções disponíveis sobre Transporte Próprio."
                          );
                        } else {
                          setTemTransporte(!temTransporte);
                        }
                      }}
                      style={{
                        width: "30px",
                      }}
                      checked={temTransporte}
                    ></input>
                    <span> Com Transporte próprio </span>
                  </div>
                  {/* SEGUNDA OPCAO FILTRO */}
                  <div>
                    <input
                      className="inputt"
                      type={"checkbox"}
                      onChange={() => {
                        if (temTransporte) {
                          message.warn(
                            "Selecione apenas uma das opções disponíveis sobre Transporte Próprio."
                          );
                        } else {
                          setNaoTemTransporte(!naoTemTransporte);
                        }
                      }}
                      style={{
                        width: "30px",
                      }}
                      checked={naoTemTransporte}
                    ></input>
                    <span> Sem transporte próprio </span>
                  </div>
                  {/* TERCEIRA OPCAO FILTRO */}
                  <div>
                    <input
                      className="inputt"
                      type={"checkbox"}
                      onChange={() => {
                        if (naoTemRecibo) {
                          message.warn(
                            "Selecione apenas uma das opções disponíveis sobre Emissão de Recibos."
                          );
                        } else {
                          setTemRecibo(!temRecibo);
                        }
                      }}
                      style={{
                        width: "30px",
                      }}
                      checked={temRecibo}
                    ></input>
                    <span> Emite Recibo Verde</span>
                  </div>
                  {/* QUARTA OPCAO FILTRO */}
                  <div>
                    <input
                      className="inputt"
                      type={"checkbox"}
                      onChange={() => {
                        if (temRecibo) {
                          message.warn(
                            "Selecione apenas uma das opções disponíveis sobre Emissão de Recibos."
                          );
                        } else {
                          setNaoTemRecibo(!naoTemRecibo);
                        }
                      }}
                      style={{
                        width: "30px",
                      }}
                      checked={naoTemRecibo}
                    ></input>
                    <span> Não Emite Recibo Verde </span>
                  </div>
                  {/* QUINTA OPCAO FILTRO*/}
                  <div>
                    <span>Árbitro de Nível </span>
                    <Select
                      className="inputt"
                      onChange={handleChangeNivel}
                      style={{
                        width: "fit-content",
                        borderRadius: "5px",
                        borderBlockColor: "rgba(255, 255, 255, 0.5)",
                        boxSizing: "border-box",
                        backgroundColor: "#f0f0f0",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                      defaultValue="Todos"
                    >
                      <Option className="inputt-option" value={"Todos"}>
                        {" "}
                        Todos{" "}
                      </Option>
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
                  </div>

                  <div>
                    Sem relação com:
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
                  </div>
                  <div>
                    <Button
                      onClick={() => {
                        handleSubmissionConfirmation();
                        message.success("Nomeações enviadas para os Árbitros.");
                      }}
                      type="primary"
                      style={{
                        marginRight: "0.5%",
                        marginBottom: "0.5%",
                      }}
                    >
                      Enviar Nomeações para Árbitros
                    </Button>
                  </div>
                </div>

                {/* <label className="labels" style={{ marginLeft: "5px" }}>
                  Arbitros disponíveis:
                </label>
                <ul
                  style={{
                    marginTop: "0px",
                    height: "auto",
                  }}
                >
                  {arbitrosDisponiveis.map((arb) => {
                    if (arbitrosDisponiveis.length === 0) {
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
                </ul> */}
              </div>
            </div>
            <div>
              <div className="demo-app-main" style={{ overflow: "auto" }}>
                <div className="container">
                  <div
                    className="table-responsive"
                    style={{ display: "flex" }}
                  ></div>

                  <StyledTable
                    //bordered
                    rowClassName={(record, index) =>
                      index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    dataSource={dataSource}
                    columns={colunasNomeacoesPrivadas}
                    pagination={true}
                    size="middle"
                    style={{
                      marginLeft: "0.5%",
                      marginTop: "0.5%",
                      marginRight: "0.5%",
                    }}
                    scroll={{
                      x: 1800,
                    }}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
