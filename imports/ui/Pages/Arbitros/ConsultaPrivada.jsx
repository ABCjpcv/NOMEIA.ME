import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
} from "antd";
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

export function ConsultaPrivada({ user }) {
  const colunasNomeacoesPrivadas = [
    {
      title: "Jogo",
      dataIndex: "Jogo",
      key: "Jogo",
      sorter: (a, b) => a.Jogo - b.Jogo,
      sortDirections: ["descend", "ascend"],
      width: "1%",
      fixed: "left",
    },
    {
      title: "Dia",
      dataIndex: "Dia",
      key: "Dia",
      sorter: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
      sortDirections: ["descend", "ascend"],
      width: "4%",
      fixed: "left",
    },
    {
      title: "Hora",
      dataIndex: "Hora",
      key: "Hora",
      sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
      sortDirections: ["descend", "ascend"],
      width: "4%",
      fixed: "left",
    },
    {
      title: "Prova",
      dataIndex: "Prova",
      key: "Prova",
      sorter: (a, b) => comparaAminhaLindaString(a.Prova, b.Prova),
      sortDirections: ["descend", "ascend"],
      width: "5%",
      fixed: "left",
    },
    {
      title: "Serie",
      dataIndex: "Serie",
      key: "Serie",
      sorter: (a, b) => comparaAminhaLindaString(a.Serie, b.Serie),
      sortDirections: ["descend", "ascend"],
      width: "4%",
      fixed: "left",
    },
    {
      title: "Equipas",
      dataIndex: "Equipas",
      key: "Equipas",
      sorter: (a, b) => comparaAminhaLindaString(a.Equipas, b.Equipas),
      sortDirections: ["descend", "ascend"],
      width: "5%",
      fixed: "left",
    },
    {
      title: "Pavilhao",
      dataIndex: "Pavilhao",
      key: "Pavilhao",
      sorter: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
      sortDirections: ["descend", "ascend"],
      width: "4%",
      fixed: "left",
    },
    {
      title: "Arbitro1",
      dataIndex: "Arbitro1",
      key: "Arbitro1",
      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro1, b.Arbitro1),
      sortDirections: ["descend", "ascend"],
      width: "10%",
    },
    {
      title: "Arbitro2",
      dataIndex: "Arbitro2",
      key: "Arbitro2",
      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro2, b.Arbitro2),
      sortDirections: ["descend", "ascend"],
      width: "10%",
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
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      width: "14%",
      fixed: "right",
      render: (_, record) =>
        dataSource.length > 0 && handleJogoPassou(record) ? (
          <div>
            Resultado:
            <br></br>
            <InputNumber
              defaultValue={0}
              max={3}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            X{" "}
            <InputNumber
              defaultValue={0}
              max={3}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
              // status={"warning"}
            />
            <br></br>
            Sets:
            <br></br>
            {"("}{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            -{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            {")"}
            <br></br>
            {"("}{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            -{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            {")"}
            <br></br>
            {"("}{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            -{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            {")"}
            <br></br>
            {"("}{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            -{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            {")"}
            <br></br>
            {"("}{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            -{" "}
            <InputNumber
              defaultValue={0}
              max={25}
              min={0}
              size={"small"}
              style={{ height: "22px", width: "44px" }}
            />{" "}
            {")"}
          </div>
        ) : dataSource.length > 0 ? (
          <div>
            <Popconfirm
              title="Confirmar jogo?"
              onConfirm={() => handleConfirmation(record)}
            >
              <Button type="primary" shape="round" style={{ width: "100%" }}>
                Confirmo ✔️
              </Button>
            </Popconfirm>
            <br></br>
            <br></br>
            <Popconfirm
              title="Recusar jogo?"
              onConfirm={() => handleRefuse(record)}
            >
              <Button shape="round" style={{ width: "100%" }}>
                Recuso ❌
              </Button>
            </Popconfirm>
          </div>
        ) : null,
    },
    {
      title: "Estado:",
      dataIndex: "estado",
      key: "estado",
      width: "15%",
      fixed: "right",
      render: (_, { tags }) =>
        dataSource.length > 0 ? (
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

  const [dataSource, setDataSource] = useState([]);

  let [submetido, setSubmetido] = useState(Boolean);

  let isCA = Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
    return result;
  });

  function handleJogoPassou(record) {
    let horario = addHours(
      1,
      new Date(
        record.Dia.split("/")[2] +
          "-" +
          record.Dia.split("/")[1] +
          "-" +
          record.Dia.split("/")[0] +
          " " +
          record.Hora.split(":")[0] +
          ":" +
          record.Hora.split(":")[1] +
          ":00"
      )
    );

    console.log("horario", horario);
    console.log("hoje", new Date());
    console.log("horario < new Date()", horario < new Date());

    return horario < new Date();
  }

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
    try {
      if (document.getElementById("submissionConfirmationButton").disabled) {
        message.warn(
          "Já confirmou as suas nomeações " + Meteor.user().username + "!"
        );
        document.getElementById("confirmAllNominations").disabled = true;
      }
    } catch (error) {}

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

  function handleSubmissionConfirmation(data) {
    let jogos = [];
    let confirmacoes = [];

    for (let index = 0; index < data.length; index++) {
      if (data[index].tags[0].includes("pendente")) {
        return message.info("Ainda tem jogos por confirmar, " + user.username);
      } else {
        jogos.push(data[index]);
        confirmacoes.push(data[index].tags[0]);
      }
    }

    let email = user.emails[0].address;

    Meteor.call(
      "addConfirmacaoNomeacao",
      email,
      jogos,
      confirmacoes,
      (err, result) => {
        if (err) {
          console.log("ERRRRROOOOO", { err });
        } else {
          message.success("Confirmações submetidas " + user.username);
        }
      }
    );

    setSubmetido(true);
  }

  function loadData() {
    user = Meteor.user();
    let email = user.emails[0].address;

    //console.log("email", email);
    Meteor.call("carregaNomeacoes", email, (err, result) => {
      //console.log("resultado de carregaNomeacoes da BD:", result);
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result.nomeacoesPrivadas.length > 0) {
        //console.log("RESULTADO AQUI", result);

        let dataFromDB = [];

        let confirmado = true;
        for (let index = 0; index < result.nomeacoesPrivadas.length; index++) {
          let jogoLido = result.nomeacoesPrivadas[index].jogo;

          let tags = result.nomeacoesPrivadas[index].confirmacaoAtual;

          tags != "Confirmado" ? (confirmado = false) : (confirmado = true);

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
        setSubmetido(confirmado);
        setDataSource(dataFromDB);
      } else {
        setDataSource([]);
      }
    });
  }

  const info = () => {
    Modal.info({
      title: "Instruções",
      content: (
        <div>
          <p>Verifique as nomeações dos dias indicados.</p>
          <p>
            Confirme ou recuse Jogos sendo que terá de justificar recusas ao
            Conselho de Arbitragem.
          </p>
          <p>
            Clique em 'Submeter Confirmações' para conhecimento do Conselho.
          </p>
          <p> Indique o resultado do Jogo quando disponível. </p>
        </div>
      ),

      onOk() {},
    });
  };

  if (dataSource.length === 0) {
    loadData();
  }

  return (
    <>
      <div className="demo-app" style={{ alignSelf: "center" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <div className="demo-app-main" style={{ width: "100%" }}>
            <div className="container" style={{ width: "100%" }}>
              <br />

              {dataSource.length != 0 ? (
                <div
                  className="table-responsive"
                  style={{
                    marginLeft: "0.5%",
                    marginRight: "0%",
                    width: "99%",
                    marginTop: "-1%",
                  }}
                >
                  <Table
                    className="consultaPrivadaTabela"
                    dataSource={dataSource}
                    columns={colunasNomeacoesPrivadas}
                    style={{
                      width: "100%",
                      height: "37vw",
                    }}
                    size="middle"
                    pagination={false}
                    // scroll={{
                    //   y: 800,
                    // }}
                  />
                  <Button
                    onClick={handleAllConfirmation}
                    style={{
                      marginTop: "0.5%",
                    }}
                    id="confirmAllNominations"
                  >
                    Confirmar todos
                  </Button>

                  <Button
                    onClick={() => {
                      handleSubmissionConfirmation(dataSource);
                    }}
                    type="primary"
                    style={{
                      marginBottom: 16,
                    }}
                    id="submissionConfirmationButton"
                  >
                    Submeter Confirmações
                  </Button>
                  <Space wrap>
                    <Button
                      shape="circle"
                      style={{
                        marginBottom: 16,
                      }}
                      value="Instruções"
                      onClick={info}
                    >
                      {" "}
                      ❓{" "}
                    </Button>
                  </Space>
                </div>
              ) : (
                <h2 className="blue">Não tem nomeações de momento.</h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function addHours(numOfHours, date = new Date()) {
  date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  return date;
}
