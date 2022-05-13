import React from "react";
import {FileInput} from "./FileInput"
import { EscolhaArbitros } from "./EscolhaArbitros";

export class ListaJogosSemArbitros extends React.Component {

  

  render() {
    return (
      <div
        className="demo-app"
        style={{ height: "10%", width: "915px", float: "right" }}
      >
        {this.renderSidebar()}
        <div >
          <div className="demo-app-main" style={{ overflow: "auto"}}>
                       
            
              <div className="botao" onClick={() => navigate("/EscolhaArbitros")} value="Escolher Árbitros"> Escolher Árbitro</div>
        </div>
      </div>
      </div>
    );
  }

  renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>Lista Total de Jogos Sem Árbitro:</h2>
        </div>
      </div>
    );
  }

}
