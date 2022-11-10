import { Button, Input, InputNumber, message, Space } from "antd";
import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { Header } from "../Geral/Header";
import {
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { ImagemPerfil } from "./ImagemPerfil v1";

export function UserSettings({ user }) {
  user === null ? (user = Meteor.user()) : (user = user);
  let [isCA, setIsCA] = useState(null);

  let myPromise = new Promise((resolve, reject) => {
    Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
      if (result == 1 || result == 0) {
        resolve(result);
      } else {
        reject();
      }

      return result === 1;
    });
  });

  setTimeout(() => {
    myPromise.then(function (result) {
      const admin = result === 1;
      setIsCA(admin);
    });
  }, 200);

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

  let [passAtual, setPassAtual] = useState("");
  let [passNova, setPassNova] = useState("");
  let [passNovaConfirma, setPassNovaConfirma] = useState("");

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
      // console.log("result", result);
      if (result === 1) {
        message.success("Adicionado transporte próprio!");
        setTemTransporte(true);
        setNaoTemTransporte(false);
      }
    });
  }

  function removeTransporteProprioUserSettings(user) {
    Meteor.call("removeTransporte", user, (err, result) => {
      // console.log("result", result);
      if (result === 1) {
        message.warn("Removido transporte próprio!");
        setTemTransporte(false);
        setNaoTemTransporte(true);
      }
    });
  }

  function adicionaEmissaoReciboUserSettings(user) {
    Meteor.call("adicionaRecibo", user, (err, result) => {
      // console.log("result", result);
      if (result === 1) {
        message.success("Adicionada emissão de recibo!");
        setTemRecibo(true);
        setNaoTemRecibo(false);
      }
    });
  }

  function removeEmissaoReciboUserSettings(user) {
    Meteor.call("removeRecibo", user, (err, result) => {
      // console.log("result", result);
      if (result === 1) {
        message.warn("Removida emissão de recibo!");
        setTemRecibo(false);
        setNaoTemRecibo(true);
      }
    });
  }

  function getTransporteProprioUser(user) {
    Meteor.call("getTransporte", user, (err, result) => {
      // console.log("result", result);
      if (result) {
        setTemTransporte(result);
        setNaoTemTransporte(!result);
      }
    });
  }

  function getEmissaoReciboUser(user) {
    return Meteor.call("getRecibo", user, (err, result) => {
      // console.log("result", result);
      if (result) {
        setTemRecibo(result);
        setNaoTemRecibo(!result);
      }
    });
  }

  const handleChangePasswordAuth = (e) => {
    if (e.target.value.length === 0) {
      document.getElementById(
        "currentPasswordUserSettings"
      ).style.backgroundColor = "";
    } else if (!validatePassword(e.target.value)) {
      document.getElementById(
        "currentPasswordUserSettings"
      ).style.backgroundColor = "rgba(255, 153, 0, 0.3)";
      document
        .getElementById("currentPasswordUserSettings")
        .setAttribute("status", "warning");
    } else {
      document.getElementById(
        "currentPasswordUserSettings"
      ).style.backgroundColor = "";
      setPassAtual(e.target.value);
    }
  };

  const handleChangePasswordAuth2 = (e) => {
    if (e.target.value.length === 0) {
      document.getElementById("passwordUserSettings").style.backgroundColor =
        "";
    } else if (!validatePassword(e.target.value)) {
      document.getElementById("passwordUserSettings").style.backgroundColor =
        "rgba(255, 153, 0, 0.3)";
      document
        .getElementById("passwordUserSettings")
        .setAttribute("status", "warning");
    } else {
      document.getElementById("passwordUserSettings").style.backgroundColor =
        "";
      setPassNova(e.target.value);
    }
  };

  const handleChangePasswordAuth3 = (e) => {
    if (e.target.value.length === 0) {
      document.getElementById("password2UserSettings").style.backgroundColor =
        "";
    } else if (!validatePassword(e.target.value)) {
      document.getElementById("password2UserSettings").style.backgroundColor =
        "rgba(255, 153, 0, 0.3)";
      document
        .getElementById("password2UserSettings")
        .setAttribute("status", "warning");
    } else {
      document.getElementById("password2UserSettings").style.backgroundColor =
        "";
      setPassNovaConfirma(e.target.value);
    }
  };

  return (
    <div>
      <Header
        user={user}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={isCA}
        menuPrivadoCA={!isCA}
        atribuirArbitrosAdesl={true}
        atribuirArbitrosCev={true}
        atribuirArbitrosCR_CN={true}
        carregarJogos={true}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={false}
        historico={true}
        forgotPasswordHeader={true}
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
          <div
            className="input"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              flexDirection: "column",
            }}
          >
            {/* <ImagemPerfil></ImagemPerfil> */}
            {/* <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginLeft: "3%",
                width: "-webkit-fill-available",
                justifyContent: "flex-start",
                marginTop: "3%",
              }}
            > */}
            <label className="labels">Nome</label>

            <Input
              type={"text"}
              value={user.username}
              id="nomeUserSettings"
              style={{ borderRadius: "10px" }}
              disabled
            ></Input>
            {/* </div> */}
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
                style={{ width: "49%", borderRadius: "10px" }}
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
            <div style={{ display: "flex" }}>
              <label
                className="labels"
                style={{ width: "49%", justifyContent: "space-around" }}
              >
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
                    height: "30px",
                    width: "30px",
                    borderRadius: "10px",
                  }}
                  checked={temTransporte}
                ></Input>
                Tenho Transporte próprio
              </label>
              <label
                className="labels"
                style={{
                  width: "50%",
                  marginLeft: "2%",
                }}
              >
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
                    marginLeft: "2%",
                    height: "30px",
                    width: "30px",
                    borderRadius: "10px",
                    marginRight: "5%",
                  }}
                  checked={temRecibo}
                ></Input>
                Emito recibo verde
              </label>
            </div>
          </div>
          <p></p>
          <div
            className="input"
            style={{
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          >
            <label className="labels" style={{ alignSelf: "flex-start" }}>
              <b>
                {" "}
                <LockOutlined /> Mudar Password:{" "}
              </b>
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
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
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
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                status={undefined}
                onChange={handleChangePasswordAuth2}
                disabled={passAtual.length > 4 ? false : true}
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
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                status={undefined}
                onChange={handleChangePasswordAuth3}
                disabled={passNova.length > 4 ? false : true}
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
                let erro = false;
                Meteor.loginWithPassword(
                  Meteor.user().emails[0].address,
                  currentPasswordUserSettings,
                  function (err) {
                    if (err) {
                      erro = true;
                      message.error("Password atual errada");
                      return;
                    }
                  }
                );

                setTimeout(() => {
                  if (!erro) {
                    if (passwordUserSettings != password2UserSettings) {
                      message.error("As passwords novas não correspondem.");
                    } else {
                      Meteor.call(
                        "alteraPassword",
                        user,
                        password2UserSettings,
                        (err, result) => {
                          if (result === 1) {
                            message.success("Password alterada com sucesso! ");
                            Meteor.logout();
                          }
                        }
                      );
                    }
                  }
                }, 320);
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

function validatePassword(password) {
  return password.length > 4 ? true : false;
}
