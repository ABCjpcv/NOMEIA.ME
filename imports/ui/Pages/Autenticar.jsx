import { Meteor } from "meteor/meteor";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Autenticar() {
  let navigate = useNavigate();

   function mostraPerfil() {
    document.getElementById("titulo").hidden = true;
   // document.getElementById("carregarJogos").hidden = true;
   // document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = false;
    document.getElementById("menuPrivadoCA").hidden = true;
          // document.getElementById("carregarFicheiroJogos").hidden = true;
          // document.getElementById("atribuirArbitrosAjogos").hidden = true;
          // document.getElementById("indisponibilidadesCA").hidden = true;
    //document.getElementById("restricoesCA").hidden = true;
    //document.getElementById("consultaPrivadaCA").hidden = true;
          //  document.getElementById("indisponibilidades").hidden = true;
          //  document.getElementById("restricoes").hidden = true;
          //  document.getElementById("consultaPrivada").hidden = false;
  }

  function mostraPerfilCA() {
    document.getElementById("titulo").hidden = true;
    document.getElementById("atribuirArbitros").hidden = true;
    document.getElementById("nomeacoesPrivadas").hidden = false;
    document.getElementById("indisponibilidadePrivadas").hidden = true;
    document.getElementById("restricoesPrivadas").hidden = true;
    document.getElementById("menuPrivado").hidden = true;
    document.getElementById("menuPrivadoCA").hidden = false;
          // document.getElementById("carregarFicheiroJogos").hidden = false;
          // document.getElementById("atribuirArbitrosAjogos").hidden = true;
          // document.getElementById("indisponibilidadesCA").hidden = true;
          // document.getElementById("restricoesCA").hidden = true;
          // document.getElementById("consultaPrivadaCA").hidden = true;
   // document.getElementById("indisponibilidades").hidden = true;
    // document.getElementById("restricoes").hidden = true;
   // document.getElementById("consultaPrivada").hidden = true;
  }

  function login(result, pass) {
    if (Meteor.user() != undefined) {
      //console.log("current user: " + Meteor.user().username);
      Meteor.logout();
    } else {
     // console.log("Não há user");
    }

    Meteor.loginWithPassword(result, pass, () => {
      
      Meteor.call("isAdmin", Meteor.user(), (err, result) => {

        console.log(result);

        if (err) {
          console.log("ERRRRROOOOO", { err });
          
        } else if (result) {
            console.log("vou mostrar Perfil do CA");
            navigate("/ProfileCA");
            mostraPerfilCA();
            
          }
          else if(!result){
            console.log("vou mostrar Perfil do Arbitro");
           navigate("/Profile"); 
           mostraPerfil();
            
        }
      })
    });
  }

  return (
    <div>
      <h1 className="blue"> Autenticar: </h1>
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
          <input className="inputt" type={"email"} id="eemail"></input>
        </div>
        <p></p>
        <div className="input">
          <label className="labels">Password*</label>
          <input className="inputt" type={"password"} id="ppass"></input>
        </div>
        <p></p>
        <button
          className="botao"
          onClick={() =>
            Meteor.call(
              // faz a verificacao dos parametros e se o user existe ou não
              "authenticateUser",
              document.getElementById("eemail").value,
              document.getElementById("ppass").value,

              (err, result) => {
                if (err) {
                  //Fazer aparecer mensagem de texto de credenciais erradas.
                  console.log(err);
                } else if (result) {
                  // trata do login deste user
                  pass = document.getElementById("ppass").value;
                  login(result, pass);
                }
              }
            )
          }
        >
          Autenticar
        </button>
        <p></p>
        <div className="input">
          <label>Ainda não tem conta?</label>
          <button className="botao" onClick={() => navigate("/ContaNova")}>
            Criar Conta Nova
          </button>
        </div>
      </div>
    </div>
  );
}
