// PAGINA DEDICADA AOS UTILIZADORES PODEREM MUDAR DE PASSWORD, INDICAREM O SEU NIVEL DE ARBITRO E LICENÇA

import { Meteor } from "meteor/meteor";
import React from "react";
import { useNavigate } from "react-router-dom";

export function UserSettings() {
  let navigate = useNavigate();
  let user = Meteor.user();

  function submeterAlteracaoPassword(user, newPassword) {
    Meteor.call("alteraPassword", user, newPassword, (err, result) => {
      if (result === 1) {
        window.alert("Password alterada com sucesso!");
      } else {
        window.alert("ERRO");
      }
    });
  }

  function adicionaTransporteProprioUserSettings(user) {}

  function adicionaEmissaoReciboUserSettings(user) {}

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

        <p></p>

        <div className="input">
          <label className="labels">
            Transporte próprio:
            <input
              className="inputt"
              type={"checkbox"}
              id="transporteProprioUserSettings"
              onClick={adicionaTransporteProprioUserSettings()}
              style={{ marginLeft: "180px", height: "30px", width: "30px" }}
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
              id="emitoReciboUserSettings"
              onClick={adicionaEmissaoReciboUserSettings()}
              style={{ marginLeft: "188px", height: "30px", width: "30px" }}
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
