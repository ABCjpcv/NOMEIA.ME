import React, { useState } from "react";
import { Meteor } from "meteor/meteor";
import { Fragment } from "react/cjs/react.production.min";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  UserOutlined,
  LoginOutlined,
  CalendarOutlined,
  ScheduleOutlined,
  TagsOutlined,
  SolutionOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UploadOutlined,
  SelectOutlined,
    HomeOutlined,
    EuroOutlined
} from "@ant-design/icons";

import { Button, Drawer, Space } from "antd";

export const Header = ({
  user,
  titulo,
  consultaPrivada,
  menuPrivado,
  menuPrivadoCA,
  atribuirArbitrosAdesl,
  atribuirArbitrosCev,
  atribuirArbitrosCR_CN,
  carregarJogos,
  criarContaNova,
  removerConta,
  indisponibilidadePrivadas,
  restricoesPrivadas,
  definicoes,
  historico,
  clubesAfiliadosAVL,
  consultaNomeacoesSemanais,
  forgotPasswordHeader,
    sobreHeader,
  gestaoPagamentos
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
                    height: "100%",
                    justifyContent: "flex-start",
                    marginLeft: "3%",
                    alignItems: "center",
                  }}
                >
                  <MenuPrivado />
                  <Button
                    onClick={() => (
                      (location.pathname = "/Conta/Profile/Definicoes"),
                      navigate("/Conta/Profile/Definicoes")
                    )}
                    style={{
                      display: "flex",
                      fontSize: "14px",
                      alignItems: "center",
                    }}
                  >
                    <UserOutlined /> {Meteor.user().username}
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
                    height: "100%",
                    justifyContent: "flex-start",
                    marginLeft: "3%",
                    alignItems: "center",
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
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <UserOutlined /> {Meteor.user().username}
                  </Button>
                </div>
              </div>
            </div>

            <div
              id="divCentral"
              style={{
                display: "flex",
                alignItems: "stretch",
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
                <img
                  id="logo"
                  src="logo.png"
                  style={{ height: "100%", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                />
                <b>Plataforma Online de Nomeações de Árbitros de Voleibol</b>
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
                <img
                  id="logo"
                  src="logo.png"
                  style={{ height: "100%", cursor: "pointer" }}
                />
                <b>Plataforma Online de Nomeações de Árbitros de Voleibol</b>
              </h1>

              {/* AQUI ESTAO OS HEADERS DOS CONSELHO DE ARBITRAGEM */}
              <p
                id="atribuirArbitrosAdesl"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={atribuirArbitrosAdesl}
              >
                Atribuição de Árbitros (ADESL)
              </p>

              <p
                id="atribuirArbitrosCev"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={atribuirArbitrosCev}
              >
                Atribuição de Árbitros (CEV)
              </p>

              <p
                id="atribuirArbitrosCR_CN"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={atribuirArbitrosCR_CN}
              >
                Atribuição de Árbitros (CR / CN)
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
                Carregar Jogos Novos
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
                Criar Conta Nova
              </p>

              <p
                id="removerConta"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={removerConta}
              >
                Atualizar Árbitro:
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
                Nomeações
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
                Calendário
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
                Incompatibilidades
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
                {/* 🙍‍♂️ Perfil  */}
                {Meteor.user().username}
                          </p>

                          <p
                              id="gestaoPagamentos"
                              style={{
                                  width: "100%",
                                  marginTop: "1%",
                                  fontSize: "smaller",
                              }}
                              hidden={gestaoPagamentos}
                          >
                              Gestão de Pagamentos
                          </p>

              <p
                id="historico"
                style={{
                  width: "100%",
                  marginTop: "1%",
                  fontSize: "smaller",
                }}
                hidden={historico}
              >
                <SolutionOutlined /> Histórico de Jogos
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
                    height: "100%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => (
                      (location.pathname = "/"), navigate("/"), Meteor.logout()
                    )}
                    style={{
                      fontSize: "14px",

                      height: "50%",
                      marginRight: "3%",
                    }}
                  >
                    Sair <LoginOutlined />
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
                    height: "100%",
                    justifyContent: "flex-end",
                    alignItems: "center",
                  }}
                >
                  <Button
                    onClick={() => (
                      (location.pathname = "/"), navigate("/"), Meteor.logout()
                    )}
                    style={{
                      fontSize: "14px",

                      height: "50%",
                      marginRight: "3%",
                    }}
                  >
                    Sair <LoginOutlined />
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
              justifyContent: "space-around",
            }}
          >
            <div
              id="divEsquerdo"
              style={{
                display: "flex",
                width: "6%",
                height: "100%",
              }}
            >
              <div className="containerLogo">
                <div
                  style={{
                    height: "100%",
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "20%",
                    marginTop: "2%",
                    alignItems: "center",
                  }}
                  onClick={() => navigate("/")}
                >
                  <HomeOutlined onClick={() => navigate("/")} />
                  <Button
                    size="small"
                    type="link"
                    style={{ fontSize: "10px", color: "#4933ac" }}
                    onClick={() => navigate("/")}
                  >
                    Página Inicial
                  </Button>
                </div>

                {/* <div className="overlayLogo">
                  <div className="homePageText">
                    <h1 className="homePageText">
                      Página <br></br>inicial
                    </h1>
                  </div>
                </div> */}
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
                <img
                  id="logo"
                  src="logo.png"
                  style={{ height: "100%", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                />
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
                hidden={clubesAfiliadosAVL || !titulo}
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
                hidden={consultaNomeacoesSemanais || !titulo}
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
                hidden={forgotPasswordHeader || !titulo}
              >
                <img
                  id="logo"
                  src="logo.png"
                  style={{ height: "100%", cursor: "pointer" }}
                  onClick={() => navigate("/")}
                />
                <b>Plataforma Online de Nomeações de Árbitros de Voleibol</b>
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
                hidden={sobreHeader || !titulo}
              >
                <b>Sobre o Nomeia.Me</b>
              </h1>
            </div>
            <div
              id="divDireito"
              style={{
                display: "flex",
                height: "100%",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", height: "70%" }}>
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
                    style={{ heigth: "80%", cursor: "pointer" }}
                  />
                </a>
              </div>
            </div>
          </div>
          <h6></h6>
        </>
      )}
    </>
  );
};

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
          ☰ Menu
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
            <ScheduleOutlined /> Consultar nomeações
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "/Conta/Profile/Calendario")
                (location.pathname = "/Conta/Profile/Calendario"),
                  navigate("/Conta/Profile/Calendario");
            }}
          >
            <CalendarOutlined /> Calendário
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
            <TagsOutlined /> Indicar incompatibilidades
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/Profile/Jogos_Passados") {
                (location.pathname = "/Conta/Profile/Jogos_Passados"),
                  navigate("/Conta/Profile/Jogos_Passados");
              }
            }}
          >
            <SolutionOutlined /> Histórico de jogos
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/Profile/Definicoes") {
                (location.pathname = "/Conta/Profile/Definicoes"),
                  navigate("/Conta/Profile/Definicoes");
              }
            }}
          >
            <UserOutlined /> Perfil
          </p>
              </a>

              <a className="menu-item">
                  <p
                      style={{ fontSize: "15px", marginLeft: "5%" }}
                      onClick={() => {
                          if (location.pathname != "Conta/Profile/Gestao_Pagamentos") {
                              (location.pathname = "/Conta/Profile/Gestao_Pagamentos"),
                                  navigate("/Conta/Profile/Gestao_Pagamentos");
                          }
                      }}
                  >
                      <EuroOutlined /> Gestão de Pagamentos
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
            display: "flex",
            width: "100%",
          }}
          onClick={showDrawer}
        >
          ☰ Menu
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
            onClick={() => {
              if (location.pathname != "Conta/ProfileCA") {
                (location.pathname = "/Conta/ProfileCA"),
                  navigate("/Conta/ProfileCA");
              }
            }}
          >
            <ScheduleOutlined /> Consultar nomeações
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/ProfileCA/Calendario") {
                (location.pathname = "/Conta/ProfileCA/Calendario"),
                  navigate("/Conta/ProfileCA/Calendario");
              }
            }}
          >
            <CalendarOutlined /> Calendário
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/ProfileCA/Relacoes") {
                (location.pathname = "/Conta/ProfileCA/Relacoes"),
                  navigate("/Conta/ProfileCA/Relacoes");
              }
            }}
          >
            <TagsOutlined /> Indicar incompatibilidades
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/ProfileCA/Jogos_Passados") {
                (location.pathname = "/Conta/ProfileCA/Jogos_Passados"),
                  navigate("/Conta/ProfileCA/Jogos_Passados");
              }
            }}
          >
            <SolutionOutlined /> Histórico de jogos
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/ProfileCA/Definicoes") {
                (location.pathname = "/Conta/ProfileCA/Definicoes"),
                  navigate("/Conta/ProfileCA/Definicoes");
              }
            }}
          >
            <UserOutlined /> Perfil
          </p>
              </a>

              <a className="menu-item">
                  <p
                      style={{ fontSize: "15px", marginLeft: "5%" }}
                      onClick={() => {
                          if (location.pathname != "Conta/ProfileCA/Gestao_Pagamentos") {
                              (location.pathname = "/Conta/ProfileCA/Gestao_Pagamentos"),
                                  navigate("/Conta/ProfileCA/Gestao_Pagamentos");
                          }
                      }}
                  >
                      <EuroOutlined /> Gestão de Pagamentos
                  </p>
              </a>

        <p>
          {" "}
          <b> Conselho de Arbitragem: </b>{" "}
        </p>

        <p
          style={{ fontSize: "15px", marginLeft: "5%", marginBottom: "-0.5em" }}
          id="clickOptionMenuAtribuirArbitros"
        >
          <SelectOutlined /> Nomear árbitros
          <span>
            <ul>
              <li>
                <a
                  className="menu-item"
                  onClick={() => {
                    if (
                      location.pathname !=
                      "Conta/ProfileCA/Atribuir_Arbitros/ADESL"
                    ) {
                      (location.pathname =
                        "/Conta/ProfileCA/Atribuir_Arbitros/ADESL"),
                        navigate("/Conta/ProfileCA/Atribuir_Arbitros/ADESL");
                    }
                  }}
                >
                  ADESL - CUL
                </a>
              </li>
              {/* <li>
              {" "}
              <a
                className="menu-item"
                onClick={() => {
                  if (
                    location.pathname != "Conta/ProfileCA/Atribuir_Arbitros/CEV"
                  ) {
                    (location.pathname =
                      "/Conta/ProfileCA/Atribuir_Arbitros/CEV"),
                      navigate("/Conta/ProfileCA/Atribuir_Arbitros/CEV");
                  }
                }}
              >
                CEV{" "}
              </a>
            </li> */}
              <li>
                {" "}
                <a
                  className="menu-item"
                  onClick={() => {
                    if (
                      location.pathname !=
                      "Conta/ProfileCA/Atribuir_Arbitros/CR_CN"
                    ) {
                      (location.pathname =
                        "/Conta/ProfileCA/Atribuir_Arbitros/CR_CN"),
                        navigate("/Conta/ProfileCA/Atribuir_Arbitros/CR_CN");
                    }
                  }}
                >
                  CR / CN
                </a>
              </li>
            </ul>
          </span>
        </p>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if (location.pathname != "Conta/ProfileCA/Carregar_Novos_Jogos") {
                (location.pathname = "/Conta/ProfileCA/Carregar_Novos_Jogos"),
                  navigate("/Conta/ProfileCA/Carregar_Novos_Jogos");
              }
            }}
          >
            <UploadOutlined /> Carregar jogos novos
          </p>
        </a>
        <p>
          {" "}
          <b> Gerir Árbitros: </b>{" "}
        </p>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if ((location.pathname = "/Conta/ProfileCA/Criar_Arbitro")) {
                (location.pathname = "/Conta/ProfileCA/Criar_Arbitro"),
                  navigate("/Conta/ProfileCA/Criar_Arbitro");
              }
            }}
          >
            <UserAddOutlined /> Criar conta árbitro
          </p>
        </a>
        <a className="menu-item">
          <p
            style={{ fontSize: "15px", marginLeft: "5%" }}
            onClick={() => {
              if ((location.pathname = "/Conta/ProfileCA/Criar_Arbitro")) {
                (location.pathname = "/Conta/ProfileCA/Remover_Arbitro"),
                  navigate("/Conta/ProfileCA/Remover_Arbitro");
              }
            }}
          >
            <UserDeleteOutlined /> Editar conta árbitro
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
