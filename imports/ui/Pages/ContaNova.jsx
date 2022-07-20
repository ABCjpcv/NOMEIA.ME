import React from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { message } from "antd";

export function ContaNova() {
  let navigate = useNavigate();

  return (
    <div>
      <h1 className="blue">Informações do Árbitro: </h1>

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
          <label className="labels">Nivel</label>
          <input className="inputt" type={"number"} id="nivelArbitro"></input>
        </div>
        <br></br>
        <div className="input">
          <label className="labels">Licença</label>
          <input className="inputt" type={"number"} id="licencaArbitro"></input>
        </div>
        <br></br>
        <div className="input">
          <label className="labels">
            Conselho de Arbitragem:
            <input
              className="inputt"
              type={"checkbox"}
              id="isCA"
              style={{ marginLeft: "150px", height: "30px", width: "30px" }}
            ></input>
          </label>
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
              document.getElementById("nivelArbitro").value,
              document.getElementById("licencaArbitro").value,
              document.getElementById("pass").value,
              document.getElementById("pass2").value,
              document.getElementById("isCA").checked,
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
            )
          }
        >
          Registar árbitro novo
        </button>
      </div>
    </div>
  );
}
