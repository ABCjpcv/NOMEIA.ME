import React from "react";

import "./app.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";

export const Profile = () => {
  function changeUsernameStatus() {
    document.getElementById("usernameStatus").innerHTML =
    Meteor.user?.()?.username;
  }

  changeUsernameStatus();

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

          <div id="page-wrap"></div>
        </div>
      </div>
    </div>
  );
};
