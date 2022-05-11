import { Meteor } from "meteor/meteor";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Autenticar() {
  let navigate = useNavigate();

  return (
    <div>
      <h1>Autenticar: </h1>
      <div>
        Email: <input type={"text"} id="eemail"></input>
        <p></p>
        Password: <input type={"password"} id="ppass"></input>
        <p></p>
        <button
          onClick={() =>
            Meteor.call(
              "authenticateUser",
              document.getElementById("eemail").value,
              document.getElementById("ppass").value,
              (err, result) => {
                if (err) {
                  //Fazer aparecer mensagem de texto de credenciais erradas.
                }
                else if(result){
                Meteor.call("readCsv", "Livro1.csv");
                navigate("/Profile");
                Meteor.loggingIn();
                }
              }
            )
          }
        >
          Autenticar
        </button>
        <p></p>
        Ainda não tem conta?
        <br></br>
        <button onClick={() => navigate("/ContaNova")}>
          Criar Conta Nova
        </button>
      </div>
    </div>
  );
}
