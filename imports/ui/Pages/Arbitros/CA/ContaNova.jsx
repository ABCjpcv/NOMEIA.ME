import React from "react";
import { Meteor } from "meteor/meteor";
import { Button, Input, InputNumber, message, Space } from "antd";
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
                onChange={handleChangeNomeContaNova}
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
                onChange={handleChangeEmailContaNova}
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
                  onChange={handleChangeNivelArbitroContaNova}
                  min="1"
                  max="4"
                  style={{ width: "49%" }}
                ></InputNumber>
                <InputNumber
                  type="number"
                  placeholder="xxxx"
                  id="licencaArbitro"
                  onChange={handleChangeLicencaContaNova}
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
                Pertence ao Conselho de Arbitragem da Associação de Voleibol de
                Lisboa?
                <Input
                  type={"checkbox"}
                  id="isCA"
                  style={{
                    display: "flex",
                    marginLeft: "20%",
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
                  onChange={handleChangePasswordAuth}
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
                let nome = document.getElementById("nome").value;
                let email = document.getElementById("email").value;
                let nivelArbitro =
                  document.getElementById("nivelArbitro").value;
                let licencaArbitro =
                  document.getElementById("licencaArbitro").value;
                let pass = document.getElementById("pass").value;
                let pass2 = document.getElementById("pass2").value;
                let isCA = document.getElementById("isCA").checked;
                Meteor.call(
                  "registerUser",
                  nome,
                  email,
                  nivelArbitro,
                  licencaArbitro,
                  pass,
                  pass2,
                  isCA,
                  (err, result) => {
                    console.log("O QUE APARECE DO OUTRO LADO?", result);

                    if (result) {
                      message.success(
                        "Árbitro " +
                          document.getElementById("nome").value +
                          ", criado com sucesso!"
                      );
                      document.getElementById("nome").value = "";
                      document.getElementById("email").value = "";
                      document.getElementById("nivelArbitro").value = "";
                      document.getElementById("licencaArbitro").value = "";
                      document.getElementById("pass").value = "";
                      document.getElementById("pass2").value = "";
                      document.getElementById("isCA").checked = false;
                    }
                  }
                );
              }}
            >
              Registar árbitro novo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

const handleChangeNomeContaNova = () => {};

const handleChangeEmailContaNova = () => {};

const handleChangeNivelArbitroContaNova = () => {};

const handleChangeLicencaContaNova = () => {};

const handleChangePasswordAuth = () => {};

const handleChangePassword2Auth = () => {};
