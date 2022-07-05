import React, {useEffect, useState} from "react";
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
    
    // PROFILE
    document.getElementById("carregarFicheiroJogos").hidden = false;
    document.getElementById("atribuirArbitrosAjogos").hidden = true;
    document.getElementById("indisponibilidadesCA").hidden = true;
    document.getElementById("restricoesCA").hidden = true;
    document.getElementById("consultaPrivadaCA").hidden = true;
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
    
    // PROFILE
    document.getElementById("carregarFicheiroJogos").hidden = true;
    document.getElementById("atribuirArbitrosAjogos").hidden = false;
    document.getElementById("indisponibilidadesCA").hidden = true;
    document.getElementById("restricoesCA").hidden = true;
    document.getElementById("consultaPrivadaCA").hidden = true;
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
    
    // PROFILE
    document.getElementById("carregarFicheiroJogos").hidden = true;
    document.getElementById("atribuirArbitrosAjogos").hidden = true;
    document.getElementById("indisponibilidadesCA").hidden = true;
    document.getElementById("restricoesCA").hidden = true;
    document.getElementById("consultaPrivadaCA").hidden = false;
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
    
    // PROFILE
    document.getElementById("carregarFicheiroJogos").hidden = true;
    document.getElementById("atribuirArbitrosAjogos").hidden = true;
    document.getElementById("indisponibilidadesCA").hidden = false;
    document.getElementById("restricoesCA").hidden = true;
    document.getElementById("consultaPrivadaCA").hidden = true;
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
    
    // PROFILE
    document.getElementById("carregarFicheiroJogos").hidden = true;
    document.getElementById("atribuirArbitrosAjogos").hidden = true;
    document.getElementById("indisponibilidadesCA").hidden = true;
    document.getElementById("restricoesCA").hidden = false;
    document.getElementById("consultaPrivadaCA").hidden = true;
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
    
    // PROFILE
    document.getElementById("carregarFicheiroJogos").hidden = true;
    document.getElementById("atribuirArbitrosAjogos").hidden = true;
    document.getElementById("indisponibilidadesCA").hidden = true;
    document.getElementById("restricoesCA").hidden = true;
    document.getElementById("consultaPrivadaCA").hidden = true;
  }
 

    return (
      // Pass on our props
      <Menu right={true}  {...props}>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => {
              mostraPaginaCarregarJogos();
            }}
          >
            Carregar Jogos Novos
          </p>
        </a>
        
        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => {
              mostraPaginaAtribuicaoArbitros();
            }}
          >
            Atribuir Árbitros a Jogos
          </p>
        </a>

        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => {
              mostraPaginaNomeacoesCA();
            }}
          >
            Consultar Nomeações
          </p>
        </a>
  
        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => {
              mostraPaginaIndisponibilidadesCA();
            }}
          >
            Marcar Indisponibilidades
          </p>
        </a>
  
        <a className="menu-item">
          <p
            style={{ fontSize: "15px" }}
            onClick={() => {
              mostraPaginaRestricoesCA();
            }}
          >
            Indicar Restrições
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
