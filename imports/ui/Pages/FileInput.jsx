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


              if(files[0].type === "text/csv") {
              // Aceita ficheiros csv, xls, xlsx
              Papa.parse(files[0], {
                complete: function (results) {

                  let newGames = results.data;

                  console.log("newGames", newGames);

                  Meteor.call("addJogosSemanais", newGames, (err, result) => {
                    if(err){
                      console.log("Error: " + err);
                    }
                    else if(result){
                       window.alert("Novos jogos semanais carregados")
                    }
                  
                  }); 

                  // ESTÁ A FAZER DOWNLOAD DO FICHEIRO JSON
                  // QUERO PÔ-LO NA BASE DE DADOS PARA DEPOIS LER O MESMO EM VEZ DE FAZER DOWNLOAD

                  // link.download = "Livro.json";
                  // link.href = url;
                  // link.click();
                },
              });
            } else{
              window.alert("not accepting at the moment");
            }
            }
          }}
        />
      </span>
    );
  }
}
