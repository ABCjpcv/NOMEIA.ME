import { Button, message } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { Header } from "../Geral/Header";

export function UserSettings({ user }) {
  user === null ? (user = Meteor.user()) : (user = user);
  let isCA = Meteor.call("isAdmin", user, true, (err, result) => {
    if (result) return result;
  });

  /**
   * ATRIBUICAO DOS ESTADOS
   */
  let [temRecibo, setTemRecibo] = useState(() => getEmissaoReciboUser(user));
  let [temTransporte, setTemTransporte] = useState(() =>
    getTransporteProprioUser(user)
  );
  let [naoTemRecibo, setNaoTemRecibo] = useState(() =>
    getEmissaoReciboUser(user)
  );
  let [naoTemTransporte, setNaoTemTransporte] = useState(() =>
    getTransporteProprioUser(user)
  );

  let [nivel, setNivel] = useState(() => getNivel(user));

  function submeterAlteracaoPassword(user, newPassword) {}

  function getNivel(user) {
    Meteor.call("getNivel", user, (err, result) => {
      setNivel(result);
    });
  }

  function adicionaTransporteProprioUserSettings(user) {
    Meteor.call("adicionaTransporte", user, (err, result) => {
      console.log("result", result);
      if (result === 1) {
        message.success("Adicionado transporte próprio!");
        setTemTransporte(true);
        setNaoTemTransporte(false);
      }
    });
  }

  function removeTransporteProprioUserSettings(user) {
    Meteor.call("removeTransporte", user, (err, result) => {
      console.log("result", result);
      if (result === 1) {
        message.warn("Removido transporte próprio!");
        setTemTransporte(false);
        setNaoTemTransporte(true);
      }
    });
  }

  function adicionaEmissaoReciboUserSettings(user) {
    Meteor.call("adicionaRecibo", user, (err, result) => {
      console.log("result", result);
      if (result === 1) {
        message.success("Adicionada emissão de recibo!");
        setTemRecibo(true);
        setNaoTemRecibo(false);
      }
    });
  }

  function removeEmissaoReciboUserSettings(user) {
    Meteor.call("removeRecibo", user, (err, result) => {
      console.log("result", result);
      if (result === 1) {
        message.warn("Removida emissão de recibo!");
        setTemRecibo(false);
        setNaoTemRecibo(true);
      }
    });
  }

  function getTransporteProprioUser(user) {
    Meteor.call("getTransporte", user, (err, result) => {
      console.log("result", result);
      if (result) {
        setTemTransporte(result);
        setNaoTemTransporte(!result);
      }
    });
  }

  function getEmissaoReciboUser(user) {
    return Meteor.call("getRecibo", user, (err, result) => {
      console.log("result", result);
      if (result) {
        setTemRecibo(result);
        setNaoTemRecibo(!result);
      }
    });
  }

  return (
    <div>
      <Header
        user={user}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={isCA}
        menuPrivadoCA={!isCA}
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={false}
      />
      <h1 className="blue"> </h1>
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="input">
          <label className="labels">Nome</label>
          <input
            className="inputt"
            type={"text"}
            id="nomeUserSettings"
            value={user.username}
            disabled
          ></input>
        </div>
        <p></p>
        <div className="input">
          <label className="labels">Email</label>
          <input
            className="inputt"
            type={"email"}
            id="emailUserSettings"
            value={user.emails[0].address}
            disabled
          ></input>
        </div>
        <p></p>
        <div className="input">
          <label className="labels">Nivel</label>
          <input
            className="inputt"
            type={"text"}
            id="nivelUserSettings"
            value={nivel}
            disabled
          ></input>
        </div>
        <p></p>

        <p></p>

        <div className="input">
          <label
            className="labels"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Tenho Transporte próprio:
            <input
              className="inputt"
              type={"checkbox"}
              onChange={() => {
                if (temTransporte) {
                  removeTransporteProprioUserSettings(user);
                }
                if (!temTransporte) {
                  adicionaTransporteProprioUserSettings(user);
                }
              }}
              style={{ height: "30px", width: "30px" }}
              checked={temTransporte}
            ></input>
          </label>
        </div>

        {/* <p></p>
        <div className="input">
          <label className="labels">
            Não tenho Transporte próprio:
            <input
              className="inputt"
              type={"checkbox"}
              onChange={() => {
                if (!naoTemTransporte) {
                  removeTransporteProprioUserSettings(user);
                }
                if (naoTemTransporte) {
                  adicionaTransporteProprioUserSettings(user);
                }
              }}
              style={{ marginLeft: "105px", height: "30px", width: "30px" }}
              checked={naoTemTransporte}
            ></input>
          </label>
        </div> */}

        <p></p>
        <div className="input">
          <label
            className="labels"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            Emito recibo verde:
            <input
              className="inputt"
              type={"checkbox"}
              onChange={() => {
                if (temRecibo) {
                  removeEmissaoReciboUserSettings(user);
                }
                if (!temRecibo) {
                  adicionaEmissaoReciboUserSettings(user);
                }
              }}
              style={{ height: "30px", width: "30px" }}
              checked={temRecibo}
            ></input>
          </label>
        </div>
        {/* <p></p>
        <div className="input">
          <label className="labels">
            Não emito recibo verde:
            <input
              className="inputt"
              type={"checkbox"}
              onChange={() => {
                if (!naoTemRecibo) {
                  removeEmissaoReciboUserSettings(user);
                }
                if (naoTemRecibo) {
                  adicionaEmissaoReciboUserSettings(user);
                }
              }}
              style={{ marginLeft: "159px", height: "30px", width: "30px" }}
              checked={naoTemRecibo}
            ></input>
          </label>
        </div> */}
        <p></p>
        <div
          className="input"
          style={{
            backgroundColor: "rgba(255,255,255,0.5)",
          }}
        >
          <label className="labels" style={{ alignSelf: "center" }}>
            🔑 Mudar Password
          </label>
        </div>

        <div className="input">
          <label className="labels">Password atual: </label>
          <input
            className="inputt"
            type={"password"}
            placeholder="*****"
            id="currentPasswordUserSettings"
          ></input>
        </div>

        <div className="input">
          <label className="labels">Nova password:</label>
          <input
            className="inputt"
            type={"password"}
            placeholder="*****"
            id="passwordUserSettings"
          ></input>
        </div>

        <div className="input">
          <label className="labels">Confirmar a nova password</label>
          <input
            className="inputt"
            type={"password"}
            placeholder="*****"
            id="password2UserSettings"
          ></input>
        </div>

        <div className="input" style={{ marginTop: "1%" }}>
          <label
            className="labels"
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              size="small"
              shape="round"
              type="primary"
              onClick={() => {
                let currentPasswordUserSettings = document.getElementById(
                  "currentPasswordUserSettings"
                ).value;
                let passwordUserSettings = document.getElementById(
                  "passwordUserSettings"
                ).value;
                let password2UserSettings = document.getElementById(
                  "password2UserSettings"
                ).value;

                if (
                  currentPasswordUserSettings === "" &&
                  passwordUserSettings === "" &&
                  password2UserSettings === ""
                ) {
                  message.warn("Por favor coloque valores nos campos");
                } else if (currentPasswordUserSettings === "") {
                  message.error("É necessário a sua password atual.");
                } else if (passwordUserSettings === "") {
                  message.error("Não colocou password nova.");
                } else if (password2UserSettings === "") {
                  message.error(
                    "Não colocou a confirmação da password nova.  "
                  );
                } else {
                  Meteor.loginWithPassword(
                    user,
                    currentPasswordUserSettings,
                    (err, result) => {
                      console.log("result", result);
                      if (result === undefined) {
                        //Fazer aparecer mensagem de texto de credenciais erradas.
                        message.error("Password atual errada");
                      } else {
                        if (passwordUserSettings != password2UserSettings) {
                          message.error("As passwords novas não correspondem.");
                        } else {
                          Meteor.call(
                            "alteraPassword",
                            user.emails[0].address,
                            password2UserSettings,
                            (err, result) => {
                              if (result === 1) {
                                message.success(
                                  "Password alterada com sucesso! Faça a autenticação novamente."
                                );
                                Meteor.logout();
                              } else {
                                message.error("ERRO");
                              }
                            }
                          );
                        }
                      }
                    }
                  );
                }
              }}
            >
              Alterar Password
            </Button>
          </label>
        </div>
      </div>
    </div>
  );
}
