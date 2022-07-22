import React from "react";

import { Meteor } from "meteor/meteor";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";

export default (props) => {
  let navigate = useNavigate();

  function mostraPaginaNomeacoes() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("definicoes").hidden = true;
  }

  function mostraPaginaIndisponibilidades() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = false;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("definicoes").hidden = true;
  }

  function mostraPaginaRestricoes() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = false;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("definicoes").hidden = true;
  }

  function mostraPaginaDefinicoes() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("definicoes").hidden = false;
  }

  function mostraTitulo() {
    document.getElementById("titulo").hidden = false;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = true;
  }

  return (
    // Pass on our props
    <Menu right={true} {...props}>
      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (navigate("Conta/Profile"), mostraPaginaNomeacoes())}
        >
          Consultar Nomeações
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            mostraPaginaIndisponibilidades(),
            navigate("Conta/Profile/Indisponibilidades")
          )}
        >
          Marcar Indisponibilidades
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            navigate("Conta/Profile/Relacoes"), mostraPaginaRestricoes()
          )}
        >
          Indicar Restrições
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            navigate("Conta/Profile/Definicoes"), mostraPaginaDefinicoes()
          )}
        >
          Definições
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (mostraTitulo(), navigate("/"), Meteor.logout())}
        >
          Sair
        </p>
      </a>
    </Menu>
  );
};
