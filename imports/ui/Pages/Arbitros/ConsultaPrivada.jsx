import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
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

import { QuestionCircleOutlined } from "@ant-design/icons";

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

function validaSet(set, decisivo) {
  let parcial1 = parseInt(set.split("-")[0]);
  let parcial2 = parseInt(set.split("-")[1]);

  let conta = parcial1 - parcial2;
  conta < 0 ? (conta = conta * -1) : null;

  if (conta === NaN) return false;

  if (conta < 2) return false;
  // if (!decisivo) {
  //   if (
  //     !(
  //       (parcial1 > 25 && parcial2 > 25) ||
  //       (parcial1 == 25 && parcial2 != 25)
  //     )
  //   ) {
  //     console.log("ERRADO");
  //     return false;
  //   }
  // } else {
  //   if (
  //     !(
  //       (parcial1 != 15 && parcial2 == 15) ||
  //       (parcial1 == 15 && parcial2 != 15)
  //     )
  //   ) {
  //     return false;
  //   }
  // }
  else return true;
}

function parcial1(set) {
  return parseInt(set.split("-")[0]);
}
function parcial2(set) {
  return parseInt(set.split("-")[1]);
}
function validaResultadoComSets(resultado, set1, set2, set3, set4, set5) {
  if (resultado === "3-0") {
    return (
      parcial1(set1) > parcial2(set1) &&
      parcial1(set2) > parcial2(set2) &&
      parcial1(set3) > parcial2(set3)
    );
  } else if (resultado === "0-3") {
    return (
      parcial1(set1) < parcial2(set1) &&
      parcial1(set2) < parcial2(set2) &&
      parcial1(set3) < parcial2(set3)
    );
  } else if (resultado === "3-1") {
    //GGPG
    let c1 =
      parcial1(set1) > parcial2(set1) &&
      parcial1(set2) > parcial2(set2) &&
      parcial1(set3) < parcial2(set3) &&
      parcial1(set4) > parcial2(set4);
    //PGGG
    let c2 =
      parcial1(set1) < parcial2(set1) &&
      parcial1(set2) > parcial2(set2) &&
      parcial1(set3) > parcial2(set3) &&
      parcial1(set4) > parcial2(set4);
    //GPGG
    let c3 =
      parcial1(set1) > parcial2(set1) &&
      parcial1(set2) < parcial2(set2) &&
      parcial1(set3) > parcial2(set3) &&
      parcial1(set4) > parcial2(set4);

    return c1 || c2 || c3;
  } else if (resultado === "1-3") {
    //GGPG
    let c1 =
      parcial2(set1) > parcial1(set1) &&
      parcial2(set2) > parcial1(set2) &&
      parcial2(set3) < parcial1(set3) &&
      parcial2(set4) > parcial1(set4);
    //PGGG
    let c2 =
      parcial2(set1) < parcial1(set1) &&
      parcial2(set2) > parcial1(set2) &&
      parcial2(set3) > parcial1(set3) &&
      parcial2(set4) > parcial1(set4);
    //GPGG
    let c3 =
      parcial2(set1) > parcial1(set1) &&
      parcial2(set2) < parcial1(set2) &&
      parcial2(set3) > parcial1(set3) &&
      parcial2(set4) > parcial1(set4);

    return c1 || c2 || c3;
  } else if (resultado === "3-2") {
    //GGPPG
    let c1 =
      parcial1(set1) > parcial2(set1) &&
      parcial1(set2) > parcial2(set2) &&
      parcial1(set3) < parcial2(set3) &&
      parcial1(set4) < parcial2(set4) &&
      parcial1(set5) > parcial2(set5);
    //GPGPG
    let c2 =
      parcial1(set1) > parcial2(set1) &&
      parcial1(set2) < parcial2(set2) &&
      parcial1(set3) > parcial2(set3) &&
      parcial1(set4) < parcial2(set4) &&
      parcial1(set5) > parcial2(set5);
    //GPPGG
    let c3 =
      parcial1(set1) > parcial2(set1) &&
      parcial1(set2) < parcial2(set2) &&
      parcial1(set3) < parcial2(set3) &&
      parcial1(set4) > parcial2(set4) &&
      parcial1(set5) > parcial2(set5);
    //PGGPG
    let c4 =
      parcial1(set1) < parcial2(set1) &&
      parcial1(set2) > parcial2(set2) &&
      parcial1(set3) > parcial2(set3) &&
      parcial1(set4) > parcial2(set4) &&
      parcial1(set5) > parcial2(set5);
    //PGPGG
    let c5 =
      parcial1(set1) < parcial2(set1) &&
      parcial1(set2) > parcial2(set2) &&
      parcial1(set3) < parcial2(set3) &&
      parcial1(set4) > parcial2(set4) &&
      parcial1(set5) > parcial2(set5);
    //PPGGG
    let c6 =
      parcial1(set1) < parcial2(set1) &&
      parcial1(set2) < parcial2(set2) &&
      parcial1(set3) > parcial2(set3) &&
      parcial1(set4) > parcial2(set4) &&
      parcial1(set5) > parcial2(set5);

    // console.log("c1", c1);
    // console.log("c2", c2);
    // console.log("c3", c3);
    // console.log("c4", c4);
    // console.log("c5", c5);
    // console.log("c6", c6);
    return c1 || c2 || c3 || c4 || c5 || c6;
  } else if (resultado === "2-3") {
    //GGPPG
    let c1 =
      parcial2(set1) > parcial1(set1) &&
      parcial2(set2) > parcial1(set2) &&
      parcial2(set3) < parcial1(set3) &&
      parcial2(set4) < parcial1(set4) &&
      parcial2(set5) > parcial1(set5);
    //GPGPG
    let c2 =
      parcial2(set1) > parcial1(set1) &&
      parcial2(set2) < parcial1(set2) &&
      parcial2(set3) > parcial1(set3) &&
      parcial2(set4) < parcial1(set4) &&
      parcial2(set5) > parcial1(set5);
    //GPPGG
    let c3 =
      parcial2(set1) > parcial1(set1) &&
      parcial2(set2) < parcial1(set2) &&
      parcial2(set3) < parcial1(set3) &&
      parcial2(set4) > parcial1(set4) &&
      parcial2(set5) > parcial1(set5);
    //PGGPG
    let c4 =
      parcial2(set1) < parcial1(set1) &&
      parcial2(set2) > parcial1(set2) &&
      parcial2(set3) > parcial1(set3) &&
      parcial2(set4) > parcial1(set4) &&
      parcial2(set5) > parcial1(set5);
    //PGPGG
    let c5 =
      parcial2(set1) < parcial1(set1) &&
      parcial2(set2) > parcial1(set2) &&
      parcial2(set3) < parcial1(set3) &&
      parcial2(set4) > parcial1(set4) &&
      parcial2(set5) > parcial1(set5);
    //PPGGG
    let c6 =
      parcial2(set1) < parcial1(set1) &&
      parcial2(set2) < parcial1(set2) &&
      parcial2(set3) > parcial1(set3) &&
      parcial2(set4) > parcial1(set4) &&
      parcial2(set5) > parcial1(set5);
    return c1 || c2 || c3 || c4 || c5 || c6;
  } else {
    false;
  }
}

function handleConfirmationResultado(record, index) {
  let jogo = record;

  let inputs = document.querySelectorAll("input");

  console.log(inputs);
  console.log("index", index);
  console.log("inputs[index]", inputs[index]);

  let inputsLength = inputs.length;

  if (index * 12 >= inputsLength) {
    // EXISTEM JOGOS QUE AINDA NÃO FORAM REALIZADOS NO MEIO
    handleConfirmationResultado(record, index - 1);
  }

  let resultado = inputs[index * 12].value + "-" + inputs[index * 12 + 1].value;

  // console.log("RESULTADO", resultado);
  if (
    !(
      resultado === "0-3" ||
      resultado === "1-3" ||
      resultado === "2-3" ||
      resultado === "3-0" ||
      resultado === "3-1" ||
      resultado === "3-2"
    )
  ) {
    message.warn("Resultado incorreto!");
    return;
  }

  let set1 = inputs[index * 12 + 2].value + "-" + inputs[index * 12 + 3].value;

  if (!validaSet(set1, false)) {
    message.warn("Pontuação do 1º Set inválida!");
    return;
  }

  let set2 = inputs[index * 12 + 4].value + "-" + inputs[index * 12 + 5].value;

  // console.log("set2", set2);

  if (!validaSet(set2, false)) {
    message.warn("Pontuação do 2º Set inválida!");
    return;
  }

  let set3 = inputs[index * 12 + 6].value + "-" + inputs[index * 12 + 7].value;

  if (!validaSet(set3, false)) {
    message.warn("Pontuação do 3º Set inválida!");
    return;
  }

  let set4 = "0-0";
  let set5 = "0-0";

  if (
    resultado === "3-1" ||
    resultado === "1-3" ||
    resultado === "3-2" ||
    resultado === "2-3"
  ) {
    set4 = inputs[index * 12 + 8].value + "-" + inputs[index * 12 + 9].value;
    if (!validaSet(set4, false)) {
      message.warn("Pontuação do 4º Set inválida!");
      return;
    }
    if (resultado === "2-3" || resultado === "3-2") {
      set5 =
        inputs[index * 12 + 10].value + "-" + inputs[index * 12 + 11].value;
      if (!validaSet(set5, true)) {
        message.warn("Pontuação do 5º Set inválida!");
        return;
      }
    }
  }

  if (!validaResultadoComSets(resultado, set1, set2, set3, set4, set5)) {
    message.warn("Pontuações inválidas de acordo com o resultado!");
    return;
  }

  // console.log(
  //   "sets",
  //   set1 + " " + set2 + " " + set3 + " " + set4 + " " + set5
  // );

  // console.log("index", index);

  let res =
    resultado + "-" + set1 + "-" + set2 + "-" + set3 + "-" + set4 + "-" + set5;
  RES = res;

  // $($(".divResultadoDisabled")[index]).attr("hidden", false);
  // $($(".divResultado")[index]).attr("hidden", true);

  // $(
  //   $("button.ant-btn.ant-btn-round.ant-btn-primary.button_result_hidden")[
  //     index
  //   ]
  // ).attr("hidden", false);
  // $(
  //   $("button.ant-btn.ant-btn-round.ant-btn-primary.button_result")[index]
  // ).attr("hidden", true);

  // GUARDAR NO LADO DO SERVER O RESULTADO

  let user = Meteor.user();
  let email = user.emails[0].address;

  Meteor.call("adicionaResultadoJogo", email, jogo, res, (err, result) => {
    if (err) {
      console.log("ERRRRROOOOO", { err });
    } else {
      message.success("Resultado submetido " + user.username);
    }
  });

  let newDS = [];
  for (let index = 0; index < dataSource.length; index++) {
    if (dataSource[index] != record) newDS.push(dataSource[index]);
  }
  setDataSource(newDS);
}

function handleAddResultadoNovo(record, index) {
  console.log("ertyuiolk,mnbg", record);
  Modal.confirm({
    title: "Resultado do jogo:\r\n" + record.Equipas,
    content: (
      <div className="divResultado">
        <Form
          labelCol={{
            span: 20,
            offset: 0,
          }}
          wrapperCol={{
            span: 20,
          }}
          layout="vertical"
          size="small"
        >
          <Form.Item label="Resultado:">
            <InputNumber
              className="resultado"
              placeholder="0"
              max={3}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            X
            <InputNumber
              className="resultado"
              placeholder="0"
              max={3}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
          </Form.Item>
          <Form.Item label="Sets">
            {"("}
            <InputNumber
              className="set1"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            -
            <InputNumber
              className="set1"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            {")"}
            <br></br>
            {"("}
            <InputNumber
              className="set2"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            -
            <InputNumber
              className="set2"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            {")"}
            <br></br>
            {"("}
            <InputNumber
              className="set3"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            -
            <InputNumber
              className="set3"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            {")"}
            <br></br>
            {"("}
            <InputNumber
              className="set4"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            -
            <InputNumber
              className="set4"
              placeholder="0"
              max={50}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            {")"}
            <br></br>
            {"("}
            <InputNumber
              className="set5"
              placeholder="0"
              max={30}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            -
            <InputNumber
              className="set5"
              placeholder="0"
              max={30}
              min={0}
              size={"small"}
              style={{ width: "40px" }}
              controls={false}
            />
            {")"}
          </Form.Item>
        </Form>
      </div>
    ),
    width: "20%",
    keyboard: false,
    okText: "Submeter",
    closable: true,

    onOk() {
      handleConfirmationResultado(record, index);

      // }
    },
    cancelText: "Cancelar",
    className: "modalRecusa",
  });
}

let RES = "";

export function ConsultaPrivada({ user }) {
  const colunasNomeacoesPrivadas = [
    {
      title: "Jogo",
      dataIndex: "Jogo",
      key: "Jogo",
      width: "4%",
      sorter: (a, b) => a.Jogo - b.Jogo,
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Dia",
      dataIndex: "Dia",
      key: "Dia",
      width: "7%",
      sorter: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Hora",
      dataIndex: "Hora",
      key: "Hora",
      width: "5%",
      sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Prova",
      dataIndex: "Prova",
      key: "Prova",
      width: "7%",
      sorter: (a, b) => comparaAminhaLindaString(a.Prova, b.Prova),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Série",
      dataIndex: "Serie",
      key: "Serie",
      width: "5%",
      sorter: (a, b) => comparaAminhaLindaString(a.Serie, b.Serie),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Equipas",
      dataIndex: "Equipas",
      key: "Equipas",
      width: "12%",
      sorter: (a, b) => comparaAminhaLindaString(a.Equipas, b.Equipas),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Pavilhão",
      dataIndex: "Pavilhao",
      key: "Pavilhao",
      width: "15%",
      sorter: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "1º Árbitro",
      dataIndex: "Arbitro1",
      key: "Arbitro1",

      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro1, b.Arbitro1),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "2º Árbitro",
      dataIndex: "Arbitro2",
      key: "Arbitro2",

      sorter: (a, b) => comparaAminhaLindaString(a.Arbitro2, b.Arbitro2),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Juízes de linha",
      dataIndex: "JL",
      key: "JL",
      width: "9%",
      sorter: (a, b) => comparaAminhaLindaString(a.JL, b.JL),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ação",
      dataIndex: "acao",
      key: "acao",
      fixed: "right",
      width: "9%",
      render: (_, record, index) =>
        dataSource.length > 0 && handleJogoPassou(record) ? (
          <>
            <div>
              <Button
                type="ghost"
                shape="round"
                size="small"
                style={{
                  whiteSpace: "normal",
                  minWidth: "100px",
                  height: "40px",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
                onClick={() => {
                  handleAddResultadoNovo(record, index);
                }}
              >
                Adiciona <br></br>Resultado
              </Button>
            </div>
          </>
        ) : dataSource.length > 0 ? (
          <div>
            <Button
              type="primary"
              shape="round"
              size="small"
              style={{ width: "100%", fontSize: "12px" }}
              onClick={() => {
                handleConfirmation(record);
              }}
              disabled={record.tags[0] == "recusado" ? true : false}
            >
              Confirmo ✔️
            </Button>
            <div style={{ height: "5%" }}>
              <h3></h3>
            </div>
            <Popconfirm
              title="Recusar jogo?"
              onConfirm={() => recusa(record)}
              style={{ width: "100%" }}
              cancelText="Cancelar"
              //disabled={record.tags[0] == "recusado" ? true : false}
            >
              <Button
                shape="round"
                size="small"
                style={{ width: "100%", fontSize: "12px" }}
                disabled={record.tags[0] == "recusado" ? true : false}
                // onClick={() => recusa(record)}
              >
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
      fixed: "right",
      render: (_, record, index) =>
        // dataSource.length > 0 && handleJogoPassou(record) ? (
        //   <>
        //     <Popconfirm
        //       className="popconfirm_result"
        //       title="Confirmar resultado?"
        //       onConfirm={() => handleConfirmationResultado(record, index)}
        //       cancelText="Cancelar"
        //     >
        //       <Button
        //         type="primary"
        //         shape="round"
        //         style={{ width: "100%" }}
        //         className="button_result"
        //         hidden={false}
        //         size="small"
        //       >
        //         Confirmo ✔️
        //       </Button>
        //       <Button
        //         type="primary"
        //         shape="round"
        //         style={{ width: "100%" }}
        //         className="button_result_hidden"
        //         disabled
        //         hidden={true}
        //       >
        //         Confirmo ✔️
        //       </Button>
        //     </Popconfirm>
        //   </>
        // ) :
        dataSource.length > 0 ? (
          <>
            {record.tags.map((tag) => {
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

  useEffect(() => {}, [dataSource]);

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
    handleSubmissionConfirmation(dataSource, true);
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

  function handleSubmissionConfirmation(data, confirma) {
    let jogos = [];
    let confirmacoes = [];
    let sendMessage = false;

    for (let index = 0; index < data.length; index++) {
      if (data[index].tags[0].includes("pendente")) {
        sendMessage = true;
      }
      jogos.push(data[index]);
      confirmacoes.push(data[index].tags[0]);
    }

    let email = user.emails[0].address;

    //console.log("confirmacoes", confirmacoes);

    Meteor.call(
      "adicionaConfirmacaoNomeacao",
      email,
      jogos,
      confirmacoes,
      (err, result) => {
        if (err) {
          console.log("ERRRRROOOOO", { err });
        } else {
          confirma
            ? message.success("Confirmação de jogo submetida " + user.username)
            : message.info("Recusa de jogo submetida " + user.username);
        }
      }
    );

    // if (sendMessage)
    //   message.info("Ainda tem jogos por confirmar, " + user.username);
  }

  function loadData() {
    user = Meteor.user();
    let email = user.emails[0].address;

    //console.log("email", email);
    Meteor.call("carregaNomeacoes", email, (err, result) => {
      //console.log("resultado de carregaNomeacoes da BD:", result);
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result)
        if (result.nomeacoesPrivadas.length > 0) {
          // console.log("RESULTADO AQUI", result);

          let dataFromDB = [];

          let confirmado = true;
          for (
            let index = 0;
            index < result.nomeacoesPrivadas.length;
            index++
          ) {
            let jogoLido = result.nomeacoesPrivadas[index].jogo;

            let tags = result.nomeacoesPrivadas[index].confirmacaoAtual;

            tags != "Confirmado" ? (confirmado = false) : (confirmado = true);

            // console.log("jogoLido", jogoLido);

            let jl =
              jogoLido.juiz_linha[0].length == 0
                ? ""
                : jogoLido.juiz_linha.toString().replaceAll(",", "\n");

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
              JL: jogoLido.juiz_linha[0] + " " + jogoLido.juiz_linha[1],
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

  let recusaInput = "";
  let mudou = false;
  let [recusaInputDisabled, setRecusaInputDisabled] = useState("");
  let [estadoRecusaInput, setEstadoRecusaInput] = useState("error");
  let [isModalVisible, setModalVisible] = useState();

  const handleRecusaInput = (e) => {
    recusaInput = e.target.value;

    if (e.target.value.length != 0 && !mudou) {
      // let ultimo = $(".ant-btn.ant-btn-primary").length - 1;
      // $($(".ant-btn.ant-btn-primary"))[ultimo].toggleAttribute("disabled");
      setRecusaInputDisabled(false);
      setEstadoRecusaInput("");
      mudou = true;
    } else if (e.target.value.length == 0) {
      // let ultimo = $(".ant-btn.ant-btn-primary").length - 1;
      // $($(".ant-btn.ant-btn-primary"))[ultimo].toggleAttribute("disabled");
      setRecusaInputDisabled(true);
      setEstadoRecusaInput("error");
      mudou = false;
    }
  };

  function handleOkRecusa(record) {
    console.log("Change is:", recusaInput);
    const newData = dataSource.filter((item) => {
      if (item.key == record.key) {
        return (item.tags[0] = ["recusado"]);
      } else {
        return item;
      }
    });
    setDataSource(newData);
    handleSubmissionConfirmation(dataSource, false);
  }

  function recusa(record) {
    Modal.confirm({
      title: "Recusa de Jogo",
      content: (
        <div>
          <p>Indique o motivo da recusa do Jogo</p>
          <Input
            id="input_recusa_jogo"
            showCount
            maxLength={80}
            allowClear
            onInput={handleRecusaInput}
            status={estadoRecusaInput}
          ></Input>
        </div>
      ),
      keyboard: false,
      okText: "Enviar recusa de jogo",
      onOk() {
        if (recusaInput.length == 0) {
          message.warn("Não colocou motivo de recusa de jogo...");
          setModalVisible(true);
        } else {
          handleOkRecusa(record);
          setModalVisible(false);
        }
      },
      cancelText: "Cancelar",
      visible: isModalVisible == undefined ? true : isModalVisible,
      className: "modalRecusa",
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

  let passaramTodos = true;

  for (let index = 0; index < dataSource.length; index++) {
    const element = dataSource[index];
    passaramTodos = passaramTodos && handleJogoPassou(element);
    // if (passaramTodos) break;
  }

  if (dataSource.length === 0) {
    return <h2 className="blue">Não tem nomeações de momento.</h2>;
  } else {
    return (
      <>
        <div className="demo-app" style={{ alignSelf: "center" }}>
          <div style={{ width: "100%", height: "100%" }}>
            <div className="demo-app-main" style={{ width: "100%" }}>
              <div className="container" style={{ width: "100%" }}>
                <br />

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
                      height: "100%",
                    }}
                    size="small"
                    pagination={false}
                    scroll={{
                      y: "66vh",
                    }}
                  />
                  <Button
                    onClick={() => {
                      handleAllConfirmation,
                        handleSubmissionConfirmation(dataSource);
                    }}
                    style={{
                      marginTop: "0.5%",
                    }}
                    type="primary"
                    size="small"
                    id="confirmAllNominations"
                    disabled={passaramTodos}
                  >
                    Confirmar todos
                  </Button>

                  {/* <Button
                    onClick={() => {
                      handleSubmissionConfirmation(dataSource);
                    }}
                    type="primary"
                    style={{
                      marginBottom: 16,
                    }}
                    id="submissionConfirmationButton"
                    disabled={passaramTodos}
                  >
                    Submeter Confirmações
                  </Button> */}
                  <Space wrap>
                    <Button
                      shape="round"
                      style={{
                        marginBottom: 16,
                      }}
                      value="Instruções"
                      onClick={info}
                    >
                      <QuestionCircleOutlined />
                    </Button>
                  </Space>
                </div>
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
}
