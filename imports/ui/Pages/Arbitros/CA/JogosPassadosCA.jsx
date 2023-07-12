import React, { useEffect, useState } from "react";

import { Header } from "../../Geral/Header";
import { InputNumber, Table } from "antd";
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

export function JogosPassadosCA({ user }) {
  const colunasJogosPassadosCA = [
    {
      title: "Jogo",
      dataIndex: "numerojogo",
      key:"numerojogo",
      sorter: (a, b) => a.numerojogo - b.numerojogo,
      sortDirections: ["descend", "ascend"],
      width: "5%",
      fixed: "left",
    },
    {
      title: "Dia",
      dataIndex: "dia",
      key: "dia",
      sorter: (a, b) => comparaAminhaLindaData(a.dia, b.dia),
      sortDirections: ["descend", "ascend"],
      width: "8%",
      fixed: "left",
    },
    {
      title: "Hora",
      dataIndex: "hora",
      key: "hora",
      sorter: (a, b) => comparaAminhaLindaString(a.hora, b.hora),
      sortDirections: ["descend", "ascend"],
      width: "5%",
      fixed: "left",
    },
    {
      title: "Prova",
      dataIndex: "prova",
      key: "prova",
      sorter: (a, b) => comparaAminhaLindaString(a.prova, b.prova),
      sortDirections: ["descend", "ascend"],
      width: "5%",
      fixed: "left",
    },
    {
      title: "Série",
      dataIndex: "serie",
      key: "Serie",
      sorter: (a, b) => comparaAminhaLindaString(a.serie, b.serie),
      sortDirections: ["descend", "ascend"],
      width: "5%",
      fixed: "left",
    },
    {
      title: "Equipas",
      dataIndex: "equipas",
      key: "Equipas",
      sorter: (a, b) => comparaAminhaLindaString(a.equipas, b.equipas),
      sortDirections: ["descend", "ascend"],
      fixed: "left",
    },
    {
      title: "Pavilhão",
      dataIndex: "pavilhao",
      key: "pravilhao",
      sorter: (a, b) => comparaAminhaLindaString(a.pavilhao, b.pavilhao),
      sortDirections: ["descend", "ascend"],

      fixed: "left",
    },
    {
      title: "1º Árbitro",
      dataIndex: "arbitro1",
      key: "arbitro1",
      sorter: (a, b) => comparaAminhaLindaString(a.arbitro1, b.arbitro1),
      sortDirections: ["descend", "ascend"],
      width: "10%",
    },
    {
      title: "2º Árbitro",
      dataIndex: "arbitro2",
      key: "arbitro2",
      sorter: (a, b) => comparaAminhaLindaString(a.arbitro2, b.arbitro2),
      sortDirections: ["descend", "ascend"],
      width: "10%",
    },
    {
      title: "Juízes de linha",
      dataIndex: "juiz_linha",
      key: "juiz_linha",
      sorter: (a, b) => comparaAminhaLindaString(a.juiz_linha1, b.juiz_linha1),
      sortDirections: ["descend", "ascend"],
    },

    {
      title: "Resultado",
      dataIndex: "resultado",
      key: "resultado",
      width: "12%",
      fixed: "right",
      render: (_, record, index) =>
        dataSource.length > 0 ? (
          <>
            <div className="divResultadoDisabled">
              <InputNumber
                className="resultado"
                size={"small"}
                value={resultados[index].total[0]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />{" "}
              X{" "}
              <InputNumber
                className="resultado"
                size={"small"}
                value={resultados[index].total[1]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />
              <br></br>
              Sets:
              <br></br>
              {"( "}
              <InputNumber
                className="set1"
                size={"small"}
                value={resultados[index].set1[0]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />{" "}
              -{" "}
              <InputNumber
                className="set1"
                size={"small"}
                value={resultados[index].set1[1]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />
              {" )"}
              <br></br>
              {"( "}
              <InputNumber
                className="set2"
                size={"small"}
                value={resultados[index].set2[0]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />{" "}
              -{" "}
              <InputNumber
                className="set2"
                size={"small"}
                value={resultados[index].set2[1]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />
              {" )"}
              <br></br>
              {"( "}
              <InputNumber
                className="set3"
                size={"small"}
                value={resultados[index].set3[0]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />{" "}
              -{" "}
              <InputNumber
                className="set3"
                size={"small"}
                value={resultados[index].set3[1]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />
              {" )"}
              <br></br>
              {"( "}
              <InputNumber
                className="set4"
                size={"small"}
                value={resultados[index].set4[0]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />{" "}
              -{" "}
              <InputNumber
                className="set4"
                size={"small"}
                value={resultados[index].set4[1]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />
              {" )"}
              <br></br>
              {"( "}
              <InputNumber
                className="set5"
                size={"small"}
                value={resultados[index].set5[0]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />{" "}
              -{" "}
              <InputNumber
                className="set5"
                size={"small"}
                value={resultados[index].set5[1]}
                style={{ height: "22px", width: "44px" }}
                disabled
              />
              {" )"}
            </div>
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

  const [resultados, setResultados] = useState([]);

  function loadData() {
    user = Meteor.user();

    //console.log("email", email);
    Meteor.call("carregaResultadosJogosPassadosCA", (err, result) => {
      //console.log("resultado de carregaNomeacoes da BD:", result);
      if (err) {
        console.log("ERRRRROOOOO", err);
      } else if (result) {
        // console.log("resultado de carrega", result);
        if (result.length > 0) {
          let dataFromDB = [];
          let resultadosFromDB = [];

          for (let index = 0; index < result.length; index++) {
            let jogoLido = result[index].jogo;

            // console.log("jogoLido", jogoLido);

            let tags = result[index].confirmacaoAtual;

            let currentKeys = [];
            for (let index = 0; index < dataFromDB.length; index++) {
              currentKeys.push(dataFromDB[index].key);
            }

            let obj = {
              Jogo: jogoLido.id,
              Dia: jogoLido.dia,
              Hora: jogoLido.hora,
              Prova: jogoLido.prova,
              Serie: jogoLido.serie,
              Equipas: jogoLido.equipas,
              Pavilhao: jogoLido.pavilhao,
              arbitro1: jogoLido.arbitro1,
              arbitro2: jogoLido.arbitro2,
              juiz_linha1: jogoLido.juiz_linha1,
              juiz_linha2: jogoLido.juiz_linha2,
              // juiz_linha3: jogoLido.juiz_linha3,
              // juiz_linha4: jogoLido.juiz_linha4,
              key: jogoLido.key,
              tags: [tags],
            };

            if (!currentKeys.includes(obj.key)) dataFromDB.push(obj);

            let resultadoLido = result[index].resultado;

            resultadosFromDB.push({
              total: resultadoLido.total,
              set1: resultadoLido.set1,
              set2: resultadoLido.set2,
              set3: resultadoLido.set3,
              set4: resultadoLido.set4,
              set5: resultadoLido.set5,
            });
          }
          setResultados(resultadosFromDB);
          setDataSource(dataFromDB);
        } else {
          setDataSource([]);
        }
      }
    });
  }

  if (dataSource.length === 0) {
    loadData();
  }

  return (
    <>
      <div className="demo-app" style={{ alignSelf: "center" }}>
        <div style={{ width: "100%", height: "100%" }}>
          <div className="demo-app-main" style={{ width: "100%" }}>
            <div className="container" style={{ width: "100%" }}>
              <Header
                user={user}
                titulo={true}
                consultaPrivada={true}
                menuPrivado={true}
                menuPrivadoCA={false}
                atribuirArbitrosAdesl={true}
                atribuirArbitrosCev={true}
                atribuirArbitrosCR_CN={true}
                carregarJogos={true}
                criarContaNova={true}
                removerConta={true}
                indisponibilidadePrivadas={true}
                restricoesPrivadas={true}
                definicoes={true}
                historico={false}
                              forgotPasswordHeader={true}
                              gestaoPagamentos={true}
              />

              {dataSource.length != 0 ? (
                <div
                  className="table-responsive"
                  style={{
                    marginLeft: "0.5%",
                    marginRight: "0%",
                    width: "99%",
                    marginTop: "0.5%",
                  }}
                >
                  <Table
                    className="consultaPrivadaTabela"
                    dataSource={dataSource}
                    columns={colunasJogosPassadosCA}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                    size="small"
                    pagination={false}
                    scroll={{
                      y: "66vh",
                    }}
                  />
                </div>
              ) : (
                <h2 className="blue">Não existem ainda jogos passados.</h2>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
