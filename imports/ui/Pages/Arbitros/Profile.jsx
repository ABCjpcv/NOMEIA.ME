import React from "react";

import "../../../../imports/ui/Pages/app.css";
import { ConsultaPrivada } from "./ConsultaPrivada";

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
