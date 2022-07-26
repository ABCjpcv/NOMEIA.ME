import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Fragment } from "react/cjs/react.production.min";
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
  clubesAfiliadosAVL,
  consultaNomeacoesSemanais,
  forgotPasswordHeader,
  sobreHeader,
}) => {
  let navigate = useNavigate();
  let location = useLocation();

  return (
    <>
      {user ? (
        /**
         * CASO EXISTA UTILIZADOR
         */
        <div
          className="div_header"
          style={{
            display: "flex",
            marginLeft: "0.5%",
            marginTop: "0.5%",
            marginRight: "0.5%",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            id="divEsquerdo"
            style={{
              display: "flex",
              width: "30%",
              marginLeft: "0.5%",
              height: "100%",
              alignItems: "center",
            }}
          >
            <div hidden={menuPrivado}>
              <MenuPrivado />
              <Button
                onClick={() => (
                  (location.pathname = "/Conta/Profile/Definicoes"),
                  navigate("/Conta/Profile/Definicoes")
                )}
                style={{
                  fontSize: "14px",
                  verticalAlign: "text-bottom",
                }}
              >
                🙍‍♂️ {user.username}
              </Button>
            </div>
            <div hidden={menuPrivadoCA}>
              <MenuPrivadoCA />
              <Button
                onClick={() => (
                  (location.pathname = "/Conta/ProfileCA/Definicoes"),
                  navigate("/Conta/ProfileCA/Definicoes")
                )}
                style={{
                  fontSize: "14px",
                  verticalAlign: "text-bottom",
                }}
              >
                🙍‍♂️ {user.username}
              </Button>
            </div>
          </div>

          <div
            id="divCentral"
            style={{ display: "flex", justifyContent: "center", width: "40%" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <h1
                className="blue"
                id="titulo"
                style={{ fontWeight: "100", marginTop: "1%", fontSize: "22px" }}
                hidden={titulo}
              >
                <b>Plataforma Online de Nomeações de Árbitros de Voleibol</b>
              </h1>

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
                📅 Calendário
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
                🙍‍♂️ Perfil
              </p>
            </div>
          </div>
          <div
            id="divDireito"
            style={{
              display: "flex",
              width: "30%",
              height: "100%",
              marginRight: "0.5%",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <div
              hidden={menuPrivado}
              style={{
                width: "inherit",
                display: "flex",
                justifyItems: "flex-end",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => (
                  (location.pathname = "/"), navigate("/"), Meteor.logout()
                )}
                style={{
                  fontSize: "14px",
                  verticalAlign: "text-bottom",
                  /* width: fit-content; */
                  height: "100%",
                }}
              >
                Sair 🏃🚪
              </Button>
            </div>
            <div
              hidden={menuPrivadoCA}
              style={{
                width: "inherit",
                display: "flex",
                justifyItems: "flex-end",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Button
                onClick={() => (
                  (location.pathname = "/"), navigate("/"), Meteor.logout()
                )}
                style={{
                  fontSize: "16px",
                  verticalAlign: "middle",
                  width: "fit-content",
                  height: "100%",
                }}
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /**
         * CASO NAO EXISTA UTILIZADOR
         */
        <div className="div_header" style={{ display: "flex" }}>
          <div
            id="divEsquerdo"
            style={{
              display: "flex",
              width: "20%",
            }}
          >
            <img
              id="logo"
              src="logo.png"
              style={{ width: "20%", cursor: "pointer", marginLeft: "30%" }}
            />
          </div>

          <div
            id="divCentral"
            style={{ display: "flex", justifyContent: "center", width: "60%" }}
          >
            <h1
              className="blue"
              id="titulo"
              style={{ fontWeight: "100", marginTop: "1%", fontSize: "22px" }}
              hidden={titulo}
            >
              <b>Plataforma Online de Nomeações de Árbitros de Voleibol</b>
            </h1>

            <h1
              className="blue"
              id="clubesAfiliadosAVL"
              style={{ fontWeight: "100", marginTop: "1%", fontSize: "22px" }}
              hidden={clubesAfiliadosAVL}
            >
              <b>Clubes Afiliados à AVL</b>
            </h1>

            <h1
              className="blue"
              id="consultaNomeacoesSemanais"
              style={{ fontWeight: "100", marginTop: "1%", fontSize: "22px" }}
              hidden={consultaNomeacoesSemanais}
            >
              <b>Nomeações Semanais</b>
            </h1>

            <h1
              className="blue"
              id="forgotPasswordHeader"
              style={{ fontWeight: "100", marginTop: "1%", fontSize: "22px" }}
              hidden={forgotPasswordHeader}
            >
              <b>Redefinir Password</b>
            </h1>

            <h1
              className="blue"
              id="sobreHeader"
              style={{ fontWeight: "100", marginTop: "1%", fontSize: "22px" }}
              hidden={sobreHeader}
            >
              <b>Sobre</b>
            </h1>
          </div>

          <div
            id="divDireito"
            style={{
              display: "flex",
              width: "fit-content",
            }}
          >
            <LogoAVL></LogoAVL>
          </div>
        </div>
      )}
    </>
  );
};

import { Button, Drawer, Space } from "antd";

const MenuPrivado = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  let navigate = useNavigate();
  let location = useLocation();

  return (
    <>
      <Space>
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
        placement={"left"}
        closable={false}
        onClose={onClose}
        visible={visible}
        key={"left"}
      >
        <p>
          {" "}
          <b> Árbitro: </b>{" "}
        </p>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/Profile"), navigate("/Conta/Profile")
            )}
          >
            Consultar Nomeações
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/Profile/"),
              navigate("/Conta/Profile/Indisponibilidades")
            )}
          >
            Indicar Indisponibilidades
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/Profile/"),
              navigate("/Conta/Profile/Relacoes")
            )}
          >
            Indicar Restrições
          </p>
        </a>
      </Drawer>
    </>
  );
};

const MenuPrivadoCA = () => {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };

  const onClose = () => {
    setVisible(false);
  };

  let navigate = useNavigate();
  let location = useLocation();

  return (
    <>
      <Space>
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
        placement={"left"}
        closable={false}
        onClose={onClose}
        visible={visible}
        key={"left"}
      >
        <p>
          {" "}
          <b> Árbitro: </b>
        </p>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/ProfileCA"),
              navigate("/Conta/ProfileCA")
            )}
          >
            Consultar Nomeações
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/ProfileCA/Indisponibilidades"),
              navigate("/Conta/ProfileCA/Indisponibilidades")
            )}
          >
            Marcar Indisponibilidades
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/ProfileCA/Relacoes"),
              navigate("/Conta/ProfileCA/Relacoes")
            )}
          >
            Indicar Restrições
          </p>
        </a>
        <p>
          {" "}
          <b> Conselho de Arbitragem: </b>{" "}
        </p>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            id="clickOptionMenuAtribuirArbitros"
            onClick={() => (
              (location.pathname = "/Conta/ProfileCA/Atribuir_Arbitros"),
              navigate("/Conta/ProfileCA/Atribuir_Arbitros")
            )}
          >
            Atribuir Árbitros a Jogos
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/ProfileCA/Carregar_Novos_Jogos"),
              navigate("/Conta/ProfileCA/Carregar_Novos_Jogos")
            )}
          >
            Carregar Jogos Novos
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/ProfileCA/Criar_Arbitro"),
              navigate("/Conta/ProfileCA/Criar_Arbitro")
            )}
          >
            Criar Conta Nova
          </p>
        </a>

        {/* <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => (
              (location.pathname = "/Conta/ProfileCA/Definicoes"),
              navigate("/Conta/ProfileCA/Definicoes")
            )}
          >
            Definições
          </p>
        </a> */}
        {/* <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => (
              (location.pathname = "/"), navigate("/"), Meteor.logout()
            )}
          >
            Terminar Sessão
          </p>
        </a> */}
      </Drawer>
    </>
  );
};
