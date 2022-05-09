import React from "react";
import { slide as Menu } from "react-burger-menu";

export default props => {
  return (
    // Pass on our props
    <Menu {...props}>
      <a className="menu-item">
          <p></p>
        Consultar Nomeações 
      </a>

      <a className="menu-item" >
          <p></p>
        Marcar Indisponibilidades
      </a>

      <a className="menu-item" >
          <p></p>
        Indicar Restrições
      </a>

      <a className="menu-item" >
          <p></p>
        Sair
      </a>
    </Menu>
  );
};
