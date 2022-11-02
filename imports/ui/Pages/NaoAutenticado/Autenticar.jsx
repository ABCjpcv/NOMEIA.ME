import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Input, Button, message, Space } from "antd";
import { Header } from "../Geral/Header";

const handleChangeEmailAuth = (e) => {
  if (e.target.value.length === 0) {
    document.getElementById("eemail").style.backgroundColor = "";
  } else if (!validateEmail(e.target.value)) {
    document.getElementById("eemail").style.backgroundColor =
      "rgba(255, 153, 0, 0.3)";
    document.getElementById("eemail").setAttribute("status", "warning");
  } else {
    document.getElementById("eemail").style.backgroundColor = "";
  }
};

const handleChangePasswordAuth = (e) => {
  if (e.target.value.length === 0) {
    document.getElementById("ppass").style.backgroundColor = "";
  } else if (!validatePassword(e.target.value)) {
    document.getElementById("ppass").style.backgroundColor =
      "rgba(255, 153, 0, 0.3)";
    document.getElementById("ppass").setAttribute("status", "warning");
  } else {
    document.getElementById("ppass").style.backgroundColor = "";
  }
};

function validatePassword(password) {
  return password.length > 4 ? true : false;
}

export function Autenticar({ user }) {
  // console.log("user", user);
  // let u = Meteor.user();
  // console.log("u", u);
  // // if (u != null) {
  // //   Meteor.logout();
  // // }

  let navigate = useNavigate();

  function login(user, pass) {
    // console.log("Não há user");
    if (user != "Invalid credentials / user does not exist.") {
      let utilizador = JSON.parse(JSON.stringify(user));

      Meteor.loginWithPassword(utilizador.username, pass, (err, result) => {
        if (err) {
          //message.error("Credenciais erradas ou utilizador inexistente.");
        }
        Meteor.call("isAdmin", utilizador, Meteor.user(), (err, result) => {
          if (result === -1) {
            message.error("Password incorreta");
          } else if (result === 1) {
            //console.log("vou mostrar Perfil do CA");
            message.success("Bem vindo " + utilizador.username + "!");

            navigate("/Conta/ProfileCA");
          } else if (result === 0) {
            //console.log("vou mostrar Perfil do Arbitro");
            message.success("Bem vindo " + utilizador.username + "!");

            navigate("/Conta/Profile");
          }
        });
      });
    }
  }

  function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    }
    return false;
  }

  return (
    <>
      <Header
        user={user}
        titulo={false}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={true}
        atribuirArbitrosAdesl={false}
        atribuirArbitrosCev={false}
        atribuirArbitrosCR_CN={false}
        carregarJogos={true}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
        clubesAfiliadosAVL={true}
        consultaNomeacoesSemanais={true}
        forgotPasswordHeader={true}
        sobreHeader={true}
      />
      <div>
        {/* {user != null ? Meteor.logout() : null} */}

        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1
            className="blue"
            style={{ fontWeight: "100", marginBottom: "0%" }}
          >
            {" "}
            Autenticar:{" "}
          </h1>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "space-evenly",
              width: "30%",
            }}
          >
            <div className="input" style={{ justifyContent: "flex-start" }}>
              <label className="labels">Email</label>
            </div>
            <div className="input">
              <Input
                type={"email"}
                placeholder="exemplo@email.com"
                id="eemail"
                style={{ borderRadius: "10px" }}
                status={undefined}
                onChange={handleChangeEmailAuth}
              ></Input>
            </div>
            <p></p>

            <div className="input" style={{ justifyContent: "flex-start" }}>
              <label className="labels">Password</label>
            </div>
            <div className="input" style={{ justifyContent: "flex-start" }}>
              <Space
                direction="vertical"
                style={{ width: "100%", shapeMargin: "round" }}
              >
                <Input.Password
                  id="ppass"
                  style={{ width: "100%", borderRadius: "10px" }}
                  placeholder="*****"
                  iconRender={(visible) =>
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  status={undefined}
                  onChange={handleChangePasswordAuth}
                  onPressEnter={() => {
                    document.getElementById("enterButton").click();
                  }}
                />
              </Space>
            </div>
            <p></p>
            <Button
              type="primary"
              shape="round"
              id="enterButton"
              onClick={() => {
                let email = document.getElementById("eemail").value;
                let pass = document.getElementById("ppass").value;
                if (email === "") {
                  message.warn("Por favor insira email.");
                } else if (!validateEmail(email)) {
                  message.warn("Por favor insira email válido.");
                  document
                    .getElementById("ppass")
                    .setAttribute("status", "error");
                } else if (pass === "") {
                  message.warn("Por favor insira password.");
                  document
                    .getElementById("ppass")
                    .setAttribute("status", "warning");
                }
                // else if (!validatePassword(pass)) {
                //   message.error("Password inválida.");
                //   document
                //     .getElementById("ppass")
                //     .setAttribute("status", "warning");
                // }
                else if (
                  email != "" &&
                  pass != "" &&
                  validateEmail(email)
                  //&&                   validatePassword(pass)
                ) {
                  Meteor.call(
                    // faz a verificacao dos parametros e se o user existe ou não
                    "authenticateUser",
                    email,
                    pass,

                    (err, result) => {
                      console.log("err", err);
                      console.log("result", result);
                      if (err) {
                        //Fazer aparecer mensagem de texto de credenciais erradas.
                        message.error(
                          "Credenciais erradas ou utilizador inexistente."
                        );
                      } else if (result) {
                        if (
                          result != "Invalid credentials / user does not exist."
                        ) {
                          // trata do login deste user
                          login(result, pass);
                        } else {
                          message.error(
                            "Credenciais erradas ou utilizador inexistente."
                          );
                        }
                      }
                    }
                  );
                }
              }}
            >
              Autenticar
            </Button>
            <p></p>
            <div className="input">
              <label className="labels" style={{ alignSelf: "center" }}>
                {" "}
                Esqueceu-se da password?
              </label>
            </div>
            <div
              className="input"
              style={{ width: "50%", alignSelf: "center" }}
            >
              <Button shape="round" onClick={() => navigate("/ForgotPassword")}>
                Redefinir password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}
