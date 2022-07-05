import React, { useState } from "react";
import { Button, Popconfirm, Table, Tag } from "antd";
import axios from "axios";
import { useTableSearch } from "./useTableSearch";
import "antd/dist/antd.css";
import { Meteor } from "meteor/meteor";

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

// const fetchData = async () => {
//   const { data } = await axios.get("Livro.json");
//   return { data };
// };

export function ConsultaPrivada() {
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
    },
    {
      title: "Arbitro2",
      dataIndex: "Arbitro2",
      key: "Arbitro2",
      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro2, b.Arbitro2),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "JL",
      dataIndex: "JL1",
      key: "JL1",
      sorter: (a, b) => comparaAminhaLindaString(a.JL1, b.JL1),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "JL",
      dataIndex: "JL2",
      key: "JL2",
      sorter: (a, b) => comparaAminhaLindaString(a.JL2, b.JL2),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "JL",
      dataIndex: "JL3",
      key: "JL3",
      sorter: (a, b) => comparaAminhaLindaString(a.JL3, b.JL3),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "JL",
      dataIndex: "JL4",
      key: "JL4",
      sorter: (a, b) => comparaAminhaLindaString(a.JL4, b.JL4),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Confirmação",
      dataIndex: "confirmacao",
      key: "confirmacao",
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <div>
            <Popconfirm
              title="Confirmar jogo?"
              onConfirm={() => handleConfirmation(record)}
            >
              <a>Confirmar</a>
            </Popconfirm>
            <br></br>
            <br></br>
            <Popconfirm
              title="Recusar jogo?"
              onConfirm={() => handleRefuse(record)}
            >
              <a> Recusar </a>
            </Popconfirm>
          </div>
        ) : null,
    },
    {
      title: "Estado:",
      dataIndex: "estado",
      key: "estado",
      width: "15%",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color;

            if (tag[0] === "pendente") {
              color = "yellow";
            } else if (tag[0] === "confirmado") {
              color = "green";
            } else if (tag[0] === "recusado") {
              color = "red";
            }

            return (
              <Tag color={color} key={tag}>
                {tag[0].toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  /**
   *
   *
   * ATRIBUICAO DOS ESTADOS (STATES)
   *
   *
   */

  const [mudouNome, setMudouNome] = useState(false);

  const [dataSource, setDataSource] = useState([
    // {
    //   Jogo: "2059",
    //   Dia: "01/05/2022",
    //   Hora: "17:00",
    //   Prova: "CNMJuv",
    //   Serie: "D",
    //   Equipas: "SCPORT. - CNGINAS",
    //   Pavilhao: "PAV. MULTID. SPORTING CP",
    //   Arbitro1: "André Carvalho",
    //   Arbitro2: "",
    //   JL1: "",
    //   JL2: "",
    //   JL3: "",
    //   JL4: "",
    //   key: "5",
    //   tags: ['pendente']
    // },
    // {
    //   Jogo: "2178",
    //   Dia: "30/04/2022",
    //   Hora: "15:00",
    //   Prova: "CNFJuv",
    //   Serie: "D",
    //   Equipas: "SCPORT. - SLBENFI",
    //   Pavilhao: "PAV. MULTID. SPORTING CP",
    //   Arbitro1: "André Correia",
    //   Arbitro2: "",
    //   JL1: "",
    //   JL2: "",
    //   JL3: "",
    //   JL4: "",
    //   key: "6",
    //   tags: ['pendente']
    // },
    // {
    //   Jogo: "1526",
    //   Dia: "01/05/2022",
    //   Hora: "18:00",
    //   Prova: "JUV F",
    //   Serie: "TPAP",
    //   Equipas: "CFB B - EFL",
    //   Pavilhao: "PAV. ACACIO ROSA- RESTELO",
    //   Arbitro1: "André Correia",
    //   Arbitro2: "",
    //   JL1: "",
    //   JL2: "",
    //   JL3: "",
    //   JL4: "",
    //   key: "7",
    //   tags: ['pendente']
    // },
  ]);

  const handleConfirmation = (record) => {
    const newData = dataSource.filter((item) => {
      if (item.key == record.key) {
        return (item.tags[0] = ["confirmado"]);
      } else {
        return item;
      }
    });
    setDataSource(newData);
  };

  const handleAllConfirmation = () => {
    const newData = dataSource.filter((item) => {
      return (item.tags[0] = ["confirmado"]);
    });
    setDataSource(newData);
  };

  const handleRefuse = (record) => {
    const newData = dataSource.filter((item) => {
      if (item.key == record.key) {
        return (item.tags[0] = ["recusado"]);
      } else {
        return item;
      }
    });
    setDataSource(newData);
  };

  function handleDelete() {
    let arbitro = Meteor.user().username;
    // AQUI SERIA METEOR.USER().USERNAME
    const newData = dataSource.filter((item) => item.Arbitro1 === arbitro);
    setDataSource(newData);
  }

  function handleSubmissionConfirmation(data) {
    let idsJogos = [];
    let confirmacoes = [];

    for (let index = 0; index < data.length; index++) {


      if (data[index].tags[0].includes("pendente")) {
        return window.alert(
          "Tem jogos por confirmar, " + Meteor.user().username
        );
      } else {
        idsJogos.push(parseInt(data[index].Jogo));
        confirmacoes.push(data[index].tags[0]);
      }
    }

    for (let index = 0; index < idsJogos.length; index++) {
      console.log(idsJogos[index]);
      console.log(confirmacoes[index]);
    }

    let email = Meteor.user().emails[0].address;

    Meteor.call("addNomeacao", email, idsJogos, confirmacoes, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", { err });
      } else {
        window.alert("Confirmações submetidas " + Meteor.user().username);
      }
    });
  }

  function loadData() {
    let email = Meteor.user().emails[0].address;
    Meteor.call("carregaNomeacoes", email, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result.nomeacoesPrivadas.length > 0) {
        let dataFromDB = [];

        for (let index = 0; index < result.nomeacoesPrivadas.length; index++) {
          let jogoLido = result.nomeacoesPrivadas[index].jogo;

          let tags = result.nomeacoesPrivadas[index].confirmacaoAtual;

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
            tags: [tags],
          };

          dataFromDB.push(obj);
        }

        setDataSource(dataFromDB);
      } else {
        setDataSource([]);
      }
    });
  }

  if (!mudouNome) {
    loadData();
    setMudouNome(true);
  }

  // if (!mudouNome) {
  //   handleDelete();
  //   setMudouNome(true);
  // }

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
              <Table
                bordered
                dataSource={dataSource}
                columns={colunasNomeacoesPrivadas}
              />
              <Button
                onClick={handleAllConfirmation}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Confirmar todos
              </Button>

              <Button
                onClick={() => {
                  handleSubmissionConfirmation(dataSource);
                }}
                style={{
                  marginBottom: 16,
                }}
              >
                Submeter Confirmações
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
