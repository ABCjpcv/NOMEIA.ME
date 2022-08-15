import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Fragment } from "react/cjs/react.production.min";
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
      {user != null ? (
        /**
         * CASO EXISTA UTILIZADOR
         */
        <>
          <div
            className="div_header"
            style={{
              display: "flex",
              marginLeft: "0.5%",
              marginRight: "0.5%",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <div
              id="divEsquerdo"
              style={{
                display: "flex",
                width: "20%",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                hidden={menuPrivado}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "50%",
                    justifyContent: "flex-start",
                    marginTop: "3.75%",
                    marginLeft: "3%",
                  }}
                >
                  <MenuPrivado />
                  <Button
                    onClick={() => (
                      (location.pathname = "/Conta/Profile/Definicoes"),
                      navigate("/Conta/Profile/Definicoes")
                    )}
                    style={{
                      fontSize: "14px",
                    }}
                  >
                    🙍‍♂️ {user.username}
                  </Button>
                </div>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                hidden={menuPrivadoCA}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "50%",
                    justifyContent: "flex-start",
                    marginTop: "3.75%",
                    marginLeft: "3%",
                  }}
                >
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
            </div>

            <div
              id="divCentral"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "60%",
                height: "100%",
              }}
            >
              <h1
                className="blue"
                id="titulo"
                style={{
                  width: "100%",
                  fontWeight: "100",
                  marginTop: "1%",
                  fontSize: "22px",
                }}
                hidden={titulo}
              >
                <b>Plataforma Online de Nomeações de Árbitros de Voleibol</b>
              </h1>

              {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
              <p
                id="atribuirArbitros"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={atribuirArbitros}
              >
                Atribuição de Árbitros
              </p>

              <p
                id="carregarJogos"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={carregarJogos}
              >
                Carregar Jogos Novos:
              </p>

              <p
                id="criarContaNova"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={criarContaNova}
              >
                Criar Conta Nova:
              </p>

              {/* AQUI ESTAO OS HEADERS DOS ARBITROS */}
              <p
                id="nomeacoesPrivadas"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={consultaPrivada}
              >
                As minhas nomeações:
              </p>
              <p
                id="indisponibilidadePrivadas"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={indisponibilidadePrivadas}
              >
                📅 Calendário
              </p>
              <p
                id="restricoesPrivadas"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={restricoesPrivadas}
              >
                Relações com clubes:
              </p>

              <p
                id="definicoes"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={definicoes}
              >
                🙍‍♂️ Perfil
              </p>
            </div>
            <div
              id="divDireito"
              style={{
                display: "flex",
                width: "20%",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                }}
                hidden={menuPrivado}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "50%",
                    justifyContent: "flex-end",
                    marginTop: "3.75%",
                  }}
                >
                  <Button
                    onClick={() => (
                      (location.pathname = "/"), navigate("/"), Meteor.logout()
                    )}
                    style={{
                      fontSize: "14px",

                      height: "100%",
                      marginRight: "3%",
                    }}
                  >
                    Sair 🏃🚪
                  </Button>
                </div>
              </div>
              <div
                hidden={menuPrivadoCA}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    height: "50%",
                    justifyContent: "flex-end",
                    marginTop: "3.75%",
                  }}
                >
                  <Button
                    onClick={() => (
                      (location.pathname = "/"), navigate("/"), Meteor.logout()
                    )}
                    style={{
                      fontSize: "14px",

                      height: "100%",
                      marginRight: "3%",
                    }}
                  >
                    Sair 🏃🚪
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /**
         * CASO NAO EXISTA UTILIZADOR
         */
        <>
          <div
            className="div_header"
            style={{
              display: "flex",
              marginLeft: "0.5%",
              marginRight: "0.5%",
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <div
              id="divEsquerdo"
              style={{
                display: "flex",
                width: "20%",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "space-evenly",
                }}
              >
                <img
                  id="logo"
                  src="logo.png"
                  style={{ height: "100%", cursor: "pointer" }}
                />
              </div>
            </div>

            <div
              id="divCentral"
              style={{
                display: "flex",
                justifyContent: "center",
                width: "60%",
                height: "100%",
              }}
            >
              <h1
                className="blue"
                id="titulo"
                style={{
                  width: "100%",
                  fontWeight: "100",
                  marginTop: "1%",
                  fontSize: "22px",
                }}
                hidden={titulo}
              >
                <b>Plataforma Online de Nomeações de Árbitros de Voleibol</b>
              </h1>

              <h1
                className="blue"
                id="clubesAfiliadosAVL"
                style={{
                  width: "100%",
                  fontWeight: "100",
                  marginTop: "1%",
                  fontSize: "22px",
                }}
                hidden={clubesAfiliadosAVL}
              >
                <b>Clubes Afiliados à AVL</b>
              </h1>

              <h1
                className="blue"
                id="consultaNomeacoesSemanais"
                style={{
                  width: "100%",
                  fontWeight: "100",
                  marginTop: "1%",
                  fontSize: "22px",
                }}
                hidden={consultaNomeacoesSemanais}
              >
                <b>Nomeações Semanais</b>
              </h1>

              <h1
                className="blue"
                id="forgotPasswordHeader"
                style={{
                  width: "100%",
                  fontWeight: "100",
                  marginTop: "1%",
                  fontSize: "22px",
                }}
                hidden={forgotPasswordHeader}
              >
                <b>Redefinir Password</b>
              </h1>

              <h1
                className="blue"
                id="sobreHeader"
                style={{
                  width: "100%",
                  fontWeight: "100",
                  marginTop: "1%",
                  fontSize: "22px",
                }}
                hidden={sobreHeader}
              >
                <b>Sobre o Nomeia.Me</b>
              </h1>
            </div>
            <div
              id="divDireito"
              style={{
                display: "flex",
                width: "20%",
                height: "100%",
                alignContent: "space-evenly",
              }}
            >
              <a
                href="https://www.avlisboa.pt/"
                style={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <img
                  id="avlLogo"
                  src="avllogo.png"
                  style={{ heigth: "100%", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                />
              </a>
            </div>
          </div>
          <br></br>
        </>
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
            display: "flex",
            width: "100%",
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
            onClick={() => {
              if (location.pathname != "/Conta/Profile") {
                (location.pathname = "/Conta/Profile"),
                  navigate("/Conta/Profile");
              }
            }}
          >
            Consultar Nomeações
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "/Conta/Profile/Indisponibilidades")
                (location.pathname = "/Conta/Profile/Indisponibilidades"),
                  navigate("/Conta/Profile/Indisponibilidades");
            }}
          >
            Indicar Indisponibilidades
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/Profile/Relacoes") {
                (location.pathname = "/Conta/Profile/Relacoes"),
                  navigate("/Conta/Profile/Relacoes");
              }
            }}
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
