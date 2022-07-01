import React from "react";
import SideBar from "./sidebar";
import { Fragment } from "react/cjs/react.production.min";
import { useNavigate } from "react-router-dom";
import { LogoHeader } from "./Pages/LogoHeader";




export class Header extends React.Component {

  render() {
    return (
      <div
        className="div_header"
        style={{ }}
      >
        <div id="divEsquerdo" style={{ float: "left", width: "15%"}}>
          <LogoHeader></LogoHeader>
        </div>

        <div id="divCentral" style={{ margin:"0 auto", width: "40%"}}>
          <p id="titulo" style={{ margin: "0", marginLeft:"-120px" }}>
            Plataforma Online de Nomeações de Árbitros de Voleibol
          </p>

          {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
          <p id="carregarJogos" style={{ margin: "0" }} hidden={true}>
            Carregar Jogos Semanais 
          </p>
          <p id="atribuirArbitros" style={{ margin: "0" }} hidden={true}>
          Atribuição de Árbitros
          </p>




          {/* AQUI ESTAO OS HEADERS DOS ARBITROS */}
          <p id="nomeacoesPrivadas" style={{ margin: "0" }} hidden={true}>
            As minhas nomeações 📅🏐
          </p>
          <p id="indisponibilidadePrivadas" style={{ margin: "0" }} hidden={true}>
            Marcação de Indisponibilidades:
          </p>
          <p id="restricoesPrivadas" style={{ margin: "0" }} hidden={true}>
          Relações com clubes
          </p>
        </div>

        <div id="divDireito" style={{float:"right", width:"15%"}}>
          <Fragment>
            <div id="menuPrivado" hidden={true}>
              <p id="usernameStatus" style={{ margin: "0", marginLeft: "-110px", fontSize: "18px" }} hidden={false}> username </p>
              <SideBar
                pageWrapId={"page-wrap"}
                outerContainerId={"menuPrivado"}
              />
              <div id="page-wrap"></div>
            </div>
            
          </Fragment>
        </div>
      </div>
    );

    function navigate(a){
      let n = useNavigate();
      return n(a);
    }

  }
  
}
