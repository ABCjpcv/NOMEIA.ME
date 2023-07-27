import React, { useRef, useEffect, useState, useCallback} from "react";
import Papa from "papaparse";
import {
  Button,
  Input,
  message,
  Space,
  Select,
  Upload,
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
import { Header } from "../../../Geral/Header";
import {
  SearchOutlined,
  AlertOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  SaveOutlined,
  EditOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

import { ConfigProvider } from "antd";

import locale from "antd/es/locale/pt_PT";

import Highlighter from "react-highlight-words";

import moment from "moment/moment";

import $ from "jquery";

const { Option } = Select;
const { Dragger } = Upload;

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
    a = x;

    try {
      b.length;
    } catch (error) {
      b = x;
    }

    let tamanho = 0;

    try {
      tamanho = a.length > b.length ? b.length : a.length;
    } catch (error) {
      tamanho = a > b ? b : a;
    }
    for (let index = 0; index < tamanho; index++) {
      posA = a.charCodeAt(index);
      posB = b.charCodeAt(index);

      if (posA != posB) {
        x = posB - posA;
        break;
      }
    }
    return x;
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
let prevNomeArbitro = " ";

export function CampeonatoRegionalNacional({ user }) {
  let navigate = useNavigate();
  let location = useLocation();
  let [selectVal, setSelectVal] = useState("Campeonato Regional / Nacional");

  useEffect(() => {}, [selectVal]);

  const props = {
    beforeUpload: (file) => {
      let isValidFyleType = file.type === "text/csv";
      isValidFyleType = isValidFyleType || file.type === ".xlsx";
      isValidFyleType = isValidFyleType || file.type === ".xls";

      if (!isValidFyleType) {
        message.error(
          "Formato de ficheiro inválido. \n" + `${file.name} não é CSV.`
        );
      }
      return isValidFyleType;
    },
    onChange: (event) => {
      if (event.file) {
        // console.log("selectVal", selectVal);
        if (selectVal != undefined) {
          // Aceita ficheiros csv, xls, xlsx
          Papa.parse(event.file.originFileObj, {
            complete: function (results) {
              let newGames = results.data;
              // console.log("NEW GAMES", newGames);
              if (selectVal === "Campeonato Regional / Nacional") {
                Meteor.call(
                  "adicionaJogosSemanais",
                  newGames,
                  (err, result) => {
                    // console.log(
                    //   "ENTRAS REGIONAL???????????????????????????????????????????"
                    // );
                    if (err) {
                      //console.log("Error: " + err);
                      return;
                    }
                    if (result) {
                      message.success(
                        "Novos jogos do Campeonato Regional / Nacional carregados!"
                      );
                    }
                  }
                  );
                  
                  }
                  loadData();
            },
          });
        } else {
          message.error("Não indicou o campeonato!");
        }
      }
    },
  };

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
      (record[dataIndex] + "").toLowerCase().includes(value.toLowerCase()),
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
          dataIndex: "numerojogo",
          key: "numerojogo",
      sorter: (a, b) => parseInt(a.numerojogo) - parseInt(b.numerojogo),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "5%",
      ...getColumnSearchProps("numerojogo"),
    },
    {
      title: "Dia",
      dataIndex: "dia",
      key: "dia",
      sorter: (a, b) => comparaAminhaLindaData(a.dia, b.dia),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "6.3%",
      ...getColumnSearchProps("dia"),
    },
    {
      title: "Hora",
      dataIndex: "hora",
      key: "hora",
      sorter: (a, b) => comparaAminhaLindaString(a.hora, b.hora),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "5.8%",
      ...getColumnSearchProps("hora"),
    },
    {
      title: "Prova",
      dataIndex: "prova",
      key: "prova",
      sorter: (a, b) => comparaAminhaLindaString(a.prova, b.prova),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "6%",

      ...getColumnSearchProps("prova"),
    },
    {
      title: "Série",
      dataIndex: "serie",
      key: "serie",
      sorter: (a, b) => comparaAminhaLindaString(a.serie, b.serie),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
      width: "5.5%",

      ...getColumnSearchProps("serie"),
    },
    {
      title: "Equipas",
      dataIndex: "equipas",
      key: "equipas",
      sorter: (a, b) => comparaAminhaLindaString(a.equipas, b.equipas),
      sortDirections: ["descend", "ascend"],
      fixed: "left",

      ...getColumnSearchProps("equipas"),
    },
    {
      title: "Pavilhão",
      dataIndex: "pavilhao",
      key: "pavilhao",
      sorter: (a, b) => comparaAminhaLindaString(a.pavilhao, b.pavilhao),
      sortDirections: ["descend", "ascend"],
      fixed: "left",

      ...getColumnSearchProps("pavilhao"),
    },
    {
      title: "1º Árbitro",
      dataIndex: "arbitro1",
      key: "arbitro1",
      sorter: (a, b) => comparaAminhaLindaString(a.arbitro1, b.arbitro1),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("arbitro1"),
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
                  value={record.arbitro1 != "" && record.arbitro1 != " " ? record.arbitro1 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
                  showArrow={false}
                  filterOption={(input, option) => {
                      // Converte o input e o valor da opção para letras minúsculas sem acentos
                      const inputWithoutAccent = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      const optionWithoutAccent = option.children.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      // Verifica se o valor da opção inclui o input fornecido sem acentos
                      return optionWithoutAccent.includes(inputWithoutAccent);
                  }}
          >
            {["", ...arbitrosDisponiveis].map((arb) => {
              //console.log(arbitrosDisponiveis);
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
      dataIndex: "arbitro2",
      key: "arbitro2",
      sorter: (a, b) => comparaAminhaLindaString(a.arbitro2, b.arbitro2),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("arbitro2"),
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
                  value={record.arbitro2 != "" && record.arbitro2 != " " ? record.arbitro2 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
                  showArrow={false}
                  filterOption={(input, option) => {
                      // Converte o input e o valor da opção para letras minúsculas sem acentos
                      const inputWithoutAccent = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      const optionWithoutAccent = option.children.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      // Verifica se o valor da opção inclui o input fornecido sem acentos
                      return optionWithoutAccent.includes(inputWithoutAccent);
                  }}
          >
            {["", ...arbitrosDisponiveis].map((arb) => {
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
      dataIndex: "juiz_linha1",
      key: "juiz_linha1",
      sorter: (a, b) => comparaAminhaLindaString(a.juiz_linha1, b.juiz_linha1),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("juiz_linha1"),
      render: (text, record, index) => (
          <>
          <Select
            showSearch
            mode="single"
            name="select_juiz_linha1"
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
            key={"select_juiz_linha1_" + index}
            type="select"
            onChange={handleChangeSelecaoArbitro}
                  value={record.juiz_linha1 != "" && record.juiz_linha1 != " " ? record.juiz_linha1 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
                  showArrow={false}
                  filterOption={(input, option) => {
                      // Converte o input e o valor da opção para letras minúsculas sem acentos
                      const inputWithoutAccent = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      const optionWithoutAccent = option.children.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      // Verifica se o valor da opção inclui o input fornecido sem acentos
                      return optionWithoutAccent.includes(inputWithoutAccent);
                  }}
          >
            {["", ...arbitrosDisponiveis].map((arb) => {
              return (
                <Select.Option
                  className="select-ref-choice"
                  value={arb + ""}
                  key={"option_1_juiz_linha_index_" + index + "_" + _.uniqueId()}
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
      dataIndex: "juiz_linha2",
      key: "juiz_linha2",
      sorter: (a, b) => comparaAminhaLindaString(a.juiz_linha2, b.juiz_linha2),
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("juiz_linha2"),
      render: (text, record, index) => (
        <>
          <Select
            showSearch
            mode="single"
            name="select_juiz_linha2"
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
            key={"select_juiz_linha2_" + index}
            type="select"
            onChange={handleChangeSelecaoArbitro}
                  value={record.juiz_linha2 != "" && record.juiz_linha2 != " " ? record.juiz_linha2 : null}
            disabled={disabledDataSource.includes(record)}
            size="small"
                  showArrow={false}
                  filterOption={(input, option) => {
                      // Converte o input e o valor da opção para letras minúsculas sem acentos
                      const inputWithoutAccent = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      const optionWithoutAccent = option.children.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      // Verifica se o valor da opção inclui o input fornecido sem acentos
                      return optionWithoutAccent.includes(inputWithoutAccent);
                  }}
          >
            {["", ...arbitrosDisponiveis].map((arb) => {
              return (
                <Select.Option
                  className="select-ref-choice"
                  value={arb + ""}
                  key={"option_2_juiz_linha_index_" + index + "_" + _.uniqueId()}
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
    //   title: "juiz_linha3",
    //   dataIndex: "juiz_linha3",
    //   key: "juiz_linha3",
    //   sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
    //   sortDirections: ["descend", "ascend"],
    //   render: (text, record, index) => (
    //     <>
    //       <Select
    //         showSearch
    //         mode="single"
    //         name="select_juiz_linha3"
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
    //         key={"select_juiz_linha3_" + index}
    //         type="select"
    //         // onChange={handleChangeSelecaoArbitro}
    //         onSelect={handleChangeSelecaoArbitro}
    //         value={record.juiz_linha3 != "" ? record.juiz_linha3 : null}
    //         disabled={disabledDataSource.includes(record)}
    //         size="small"
    //         showArrow={false}
    //       >
    //         {["", ...arbitrosDisponiveis].map((arb) => {
    //           return (
    //             <Select.Option
    //               className="select-ref-choice"
    //               value={arb + ""}
    //               key={"option_3_juiz_linha_index_" + index + "_" + _.uniqueId()}
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
    //   title: "juiz_linha4",
    //   dataIndex: "juiz_linha4",
    //   key: "juiz_linha4",
    //   sorter: (a, b) => comparaAminhaLindaString(a.key, b.key),
    //   sortDirections: ["descend", "ascend"],
    //   render: (text, record, index) => (
    //     <>
    //       <Select
    //         showSearch
    //         mode="single"
    //         name="select_juiz_linha4"
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
    //         key={"select_juiz_linha4_" + index}
    //         type="select"
    //         onChange={handleChangeSelecaoArbitro}
    //         value={record.juiz_linha4 != "" ? record.juiz_linha4 : null}
    //         disabled={disabledDataSource.includes(record)}
    //         size="small"
    //         showArrow={false}
    //       >
    //         {["", ...arbitrosDisponiveis].map((arb) => {
    //           return (
    //             <Select.Option
    //               className="select-ref-choice"
    //               value={arb + ""}
    //               key={"option_4_juiz_linha_index_" + index + "_" + _.uniqueId()}
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
                  Meteor.call("alteraNomeacao", record, user, false, true, (err, result) => {
                    if (err) console.log("Error", err);
                    if (result == 1)
                      message.success("Alteração registada com sucesso!");
                  });

                  // console.log("Guardado");

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

    let [loaded, setLoaded] = useState(false);

  let [dataSource, setDataSource] = useState([]);

  let [disabledDataSource, setDisabledDataSource] = useState([]);

  let [temRecibo, setTemRecibo] = useState(false);
  let [naoTemRecibo, setNaoTemRecibo] = useState(false);
  let [temTransporte, setTemTransporte] = useState(false);
  let [naoTemTransporte, setNaoTemTransporte] = useState(false);
  let [clubesRelacionados, setClubesRelacionados] = useState([]);
  let [nivelDeArbitro, setNivelDeArbitro] = useState(0);

  let [editableRow, setEditableRow] = useState("");
    let [edit, setEdit] = useState(Boolean);

    let [enviaDisabled, setEnviaDisabled] = useState(false);

    useEffect(() => {
                console.log("dataSource", dataSource);
    }, [disabledDataSource])


    useEffect(() => {
        console.log("dataSource", dataSource); 
    }, [dataSource]);

    useEffect(() => {
        //console.log("editing??", edit)
    }, [edit]);

    useEffect(() => {
        //console.log("loaded??", enviaDisabled)
    }, [enviaDisabled]);

  function handleSubmissionConfirmation() {
    Meteor.call("getPreNomeacoesRealizadas", Meteor.user(), (err, result) => {
      if (err) {
        console.log(err);
      } else if (result) {
         console.log("BANANANAANANNANNANNAN", result);

          let preNomeacoesRealizadas = result.preNomeacoesRegionais;

        Meteor.call(
          "submeteJogosComNomeacoes",
          preNomeacoesRealizadas,
          false,
          true,
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

     // loadData(true);
  }

  function handleChangeSelecaoArbitro(value, key) {
    //console.log("value", value);
    //console.log("key", key);

    let indexAux = key.key.split("_");

    for (let i = 0; i < indexAux.length; i++) {
      const element = indexAux[i];
      if (element === "index") {
        index = parseInt(indexAux[i + 1]);
      }
    }

    //console.log("currJogo", currJogo);

    let titulo =
      "Jogo nº " +
      currJogo.numerojogo +
      " " +
      currJogo.prova +
      " Serie " +
      currJogo.serie +
      " " +
      currJogo.equipas +
      " " +
      currJogo.pavilhao;

    //console.log("titulo", titulo);

    // console.log("prevNomeArbitro", prevNomeArbitro);

    //console.log("value.length", value.length);

    if (prevNomeArbitro === "" && value === " ") {
      return;
    } else {
      if (value.length === 1) {
        //console.log("ENTRAS AQUI????");

        // remover a nomeacao anterior
        Meteor.call(
          "removeNomeacaoCalendarioArbitro",
          currNomeArbitro,
          titulo,
          currJogo,
          key.key,
          false,
          true,
          (err, result) => {
            if (err) {
              console.error(err);
            } else if (result) {
              setDataSource(result);
            }
          }
        );
      } else if (prevNomeArbitro.length > 0) {
        //console.log("ENTRAS AFINAL AQUI????");

        Meteor.call(
          "removeNomeacaoCalendarioArbitro",
          prevNomeArbitro,
          titulo,
          currJogo,
          key.key,
          false,
          true,
          (err, result) => {
            if (err) {
              console.error(err);
            } else if (result) {
              setDataSource(result);
            }
          }
        );

        currNomeArbitro = value;
        // console.log("nomeArbitro: ", currNomeArbitro);

        Meteor.call(
          "verificaIncompatibilidades",
          currNomeArbitro,
          (err, result) => {
            let condicoesArbitro = JSON.parse(JSON.stringify(result));
            let relacoes = condicoesArbitro.relacaoComEquipas;
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
          }
        );

        //console.log("key", key);

        Meteor.call(
          "adicionaNomeacaoCalendarioArbitro",
          currNomeArbitro,
          currJogo,
          key.key,
          edit,
          false,
          true,
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

        Meteor.call(
          "verificaIncompatibilidades",
          currNomeArbitro,
          (err, result) => {
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
          }
        );

        //console.log("key", key);

        Meteor.call(
          "adicionaNomeacaoCalendarioArbitro",
          currNomeArbitro,
          currJogo,
          key.key,
          edit,
          false,
          true,
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
        // console.log("RESULTADO", result);
        let dataFromDB = [];
        let preNomeacoes = result[0];

        for (let index = 0; index < preNomeacoes.length; index++) {
            let jogoLido = preNomeacoes[index];

            //console.log("jogoLido", jogoLido)
            let obj = {
                numerojogo: jogoLido.numerojogo,
            dia: jogoLido.dia,
            hora: jogoLido.hora,
            prova: jogoLido.prova,
            serie: jogoLido.serie,
            equipas: jogoLido.equipas,
            pavilhao: jogoLido.pavilhao,
            arbitro1: jogoLido.arbitro1,
            arbitro2: jogoLido.arbitro2,
                juiz_linha1: jogoLido.juiz_linha1,
                juiz_linha2: jogoLido.juiz_linha2,
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

    function checkBD(dataSource) {
        Meteor.call("getPreNomeacoesRealizadas", Meteor.user(), (err, result) => {
            if (err) {
                console.log(err);
            } else if (result) {
                //console.log("MIAU", result);

                let preNomeacoesRegionais = result.preNomeacoesRegionais;

                if (preNomeacoesRegionais.length === 0) {
                    setLoaded(true);
                } else {
                    if (dataSource.length !== preNomeacoesRegionais.length) {
                        setLoaded(true);
                        setEnviaDisabled(result.enviado);
                        if (result.enviado) {
                            setDisabledDataSource(preNomeacoesRegionais);
                            setDataSource(preNomeacoesRegionais);
                        } else {
                            setDataSource(preNomeacoesRegionais);
                        }

                    } else {
                        const array1Ids = Array.isArray(dataSource) ? dataSource.map(obj => obj.numerojogo) : [];
                        const array2Ids = Array.isArray(preNomeacoesRegionais) ? preNomeacoesRegionais.map(obj => obj.numerojogo) : [];

                        for (let i = 0; i < array1Ids.length; i++) {
                            const currentId = array1Ids[i].numerojogo;
                            const indexInArray2 = array2Ids.indexOf(currentId);

                            if (indexInArray2 === -1) {
                                setLoaded(true);
                            }

                            array2Ids.splice(indexInArray2, 1);
                        }

                        if (array2Ids.length === 0) {
                            setLoaded(true);
                            setEnviaDisabled(result.enviado);
                            if (result.enviado) {
                                setDisabledDataSource(preNomeacoesRegionais);
                                setDataSource(preNomeacoesRegionais);
                            } 
                            
                        }
                    }
                }
            }
        });
    }

  

  function handleChangeClubes(value) {
    setClubesRelacionados(value);
  }

  function handleChangeNivel(value) {
    // console.log("value nivel", value);
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
      } else if (result === 0) {
        message.warn("Não existem jogos pendentes de confirmação");
      } else {
        // console.log("result: ", result);
        message.error("Não foi possível enviar os emails.");
      }
    });
  }

    let [isModalVisible, setModalVisible] = useState(false);



    let [idJogo, setIdJogo] = useState("");
    let [idDia, setIdDia] = useState("");
    let [idHoras, setIdHoras] = useState("");
    let [idMinutos, setIdMinutos] = useState("");
    let [idProva, setIdProva] = useState("");
    let [idSerie, setIdSerie] = useState("");
    let [idEquipaA, setIdEquipaA] = useState("");
    let [idEquipaB, setIdEquipaB] = useState("");
    let [idPavilhao, setIdPavilhao] = useState("");

    const idJogoRef = useRef(idJogo);
    const idDiaRef = useRef(idDia);
    const idHorasRef = useRef(idHoras);
    const idMinutosRef = useRef(idMinutos);
    const idProvaRef = useRef(idProva);
    const idSerieRef = useRef(idSerie);
    const idEquipaARef = useRef(idEquipaA);
    const idEquipaBRef = useRef(idEquipaB);
    const idPavilhaoRef = useRef(idPavilhao);


  const disabledDate = (current) => {
    // Can not select days before today

    return !moment().isSameOrBefore(current);
    };

    const CustomTimePicker = ({ onChange }) => {
        const handleHourChange = (hour) => {
            setIdHoras(hour);
        };

        const handleMinuteChange = (minute) => {
            setIdMinutos(minute);
        };
        return (
            <div>
                <Select
                    placeholder={idHoras}
                    style={{ width: '50%' }}
                    //value={idhoras}
                    onChange={handleHourChange}
                >
                    {renderHourOptions()}
                </Select>

                <Select
                    placeholder={idMinutos}
                    style={{ width: '50%' }}
                    //value={idMinutos}
                    onChange={handleMinuteChange}
                >
                    {renderMinuteOptions()}
                </Select>
            </div>
        );
    };
     
    const renderHourOptions = () => {
        const hours = [];

        for (let i = 8; i <= 23; i++) {
            hours.push(i);
        }

        return hours.map((hour) => (
            <Option key={hour} value={hour}>
                {`${hour}:`}
            </Option>
        ));
    };

    const renderMinuteOptions = () => {
        const minutes = [...Array(60).keys()];

        return minutes.map((minute) => (
            <Option key={minute} value={minute}>
                {minute < 10 ? `0${minute}` : minute}
            </Option>
        ));
    };


    useEffect(() => {
        idJogoRef.current = idJogo;
    }, [idJogo]);

    useEffect(() => {
        idDiaRef.current = idDia;
    }, [idDia]);

    useEffect(() => {
        idHorasRef.current = idHoras;
    }, [idHoras]);

    useEffect(() => {
        idMinutosRef.current = idMinutos;
    }, [idMinutos]);

    useEffect(() => {
        idProvaRef.current = idProva;
    }, [idProva]);

    useEffect(() => {
        idSerieRef.current = idSerie;
    }, [idSerie]);

    useEffect(() => {
        idEquipaARef.current = idEquipaA;
    }, [idEquipaA]);

    useEffect(() => {
        idEquipaBRef.current = idEquipaB;
    }, [idEquipaB]);

    useEffect(() => {
        idPavilhaoRef.current = idPavilhao;
    }, [idPavilhao]);



    const handleInputChangeIdJogo = (value) => {

        const stringValue = value == null ? "" : value.toString(); // Convert the value to a string
        Meteor.call("verifyIdJogo", stringValue, Meteor.user().username, (err, result) => {
            console.log(result);
            if (err) {
                console.log(err);
            } else if (result !== -1) {
                setIdJogo(stringValue); // Update the state with the string value
            } else {
                setIdJogo("-1"); // If result is -1, set an empty string to indicate an invalid value
            }
        });
    };


    const handleOk = () => {
        


            return new Promise((resolve, reject) => {
                // Your form validation logic here

                let valido = true;

                console.log("idJogo!!", idJogoRef.current)

                if (idJogoRef.current.length === 0) { // Check if idJogo is an empty string
                    message.warn("Não colocou número de jogo!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }

                if (parseInt(idJogoRef.current) == -1) {
                    message.warn("Esse número de jogo já existe!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }


                console.log("dia", idDiaRef.current);

                if (idDiaRef.current.length <= 0) {
                    message.warn("Não colocou dia!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }

                console.log("hora", idHorasRef.current)

                if (idHorasRef.current.length <= 0) {
                    message.warn("Não colocou a hora!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }

                console.log("minutos", idMinutosRef.current);

                if (idMinutosRef.current.length <= 0) {
                    message.warn("Não colocou os minutos!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }

                console.log("prova", idProvaRef.current)

                if (idProvaRef.current.length <= 0) {
                    message.warn("Não colocou prova!");
                    valido = false;
                }
                              

                if (!valido) {
                    reject();
                    return;
                }

                console.log("serie", idSerieRef.current)

                if (idSerieRef.current.length <= 0) {
                    message.warn("Não colocou série!");
                    valido = false;
                }
                

                if (!valido) {
                    reject();
                    return;
                }

                console.log("equipaA", idEquipaARef.current)

                if (idEquipaARef.current.length <= 0) {
                    message.warn("Não colocou equipa visitada!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }

                console.log("equipaB", idEquipaBRef.current)
                if (idEquipaBRef.current.length <= 0) {
                    message.warn("Não colocou equipa visitante!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }

                console.log("pavilhao", idPavilhaoRef.current)
                if (idPavilhaoRef.current.length <= 0) {
                    message.warn("Não colocou pavilhão!");
                    valido = false;
                }

                if (!valido) {
                    reject();
                    return;
                }


                if (valido) {
                    // Submit form logic
                    //message.success('Form submitted successfully!');

                    Meteor.call(
                        "adicionaJogoNovo",
                        idJogoRef.current,
                        idDiaRef.current,
                        idHorasRef.current,
                        idMinutosRef.current,
                        idProvaRef.current,
                        idSerieRef.current,
                        idEquipaARef.current,
                        idEquipaBRef.current,
                        idPavilhaoRef.current,
                        "r",
                        (err, result) => {
                            if (err) {
                                console.log(err);
                            } else {
                                //message.success("Adicionado o jogo " + idJogoRef.current + ".");
                            }
                        }
                    );

                    resolve(); // Resolve the promise to close the modal
                    message.success("Adicionado o jogo " + idJogoRef.current + ".");
                    setSelectedValuePavilhao(undefined);
                    window.location.reload();
                } else {
                    // Show error message and reject the promise to keep the modal open
                    //message.error('Please fill out all the required fields.');
                    reject();
                }
            });

    }

    const [pavilhoes, setPavilhoes] = useState([]);
    const [selectedValuePavilhao, setSelectedValuePavilhao] = useState(undefined);

    const fetchPavilhoes = useCallback(() => {
        Meteor.call('getPavilhoes', (error, result) => {
            if (!error) {
                setPavilhoes(result);
            }
        });
    }, []);

    useEffect(() => {
        fetchPavilhoes();
    }, [fetchPavilhoes]);

    const handleSearchPavilhao = (value) => {
        // No need to set searchValuePavilhao here
    };

    const handleSelectPavilhao = (value) => {
        setSelectedValuePavilhao(value); // Set the selected value here
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            setSelectedValuePavilhao(selectedValuePavilhao); // Set the selected value when Enter is pressed
        }
    };



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
                              onChange={handleInputChangeIdJogo}
                              //value={idJogo}
                />
              </Form.Item>
              <Form.Item label="Dia">
                <ConfigProvider locale={locale}>
                  <DatePicker
                    locale={locale}
                    placeholder="Selecione o dia..."
                    style={{ width: "100%" }}
                    disabledDate={disabledDate}
                    onChange={(e) => setIdDia(e.toLocaleString())}
                    // showTime={{
                    //   defaultValue: moment("00:00:00"),
                    // }}
                  />
                </ConfigProvider>
                      </Form.Item>
              <Form.Item label="Hora" >
                          <CustomTimePicker onChange={(e) => { setIdHoras(e) }}></CustomTimePicker>
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
                      setIdProva(p);
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
                          <Select
                              id="newGamePavilhao"
                              style={{ textTransform: 'uppercase' }}
                              onChange={(value) => setIdPavilhao(value)}
                              placeholder="Selecione o pavilhão..."
                              showSearch // Habilita a funcionalidade de busca
                              optionFilterProp="children" // Faz com que a busca filtre pelo conteúdo dos filhos das opções
                              filterOption={(input, option) =>
                                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                              } // Implementa o filtro personalizado
                              onSearch={handleSearchPavilhao} // Chamado quando o usuário digita algo no Select
                              onSelect={handleSelectPavilhao} // Chamado quando o usuário seleciona uma opção
                              onKeyPress={handleKeyPress} // Captura a tecla Enter pressionada no campo de busca
                              value={selectedValuePavilhao} // Define o valor selecionado no campo
                          >
                              {pavilhoes.map((pavilhao) => (
                                  <Option key={pavilhao.value} value={pavilhao.value}>
                                      {pavilhao.label}
                                  </Option>
                              ))}
                          </Select>
                      </Form.Item>

            </Form>
          </>
        </div>
      ),
      width: "42%",
      keyboard: false,
      okText: "Adicionar jogo",
      closable: true,

        onOk: handleOk,
      cancelText: "Cancelar",
      visible: isModalVisible,
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
        atribuirArbitrosAdesl={true}
        atribuirArbitrosCev={true}
        atribuirArbitrosCR_CN={false}
        carregarJogos={true}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
              forgotPasswordHeader={true}
              gestaoPagamentos={true}
          
          />

          {!loaded ? checkBD(dataSource) : 

      dataSource.length === 0 ? (
        <>
          <div
            style={{
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "1%",
            }}
          >
            <div className="input">
              <label className="labels">
                <Select
                  onChange={(e) => setSelectVal(e)}
                  value="Campeonato Regional / Nacional"
                  style={{
                    position: "sticky",
                    top: "0",
                    left: "0",
                    width: "300px",
                    flexDirection: "none",
                    justifyContent: "space-evenly",
                  }}
                  disabled
                >
                  {/* <Select.Option
                key="cev"
                value="Confederação Europeia de Voleibol"
              >
                Confederação Europeia de Voleibol
              </Select.Option> */}
                </Select>
              </label>
              <br></br>
            </div>

            <span>
              <Dragger
                {...props}
                accept=".csv, .xlsx, .xls"
                style={{ width: "500px" }}
              >
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Selecione ou arraste um ficheiro para esta área para o
                  carregar
                </p>
                <p className="ant-upload-hint">
                  Formato do ficheiro {"("} .csv {")"}.
                </p>
              </Dragger>
            </span>
          </div>
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
                {currJogo.numerojogo != undefined
                  ? "Jogo nº: " + currJogo.numerojogo
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
                    cursor: "pointer",
                  }}
                  onClick={() => {
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
                      cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                  onClick={() => {
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

                      cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                  onClick={() => {
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
                      cursor: "pointer",
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
                    cursor: "pointer",
                  }}
                  onClick={() => {
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

                      cursor: "pointer",
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
                        message.success(
                          "Nomeações regionais e nacionais enviadas para os Árbitros."
                        );
                      }, 200);
                        document.getElementById("enviaNomeacoes").disabled = true;
                       
                    }}
                                              type="primary"
                                              disabled={disabledDataSource.length !== 0 ? true : false}
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
                          //console.log("event", event);
                          //console.log("event.target.value", event.target.value);

                          if (event.target != "div.ant-select-selector") {
                            Meteor.call(
                              "getArbitrosDisponiveis",
                              record,
                              temRecibo,
                              naoTemRecibo,
                              temTransporte,
                              naoTemTransporte,
                              clubesRelacionados,
                              nivelDeArbitro,
                              (err, result) => {
                                //console.log("result arbitros disponiveis: ",result);
                                if (err) {
                                  console.log("ERRRRROOOOO", { err });
                                } else if (result.length != 0) {
                                  setArbitrosDisponiveis(result);
                                }

                                // console.log("RESULTADO***", result);
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
