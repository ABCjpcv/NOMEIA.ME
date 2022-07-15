import { Meteor } from "meteor/meteor";
import React, { useState, useEffect } from "react";

export function UserSettings() {
  let [user, setUser] = useState(Meteor.user());

  let [temRecibo, setTemRecibo] = useState(() =>
    getEmissaoReciboUser(Meteor.user())
  );
  let [temTransporte, setTemTransporte] = useState(() =>
    getTransporteProprioUser(Meteor.user())
  );

  let [nivel, setNivel] = useState(() => getNivel(Meteor.user()));

  function submeterAlteracaoPassword(user, newPassword) {
    Meteor.call("alteraPassword", user, newPassword, (err, result) => {
      if (result === 1) {
        window.alert("Password alterada com sucesso!");
      } else {
        window.alert("ERRO");
      }
    });
  }

  function getNivel(user) {
    Meteor.call("getNivel", user, (err, result) => {
      setNivel(result);
    });
  }

  function adicionaTransporteProprioUserSettings(user) {
    Meteor.call("alteraTransporte", user, (err, result) => {
      console.log("result", result);
      if (result === 1) {
        window.alert("Adicionado transporte próprio!");
        setTemTransporte(true);
      }
      if (result === 0) {
        window.alert("Removido transporte próprio!");
        setTemTransporte(false);
      }
    });
  }

  function adicionaEmissaoReciboUserSettings(user) {
    Meteor.call("alteraRecibo", user, (err, result) => {
      console.log("result", result);
      if (result === 1) {
        window.alert("Adicionada emissão de recibo!");
        setTemRecibo(true);
      }
      if (result === 0) {
        window.alert("Removida emissão de recibo!");
        setTemRecibo(false);
      }
    });
  }

  function getTransporteProprioUser(user) {
    Meteor.call("getTransporte", user, (err, result) => {
      console.log("result", result);
      if (result) {
        setTemTransporte(result);
      }
    });
  }

  function getEmissaoReciboUser(user) {
    return Meteor.call("getRecibo", user, (err, result) => {
      console.log("result", result);
      if (result) {
        setTemRecibo(result);
      }
    });
  }

  return (
    <div>
      <h1 className="blue"> </h1>
      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="input">
          <label className="labels">Nome</label>
          <input
            className="inputt"
            type={"text"}
            id="nomeUserSettings"
            value={user.username}
            disabled
          ></input>
        </div>
        <p></p>
        <div className="input">
          <label className="labels">Email</label>
          <input
            className="inputt"
            type={"email"}
            id="emailUserSettings"
            value={user.emails[0].address}
            disabled
          ></input>
        </div>
        <p></p>
        <div className="input">
          <label className="labels">Nivel</label>
          <input
            className="inputt"
            type={"text"}
            id="nivelUserSettings"
            value={nivel}
            disabled
          ></input>
        </div>
        <p></p>

        <p></p>

        <div className="input">
          <label className="labels">
            Transporte próprio:
            <input
              className="inputt"
              type={"checkbox"}
              onChange={() =>
                adicionaTransporteProprioUserSettings(Meteor.user())
              }
              style={{ marginLeft: "180px", height: "30px", width: "30px" }}
              checked={temTransporte}
            ></input>
          </label>
        </div>

        <p></p>
        <div className="input">
          <label className="labels">
            Emito recibo verde:
            <input
              className="inputt"
              type={"checkbox"}
              onChange={() => adicionaEmissaoReciboUserSettings(Meteor.user())}
              style={{ marginLeft: "188px", height: "30px", width: "30px" }}
              checked={temRecibo}
            ></input>
          </label>
        </div>
        <p></p>
        <div className="input">
          <label className="labels">Mudar a Password*</label>
          <input
            className="inputt"
            type={"password"}
            id="passwordUserSettings"
          ></input>
        </div>

        <p></p>

        <div className="input">
          <label className="labels">Confirmar a nova password*</label>
          <input
            className="inputt"
            type={"password"}
            id="password2UserSettings"
          ></input>
        </div>

        <p></p>
        <p></p>

        <button
          className="botao"
          onClick={() => {
            let passwordUserSettings = document.getElementById(
              "passwordUserSettings"
            ).value;
            let password2UserSettings = document.getElementById(
              "password2UserSettings"
            ).value;

            if (passwordUserSettings === "" || password2UserSettings === "") {
              window.alert("Não colocou valores nos campos");
            } else if (passwordUserSettings != password2UserSettings) {
              window.alert("As passwords não correspondem.");
            } else {
              submeterAlteracaoPassword(user, passwordUserSettings);
            }
          }}
        >
          Alterar Password
        </button>
      </div>
    </div>
  );
}
