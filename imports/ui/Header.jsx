import React from "react";
import { Meteor } from "meteor/meteor";
import SideBar from "./sidebar";
import SideBarCA from "./sidebarCA";
import { Fragment } from "react/cjs/react.production.min";
import { useNavigate } from "react-router-dom";
import { LogoHeader } from "./Pages/LogoHeader";

export const Header = ({ user }) => {
  return (
    <>
      {user ? (
        <div className="div_header" style={{}}>
          <div id="divEsquerdo" style={{ float: "left", width: "15%" }}>
            <LogoHeader></LogoHeader>
          </div>

          <div id="divCentral" style={{ margin: "0 auto", width: "40%" }}>
            <p id="titulo" style={{ margin: "0", marginLeft: "-120px" }}>
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>

            {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
            <p id="atribuirArbitros" style={{ margin: "0" }} hidden={true}>
              Atribuição de Árbitros
            </p>

            <p id="carregarJogos" style={{ margin: "0" }} hidden={true}>
              Carregar Jogos Novos:
            </p>

            <p id="criarContaNova" style={{ margin: "0" }} hidden={true}>
              Criar Conta Nova:
            </p>

            {/* AQUI ESTAO OS HEADERS DOS ARBITROS */}
            <p id="nomeacoesPrivadas" style={{ margin: "0" }} hidden={true}>
              As minhas nomeações:
            </p>
            <p
              id="indisponibilidadePrivadas"
              style={{ margin: "0" }}
              hidden={true}
            >
              📅 Calendário 📅
            </p>
            <p id="restricoesPrivadas" style={{ margin: "0" }} hidden={true}>
              Relações com clubes:
            </p>

            <p id="definicoes" style={{ margin: "0" }} hidden={true}>
              ⚙️ Definições ⚙️
            </p>
          </div>

          <div id="divDireito" style={{ float: "right", width: "15%" }}>
            <Fragment>
              <div id="menuPrivado" hidden={true}>
                <p
                  id="usernameStatus"
                  style={{
                    margin: "0",
                    marginLeft: "-110px",
                    fontSize: "18px",
                  }}
                  hidden={false}
                >
                  {user.username}
                </p>
                <SideBar
                  pageWrapId={"page-wrap"}
                  outerContainerId={"menuPrivado"}
                />
                <div id="page-wrap"></div>
              </div>

              <div id="menuPrivadoCA" hidden={true}>
                <p
                  id="usernameStatusCA"
                  style={{
                    margin: "0",
                    marginLeft: "-110px",
                    fontSize: "18px",
                  }}
                  hidden={false}
                >
                  {" CA : " + user.username}
                </p>
                <SideBarCA
                  pageWrapId={"page-wrap-ca"}
                  outerContainerId={"menuPrivadoCA"}
                />
                <div id="page-wrap-ca"></div>
              </div>
            </Fragment>
          </div>
        </div>
      ) : (
        <div className="div_header" style={{}}>
          <div id="divEsquerdo" style={{ float: "left", width: "15%" }}>
            <LogoHeader></LogoHeader>
          </div>

          <div id="divCentral" style={{ margin: "0 auto", width: "40%" }}>
            <p id="titulo" style={{ margin: "0", marginLeft: "-120px" }}>
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>

            {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
            <p id="atribuirArbitros" style={{ margin: "0" }} hidden={true}>
              Atribuição de Árbitros
            </p>

            <p id="carregarJogos" style={{ margin: "0" }} hidden={true}>
              Carregar Jogos Novos:
            </p>

            <p id="criarContaNova" style={{ margin: "0" }} hidden={true}>
              Criar Conta Nova:
            </p>

            {/* AQUI ESTAO OS HEADERS DOS ARBITROS */}
            <p id="nomeacoesPrivadas" style={{ margin: "0" }} hidden={true}>
              As minhas nomeações:
            </p>
            <p
              id="indisponibilidadePrivadas"
              style={{ margin: "0" }}
              hidden={true}
            >
              📅 Calendário 📅
            </p>
            <p id="restricoesPrivadas" style={{ margin: "0" }} hidden={true}>
              Relações com clubes:
            </p>

            <p id="definicoes" style={{ margin: "0" }} hidden={true}>
              ⚙️ Definições ⚙️
            </p>
          </div>

          <div id="divDireito" style={{ float: "right", width: "15%" }}></div>
        </div>
      )}
    </>
  );
};
