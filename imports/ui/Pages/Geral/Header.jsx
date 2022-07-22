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
            <Fragment>
              <div id="menuPrivado" hidden={true}>
                <SideBar
                  pageWrapId={"page-wrap"}
                  outerContainerId={"menuPrivado"}
                  style={{ marginTop: "20px" }}
                />
                <div id="page-wrap"></div>
                <p
                  id="usernameStatus"
                  style={{
                    marginLeft: "-20%",
                    fontSize: "16px",
                    marginTop: "4%",
                  }}
                  hidden={false}
                >
                  {" Árbitro : " + user.username}
                </p>
              </div>

              <div id="menuPrivadoCA" hidden={true}>
                <SideBarCA
                  pageWrapId={"page-wrap-ca"}
                  outerContainerId={"menuPrivadoCA"}
                />
                <div id="page-wrap-ca"></div>
                <p
                  id="usernameStatusCA"
                  style={{
                    marginLeft: "-20%",
                    fontSize: "16px",
                    marginTop: "4%",
                  }}
                  hidden={false}
                >
                  {" CA : " + user.username}
                </p>
              </div>
            </Fragment>
          </div>

          <div
            id="divCentral"
            style={{ display: "flex", justifyContent: "center", width: "60%" }}
          >
            <p id="titulo" style={{ marginTop: "1%", fontSize: "smaller" }}>
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>

            {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
            <p
              id="atribuirArbitros"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={true}
            >
              Atribuição de Árbitros
            </p>

            <p
              id="carregarJogos"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={true}
            >
              Carregar Jogos Novos:
            </p>

            <p
              id="criarContaNova"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={true}
            >
              Criar Conta Nova:
            </p>

            {/* AQUI ESTAO OS HEADERS DOS ARBITROS */}
            <p
              id="nomeacoesPrivadas"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={true}
            >
              As minhas nomeações:
            </p>
            <p
              id="indisponibilidadePrivadas"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={true}
            >
              📅 Calendário 📅
            </p>
            <p
              id="restricoesPrivadas"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={true}
            >
              Relações com clubes:
            </p>

            <p
              id="definicoes"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={true}
            >
              ⚙️ Definições ⚙️
            </p>
          </div>

          <div
            id="divDireito"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
            <LogoHeader user={user}></LogoHeader>
          </div>
        </div>
      ) : (
        <div className="div_header">
          <div
            id="divEsquerdo"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
            <LogoAVL></LogoAVL>
          </div>

          <div
            id="divCentral"
            style={{ display: "flex", justifyContent: "center", width: "60%" }}
          >
            <p id="titulo" style={{ marginTop: "1%", fontSize: "smaller" }}>
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>
          </div>

          <div
            id="divDireito"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
            <LogoHeader></LogoHeader>
          </div>
        </div>
      )}
    </>
  );
};
