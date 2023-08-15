import React, { useRef, useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Header } from "../Geral/Header";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";

import Highlighter from "react-highlight-words";

const { Search } = Input;

// Requiring the lodash library
const _ = require("lodash");

export function ConsultaTotal() {
  function comparaAminhaLindaString(a, b) {
    let x = 0;
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

  const [searchVal, setSearchVal] = useState("");

  const [valorPesquisado, setValorPesquisado] = useState("");

  const [dataSource, setDataSource] = useState([]);

  const [filteredData, setFilteredData] = useState([]);

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

  useEffect(() => {
    if (searchVal.length > 0) {
      if (valorPesquisado !== searchVal) {
        setValorPesquisado(searchVal);
        let ds = dataSource;
        let pesquisa = removeAcentos(searchVal);
        ds = ds.filter(
          (item) =>
            removeAcentos(item.arbitro1).includes(pesquisa) ||
            removeAcentos(item.arbitro2).includes(pesquisa) ||
            removeAcentos(item.dia).includes(pesquisa) ||
            removeAcentos(item.equipas).includes(pesquisa) ||
            item.hora.includes(pesquisa) ||
            removeAcentos(item.juiz_linha).includes(pesquisa) ||
            item.numerojogo.toString().includes(pesquisa) ||
            removeAcentos(item.pavilhao).includes(pesquisa) ||
            removeAcentos(item.prova).includes(pesquisa) ||
            removeAcentos(item.serie).includes(pesquisa)
        );
        setFilteredData(ds);
      }
    } else {
      setFilteredData(dataSource);
    }
    // console.log(filteredData);
  }, [searchVal, dataSource, filteredData]);

  function loadData() {
    //console.log("email", email);
    Meteor.call("carregaNomeacoesTotal", (err, result) => {
      //console.log("resultado de carregaNomeacoes da BD:", result);
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result) {
        if (result.length > 0) {
          let resultadosFromDB = [];
          let initial = result;

          for (let index = 0; index < initial.length; index++) {
              let jogoLido = initial[index];

              console.log("jogolido", jogoLido)


              let juiz_linhas = jogoLido.juiz_linha1 === "" ? "" : (jogoLido.juiz_linha1 + " " + jogoLido.juiz_linha2 + " " + jogoLido.juiz_linha3 + " " + jogoLido.juiz_linha4);

              juiz_linhas = juiz_linhas.replace(/null/gi, "");
              juiz_linhas = juiz_linhas.replace(/undefined/gi, "");

            let k = _.uniqueId();

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
              juiz_linha: juiz_linhas,
              key: "ct_" + k,
            };

            //console.log("obj: ", obj);

            resultadosFromDB.push(obj);
          }

          setDataSource(resultadosFromDB);
        }
      } else {
        setDataSource([]);
      }
    });
  }

  const colunasNomeacoes = [
    {
      title: "Jogo",
      dataIndex: "numerojogo",
      key:"numerojogo",
      sorter: {
        compare: (a, b) => a.numerojogo - b.numerojogo,
      },
      sortDirections: ["descend", "ascend"],
      width: "6%",
      ...getColumnSearchProps("numerojogo"),
    },
    {
      title: "Dia",
      dataIndex: "dia",
      key: "dia",
      sorter: {
        compare: (a, b) => comparaAminhaLindaData(a.dia, b.dia),
      },
      sortDirections: ["descend", "ascend"],
      width: "8%",
      ...getColumnSearchProps("dia"),
    },
    {
      title: "Hora",
      dataIndex: "hora",
      key: "hora",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.hora, b.hora),
      },
      sortDirections: ["descend", "ascend"],
      width: "6%",

      ...getColumnSearchProps("hora"),
    },
    {
      title: "Prova",
      dataIndex: "prova",
      key: "prova",
      width: "7%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.prova, b.prova),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("prova"),
    },
    {
      title: "Série",
      dataIndex: "serie",
      key: "Serie",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.serie, b.serie),
      },
      sortDirections: ["descend", "ascend"],
      width: "7%",

      ...getColumnSearchProps("serie"),
    },
    {
      title: "Equipas",
      dataIndex: "equipas",
      key: "Equipas",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.equipas, b.equipas),
        multiple: 6,
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("equipas"),
    },
    {
      title: "Pavilhão",
      dataIndex: "pavilhao",
      key: "pravilhao",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.pavilhao, b.pavilhao),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("pavilhao"),
    },
    {
      title: "1º Árbitro",
      dataIndex: "arbitro1",
      key: "arbitro1",
      width: "11%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.arbitro1, b.arbitro1),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("arbitro1"),
    },
    {
      title: "2º Árbitro",
      dataIndex: "arbitro2",
      key: "arbitro2",
      width: "11%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.arbitro2, b.arbitro2),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("arbitro2"),
    },
    {
      title: "Juízes de linha",
      dataIndex: "juiz_linha",
      key: "juiz_linha",
      width: "9%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.juiz_linha, b.juiz_linha),
      },
      sortDirections: ["ascend", "descend"],

      ...getColumnSearchProps("juiz_linha"),
      // render: (record) => (
      //   <>
      //     <div>{console.log(record.juiz_linha)}</div>
      //   </>
      // ),
    },
  ];

  dataSource.length == 0 ? loadData() : null;

  return (
    <>
      <Header
        user={Meteor.user()}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={true}
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
        forgotPasswordHeader={true}
        clubesAfiliadosAVL={true}
        consultaNomeacoesSemanais={false}
              sobreHeader={true}
              gestaoPagamentos={true}
      />
      <div
      // style={{
      //   marginTop: "0.5%",
      // }}
      >
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <div className="input">
            <label
              className="labels"
              style={{ display: "flex", alignSelf: "space-evenly" }}
            >
              <Search
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Jogo / Dia / Hora / Prova / Serie / Equipa / Pavilhao / Arbitro / Juiz de Linha"
                //placeholder="Pesquise por um dos campos... "
                enterButton
                style={{
                  position: "sticky",
                  width: "300px",
                }}
              />
            </label>
          </div> */}
        </div>
        <div
          style={{
            marginTop: "0.5%",
            marginLeft: "0.5%",
            marginRight: "0.5%",
          }}
        >
          <Table
            size="small"
            dataSource={filteredData}
            columns={colunasNomeacoes}
            scroll={{
              y: (6 * window.screen.height) / 10,
            }}
            rowKey="key"
            pagination={false}
          />
        </div>
      </div>
    </>
  );
}

function removeAcentos(acentuada) {
  x = acentuada
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace("ç", "c");
  //console.log(x);
  return x;
}
