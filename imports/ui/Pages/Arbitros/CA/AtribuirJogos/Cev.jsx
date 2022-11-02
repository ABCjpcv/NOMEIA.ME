import React, { useRef, useEffect, useState } from "react";
import {
  Button,
  Input,
  message,
  Space,
  Select,
  Table,
  Form,
  Modal,
  Cascader,
  DatePicker,
  TimePicker,
  InputNumber,
  Popconfirm,
} from "antd";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../Geral/Header";
import {
  SearchOutlined,
  AlertOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  SaveOutlined,
  EditOutlined,
} from "@ant-design/icons";

import { ConfigProvider } from "antd";

import locale from "antd/es/locale/pt_PT";

import Highlighter from "react-highlight-words";

import moment from "moment/moment";

import $ from "jquery";

const { Option } = Select;

const StyledTable = styled((props) => (
  <Table
    {...props}
    // scroll={{
    //   x: 1600,
    // }}
  />
))`
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
    if (a.length == 0) {
      a = "z";
    }
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
let prevNomeArbitro = "";

export function Cev({ user }) {
  let navigate = useNavigate();

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Pesquisar por: ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Pesquisar
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Limpar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: true,
              });
            }}
          >
            Fechar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const colunasNomeacoesPrivadas = [
    {
      title: "Jogo",
      dataIndex: "Jogo",
      key: "Jogo",
      sorter: (a, b) => parseInt(a.Jogo) - parseInt(b.Jogo),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "5.8%",
      ...getColumnSearchProps("Jogo"),
    },
    {
      title: "Dia",
      dataIndex: "Dia",
      key: "Dia",
      sorter: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "6.3%",
      ...getColumnSearchProps("Dia"),
    },
    {
      title: "Hora",
      dataIndex: "Hora",
      key: "Hora",
      sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "5.8%",
      ...getColumnSearchProps("Hora"),
    },
    {
      title: "Prova",
      dataIndex: "Prova",
      key: "Prova",
      sorter: (a, b) => comparaAminhaLindaString(a.Prova, b.Prova),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "6%",

      ...getColumnSearchProps("Prova"),
    },
    {
      title: "Série",
      dataIndex: "Serie",
      key: "Serie",
      sorter: (a, b) => comparaAminhaLindaString(a.Serie, b.Serie),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "5.5%",

      ...getColumnSearchProps("Serie"),
    },
    {
      title: "Equipas",
      dataIndex: "Equipas",
      key: "Equipas",
      sorter: (a, b) => comparaAminhaLindaString(a.Equipas, b.Equipas),
      sortDirections: ["descend", "ascend"],
      fixed: "left",

      ...getColumnSearchProps("Equipas"),
    },
    {
      title: "Pavilhão",
      dataIndex: "Pavilhao",
      key: "Pavilhao",
      sorter: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
      sortDirections: ["descend", "ascend"],
      fixed: "left",

      ...getColumnSearchProps("Pavilhao"),
    },
    {
      title: "1º Árbitro",
      dataIndex: "Arbitro1",
      key: "Arbitro1",
      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro1, b.Arbitro1),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("Arbitro1"),
      render: (text, record, index) => (
        <>
          <Select
            bordered
            showSearch
            mode="single"
            name="select_arbitro1"
            style={{
              width: "120px",
              backgroundColor:
                record.tags[0] === ""
                  ? "white"
                  : record.tags[0] === "pendente"
                  ? "#FFB963"
                  : record.tags[0] === "confirmado"
                  ? "#6FD25A"
                  : record.tags[0] === "recusado"
                  ? "#ef5350"
                  : "white",
            }}
            key={"select_arbitro1_" + index}
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Arbitro1 != "" ? record.Arbitro1 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
            showArrow={false}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  className="select-ref-choice"
                  value={arb + ""}
                  key={"option_1_arbitro_index_" + index + "_" + _.uniqueId()}
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
      title: "2º Árbitro",
      dataIndex: "Arbitro2",
      key: "Arbitro2",
      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro2, b.Arbitro2),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("Arbitro2"),
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_arbitro2"
            style={{
              width: "120px",
              backgroundColor:
                record.tags[1] === ""
                  ? "white"
                  : record.tags[1] === "pendente"
                  ? "#FFB963"
                  : record.tags[1] === "confirmado"
                  ? "#6FD25A"
                  : record.tags[1] === "recusado"
                  ? "#ef5350"
                  : "white",
            }}
            key={"select_arbitro2_" + index}
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Arbitro2 != "" ? record.Arbitro2 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
            showArrow={false}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  className="select-ref-choice"
                  value={arb + ""}
                  key={"option_2_arbitro_index_" + index + "_" + _.uniqueId()}
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
      title: "Juiz de linha",
      dataIndex: "JL1",
      key: "JL1",
      sorter: (a, b) => comparaAminhaLindaString(a.JL1, b.JL1),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("JL1"),
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_jl1"
            style={{
              width: "120px",
              backgroundColor:
                record.tags[2] === ""
                  ? "white"
                  : record.tags[2] === "pendente"
                  ? "#FFB963"
                  : record.tags[2] === "confirmado"
                  ? "#6FD25A"
                  : record.tags[2] === "recusado"
                  ? "#ef5350"
                  : "white",
            }}
            key={"select_jl1_" + index}
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Jl1 != "" ? record.JL1 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
            showArrow={false}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  className="select-ref-choice"
                  value={arb + ""}
                  key={"option_1_jl_index_" + index + "_" + _.uniqueId()}
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
      title: "Juiz de linha",
      dataIndex: "JL2",
      key: "JL2",
      sorter: (a, b) => comparaAminhaLindaString(a.JL2, b.JL2),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("JL2"),
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_jl2"
            style={{
              width: "120px",
              backgroundColor:
                record.tags[3] === ""
                  ? "white"
                  : record.tags[3] === "pendente"
                  ? "#FFB963"
                  : record.tags[3] === "confirmado"
                  ? "#6FD25A"
                  : record.tags[3] === "recusado"
                  ? "#ef5350"
                  : "white",
            }}
            key={"select_jl2_" + index}
            type="select"
            onChange={handleChangeSelecaoArbitro}
            value={record.Jl2 != "" ? record.JL2 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
            showArrow={false}
          >
            {arbitrosDisponiveis.map((arb) => {
              return (
                <Select.Option
                  className="select-ref-choice"
                  value={arb + ""}
                  key={"option_2_jl_index_" + index + "_" + _.uniqueId()}
                >
                  {arb + ""}
                </Select.Option>
              );
            })}
          </Select>
        </>
      ),
    },
    // {
    //   title: "JL3",
    //   dataIndex: "JL3",
    //   key: "JL3",
    //   sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
    //   sortDirections: ["descend", "ascend"],
    //   render: (text, record, index) => (
    //     <>
    //       <Select
    //         showSearch
    //         mode="single"
    //         name="select_jl3"
    //         style={{
    //           width: "120px",
    //           backgroundColor:
    //             record.tags[4] === ""
    //               ? "white"
    //               : record.tags[4] === "pendente"
    //               ? "#FFB963"
    //               : record.tags[4] === "confirmado"
    //               ? "#6FD25A"
    //               : record.tags[4] === "recusado"
    //               ? "#ef5350"
    //               : "white",
    //         }}
    //         key={"select_jl3_" + index}
    //         type="select"
    //         // onChange={handleChangeSelecaoArbitro}
    //         onSelect={handleChangeSelecaoArbitro}
    //         value={record.Jl3 != "" ? record.JL3 : null}
    //         disabled={disabledDataSource.includes(record)}
    //         size="small"
    //         showArrow={false}
    //       >
    //         {arbitrosDisponiveis.map((arb) => {
    //           return (
    //             <Select.Option
    //               className="select-ref-choice"
    //               value={arb + ""}
    //               key={"option_3_jl_index_" + index + "_" + _.uniqueId()}
    //             >
    //               {arb + ""}
    //             </Select.Option>
    //           );
    //         })}
    //       </Select>
    //     </>
    //   ),
    // },
    // {
    //   title: "JL4",
    //   dataIndex: "JL4",
    //   key: "JL4",
    //   sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
    //   sortDirections: ["descend", "ascend"],
    //   render: (text, record, index) => (
    //     <>
    //       <Select
    //         showSearch
    //         mode="single"
    //         name="select_jl4"
    //         style={{
    //           width: "120px",
    //           backgroundColor:
    //             record.tags[5] === ""
    //               ? "white"
    //               : record.tags[5] === "pendente"
    //               ? "#FFB963"
    //               : record.tags[5] === "confirmado"
    //               ? "#6FD25A"
    //               : "#ef5350",
    //         }}
    //         key={"select_jl4_" + index}
    //         type="select"
    //         onChange={handleChangeSelecaoArbitro}
    //         value={record.Jl4 != "" ? record.JL4 : null}
    //         disabled={disabledDataSource.includes(record)}
    //         size="small"
    //         showArrow={false}
    //       >
    //         {arbitrosDisponiveis.map((arb) => {
    //           return (
    //             <Select.Option
    //               className="select-ref-choice"
    //               value={arb + ""}
    //               key={"option_4_jl_index_" + index + "_" + _.uniqueId()}
    //             >
    //               {arb + ""}
    //             </Select.Option>
    //           );
    //         })}
    //       </Select>
    //     </>
    //   ),
    // },
    {
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      fixed: "right",
      width: "8%",
      render: (_, record, key) => (
        <div style={{ display: "flex" }}>
          <div>
            <Button
              shape="round"
              className="edit-button"
              size="small"
              style={{
                display: "flex",
                flexDirection: "row",
                fontSize: "12px",
              }}
              onClick={() => {
                $(".save-button")[key].toggleAttribute("hidden");
                $(".edit-button")[key].toggleAttribute("hidden");

                let newDisabledDataSource = [];
                for (
                  let index = 0;
                  index < disabledDataSource.length;
                  index++
                ) {
                  if (disabledDataSource[index] !== record) {
                    newDisabledDataSource.push(disabledDataSource[index]);
                  }
                }

                setDisabledDataSource(newDisabledDataSource);
                setEditableRow(record);
                setEdit(true);
              }}
              disabled={!disabledDataSource.includes(record)}
            >
              <EditOutlined
                width={"1.5em"}
                height={"1.5em"}
                style={{ marginTop: "8%" }}
              />
              Alterar
            </Button>
            <Popconfirm
              className="popconfirm_deleteGame"
              title="Tem a certeza que quer apagar?"
              onConfirm={() => handleDeleteGame(record)}
              cancelText="Cancelar"
            >
              <Button
                shape="round"
                className="delete-button"
                size="small"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  fontSize: "12px",
                }}
              >
                <DeleteOutlined
                  width={"1.5em"}
                  height={"1.5em"}
                  style={{ marginTop: "8%" }}
                />
                Apagar
              </Button>
            </Popconfirm>

            <Button
              shape="round"
              type="primary"
              size="small"
              className="save-button"
              style={{ display: "flex", flexDirection: "row" }}
              hidden
              onClick={() => {
                $(".save-button")[key].toggleAttribute("hidden");
                $(".edit-button")[key].toggleAttribute("hidden");

                if (editableRow === record) {
                  message.warn("Não foi detetada alteração!");
                  setDisabledDataSource(dataSource);
                } else {
                  Meteor.call("alteraNomeacao", record, user, (err, result) => {
                    if (err) console.log("Error", err);
                    if (result == 1)
                      message.success("Alteração registada com sucesso!");
                  });

                  console.log("Guardado");

                  loadData(false);
                  setDisabledDataSource(dataSource);
                }
              }}
            >
              <SaveOutlined
                width={"1.5em"}
                height={"1.5em"}
                style={{ marginTop: "8%" }}
              />
              Guardar
            </Button>
          </div>
        </div>
      ),
    },
  ];

  /**
   * ATRIBUICAO DOS ESTADOS (STATES)
   */

  let [arbitrosDisponiveis, setArbitrosDisponiveis] = useState([]);

  let [clubesDisponiveis, setClubesDisponiveis] = useState([]);

  let [dataSource, setDataSource] = useState([]);

  let [disabledDataSource, setDisabledDataSource] = useState([]);

  let [temRecibo, setTemRecibo] = useState(false);
  let [naoTemRecibo, setNaoTemRecibo] = useState(false);
  let [temTransporte, setTemTransporte] = useState(false);
  let [naoTemTransporte, setNaoTemTransporte] = useState(false);
  let [clubesRelacionados, setClubesRelacionados] = useState([]);
  let [nivelDeArbitro, setNivelDeArbitro] = useState(0);

  let [editableRow, setEditableRow] = useState("");
  let [edit, setEdit] = useState();

  useEffect(() => {
    console.log("disabledDataSource, BANANANANANAN", disabledDataSource);
    console.log("dataSource", dataSource);
  }, [disabledDataSource, dataSource]);

  function handleSubmissionConfirmation() {
    Meteor.call("getPreNomeacoesRealizadas", Meteor.user(), (err, result) => {
      if (err) {
        console.log(err);
      } else if (result) {
        // console.log("BANANANAANANNANNANNAN", result);

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
    let disabledData = dataSource;

    setDisabledDataSource(disabledData);
    setDataSource(dataSource);
  }

  function handleChangeSelecaoArbitro(value, key) {
    console.log("value", value);
    console.log("key", key);

    let indexAux = key.key.split("_");

    for (let i = 0; i < indexAux.length; i++) {
      const element = indexAux[i];
      if (element === "index") {
        index = parseInt(indexAux[i + 1]);
      }
    }

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

    // console.log("prevNomeArbitro", prevNomeArbitro);

    if (prevNomeArbitro === "" && value === " ") {
      return;
    } else {
      if (value.length === 1) {
        // remover a nomeacao anterior
        Meteor.call(
          "removeNomeacaoCalendarioArbitro",
          currNomeArbitro,
          titulo,
          currJogo,
          key.key,
          (err, result) => {
            if (err) {
              console.error(err);
            } else if (result) {
              // console.log(result);
            }
          }
        );
      } else if (prevNomeArbitro.length > 0) {
        Meteor.call(
          "removeNomeacaoCalendarioArbitro",
          prevNomeArbitro,
          titulo,
          currJogo,
          key.key,
          (err, result) => {
            if (err) {
              console.error(err);
            } else if (result) {
              // console.log(result);
            }
          }
        );

        currNomeArbitro = value;
        // console.log("nomeArbitro: ", currNomeArbitro);

        Meteor.call("verificaRestricoes", currNomeArbitro, (err, result) => {
          let condicoesArbitro = JSON.parse(JSON.stringify(result));
          let relacoes = condicoesArbitro.relacaoComEquipas;

          // let mensagemRestricoes =
          //   currNomeArbitro +
          //   (!temCarro ? " não tem carro." : " tem carro.") +
          //   "\n" +
          //   currNomeArbitro +
          //   (!emiteRecibo ? " não emite recibo." : " emite recibo.") +
          //   "\n";

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
          }

          // AVISA SE ARBITRO TEM RELACOES COM ALGUM CLUBE

          if (mensagemRelacoesClubes.length != currNomeArbitro.length)
            message.warn(mensagemTotal);
        });

        //console.log("key", key);

        Meteor.call(
          "addNomeacaoCalendarioArbitro",
          currNomeArbitro,
          currJogo,
          key.key,
          edit,
          (err, result) => {
            //console.log("RESULTADO", result);

            if (err) {
              console.error(err);
            } else if (result) {
              //console.log(result);
            }
          }
        );
      } else {
        currNomeArbitro = value;
        // console.log("nomeArbitro: ", currNomeArbitro);

        Meteor.call("verificaRestricoes", currNomeArbitro, (err, result) => {
          let condicoesArbitro = JSON.parse(JSON.stringify(result));
          let relacoes = condicoesArbitro.relacaoComEquipas;

          // let mensagemRestricoes =
          //   currNomeArbitro +
          //   (!temCarro ? " não tem carro." : " tem carro.") +
          //   "\n" +
          //   currNomeArbitro +
          //   (!emiteRecibo ? " não emite recibo." : " emite recibo.") +
          //   "\n";

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
          }

          // AVISA SE ARBITRO TEM RELACOES COM ALGUM CLUBE

          if (mensagemRelacoesClubes.length != currNomeArbitro.length)
            message.warn(mensagemTotal);
        });

        //console.log("key", key);

        Meteor.call(
          "addNomeacaoCalendarioArbitro",
          currNomeArbitro,
          currJogo,
          key.key,
          edit,
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
  }

  function loadData(isEditing) {
    let email = Meteor.user().emails[0].address;
    Meteor.call("carregaJogosSemanais", email, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result[0].length > 0) {
        console.log("RESULTADO", result);
        let dataFromDB = [];
        let preNomeacoes = result[0];

        for (let index = 0; index < preNomeacoes.length; index++) {
          let jogoLido = preNomeacoes[index];
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
            JL1: jogoLido.juiz_linha[0],
            JL2: jogoLido.juiz_linha[1],
            // JL3: jogoLido.juiz_linha[2],
            // JL4: jogoLido.juiz_linha[3],
            key: jogoLido.key,
            tags: jogoLido.tags,
          };

          dataFromDB.push(obj);
        }
        // console.log("dataFromDB: ", dataFromDB);
        setDataSource(dataFromDB);
        setEdit(isEditing);
        // console.log("edit", isEditing);
        // console.log("editableRow", editableRow);
        if (
          result[1] == true &&
          (isEditing == undefined || isEditing == false)
        ) {
          let dds = [];
          for (let index = 0; index < dataFromDB.length; index++) {
            const element = dataFromDB[index];
            if (element !== editableRow) {
              dds.push(element);
            }
          }
          setDisabledDataSource(dds);
        }
      } else {
        setDataSource([]);
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

  function handleAlert() {
    Meteor.call("enviaMailAlerta", dataSource, (err, result) => {
      if (err) {
        console.log(err);
      } else if (result > 0) {
        message.success("Alertas enviados para " + result + " árbitros");
      } else {
        message.error("Não foi possível enviar os emails.");
      }
    });
  }
  let [isModalVisible, setModalVisible] = useState();

  // let [novoJogoID, setNovoJogoID] = useState();
  // let [novoJogoDia, setNovoJogoDia] = useState();
  // let [novoJogoHora, setNovoJogoHora] = useState();
  let novoJogoProva = "";
  // let [novoJogoSerie, setNovoJogoSerie] = useState();
  // let [novoJogoD, setNovoJogoID] = useState();

  // {jogo: 0, dia: "", hora: "", prova: "", serie: "", equipas: "", pavilhao: ""});

  const disabledDate = (current) => {
    // Can not select days before today

    return !moment().isSameOrBefore(current);
  };

  let [idJogo, setIdJogo] = useState("");
  let [idDia, setIdDia] = useState("");
  let [idHora, setIdHora] = useState("");
  let [idSerie, setIdSerie] = useState("");
  let [idEquipaA, setIdEquipaA] = useState("");
  let [idEquipaB, setIdEquipaB] = useState("");
  let [idPavilhao, setIdPavilhao] = useState("");

  let [isAcceptFormDisabled, setIsAcceptFormDisabled] = useState(Boolean);

  function handleAddJogoNovo() {
    Modal.confirm({
      title: "Adicionar novo jogo:",
      content: (
        <div>
          <>
            <br></br>
            <Form
              labelCol={{
                span: 3,
                offset: 0,
              }}
              wrapperCol={{
                span: 21,
              }}
              layout="horizontal"
              size="small"
            >
              <Form.Item label="Jogo">
                <InputNumber
                  id="newGameId"
                  placeholder="****"
                  min={0}
                  onChange={(e) => setIdJogo(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Dia">
                <ConfigProvider locale={locale}>
                  <DatePicker
                    locale={locale}
                    placeholder="Selecione o dia..."
                    style={{ width: "100%" }}
                    id="newGameDate"
                    disabledDate={disabledDate}
                    onChange={(e) => setIdDia(e.target.value)}
                    // showTime={{
                    //   defaultValue: moment("00:00:00"),
                    // }}
                  />
                </ConfigProvider>
              </Form.Item>
              <Form.Item label="Hora">
                <TimePicker
                  locale={locale}
                  placeholder="Selecione a hora..."
                  style={{ width: "100%" }}
                  id="newGameHour"
                  format={"HH:mm"}
                  secondStep={1}
                  onChange={(e) => setIdHora(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="Prova">
                <Cascader
                  id="newGameProva"
                  placeholder="Selecione a prova..."
                  onChange={(e) => {
                    let p = "";
                    for (let index = 0; index < e.length; index++) {
                      p = p + e[index];
                    }
                    novoJogoProva = p;
                  }}
                  options={[
                    {
                      value: "NS",
                      label: "NS",
                      children: [
                        {
                          value: "F",
                          label: "F",
                          children: [
                            {
                              value: "I",
                              label: "I",
                            },
                            {
                              value: "II",
                              label: "II",
                            },
                            {
                              value: "III",
                              label: "III",
                            },
                          ],
                        },
                        {
                          value: "M",
                          label: "M",
                          children: [
                            {
                              value: "I",
                              label: "I",
                            },
                            {
                              value: "II",
                              label: "II",
                            },
                            {
                              value: "III",
                              label: "III",
                            },
                          ],
                        },
                      ],
                    },
                    {
                      value: "CR",
                      label: "CR",
                      children: [
                        {
                          value: "INF",
                          label: "INF",
                          children: [
                            { value: "F", label: "F" },
                            { value: "M", label: "M" },
                          ],
                        },
                        {
                          value: "INI",
                          label: "INI",
                          children: [
                            { value: "F", label: "F" },
                            { value: "M", label: "M" },
                          ],
                        },
                        {
                          value: "CAD",
                          label: "CAD",
                          children: [
                            { value: "F", label: "F" },
                            { value: "M", label: "M" },
                          ],
                        },
                        {
                          value: "JUV",
                          label: "JUV",
                          children: [
                            { value: "F", label: "F" },
                            { value: "M", label: "M" },
                          ],
                        },
                        {
                          value: "JUN",
                          label: "JUN",
                          children: [
                            { value: "F", label: "F" },
                            { value: "M", label: "M" },
                          ],
                        },
                        {
                          value: "S",
                          label: "S",
                          children: [
                            {
                              value: "F",
                              label: "F",
                              children: [{ value: "III", label: "III" }],
                            },
                            {
                              value: "M",
                              label: "M",
                              children: [{ value: "III", label: "III" }],
                            },
                          ],
                        },
                      ],
                    },
                    {
                      value: "CN",
                      label: "CN",
                      children: [
                        {
                          value: "JB1",
                          label: "JB1",
                        },
                        {
                          value: "JNB",
                          label: "JNB",
                        },
                      ],
                    },
                  ]}
                />
              </Form.Item>

              <Form.Item label="Série">
                <Input
                  id="newGameSerie"
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => setIdSerie(e.target.value)}
                  placeholder="Selecione a serie..."
                />
              </Form.Item>
              <Form.Item label="Equipas">
                <Input
                  id="newGameEquipaA"
                  style={{ width: "46%", textTransform: "uppercase" }}
                  onChange={(e) => setIdEquipaA(e.target.value)}
                  placeholder="Visitada"
                />{" "}
                —{" "}
                <Input
                  id="newGameEquipaB"
                  style={{ width: "47%", textTransform: "uppercase" }}
                  onChange={(e) => setIdEquipaB(e.target.value)}
                  placeholder="Visitante"
                />
              </Form.Item>
              <Form.Item label="Pavilhão">
                <Input
                  id="newGamePavilhao"
                  type="text"
                  style={{ textTransform: "uppercase" }}
                  onChange={(e) => setIdPavilhao(e.target.value)}
                  placeholder="Selecione o pavilhão..."
                />
              </Form.Item>
            </Form>
          </>
        </div>
      ),
      width: "42%",
      keyboard: false,
      okText: "Adicionar jogo",
      closable: true,

      onOk() {
        let id = document.getElementById("newGameId").value;
        let dia = document.getElementById("newGameDate").value;
        let hora = document.getElementById("newGameHour").value;
        let serie = document
          .getElementById("newGameSerie")
          .value.toString()
          .toUpperCase();
        let prova = novoJogoProva;
        let equipaA = document
          .getElementById("newGameEquipaA")
          .value.toString()
          .toUpperCase();
        let equipaB = document
          .getElementById("newGameEquipaB")
          .value.toString()
          .toUpperCase();
        let pavilhao = document
          .getElementById("newGamePavilhao")
          .value.toString()
          .toUpperCase();
        let valido = true;
        if (id.length <= 0) {
          message.warn("Não colocou número de jogo!");
          valido = false;
        }
        if (valido && dia.length <= 0) {
          message.warn("Não colocou dia!");
          valido = false;
        }
        if (valido && hora.length <= 0) {
          message.warn("Não colocou hora!");
          valido = false;
        }
        if (valido && prova.length <= 0) {
          message.warn("Não colocou prova!");
          valido = false;
        }
        if (valido && serie.length <= 0) {
          message.warn("Não colocou série!");
          valido = false;
        }
        if (valido && equipaA.length <= 0) {
          message.warn("Não colocou equipa visitada!");
          valido = false;
        }
        if (valido && equipaB.length <= 0) {
          message.warn("Não colocou equipa visitante!");
          valido = false;
        }
        if (valido && pavilhao.length <= 0) {
          message.warn("Não colocou pavilhão!");
          valido = false;
        }

        setFormValido(valido);

        console.log(
          "id",
          id,
          "dia",
          dia,
          "hora",
          hora,
          "prova",
          prova,
          "serie",
          serie,
          "equipaA",
          equipaA,
          "equipaB",
          equipaB,
          "pavilhao",
          pavilhao
        );
        if (valido && !dataSource.includes(id)) {
          Meteor.call(
            "adicionaJogoNovo",
            id,
            dia,
            hora,
            prova,
            serie,
            equipaA,
            equipaB,
            pavilhao,
            (err, result) => {
              if (err) {
                console.log(err);
              } else {
                message.success("Adicionado o jogo " + id + ".");
              }
            }
          );
          setModalVisible(false);
        } else if (valido && dataSource.includes(id)) {
          message.warn("Esse jogo já existe...");
        } else {
          setModalVisible(true);
        }

        // }
      },
      cancelText: "Cancelar",
      visible: isModalVisible == undefined ? true : isModalVisible,
      className: "modalRecusa",
    });
  }

  function handleDeleteGame(record) {
    Meteor.call("eliminaJogo", record, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        message.success("Jogo eliminado!");
      }
    });
  }

  return (
    <>
      <Header
        user={user}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={false}
        atribuirArbitrosAdesl={false}
        atribuirArbitrosCev={false}
        atribuirArbitrosCR_CN={false}
        carregarJogos={true}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
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
          style={{
            width: "auto",
            alignSelf: "center",
            marginTop: "1%",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              alignSelf: "flex-start",
              marginTop: "0.5%",
              marginLeft: "0.5%",
              marginRight: "0.5%",
              height: "54px",
            }}
          >
            {/* <h2 className="blue">
                {currJogo.Jogo != undefined
                  ? "Jogo nº: " + currJogo.Jogo
                  : "Clique num jogo para o selecionar."}
              </h2> */}
            <div
              id="filtros"
              style={{
                display: "flex",
                flexDirection: "row",
                marginLeft: "0.5%",
                marginTop: "-0.5%",
                whiteSpace: "nowrap",
                justifyContent: "space-between",
                marginBottom: "0.5%",
              }}
            >
              {/* 0 COLUNA*/}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                {/* PRIMEIRA OPCAO FILTRO */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  <h3 className="blue">Filtros:</h3>
                </div>
              </div>

              {/* 1ª COLUNA*/}
              <div>
                {/* PRIMEIRA OPCAO FILTRO */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  <input
                    className="inputt"
                    type={"checkbox"}
                    onChange={() => {
                      if (naoTemTransporte) {
                        setTemTransporte(!temTransporte);
                        setNaoTemTransporte(!naoTemTransporte);
                        // message.warn(
                        //   "Selecione apenas uma das opções disponíveis sobre Transporte Próprio."
                        // );
                      } else {
                        setTemTransporte(!temTransporte);
                      }
                    }}
                    style={{
                      height: "30px",
                      marginRight: "2%",
                    }}
                    checked={temTransporte}
                  ></input>
                  <span> Com transporte próprio </span>
                </div>
                {/* SEGUNDA OPCAO FILTRO */}
                <div
                  style={{
                    display: "flex",
                    marginLeft: "0.5%",
                    marginTop: "-3.5%",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  <input
                    className="inputt"
                    type={"checkbox"}
                    onChange={() => {
                      if (temTransporte) {
                        setNaoTemTransporte(!naoTemTransporte);
                        setTemTransporte(!temTransporte);
                        // message.warn(
                        //   "Selecione apenas uma das opções disponíveis sobre Transporte Próprio."
                        // );
                      } else {
                        setNaoTemTransporte(!naoTemTransporte);
                      }
                    }}
                    style={{
                      height: "30px",

                      marginRight: "2%",
                    }}
                    checked={naoTemTransporte}
                  ></input>
                  <span> Sem transporte próprio </span>
                </div>
              </div>
              {/* 2ª COLUNA*/}
              <div>
                {/* TERCEIRA OPCAO FILTRO */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                    marginLeft: "5%",
                  }}
                >
                  <input
                    className="inputt"
                    type={"checkbox"}
                    onChange={() => {
                      if (naoTemRecibo) {
                        setTemRecibo(!temRecibo);
                        setNaoTemRecibo(!naoTemRecibo);
                        // message.info(
                        //   "Selecione apenas uma das opções disponíveis sobre Emissão de Recibos."
                        // );
                      } else {
                        setTemRecibo(!temRecibo);
                      }
                    }}
                    style={{
                      height: "30px",
                      marginRight: "2%",
                    }}
                    checked={temRecibo}
                  ></input>
                  <span> Emite recibo verde</span>
                </div>
                {/* QUARTA OPCAO FILTRO */}
                <div
                  style={{
                    display: "flex",
                    marginLeft: "5%",
                    alignItems: "center",

                    marginTop: "-3.5%",
                    height: "30px",
                  }}
                >
                  <input
                    className="inputt"
                    type={"checkbox"}
                    onChange={() => {
                      if (temRecibo) {
                        setNaoTemRecibo(!naoTemRecibo);
                        setTemRecibo(!temRecibo);
                        // message.info(
                        //   "Selecione apenas uma das opções disponíveis sobre Emissão de Recibos."
                        // );
                      } else {
                        setNaoTemRecibo(!naoTemRecibo);
                      }
                    }}
                    style={{
                      height: "25px",

                      marginRight: "2%",
                    }}
                    checked={naoTemRecibo}
                  ></input>
                  <span> Não emite recibo verde </span>
                </div>
              </div>

              {/* 3ª COLUNA */}

              <div
                style={{
                  marginLeft: "3%",
                  marginTop: "0.8%",
                }}
              >
                {/* QUINTA OPCAO FILTRO*/}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  <span style={{ marginRight: "2.5%" }}>
                    Árbitro de Nível:{" "}
                  </span>
                  <Select
                    className="inputt"
                    onChange={handleChangeNivel}
                    style={{
                      width: "85px",
                      height: "100%",
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
              </div>

              {/* 4ª COLUNA

                <div
                  style={{
                    marginLeft: "3%",
                    marginTop: "0.8%",
                  }}
                >
                  {/* SEXTA OPCAO FILTRO*
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "30px",
                    }}
                  >
                    <span style={{ marginRight: "0.5%" }}>
                      Sem relação com:
                    </span>
                    <Select
                      mode="multiple"
                      style={{
                        marginLeft: "5px",
                        width: "375px",
                        maxHeight: "min-content",
                      }}
                      allowClear
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
                      maxTagCount={2}
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
                </div> */}

              {/* 5ª COLUNA */}

              <div
                style={{
                  marginLeft: "3%",
                  marginTop: "0.8%",
                  marginRight: "0.5%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  <Button
                    id="enviaAlerta"
                    size="small"
                    onClick={() => {
                      handleAlert();
                    }}
                    icon={<AlertOutlined />}
                  >
                    Alertar Árbitros
                  </Button>

                  <Button
                    id="addJogoNovo"
                    size="small"
                    onClick={() => {
                      handleAddJogoNovo();
                    }}
                    icon={<PlusCircleOutlined />}
                  >
                    Adicionar Jogo
                  </Button>
                </div>
              </div>

              <div
                style={{
                  marginLeft: "3%",
                  marginTop: "0.8%",
                  marginRight: "0.5%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    height: "30px",
                  }}
                >
                  <Button
                    id="enviaNomeacoes"
                    size="small"
                    onClick={() => {
                      handleSubmissionConfirmation();
                      setTimeout(() => {
                        message.success("Nomeações enviadas para os Árbitros.");
                      }, 200);
                      document.getElementById("enviaNomeacoes").disabled = true;
                    }}
                    type="primary"
                    disabled={disabledDataSource.length > 0 ? true : false}
                  >
                    Enviar Nomeações
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="demo-app-main">
              <div className="container">
                <div className="table-responsive">
                  <Table
                    //bordered
                    rowClassName={(index) =>
                      index % 2 === 0 ? "table-row-light" : "table-row-dark"
                    }
                    dataSource={dataSource}
                    columns={colunasNomeacoesPrivadas}
                    pagination={false}
                    size="small"
                    style={{
                      marginLeft: "0.5%",
                      marginTop: "0.5%",
                      marginRight: "0.5%",
                    }}
                    scroll={{
                      y: (6 * window.screen.height) / 10,
                    }}
                    onRow={(record) => {
                      return {
                        onClick: (event) => {
                          console.log("event", event);
                          console.log("event.target.value", event.target.value);

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
                                // console.log(
                                //   "result arbitros disponiveis: ",
                                //   result
                                // );
                                if (err) {
                                  console.log("ERRRRROOOOO", { err });
                                } else if (result.length != 0) {
                                  return setArbitrosDisponiveis(result);
                                }

                                console.log("RESULTADO***", result);
                              }
                            );
                            currJogo = record;
                            prevNomeArbitro = event.target.title;
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
