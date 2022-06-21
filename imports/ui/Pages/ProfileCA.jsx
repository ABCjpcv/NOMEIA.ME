import React from "react";
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";

import "./app.css";
import { Fragment } from "react/cjs/react.production.min";
import { ListaJogosSemArbitros } from "./ListaJogosSemArbitros";
import { FileInput } from "./FileInput";

export const ProfileCA = () => {
  let user = Meteor.users.findOne({ id: Meteor.userId() });
  console.log(user);

  return (
    <Fragment>
      <div id="profile">
        <div
          style={{
            position: "fixed",
            width: "80px",
            height: "50px",
            right: "120px",
            top: "36px",
          }}
        >
          <p id="div_username"></p>
        </div>
        <h1 className="blue"> Inserir tabela de jogos (.csv)</h1>
        <div id="fileinput">
          <FileInput></FileInput>
        </div>

        <div id="listaJogosSemArbitro" hidden>
          <ListaJogosSemArbitros></ListaJogosSemArbitros>
        </div>

        <div id="page-wrap-ca"></div>
      </div>
    </Fragment>
  );
};
