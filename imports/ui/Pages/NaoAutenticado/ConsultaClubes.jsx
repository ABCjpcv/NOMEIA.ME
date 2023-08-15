import React, { useRef, usEffect, useState } from "react";

import axios from "axios";
import { useTableSearch } from "../../../api/useTableSearch";
import "antd/dist/antd.css";
import { Header } from "../Geral/Header";

import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space, Table } from "antd";

import Highlighter from "react-highlight-words";

const { Search } = Input;

const fetchClubes = async () => {
  const { data } = await axios.get("ClubesAVL_info.json");
  // console.log("data", data);
  return { data };
};

export function ConsultaClubes() {
  const [searchVal, setSearchVal] = useState(null);

  const { filteredData, loading } = useTableSearch({
    searchVal,
    retrieve: fetchClubes,
  });

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

  const colunasClubesAfiliados = [
    {
      title: "Clube",
      dataIndex: "Clube",
      key: "Clube",
      sorter: (a, b) => comparaAminhaLindaString(a.Clube, b.Clube),
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("Clube"),
    },
    // {
    //   title: "Localização",
    //   dataIndex: "Localizacao",
    //   key: "Localizacao",
    //   sorter: (a, b) => comparaAminhaLindaString(a.Localizacao, b.Localizacao),
    //   sortDirections: ["descend", "ascend"],
    // },
    {
      title: "Email",
      dataIndex: "Email",
      key: "Email",
      sorter: (a, b) => comparaAminhaLindaString(a.Email, b.Email),
      sortDirections: ["descend", "ascend"],

      ...getColumnSearchProps("Email"),
    },
    {
      title: "Telemóvel",
      dataIndex: "Telemovel",
      key: "Telemovel",
      sorter: (a, b) => comparaAminhaLindaString(a.Telemovel, b.Telemovel),
      sortDirections: ["descend", "ascend"],
      width: "12%",

      ...getColumnSearchProps("Telemóvel"),
    },

    {
      title: "Telefone",
      dataIndex: "Telefone",
      key: "Telefone",
      sorter: (a, b) => comparaAminhaLindaString(a.Telefone, b.Telefone),
      sortDirections: ["descend", "ascend"],
      width: "12%",

      ...getColumnSearchProps("Telefone"),
    },
    {
      title: "NIF",
      dataIndex: "NIF",
      key: "NIF",
      sorter: (a, b) => comparaAminhaLindaString(a.Telefone, b.Telefone),
      sortDirections: ["descend", "ascend"],
      width: "12%",

      ...getColumnSearchProps("NIF"),
    },
  ];

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

  return (
    <>
      <Header
        user={Meteor.user()}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={true}
        atribuirArbitrosAdesl={true}
        atribuirArbitrosCev={true}
        atribuirArbitrosCR_CN={true}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
        forgotPasswordHeader={true}
        clubesAfiliadosAVL={false}
        consultaNomeacoesSemanais={true}
              sobreHeader={true}
              gestaoPagamentos={true}
      />
      <div
      // style={{ marginTop: "0.5%" }}
      >
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/*           
          <div className="input">
            <label className="labels"> 
              <Search
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Clube / Email / Contacto... "
                enterButton
                style={{
                  position: "sticky",
                  top: "0",
                  left: "0",
                  width: "300px",
                  marginTop: "0.5%",
                  flexDirection: "none",
                  justifyContent: "space-evenly",
                }}
              />
            </label>
              </div> */}
        </div>
        <div
          style={{ marginTop: "0.5%", marginLeft: "0.5%", marginRight: "0.5%" }}
        >
          <Table
            rowKey="name"
            size="small"
            dataSource={filteredData}
            columns={colunasClubesAfiliados}
            loading={loading}
            pagination={false}
            scroll={{
              y: (6 * window.screen.height) / 10,
            }}
          />
        </div>
      </div>
    </>
  );
}
