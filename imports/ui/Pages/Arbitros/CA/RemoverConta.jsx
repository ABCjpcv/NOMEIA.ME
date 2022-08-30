import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import { Button, Input, InputNumber, message, Select, Space } from "antd";
import { Header } from "../../Geral/Header";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

// Requiring the lodash library
const _ = require("lodash");

export function RemoverConta() {
  let [todosArbitros, setTodosArbitros] = useState([]);

  let [stateSelected, setStateSelected] = useState("");

  const stateChange = (e) => {
    // console.log("e", e);
    setStateSelected(e);

    let arbitro = "";

    Meteor.call("getArbitroFromUsername", e, (err, result) => {
      if (result) {
        arbitro = result;
      }
    });

    setTimeout(() => {
      $("#email").val(arbitro.email);
      $("#nivelArbitro").val(arbitro.nivel);
      $("#licencaArbitro").val(arbitro.licenca);
      $("#isCA").attr("checked", arbitro.isAdmin);
    }, 200);
  };

  useEffect(() => {}, [stateSelected]);

  if (todosArbitros.length == 0) loadArbitros();

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
        criarContaNova={true}
        removerConta={false}
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
              <Select
                id="nome_arbitro"
                showSearch
                type="select"
                mode="single"
                style={{ borderRadius: "10px" }}
                onChange={stateChange}
                value={stateSelected != "" ? stateSelected : ""}
                onSelect={stateChange}
              >
                {todosArbitros.map((arb) => {
                  return (
                    <Select.Option
                      className="select-ref-choice"
                      value={arb + ""}
                      key={"arbitro_" + _.uniqueId()}
                    >
                      {arb + ""}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
            <p></p>
            <div className="input" style={{ justifyContent: "flex-start" }}>
              <label className="labels">Email</label>
              <Input
                type={"email"}
                placeholder="exemplo@email.com"
                id="email"
                style={{ borderRadius: "10px" }}
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
                  placeholder="1"
                  id="nivelArbitro"
                  min="1"
                  max="4"
                  style={{ width: "49%", borderRadius: "10px" }}
                  disabled
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
                  disabled
                  // value={userFromArbitro != "" ? userFromArbitro.licenca : null}
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
                  disabled
                ></Input>
              </label>
            </div>
            <p></p>
            <div className="input">
              <label className="labels">Insira a sua password:</label>
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
            <Button
              size="small"
              shape="round"
              type="primary"
              onClick={() => {
                let pass = document.getElementById("pass").value;
                let pass2 = document.getElementById("pass2").value;

                if (pass != pass2) {
                  message.warn("Passwords não correspondem entre si!");
                  return;
                }

                Meteor.call(
                  "deleteUser",
                  stateSelected,

                  (err, result) => {
                    if (result === 1) {
                      message.success(
                        "Árbitro " +
                          document.getElementById("nome").value +
                          ", removido com sucesso!"
                      );
                    }
                  }
                );
              }}
            >
              Eliminar árbitro
            </Button>
          </div>
        </div>
      </div>
    </>
  );

  function loadArbitros() {
    Meteor.call("getArbitros", (err, result) => {
      if (err) {
        console.log(err);
      } else if (result) {
        setTodosArbitros(result);
      }
    });
  }
}
