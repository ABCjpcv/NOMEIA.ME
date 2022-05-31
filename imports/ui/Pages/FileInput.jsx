import React from "react";
import Papa from "papaparse";

export class FileInput extends React.Component {
  constructor(props) {
    super(props);
    this.uploadFile = this.uploadFile.bind(this);
  }

  uploadFile(event) {
    let file = event.target.files[0];

    if (file) {
      let data = new FormData();
      data.append("file", file);
      // axios.post('/files', data)...
    }
  }

  render() {
    return (
      <span>
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={(e) => {
            const files = e.target.files;
            if (files) {
              // Aceita ficheiros csv, xls, xlsx
              Papa.parse(files[0], {
                complete: function (results) {
                  let merda = results.data;

                  console.log(merda);

                  const header = merda[0];

                  console.log(header);

                  let seccoes = header.toString().split(",");

                  let resultado = "[\n";

                  for (let index = 1; index < merda.length; index++) {
                    const value = merda[index].toString().split(",");

                    resultado = resultado + "{\n ";

                    for (let index = 0; index < seccoes.length; index++) {
                      resultado =
                        resultado +
                        '"' +
                        seccoes[index] +
                        '": "' +
                        value[index].replaceAll('"', "") +
                        '", \n ';
                    }
                    resultado =
                      resultado.substring(0, resultado.length - 4) + "\n},\n";
                  }

                  resultado =
                    resultado.substring(0, resultado.length - 2) + "]";

                  console.log(resultado);

                  const blob = new Blob([resultado], {
                    type: "text/plain;charset=utf-8",
                  });

                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");

                  // ESTÁ A FAZER DOWNLOAD DO FICHEIRO JSON
                  // QUERO PÔ-LO NA BASE DE DADOS PARA DEPOIS LER O MESMO EM VEZ DE FAZER DOWNLOAD

                  link.download = "Livro.json";
                  link.href = url;
                  link.click();
                },
              });
            }
          }}
        />
      </span>
    );
  }
}
