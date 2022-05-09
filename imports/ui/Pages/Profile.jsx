import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import SideBar from "./sidebar";

export const Profile = () => {
    return (
    <div>
        <div id="App">
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
        <h4> Bem vindo ao teu perfil. Clica na barra lateral para visualizar mais opções! </h4>
      <div id="page-wrap">
        <h1> As minhas nomeações 📅🏐 </h1>
        <div>
            <p></p>
            <p></p>
            <p></p>
            AQUI VAI ESTAR A TABELA COM LISTA DE NOMEAÇÕES SEMANAIS



        </div>
      </div>
    </div>
  
    </div>
    )
}