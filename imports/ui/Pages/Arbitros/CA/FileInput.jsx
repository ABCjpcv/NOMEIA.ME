import React from "react";
import Papa from "papaparse";
import { Meteor } from "meteor/meteor";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";

const { Dragger } = Upload;

const props = {
  beforeUpload: (file) => {
    let isValidFyleType = file.type === "text/csv";
    isValidFyleType = isValidFyleType || file.type === ".xlsx";
    isValidFyleType = isValidFyleType || file.type === ".xls";

    if (!isValidFyleType) {
      message.error(
        "Formato de ficheiro inválido. \n" + `${file.name} não é CSV.`
      );
    } else {
      message.success("Novos jogos semanais carregados!");
    }

    return isValidFyleType;
  },
  Upload: {},
  onChange: (event) => {
    if (event.file) {
      // Aceita ficheiros csv, xls, xlsx
      Papa.parse(event.file.originFileObj, {
        complete: function (results) {
          let newGames = results.data;

          Meteor.call("addJogosSemanais", newGames, (err, result) => {
            if (err) {
              //console.log("Error: " + err);
            } else if (result) {
              document
                .getElementById("clickOptionMenuAtribuirArbitros")
                .click();
            }
          });
        },
      });
    }
  },
};

export function FileInput() {
  return (
    <div style={{ marginTop: "1%", marginLeft: "37%", width: "500px" }}>
      {/* <h1 className="blue"> Inserir ficheiro com tabela de jogos </h1> */}

      <span>
        <Dragger {...props} accept=".csv, .xlsx, .xls">
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
  );
}
