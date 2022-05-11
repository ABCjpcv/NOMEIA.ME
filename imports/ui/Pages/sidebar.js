import React from "react";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";

export default (props) => {
  let navigate = useNavigate();

  return (
    // Pass on our props
    <Menu {...props}>
      <a className="menu-item">
        <p
          onClick={() => {
            document.getElementById("indisponibilidades").hidden = true;
            document.getElementById("consultaPrivada").hidden = false;
            document.getElementById("restricoes").hidden = true;
          }}
        >
          Consultar Nomeações{" "}
        </p>
      </a>

      <a className="menu-item">
        <p
          onClick={() => {
            document.getElementById("indisponibilidades").hidden = false;
            document.getElementById("consultaPrivada").hidden = true;
            document.getElementById("restricoes").hidden = true;
          }}
        >
          Marcar Indisponibilidades
        </p>
      </a>

      <a className="menu-item">
        <p
          onClick={() => {
            document.getElementById("indisponibilidades").hidden = true;
            document.getElementById("consultaPrivada").hidden = true;
            document.getElementById("restricoes").hidden = false;
          }}
        >
          Indicar Restrições
        </p>
      </a>

      <a className="menu-item">
        <p onClick={() => navigate("/")}>Sair</p>
      </a>
    </Menu>
  );
};
