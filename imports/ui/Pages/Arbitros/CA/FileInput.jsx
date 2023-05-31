import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import { Meteor } from "meteor/meteor";
import { InboxOutlined } from "@ant-design/icons";
import { message, Select, Upload } from "antd";
import { Header } from "../../Geral/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const { Dragger } = Upload;

export function FileInput() {
  let navigate = useNavigate();
  let location = useLocation();
  let [selectVal, setSelectVal] = useState(null);

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
              if (selectVal === "Campeonato Universitário") {
                // console.log(
                //   "ENTRAS???????????????????????????????????????????"
                // );
                Meteor.call(
                  "adicionaJogosUniversitarios",
                  newGames,
                  (err, result) => {
                    if (err) {
                      //console.log("Error: " + err);
                      return;
                    }
                    if (result) {
                      message.success(
                        "Novos jogos do Campeonato Universitário carregados!"
                      );
                    }
                  }
                );
                navigate("/Conta/ProfileCA/Atribuir_Arbitros/ADESL");
              } else if (selectVal === "Campeonato Regional / Nacional") {
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
                navigate("/Conta/ProfileCA/Atribuir_Arbitros/CR_CN");
              }
            },
          });
        } else {
          message.error("Não indicou o campeonato!");
        }
      }
    },
  };

  return (
    <>
      <Header
        user={Meteor.user()}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={false}
        atribuirArbitrosAdesl={true}
        atribuirArbitrosCev={true}
        atribuirArbitrosCR_CN={true}
        carregarJogos={false}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
              forgotPasswordHeader={true}
              gestaoPagamentos={true}
      />

      {/* <h1 className="blue"> Inserir ficheiro com tabela de jogos </h1> */}

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
              placeholder="Indique o Campeonato"
              style={{
                position: "sticky",
                top: "0",
                left: "0",
                width: "300px",
                flexDirection: "none",
                justifyContent: "space-evenly",
              }}
            >
              <Select.Option key="adesl" value="Campeonato Universitário">
                Campeonato Universitário
              </Select.Option>
              {/* <Select.Option
                key="cev"
                value="Confederação Europeia de Voleibol"
              >
                Confederação Europeia de Voleibol
              </Select.Option> */}
              <Select.Option key="Campeonato Regional / Nacional">
                Campeonato Regional / Nacional
              </Select.Option>
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
              Selecione ou arraste um ficheiro para esta área para o carregar
            </p>
            <p className="ant-upload-hint">
              Formato do ficheiro {"("} .csv {")"}.
            </p>
          </Dragger>
        </span>
      </div>
    </>
  );
}
