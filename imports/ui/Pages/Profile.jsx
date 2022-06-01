import React from "react";


import "./styles.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";

export const Profile = () => {
  //let user = Meteor.users.findOne(Meteor.userId());
 // console.log(user);
  //let username = user.username;

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
