import React from "react";
import Papa from "papaparse";
import { Meteor } from "meteor/meteor";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import { Header } from "../../Geral/Header";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const { Dragger } = Upload;

export function FileInput() {
  let navigate = useNavigate();
  let location = useLocation();
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
      let go = false;
      if (event.file) {
        // Aceita ficheiros csv, xls, xlsx
        Papa.parse(event.file.originFileObj, {
          complete: function (results) {
            let newGames = results.data;
            Meteor.call("addJogosSemanais", newGames, (err, result) => {
              if (err) {
                //console.log("Error: " + err);
                return;
              }
              go = true;
            });
          },
        });
      }

      setTimeout(() => {
        if (go) {
          go = false;
          message.success("Novos jogos semanais carregados!");
          navigate("/Conta/ProfileCA/Atribuir_Arbitros");
        }
      }, 300);
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
        atribuirArbitros={true}
        carregarJogos={false}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
      />
      <div
        style={{
          marginTop: "1%",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {/* <h1 className="blue"> Inserir ficheiro com tabela de jogos </h1> */}

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
