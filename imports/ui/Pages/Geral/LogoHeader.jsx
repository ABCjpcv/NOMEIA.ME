import React from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/cjs/react.production.min";
import { Meteor } from "meteor/meteor";
import { Button } from "antd";

export const LogoHeader = ({ user }) => {
  let navigate = useNavigate();

  function mostraTitulo() {
    // HEADERS
    try {
      document.getElementById("titulo").hidden = false;
      document.getElementById("carregarJogos").hidden = true;
      document.getElementById("atribuirArbitros").hidden = true;
      document.getElementById("nomeacoesPrivadas").hidden = true;
      document.getElementById("indisponibilidadePrivadas").hidden = true;
      document.getElementById("restricoesPrivadas").hidden = true;

      document.getElementById("menuPrivadoCA").hidden = true;
      document.getElementById("menuPrivado").hidden = true;
      document.getElementById("definicoes").hidden = true;
      document.getElementById("criarContaNova").hidden = true;
    } catch (e) {}

    // PROFILE
    // document.getElementById("atribuirArbitrosAjogos").hidden = true;
    // document.getElementById("indisponibilidadesCA").hidden = true;
    // document.getElementById("restricoesCA").hidden = true;
    // document.getElementById("consultaPrivadaCA").hidden = true;
  }

  function logout() {
    if (Meteor.user() != undefined) {
      Meteor.logout();
    }
  }

  return (
    <Fragment>
      <div
        style={{ display: "flex", justifyContent: "center" }}
        onClick={() => {
          mostraTitulo(), navigate("/"), logout();
        }}
      >
        {user ? (
          <>
            <p
              style={{
                fontSize: "15px",
                marginTop: "1%",
                marginRight: "5%",
              }}
            >
              Sair
            </p>
            <img
              id="imgLogout"
              src="logout.png"
              style={{ width: "15%", cursor: "pointer", marginRight: "-100%" }}
            />{" "}
          </>
        ) : (
          <img
            id="imgLogo"
            src="logo.png"
            style={{ width: "25%", cursor: "pointer" }}
          />
        )}
      </div>
    </Fragment>
  );
};
