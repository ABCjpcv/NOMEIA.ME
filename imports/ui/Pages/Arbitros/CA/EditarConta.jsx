import React, { useEffect, useState } from "react";
import { Meteor } from "meteor/meteor";
import {
  Button,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Space,
} from "antd";
import { Header } from "../../Geral/Header";

// Requiring the lodash library
const _ = require("lodash");

export function EditarConta() {
  let [todosArbitros, setTodosArbitros] = useState([]);

  let [stateSelected, setStateSelected] = useState("Escolha o nome do árbitro");

  let [arbitroSelecionado, setArbitroSelecionado] = useState();

  const stateChange = (e) => {
    setStateSelected(e);

    let arbitro = "";

    Meteor.call("getArbitroFromUsername", e, (err, result) => {
      if (result) {
        arbitro = result;
        setArbitroSelecionado(result);
        console.log("arbitro", arbitro);

        setTimeout(() => {
          $("#email").val(arbitro.email);
          $("#nivelArbitro").val(arbitro.nivel);
          $("#licencaArbitro").val(arbitro.licenca);
          $("#isCA").attr("checked", arbitro.isAdmin);
        }, 300);
      }
    });
  };

  const handleEditConfirmation = () => {
    let emailAntigo = arbitroSelecionado.email;
    let nivelAntigo = arbitroSelecionado.nivel;
    let licencaAntigo = arbitroSelecionado.licenca;
    let isCA = arbitroSelecionado.isAdmin;

    let emailNovo = $("#email").val();
    let nivelNovo = $("#nivelArbitro").val();
    let licencaNova = $("#licencaArbitro").val();
    let CAnovo = document.getElementById("isCA").checked;

    if (
      emailAntigo == emailNovo &&
      nivelNovo == nivelAntigo &&
      licencaAntigo == licencaNova &&
      isCA == CAnovo
    ) {
      message.warn("Não foi detetada alteração");
    } else {
      Meteor.call(
        "editUser",
        stateSelected,
        emailNovo,
        nivelNovo,
        licencaNova,
        CAnovo,
        (err, result) => {
          if (err) {
            console.log(err);
          } else if (result == 1) {
            message.success(
              "Árbitro " + stateSelected + " foi editado com sucesso!"
            );
            $("#email").val(emailNovo);
            $("#nivelArbitro").val(nivelNovo);
            $("#licencaArbitro").val(licencaNova);
            $("#isCA").attr("checked", CAnovo);
          } else if (result == -1) {
            message.error("Erro ao editar árbitro!");
          }
        }
      );

      Meteor.call("getArbitroFromUsername", stateSelected, (err, result) => {
        if (result) {
          arbitro = result;
          setArbitroSelecionado(result);
        }
      });
    }
  };

  const handleEliminationConfirmation = () => {
    if (stateSelected !== "Escolha o nome do árbitro") {
      // let pass = document.getElementById("pass").value;
      // let pass2 = document.getElementById("pass2").value;

      // if (pass.length == 0 || pass2.length == 0) {
      //   message.warn("Não inseriu a sua passwords!");
      //   return;
      // }
      // if (pass != pass2) {
      //   message.warn("Passwords não correspondem entre si!");
      //   return;
      // }
      // let erro = false;
      // Meteor.loginWithPassword(
      //   Meteor.user().emails[0].address,
      //   pass,
      //   function (err) {
      //     if (err) {
      //       erro = true;
      //       message.error("Password atual errada");
      //       return;
      //     }
      //   }
      // );

      setTimeout(() => {
        // if (!erro) {
        Meteor.call(
          "deleteUser",
          stateSelected,

          (err, result) => {
            if (result === 1) {
              message.success(
                "Árbitro " + stateSelected + ", removido com sucesso!"
              );
            }
          }
        );
        setStateSelected("Escolha o nome do árbitro");
        $("#email").val(null);
        $("#nivelArbitro").val(null);
        $("#licencaArbitro").val(null);
        $("#isCA").attr("checked", false);
        // $("#pass").removeAttr("value");
        // $("#pass2").removeAttr("value");
        // }
      }, 300);
    } else {
      message.warn("Não indicou o Árbitro a eliminar!");
      return;
    }
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
        historico={true}
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
                value={
                  stateSelected != "Escolha o nome do árbitro"
                    ? stateSelected
                    : "Escolha o nome do árbitro"
                }
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
            <div id="input">
              <div className="input" style={{ justifyContent: "flex-start" }}>
                <label className="labels">Email</label>
                <Input
                  type={"email"}
                  placeholder="exemplo@email.com"
                  id="email"
                  style={{ borderRadius: "10px" }}
                  defaultValue={
                    arbitroSelecionado != undefined
                      ? arbitroSelecionado.email
                      : null
                  }
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
                    defaultValue={
                      arbitroSelecionado != undefined
                        ? arbitroSelecionado.nivel
                        : null
                    }
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
                    defaultValue={
                      arbitroSelecionado != undefined
                        ? arbitroSelecionado.licenca
                        : null
                    }
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
            </div>

            {/* <p></p>
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
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
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
                    visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                  }
                  status={undefined}
                />
              </Space>
            </div> */}
            <p></p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Button
                size="small"
                type="primary"
                shape="round"
                onClick={() => handleEditConfirmation()}
              >
                {" "}
                💾 Guardar alterações
              </Button>
              <Popconfirm
                title={
                  "Tem a certeza que quer eliminar " + stateSelected + " ?"
                }
                onConfirm={() => handleEliminationConfirmation()}
                cancelText="Cancelar"
              >
                <Button
                  size="small"
                  shape="round"
                  type="primary"
                  style={{ backgroundColor: "red", borderColor: "red" }}
                >
                  🗑️ Eliminar árbitro
                </Button>
              </Popconfirm>
            </div>
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
