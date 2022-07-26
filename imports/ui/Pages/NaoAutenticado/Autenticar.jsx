import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { Header } from "../Geral/Header";

export function Autenticar({ user }) {
  let navigate = useNavigate();

  function login(user, pass) {
    if (Meteor.user() != undefined) {
      //console.log("current user: " + Meteor.user().username);
      Meteor.logout();
    } else {
      // console.log("Não há user");
      if (user != "Invalid credentials / user does not exist.") {
        let utilizador = JSON.parse(JSON.stringify(user));

        Meteor.loginWithPassword(utilizador.username, pass, (err, result) => {
          if (err) {
            //message.error("Credenciais erradas ou utilizador inexistente.");
          }
          Meteor.call("isAdmin", utilizador, Meteor.user(), (err, result) => {
            console.log("result", result);

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
  }

  return (
    <>
      <Header
        user={user}
        titulo={false}
        consultaPrivada={true}
        menuPrivado={true}
        menuPrivadoCA={true}
        atribuirArbitros={true}
        carregarJogos={true}
        criarContaNova={true}
        indisponibilidadePrivadas={true}
        restricoesPrivadas={true}
        definicoes={true}
      />
      <div>
        {/* {user != null ? Meteor.logout() : null} */}
        <h1 className="blue"> Autenticar: </h1>
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="input">
            <label className="labels">Email</label>
            <input className="inputt" type={"email"} id="eemail"></input>
          </div>
          <p></p>
          <div className="input">
            <label className="labels">Password</label>
            <input className="inputt" type={"password"} id="ppass"></input>
          </div>
          <p></p>
          <button
            className="botao"
            onClick={() => {
              let email = document.getElementById("eemail").value;
              let pass = document.getElementById("ppass").value;
              if (email === "") {
                message.warn("Por favor insira email.");
              } else if (pass === "") {
                message.warn("Por favor insira password.");
              }

              if (email != "" && pass != "") {
                Meteor.call(
                  // faz a verificacao dos parametros e se o user existe ou não
                  "authenticateUser",
                  email,
                  pass,

                  (err, result) => {
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
          </button>
          <p></p>
          <div className="input">
            <label> Esqueceu-se da password?</label>
            <button
              className="botao"
              onClick={() => navigate("/ForgotPassword")}
            >
              Redefinir password
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
