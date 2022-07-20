import React from "react";

import "./app.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";
import { UserSettings } from "./UserSettings";

export function Profile({ user }) {
  return (
    <div>
      <div id="profile">
        <div id="consultaPrivada">
          <ConsultaPrivada user={user}></ConsultaPrivada>
        </div>

        <div id="page-wrap"></div>
      </div>
    </div>
  );
}
