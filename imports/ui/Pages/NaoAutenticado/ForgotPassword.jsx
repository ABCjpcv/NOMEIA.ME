import React from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { Header } from "../Geral/Header";
import { Input, Button, message } from "antd";

const handleChangeEmailPasswordRedefined = (e) => {
  if (e.target.value.length === 0) {
    document.getElementById("emailPerdido").style.backgroundColor = "";
  } else if (!validateEmail(e.target.value)) {
    document.getElementById("emailPerdido").style.backgroundColor =
      "rgba(255, 153, 0, 0.3)";
    document.getElementById("emailPerdido").setAttribute("status", "warning");
  } else {
    document.getElementById("emailPerdido").style.backgroundColor = "";
  }
};

function validateEmail(mail) {
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    return true;
  }
  return false;
}

export function ForgotPassword() {
  let navigate = useNavigate();

  function resetPasswordWithEmail() {
    if (document.getElementById("emailPerdido") != null) {
      Meteor.call(
        "esqueceuPassword",
        document.getElementById("emailPerdido").value,

        (err, result) => {
          console.log("ENTRASTE pota ????");
          if (!err) {
            console.log("ENTRASTE????");
            if (result == true) {
              message.success("Email enviado com sucesso!");
              message.info(
                "Verifique a sua nova password na sua conta de email."
              );

              navigate("/Autenticar");
            }
            if (result == false) {
              message.error(
                "Email não encontrado ou serviço indisponível. Por favor contacte o Conselho de Arbitragem."
              );
            }
          }
        }
      );
    }
  }

  return (
    <>
      {" "}
      <Header
        user={Meteor.user()}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={true}
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={true}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
        historico={true}
        clubesAfiliadosAVL={true}
        consultaNomeacoesSemanais={true}
        forgotPasswordHeader={false}
        sobreHeader={true}
      />
      <div>
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
            Definir password nova:
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
                id="emailPerdido"
                style={{ borderRadius: "10px" }}
                status={undefined}
                onChange={handleChangeEmailPasswordRedefined}
                onPressEnter={() => resetPasswordWithEmail()}
              ></Input>
            </div>
            <p></p>
            <Button
              type="primary"
              shape="round"
              className="botao"
              onClick={() => resetPasswordWithEmail()}
            >
              Enviar mail
            </Button>
            Já tem conta?
            <Button
              className="botao"
              shape="round"
              onClick={() => navigate("/Autenticar")}
            >
              Autenticar
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
