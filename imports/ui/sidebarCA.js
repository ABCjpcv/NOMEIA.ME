import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";

export default (props) => {
  let navigate = useNavigate();

  function mostraPaginaCarregarJogos() {
    // HEADERS
    document.getElementById("titulo").hidden = true;
    document.getElementById("carregarJogos").hidden = false;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = true;
    document.getElementById("criarContaNova").hidden = true;
  }

  function mostraPaginaAtribuicaoArbitros() {
    // HEADERS
    document.getElementById("titulo").hidden = true;
    document.getElementById("carregarJogos").hidden = true;
    document.getElementById("atribuirArbitros").hidden = false;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = true;
    document.getElementById("criarContaNova").hidden = true;
  }

  function mostraPaginaNomeacoesCA() {
    // HEADERS
    document.getElementById("titulo").hidden = true;
    document.getElementById("carregarJogos").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = true;
    document.getElementById("criarContaNova").hidden = true;
  }

  function mostraPaginaIndisponibilidadesCA() {
    // HEADERS
    document.getElementById("titulo").hidden = true;
    document.getElementById("carregarJogos").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = false;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = true;
    document.getElementById("criarContaNova").hidden = true;
  }

  function mostraPaginaRestricoesCA() {
    // HEADERS
    document.getElementById("titulo").hidden = true;
    document.getElementById("carregarJogos").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = false;
    document.getElementById("menuPrivadoCA").hidden = false;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = true;
    document.getElementById("criarContaNova").hidden = true;
  }

  function mostraPaginaDefinicoesCA() {
    // HEADERS
    document.getElementById("titulo").hidden = true;
    document.getElementById("carregarJogos").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = false;
    document.getElementById("criarContaNova").hidden = true;
  }

  function mostraPaginaContaNovaCA() {
    // HEADERS
    document.getElementById("titulo").hidden = true;
    document.getElementById("carregarJogos").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("definicoes").hidden = true;
    document.getElementById("criarContaNova").hidden = false;
  }

  function mostraTitulo() {
    // HEADERS
    document.getElementById("titulo").hidden = false;
    document.getElementById("carregarJogos").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = true;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = true;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("criarContaNova").hidden = true;
    document.getElementById("definicoes").hidden = true;
  }

  return (
    // Pass on our props
    <Menu right={true} {...props}>
      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            mostraPaginaCarregarJogos(),
            navigate("ProfileCA/Carregar_Novos_Jogos")
          )}
        >
          Carregar Jogos Novos
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          id="clickOptionMenuAtribuirArbitros"
          onClick={() => (
            mostraPaginaAtribuicaoArbitros(),
            navigate("ProfileCA/Atribuir_Arbitros")
          )}
        >
          Atribuir Árbitros a Jogos
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (mostraPaginaNomeacoesCA(), navigate("ProfileCA"))}
        >
          Consultar Nomeações
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            mostraPaginaIndisponibilidadesCA(),
            navigate("ProfileCA/Indisponibilidades")
          )}
        >
          Marcar Indisponibilidades
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            mostraPaginaRestricoesCA(), navigate("ProfileCA/Relacoes")
          )}
        >
          Indicar Restrições
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            mostraPaginaContaNovaCA(), navigate("ProfileCA/Criar_Arbitro")
          )}
        >
          Criar Conta Nova
        </p>
      </a>

      <a className="menu-item">
        <p
          style={{ fontSize: "15px" }}
          onClick={() => (
            mostraPaginaDefinicoesCA(), navigate("ProfileCA/Definicoes")
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
