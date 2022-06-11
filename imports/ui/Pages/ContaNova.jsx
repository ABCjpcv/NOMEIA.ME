import { mergeEventStores } from "@fullcalendar/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export function ContaNova() {
  let navigate = useNavigate();

  function mostraPerfil() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("RestricoesPrivadas").hidden = true;
  }

  return (
    <div>
      <h1 className="blue">Criar Conta Nova </h1>

      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="input">
          <label className="labels">Primeiro e último nome</label>
          <input className="inputt" type={"text"} id="nome"></input>
        </div>
        <br></br>
        <div className="input">
          <label className="labels">Email</label>
          <input className="inputt" type={"email"} id="email"></input>
        </div>
        <br></br>
        <div className="input">
          <label className="labels">Password</label>
          <input className="inputt" type={"password"} id="pass"></input>
        </div>
        <br></br>
        <div className="input">
          <label className="labels">Repetir Password</label>
          <input className="inputt" type={"password"} id="pass2"></input>
        </div>
        <br></br>
        <button
          className="botao"
          onClick={() =>
            Meteor.call(
              "registerUser",
              document.getElementById("nome").value,
              document.getElementById("email").value,
              document.getElementById("pass").value,
              document.getElementById("pass2").value,
              (err, result) => {
                console.log("ENTRASTE pota ????");
                if (!err) {
                  console.log("ENTRASTE????");
                  if (result) {
                    Meteor.call("readCsv", "Livro1.csv");
                    console.log(document.getElementById("nome").value);
                    Meteor.loginWithPassword(
                      document.getElementById("nome").value,
                      document.getElementById("pass").value
                    );
                    console.log(Meteor.users.findOne(Meteor.userId).username);
                    mostraPerfil();
                    Meteor.loggingIn();
                    navigate("/Profile");
                    
                  }
                }
              }
            )
          }
        >
          Registar
        </button>
        Já tem conta?
        <button className="botao" onClick={() => navigate("/Autenticar")}>
          Autenticar
        </button>
      </div>
    </div>
  );
}
