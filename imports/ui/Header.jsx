import React from "react";
import SideBar from "./sidebar";
import { Fragment } from "react/cjs/react.production.min";

export class Header extends React.Component {
  render() {
    return (
      <div
        className="div_header"
        style={{ justifyContent: "space-between", width: "100%" }}
      >
        <div id="divEsquerdo" style={{ float: "left", width: "auto", backgroundColor: "black" }}>
          <img id="imgLogo" src="logo.png" style={{ width: "100px" }} />
        </div>

        <div id="divCentral" style={{ margin:"0 auto", width: "auto", backgroundColor: "blue"}}>
          <p id="titulo" style={{ margin: "0" }}>
            Plataforma Online de Nomeações de Árbitros de Voleibol
          </p>
          <p id="nomeacoesPrivadas" hidden={true}>
            As minhas nomeações 📅🏐
          </p>
          <p id="indisponibilidadePrivadas" hidden={true}>
            Marcação de Indisponibilidades:
          </p>
          <p id="RestricoesPrivadas" hidden={true}>
            Marcação de Restrições:
          </p>
        </div>

        <div id="divDireito" style={{float:"right", width:"auto", backgroundColor: "red"}}>
          <Fragment>
            <div id="menuPrivado" hidden={true}>
              <SideBar
                pageWrapId={"page-wrap"}
                outerContainerId={"menuPrivado"}
              />
              <div id="page-wrap"></div>
            </div>
            <p hidden={true}> username </p>
          </Fragment>
        </div>
      </div>
    );
  }
}
