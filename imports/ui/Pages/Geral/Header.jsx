import React, { useState } from "react";
import SideBar from "../../../api/Arbitro/sidebar";
import SideBarCA from "../../../api/CA/sidebarCA";
import { Fragment } from "react/cjs/react.production.min";
import { LogoHeader } from "./LogoHeader";
import { LogoAVL } from "./LogoAVL";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const Header = ({
  user,
  titulo,
  consultaPrivada,
  menuPrivado,
  menuPrivadoCA,
  atribuirArbitros,
  carregarJogos,
  criarContaNova,
  indisponibilidadePrivadas,
  restricoesPrivadas,
  definicoes,
}) => {
  return (
    <>
      {user ? (
        <div className="div_header">
          <div
            id="divEsquerdo"
            style={{ display: "flex", justifyContent: "center", width: "15%" }}
          >
            <Fragment>
              {/* <div id="page-wrap"> */}
              <div
                id="menuPrivado"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginRight: "30px",
                }}
                hidden={menuPrivado}
              >
                {/* <SideBar
                    pageWrapId={"page-wrap"}
                    outerContainerId={"menuPrivado"}
                    style={{ marginTop: "20px" }}
                  > */}
                <MenuPrivado />
                <p
                  id="usernameStatus"
                  style={{
                    marginLeft: "10px",
                    fontSize: "small",
                    marginTop: "4%",
                  }}
                >
                  {" Árbitro : " + user.username}
                </p>
                {/* </SideBar> */}
              </div>
              {/* </div> */}

              <div
                id="menuPrivadoCA"
                style={{ display: "flex", justifyContent: "space-between" }}
                hidden={menuPrivadoCA}
              >
                {/* <SideBarCA
                  pageWrapId={"page-wrap-ca"}
                  outerContainerId={"menuPrivadoCA"}
                /> */}
                {/* <div id="page-wrap-ca"></div> */}
                <MenuPrivado />
                <p
                  id="usernameStatusCA"
                  style={{
                    marginLeft: "-20%",
                    fontSize: "16px",
                    marginTop: "4%",
                  }}
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
            <p
              id="titulo"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={titulo}
            >
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>

            {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
            <p
              id="atribuirArbitros"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={atribuirArbitros}
            >
              Atribuição de Árbitros
            </p>

            <p
              id="carregarJogos"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={carregarJogos}
            >
              Carregar Jogos Novos:
            </p>

            <p
              id="criarContaNova"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={criarContaNova}
            >
              Criar Conta Nova:
            </p>

            {/* AQUI ESTAO OS HEADERS DOS ARBITROS */}
            <p
              id="nomeacoesPrivadas"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={consultaPrivada}
            >
              As minhas nomeações:
            </p>
            <p
              id="indisponibilidadePrivadas"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={indisponibilidadePrivadas}
            >
              📅 Calendário 📅
            </p>
            <p
              id="restricoesPrivadas"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={restricoesPrivadas}
            >
              Relações com clubes:
            </p>

            <p
              id="definicoes"
              style={{ marginTop: "1%", fontSize: "smaller" }}
              hidden={definicoes}
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

import { Button, Drawer, Radio, Space } from "antd";

const MenuPrivado = () => {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState("left");

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  let navigate = useNavigate();
  let location = useLocation();

  return (
    <>
      <Space>
        {/* <Radio.Group value={placement} onChange={onChange}>
          <Radio value="top">top</Radio>
          <Radio value="right">right</Radio>
          <Radio value="bottom">bottom</Radio>
          <Radio value="left">left</Radio>
        </Radio.Group> */}
        <Button
          type="primary"
          style={{
            verticalAlign: "text-bottom",
            width: "fit-content",
          }}
          onClick={showDrawer}
        >
          ☰
        </Button>
      </Space>
      <Drawer
        title="Menu"
        placement={placement}
        closable={false}
        onClose={onClose}
        visible={visible}
        key={placement}
      >
        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => (
              console.log("location.pathname", location.pathname),
              (location.pathname = "/Conta/Profile"),
              console.log("location.pathname", location.pathname),
              navigate("/Conta/Profile")
            )}
          >
            Consultar Nomeações
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => (
              console.log("location.pathname", location.pathname),
              (location.pathname = "/Conta/Profile/"),
              console.log("location.pathname", location.pathname),
              navigate("/Conta/Profile/Indisponibilidades")
            )}
          >
            Marcar Indisponibilidades
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => (
              console.log("location.pathname", location.pathname),
              (location.pathname = "/Conta/Profile/"),
              console.log("location.pathname", location.pathname),
              navigate("/Conta/Profile/Relacoes")
            )}
          >
            Indicar Restrições
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => (
              console.log("location.pathname", location.pathname),
              (location.pathname = "/Conta/Profile/"),
              console.log("location.pathname", location.pathname),
              navigate("/Conta/Profile/Definicoes")
            )}
          >
            Definições
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => {
              console.log("location.pathname", location.pathname),
                ((location.pathname = "/"), navigate("/")),
                console.log("location.pathname", location.pathname),
                Meteor.logout();
            }}
          >
            Sair
          </p>
        </a>
      </Drawer>
    </>
  );
};
