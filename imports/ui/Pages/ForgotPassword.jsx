import { mergeEventStores } from "@fullcalendar/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Meteor } from "meteor/meteor";
import { message } from "antd";

export function ForgotPassword() {
  let navigate = useNavigate();

  return (
    <div>
      <h1 className="blue"> Definir password nova:</h1>

      <div
        style={{
          margin: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="input">
          <label className="labels">Email</label>
          <input className="inputt" type={"email"} id="emailPerdido"></input>
        </div>
        <br></br>
        <button
          className="botao"
          onClick={() =>
            Meteor.call(
              "esqueceuPassword",
              document.getElementById("emailPerdido").value,

              (err, result) => {
                console.log("ENTRASTE pota ????");
                if (!err) {
                  console.log("ENTRASTE????");
                  if (result) {
                    message.success("Email enviado com sucesso!");
                    message.info(
                      "Verifique a sua nova password na sua conta de email."
                    );

                    navigate("/Autenticar");
                  }
                }
              }
            )
          }
        >
          Enviar mail
        </button>
        Já tem conta?
        <button className="botao" onClick={() => navigate("/Autenticar")}>
          Autenticar
        </button>
      </div>
    </div>
  );
}
