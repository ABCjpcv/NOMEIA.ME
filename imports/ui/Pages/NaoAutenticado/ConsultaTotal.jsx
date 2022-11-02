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
            removeAcentos(item.Arbitro1).includes(pesquisa) ||
            removeAcentos(item.Arbitro2).includes(pesquisa) ||
            removeAcentos(item.Dia).includes(pesquisa) ||
            removeAcentos(item.Equipas).includes(pesquisa) ||
            item.Hora.includes(pesquisa) ||
            removeAcentos(item.JL).includes(pesquisa) ||
            item.Jogo.toString().includes(pesquisa) ||
            removeAcentos(item.Pavilhao).includes(pesquisa) ||
            removeAcentos(item.Prova).includes(pesquisa) ||
            removeAcentos(item.Serie).includes(pesquisa)
        );
        setFilteredData(ds);
      }
    } else {
      setFilteredData(dataSource);
    }
    console.log(filteredData);
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

            let jl =
              jogoLido.juiz_linha[0].length == 0
                ? ""
                : jogoLido.juiz_linha.toString().replaceAll(",", "\n");

            let k = _.uniqueId();

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
              JL: jl,
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
      dataIndex: "Jogo",
      key: "Jogo",
      sorter: {
        compare: (a, b) => a.Jogo - b.Jogo,
      },
      sortDirections: ["descend", "ascend"],
      width: "6%",
      ...getColumnSearchProps("Jogo"),
    },
    {
      title: "Dia",
      dataIndex: "Dia",
      key: "Dia",
      sorter: {
        compare: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
      },
      sortDirections: ["descend", "ascend"],
      width: "8%",
      ...getColumnSearchProps("Dia"),
    },
    {
      title: "Hora",
      dataIndex: "Hora",
      key: "Hora",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
      },
      sortDirections: ["descend", "ascend"],
      width: "6%",

      ...getColumnSearchProps("Hora"),
    },
    {
      title: "Prova",
      dataIndex: "Prova",
      key: "Prova",
      width: "7%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.Prova, b.Prova),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("Prova"),
    },
    {
      title: "Série",
      dataIndex: "Serie",
      key: "Serie",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.Serie, b.Serie),
      },
      sortDirections: ["descend", "ascend"],
      width: "7%",

      ...getColumnSearchProps("Serie"),
    },
    {
      title: "Equipas",
      dataIndex: "Equipas",
      key: "Equipas",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.Equipas, b.Equipas),
        multiple: 6,
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("Equipas"),
    },
    {
      title: "Pavilhão",
      dataIndex: "Pavilhao",
      key: "Pavilhao",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("Pavilhao"),
    },
    {
      title: "1º Árbitro",
      dataIndex: "Arbitro1",
      key: "Arbitro1",
      width: "11%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.Arbitro1, b.Arbitro1),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("Arbitro1"),
    },
    {
      title: "2º Árbitro",
      dataIndex: "Arbitro2",
      key: "Arbitro2",
      width: "11%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.Arbitro2, b.Arbitro2),
      },
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("Arbitro2"),
    },
    {
      title: "Juízes de linha",
      dataIndex: "JL",
      key: "JL",
      width: "9%",
      sorter: {
        compare: (a, b) => comparaAminhaLindaString(a.JL, b.JL),
      },
      sortDirections: ["ascend", "descend"],

      ...getColumnSearchProps("JL"),
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
        clubesAfiliadosAVL={true}
        consultaNomeacoesSemanais={false}
        forgotPasswordHeader={true}
        sobreHeader={true}
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
              y: "70vh",
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
