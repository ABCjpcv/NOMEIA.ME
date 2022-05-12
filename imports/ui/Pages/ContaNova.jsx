import { mergeEventStores } from "@fullcalendar/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";

export function ContaNova() {
  let navigate = useNavigate();

  return (
    <div>
      <h1 className="blue">Criar Conta Nova </h1>

      <div style={{margin: "auto", display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div className="input">
          <label className="labels">Nome</label>
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
        <button className="botao"
          onClick={() =>
            Meteor.call(
              "registerUser",
              document.getElementById("nome").value,
              document.getElementById("email").value,
              document.getElementById("pass").value,
              document.getElementById("pass2").value,
              (err, result) => {
                if(!err)
                  navigate("/Profile");
                else
                console.log(err);
              }
            )
          }
        >
          Registar
        </button>
        Já tem conta?
        <button className="botao" onClick={() => navigate("/Autenticar")}>Autenticar</button>
      </div>
    </div>
  );
}
