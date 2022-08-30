import React from "react";
import { Meteor } from "meteor/meteor";
import { Button, Input, InputNumber, message, Popconfirm, Space } from "antd";
import { Header } from "../../Geral/Header";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

export function ContaNova() {
  return (
    <>
      <Header
        user={Meteor.user()}
        titulo={true}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={false}
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={false}
        removerConta={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
      />
      <div>
        {/* <h1 className="blue">Informações do Árbitro: </h1> */}

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
                placeholder="Primeiro Último"
                id="nome"
                style={{ borderRadius: "10px" }}
                status={undefined}
              ></Input>
            </div>
            <p></p>
            <div className="input" style={{ justifyContent: "flex-start" }}>
              <label className="labels">Email</label>
              <Input
                type={"email"}
                placeholder="exemplo@email.com"
                id="email"
                style={{ borderRadius: "10px" }}
                status={undefined}
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
                  placeholder="1"
                  id="nivelArbitro"
                  min="1"
                  max="4"
                  style={{ width: "49%", borderRadius: "10px" }}
                ></InputNumber>
                <InputNumber
                  type="number"
                  placeholder="xxxx"
                  id="licencaArbitro"
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
              <label
                className="labels"
                style={{
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                Conselho de Arbitragem da AVL:
                <Input
                  type={"checkbox"}
                  id="isCA"
                  style={{
                    display: "flex",
                    height: "30px",
                    width: "30px",
                    borderRadius: "10px",
                  }}
                ></Input>
              </label>
            </div>
            <p></p>
            <div className="input">
              <label className="labels">Password</label>
              <Space
                direction="vertical"
                style={{ width: "100%", shapeMargin: "round" }}
              >
                <Input.Password
                  id="pass"
                  style={{ width: "100%", borderRadius: "10px" }}
                  placeholder="*****"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  status={undefined}
                />
              </Space>
            </div>
            <p></p>
            <div className="input">
              <label className="labels">Repetir Password</label>
              <Space
                direction="vertical"
                style={{ width: "100%", shapeMargin: "round" }}
              >
                <Input.Password
                  id="pass2"
                  style={{ width: "100%", borderRadius: "10px" }}
                  placeholder="*****"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                  status={undefined}
                />
              </Space>
            </div>
            <p></p>
            <Popconfirm
              title={
                "Tem a certeza que quer adicionar " +
                document.getElementById("nome") +
                " ?"
              }
              onConfirm={() => handleConfirmation()}
            >
              <Button size="small" shape="round" type="primary">
                Registar árbitro novo
              </Button>
            </Popconfirm>
          </div>
        </div>
      </div>
    </>
  );
}

const handleConfirmation = () => {
  let nome = document.getElementById("nome").value;
  if (nome.split(" ").length < 2) {
    message.warn("Nome incorreto");
    return;
  }
  let email = document.getElementById("email").value;

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
  } else {
    message.warn("Email inválido!");
    return;
  }

  let nivelArbitro = document.getElementById("nivelArbitro").value;

  if (
    nivelArbitro !== "1" &&
    nivelArbitro !== "2" &&
    nivelArbitro !== "3" &&
    nivelArbitro !== "4"
  ) {
    message.warn("Nivel de arbitro inválido!");
    return;
  }
  let licencaArbitro = document.getElementById("licencaArbitro").value;

  if (licencaArbitro.length === 0) {
    message.warn("Licença de arbitro inválida!");
    return;
  }
  let pass = document.getElementById("pass").value;
  let pass2 = document.getElementById("pass2").value;

  if (pass != pass2) {
    message.warn("Passwords não correspondem entre si!");
    return;
  }
  let isCA = document.getElementById("isCA").checked;

  let sucesso = false;
  Meteor.call(
    "registerArbitro",
    nome,
    email,
    nivelArbitro,
    licencaArbitro,
    pass,
    pass2,
    isCA,
    (err, result) => {
      if (result) {
        sucesso = true;
      }
    }
  );

  setTimeout(() => {
    if (sucesso) {
      message.success("Árbitro " + nome + ", criado com sucesso!");
      document.getElementById("nome").value = "";
      document.getElementById("email").value = "";
      document.getElementById("nivelArbitro").value = "";
      document.getElementById("licencaArbitro").value = "";
      document.getElementById("pass").value = "";
      document.getElementById("pass2").value = "";
      document.getElementById("isCA").checked = false;
    }
  }, 300);
};
