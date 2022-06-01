import React from "react";
import SideBar from "./sidebar";
import { Fragment } from "react/cjs/react.production.min";

export class Header extends React.Component{

    render(){
    return( 
        <div className="div_header">
    <Fragment>
      
      <div id="titulo" hidden={false}>
        <img src="logo.png" style={{ width: "102px" }} />
        Plataforma Online de Nomeações de Árbitros de Voleibol
      </div>
      <div id="menuPrivado" hidden={true}>
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
      <div
        style={{
          position: "fixed",
          width: "80px",
          height: "50px",
          right: "120px",
          top: "36px",
        }}
      >
        <div id="div_username"></div>
      </div>
      <div id="nomeacoesPrivadas" hidden={true}>
        <img src="logo.png" style={{ width: "102px" }} />
        <h1 className="blue"> Nomeações Semanais: </h1>
      </div>
      <div id="indisponibilidadePrivadas" hidden={true}>
        <img src="logo.png" style={{ width: "102px" }} />
        <h1 className="blue"> Marcação de Indisponibilidades: </h1>
      </div>
      <div id="RestricoesPrivadas" hidden={true}>
        <img src="logo.png" style={{ width: "102px" }} />
        <h1 className="blue"> Marcação de Restrições: </h1>
      </div>
      </div>
      </Fragment>
    </div>
    )}
}