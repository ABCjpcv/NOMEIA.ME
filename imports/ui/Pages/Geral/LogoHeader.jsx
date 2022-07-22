import React from "react";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react/cjs/react.production.min";
import { Meteor } from "meteor/meteor";

export const LogoHeader = () => {
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
      <img
        id="imgLogo"
        src="logo.png"
        style={{ width: "30%", cursor: "pointer" }}
        onClick={() => {
          mostraTitulo(), navigate("/"), logout();
        }}
      />
    </Fragment>
  );
};
