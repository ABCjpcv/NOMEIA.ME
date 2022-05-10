import React from "react";
import { slide as Menu } from "react-burger-menu";
import { useNavigate } from "react-router-dom";

export default props => {

    let navigate = useNavigate();

  return (
    // Pass on our props
    <Menu {...props}>
      <a className="menu-item">
          <p onClick={() => navigate("/Profile")}>Consultar Nomeações </p>
        
      </a>

      <a className="menu-item" >
          <p onClick={() => navigate("/Indisponibilidades")}>Marcar Indisponibilidades</p>
        
      </a>

      <a className="menu-item" >
          <p onClick={() => navigate("/Restricoes")}>Indicar Restrições</p>
        
      </a>

      <a className="menu-item" >
          <p onClick={() => navigate("/")}>Sair</p>
        
      </a>
    </Menu>
  );
};
