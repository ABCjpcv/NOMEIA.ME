import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./app.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";
import { FileInput } from "./FileInput";
import { ListaJogosSemArbitros } from "./ListaJogosSemArbitros";
import { AtribuirJogos } from "./AtribuirJogos";

export function Profile() {
  let navigate = useNavigate();

  let user;

  function changeUsernameStatus() {
    try {
      user = Meteor.user?.();
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

  let adminRights = false;

  function isAdmin(user){
    return new Promise((resolve,reject)=>{
        //here our function should be implemented 
        setTimeout(()=>{
          Meteor.call("isAdmin", user, (err, result) => {
            if (err) {
              console.log("ERRRRROOOOO", { err });
            } else if (result) {
              adminRights = result;
            }
          });
            resolve();
        ;} , 5000
        );
    });
}

async function caller(){
    await isAdmin(Meteor.user?.());
    console.log("After waiting" + adminRights);
    return adminRights;
}


  if (!changeUsernameStatus()) {
    /**
     *  CASO O UTILIZADOR SEJA CONSELHO DE ARBITRAGEM (ADMIN)
     */

//     if (caller) {
//       return (
//         <div id="profile">
//           <div id="carregarFicheiroJogos">
//             <h1 className="blue"> Inserir tabela de jogos (excel ou csv) </h1>
//           <div>
//             <FileInput></FileInput>
//           </div>
//           </div>

//           <div id="atribuirArbitrosAjogos" hidden>
//             <AtribuirJogos></AtribuirJogos>

//           </div>

//           <div id="indisponibilidadesCA" hidden>
//               <Indisponibilidades></Indisponibilidades>
//             </div>

//             <div id="restricoesCA" hidden>
//               <Restricoes></Restricoes>
//             </div>

//             <div id="consultaPrivadaCA" hidden>
//               <ConsultaPrivada></ConsultaPrivada>
// </div>



//           {/* <div id="listaJogosSemArbitro" hidden>
//             <ListaJogosSemArbitros></ListaJogosSemArbitros>
//           </div> */}

//           <div id="page-wrap-ca"></div>
//         </div>
//       );
//     } else {
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

              <div id="page-wrap"></div>
            </div>
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
