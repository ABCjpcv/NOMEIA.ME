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
}) => {
  let navigate = useNavigate();
  let location = useLocation();

  return (
    <>
      {user ? (
        <div className="div_header">
          <div
            id="divEsquerdo"
            style={{
              display: "flex",
              width: "20%",
              marginLeft: "1%",
            }}
          >
            <div hidden={menuPrivado}>
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
                🙍‍♂️
              </Button>
              <MenuPrivado />
            </div>
            <div hidden={menuPrivadoCA}>
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
                🙍‍♂️
              </Button>
              <MenuPrivadoCA />
            </div>
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

          <div
            id="divDireito"
            style={{
              display: "flex",
              width: "fit-content",
              marginRight: "1%",
            }}
          >
            <div
              hidden={menuPrivado}
              style={{ width: "inherit", marginTop: "4%" }}
            >
              <p
                id="usernameStatus"
                style={{
                  fontSize: "16px",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
                onClick={() => (
                  (location.pathname = "/Conta/ProfileCA/Definicoes"),
                  navigate("/Conta/ProfileCA/Definicoes")
                )}
              >
                {user.username}
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
                  Logout
                </Button>
              </p>
            </div>
            <div
              hidden={menuPrivadoCA}
              style={{ width: "inherit", marginTop: "4%" }}
            >
              <p
                id="usernameStatusCA"
                style={{
                  fontSize: "16px",
                  backgroundColor: "rgba(255,255,255,0.8)",
                }}
              >
                {user.username}
                <Button
                  onClick={() => (
                    (location.pathname = "/Conta/ProfileCA/Definicoes"),
                    navigate("/Conta/ProfileCA/Definicoes")
                  )}
                  style={{
                    fontSize: "16px",
                    verticalAlign: "middle",
                    width: "fit-content",
                    height: "100%",
                  }}
                >
                  ⚙️{" "}
                </Button>
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
                  Logout
                </Button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="div_header">
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
            <p
              id="titulo"
              style={{
                marginTop: "1%",
                fontSize: "smaller",
                marginRight: "10%",
              }}
              hidden={titulo}
            >
              Plataforma Online de Nomeações de Árbitros de Voleibol
            </p>
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
