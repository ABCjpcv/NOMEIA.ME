import React, {useState} from "react";

import { useNavigate } from "react-router-dom";

import "./app.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";

let sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export function Profile (){

  
    
  let navigate = useNavigate();

  function changeUsernameStatus() {


    
    try {
      const username = Meteor.user?.()?.username;
      if(username==null || username==undefined)
      throw new Error("sessionExpired")
      else{
      document.getElementById("usernameStatus").innerHTML = username;
      }
    
    } catch (sessionExpired) {
      return true;
    }
    return false;
  }

  if(!changeUsernameStatus()){
    return(
      <div>
        <div id="profile">
        <div id="indisponibilidades" hidden>
          <Indisponibilidades></Indisponibilidades>
        </div>

        <div id="restricoes" hidden>
        <Restricoes></Restricoes>
        </div>

        <div id="consultaPrivada">
          <ConsultaPrivada></ConsultaPrivada>

          <div id="page-wrap"></div>
        </div>
      </div>
      </div>
    );
  }
  else{

  return (
      <div>
      <h1 className="blue"> A sua sessão expirou. 
      <p> <a onClick={ ()=> {navigate("/")}}> Página Principal </a>
        </p> </h1>
    </div>
    

    
    
  );
}};
