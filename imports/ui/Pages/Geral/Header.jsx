import React from "react";
import SideBar from "../../../api/Arbitro/sidebar";
import SideBarCA from "../../../api/CA/sidebarCA";
import { Fragment } from "react/cjs/react.production.min";
import { LogoHeader } from "./LogoHeader";
import { LogoAVL } from "./LogoAVL";

export const Header = ({ user }) => {
  return (
    <>
      {user ? (
        <div className="div_header">
          <div
            id="divEsquerdo"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
            <LogoHeader></LogoHeader>
          </div>

          <div
            id="divCentral"
            style={{ display: "flex", justifyContent: "center", width: "70%" }}
          >
            <p id="titulo" style={{ marginTop: "1%" }}>
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>

            {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
            <p id="atribuirArbitros" style={{ marginTop: "1%" }} hidden={true}>
              Atribuição de Árbitros
            </p>

            <p id="carregarJogos" style={{ marginTop: "1%" }} hidden={true}>
              Carregar Jogos Novos:
            </p>

            <p id="criarContaNova" style={{ marginTop: "1%" }} hidden={true}>
              Criar Conta Nova:
            </p>

            {/* AQUI ESTAO OS HEADERS DOS ARBITROS */}
            <p id="nomeacoesPrivadas" style={{ marginTop: "1%" }} hidden={true}>
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

          <div
            id="divDireito"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
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
                  style={{ marginTop: "20px" }}
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
        <div className="div_header">
          <div
            id="divEsquerdo"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
            <LogoHeader></LogoHeader>
          </div>

          <div
            id="divCentral"
            style={{ display: "flex", justifyContent: "center", width: "70%" }}
          >
            <p id="titulo" style={{ marginTop: "1%" }}>
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>
          </div>

          <div
            id="divDireito"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
            <LogoAVL></LogoAVL>
          </div>
        </div>
      )}
    </>
  );
};
