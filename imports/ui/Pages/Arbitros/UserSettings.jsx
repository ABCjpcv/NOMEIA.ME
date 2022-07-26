import { Button, Input, InputNumber, message, Space } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { Header } from "../Geral/Header";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

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

  let [licenca, setLicenca] = useState(() => getLicenca(user));

  function submeterAlteracaoPassword(user, newPassword) {}

  function getNivel(user) {
    Meteor.call("getNivel", user, (err, result) => {
      setNivel(result);
    });
  }

  function getLicenca(user) {
    Meteor.call("getLicenca", user, (err, result) => {
      setLicenca(result);
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
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "space-evenly",
            width: "30%",
            marginTop: "1%",
          }}
        >
          <div className="input" style={{ justifyContent: "flex-start" }}>
            <label className="labels">Nome</label>

            <Input
              type={"text"}
              value={user.username}
              id="nomeUserSettings"
              style={{ borderRadius: "10px" }}
              disabled
            ></Input>
          </div>
          <p></p>
          <div className="input" style={{ justifyContent: "flex-start" }}>
            <label className="labels">Email</label>
            <Input
              type={"email"}
              id="emailUserSettings"
              style={{ borderRadius: "10px" }}
              value={user.emails[0].address}
              disabled
            ></Input>
          </div>
          <p></p>

          <div className="input">
            <div style={{ display: "flex" }}>
              <label className="labels">Nivel</label>
              <label className="labels" style={{ marginLeft: "44%" }}>
                Licença
              </label>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <InputNumber
                type="number"
                id="nivelUserSettings"
                value={nivel}
                disabled
                style={{ width: "49%" }}
              ></InputNumber>
              <InputNumber
                type="number"
                id="licencaArbitroUserSettings"
                value={licenca}
                disabled
                style={{
                  width: "50%",
                  marginLeft: "1%",
                  borderRadius: "10px",
                }}
              ></InputNumber>
            </div>
          </div>

          <p></p>

          <div className="input" style={{ display: "flex" }}>
            <label className="labels">
              Tenho Transporte próprio:
              <Input
                type={"checkbox"}
                onChange={() => {
                  if (temTransporte) {
                    removeTransporteProprioUserSettings(user);
                  }
                  if (!temTransporte) {
                    adicionaTransporteProprioUserSettings(user);
                  }
                }}
                style={{
                  display: "flex",
                  marginLeft: "20%",
                  height: "30px",
                  width: "30px",
                  borderRadius: "10px",
                }}
                checked={temTransporte}
              ></Input>
            </label>
          </div>
          <p></p>
          <div className="input" style={{ display: "flex" }}>
            <label className="labels">
              Emito recibo verde:
              <Input
                type={"checkbox"}
                onChange={() => {
                  if (temRecibo) {
                    removeEmissaoReciboUserSettings(user);
                  }
                  if (!temRecibo) {
                    adicionaEmissaoReciboUserSettings(user);
                  }
                }}
                style={{
                  display: "flex",
                  marginLeft: "20%",
                  height: "30px",
                  width: "30px",
                  borderRadius: "10px",
                }}
                checked={temRecibo}
              ></Input>
            </label>
          </div>
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
            <Space
              direction="vertical"
              style={{ width: "100%", shapeMargin: "round" }}
            >
              <Input.Password
                id="currentPasswordUserSettings"
                style={{ width: "100%", borderRadius: "10px" }}
                placeholder="*****"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                status={undefined}
                onChange={handleChangePasswordAuth}
              />
            </Space>
          </div>

          <div className="input">
            <label className="labels">Nova password:</label>

            <Space
              direction="vertical"
              style={{ width: "100%", shapeMargin: "round" }}
            >
              <Input.Password
                id="passwordUserSettings"
                style={{ width: "100%", borderRadius: "10px" }}
                placeholder="*****"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                status={undefined}
                onChange={handleChangePassword2Auth}
              />
            </Space>
          </div>

          <div className="input">
            <label className="labels">Confirmar a nova password</label>
            <Space
              direction="vertical"
              style={{ width: "100%", shapeMargin: "round" }}
            >
              <Input.Password
                id="password2UserSettings"
                style={{ width: "100%", borderRadius: "10px" }}
                placeholder="*****"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
                status={undefined}
                onChange={handleChangePassword2Auth}
              />
            </Space>
          </div>

          <p></p>
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
                message.error("Não colocou a confirmação da password nova.  ");
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
        </div>
      </div>
    </div>
  );
}
