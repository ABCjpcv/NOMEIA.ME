import { Meteor } from "meteor/meteor";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

export function Autenticar() {
  let navigate = useNavigate();

  function mostraPerfil() {
    document.getElementById("titulo").hidden = true;
    // document.getElementById("carregarJogos").hidden = true;
    // document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("menuPrivadoCA").hidden = true;
    // document.getElementById("carregarFicheiroJogos").hidden = true;
    // document.getElementById("atribuirArbitrosAjogos").hidden = true;
    // document.getElementById("indisponibilidadesCA").hidden = true;
    //document.getElementById("restricoesCA").hidden = true;
    //document.getElementById("consultaPrivadaCA").hidden = true;
    //  document.getElementById("indisponibilidades").hidden = true;
    //  document.getElementById("restricoes").hidden = true;
    //  document.getElementById("consultaPrivada").hidden = false;
  }

  function mostraPerfilCA() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
    // document.getElementById("carregarFicheiroJogos").hidden = false;
    // document.getElementById("atribuirArbitrosAjogos").hidden = true;
    // document.getElementById("indisponibilidadesCA").hidden = true;
    // document.getElementById("restricoesCA").hidden = true;
    // document.getElementById("consultaPrivadaCA").hidden = true;
    // document.getElementById("indisponibilidades").hidden = true;
    // document.getElementById("restricoes").hidden = true;
    // document.getElementById("consultaPrivada").hidden = true;
  }

  function login(user, pass) {
    if (Meteor.user() != undefined) {
      //console.log("current user: " + Meteor.user().username);
      Meteor.logout();
    } else {
      // console.log("Não há user");
      console.log("user", user);

      let utilizador = JSON.parse(JSON.stringify(user));

      console.log("utilizador: ", utilizador);
      // TENHO O USER CERTO AQUI

      Meteor.loginWithPassword(utilizador.username, pass, (err, result) => {
        if (err) {
          message.error("Credenciais erradas ou utilizador inexistente.");
        }

        Meteor.call("isAdmin", utilizador, (err, result) => {
          if (Meteor.user() === null)
            message.error("Credenciais erradas ou utilizador inexistente.");
          else {
            if (err) {
              message.error("Credenciais erradas ou utilizador inexistente.");
            } else if (result) {
              console.log("vou mostrar Perfil do CA");
              navigate("/ProfileCA");
              mostraPerfilCA();
            } else if (!result) {
              console.log("vou mostrar Perfil do Arbitro");
              navigate("/Profile");
              mostraPerfil();
            }
          }
        });
      });
    }
  }

  return (
    <div>
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
          <label className="labels">Password*</label>
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
                    console.log(err);
                  } else if (result) {
                    console.log("result p login", result);
                    // trata do login deste user
                    pass = document.getElementById("ppass").value;
                    login(result, pass);
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
          <button className="botao" onClick={() => navigate("/ForgotPassword")}>
            Redefinir password
          </button>
        </div>
      </div>
    </div>
  );
}
