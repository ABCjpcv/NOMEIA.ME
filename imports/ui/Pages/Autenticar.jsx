import { Meteor } from "meteor/meteor";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Autenticar() {
  let navigate = useNavigate();
  const admins = ["Daniel Fernandes", "Sérgio Pereira", "Mafalda Bento"];

  function isAdmin(user) {
    console.log(user.username);
    return admins.includes(user.username);
  }

  function mostraPerfil() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("RestricoesPrivadas").hidden = true;
  }

  async function login(result, pass) {
    if (Meteor.user() != undefined) {
      console.log("current user: " + Meteor.user().username);
      Meteor.logout();
    } else {
      console.log("Não há user");
    }

    Meteor.call("readCsv", "Livro1.csv");

    // Result é String do username do utilizador verificado, não dá para fazer login...
    console.log("username do user a tentar fazer login: " + result);
    console.log("password do user a tentar fazer login: " + pass);

    Meteor.loginWithPassword(result, pass);
    console.log("current User: " + Meteor.user);
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
          onClick={() =>
            Meteor.call(
              "authenticateUser",
              document.getElementById("eemail").value,
              document.getElementById("ppass").value,
              (err, result) => {
                if (err) {
                  //Fazer aparecer mensagem de texto de credenciais erradas.
                  console.log(err);
                } else if (result) {
                  pass = document.getElementById("ppass").value;

                  login(result, pass).then(
                    navigate("/Profile"),
                    mostraPerfil()
                  );
                }
              }
            )
          }
        >
          Autenticar
        </button>
        <p></p>
        <div className="input">
          <label>Ainda não tem conta?</label>
          <button className="botao" onClick={() => navigate("/ContaNova")}>
            Criar Conta Nova
          </button>
        </div>
      </div>
    </div>
  );
}
