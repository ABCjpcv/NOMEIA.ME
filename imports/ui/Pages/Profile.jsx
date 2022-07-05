import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import "./app.css";

import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";

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
