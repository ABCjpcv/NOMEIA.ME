import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import "./app.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";
import { UserSettings } from "./UserSettings";

export function Profile() {
  let navigate = useNavigate();

  function changeUsernameStatus() {
    try {
      user = Meteor.user?.();

      console.log("user", user);

      const username = user.username;
      if (username == null || username == undefined)
        throw new Error("sessionExpired");
      else {
        document.getElementById("usernameStatus").innerHTML = username;
      }
    } catch (sessionExpired) {
      return true;
    }
    return false;
  }

  if (!changeUsernameStatus()) {
    /**
     *  CASO O UTILIZADOR SEJA ARBITRO
     */
    return (
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
          </div>

          <div id="definicoesPerfil" hidden>
            <UserSettings></UserSettings>
          </div>

          <div id="page-wrap"></div>
        </div>
      </div>
    );
    //}
  } else {
    return (
      <div>
        <h1 className="blue">
          A sua sessão expirou.
          <p>
            <a
              onClick={() => {
                navigate("/");
              }}
            >
              Página Principal
            </a>
          </p>
        </h1>
      </div>
    );
  }
}
