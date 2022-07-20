import React, { Fragment } from "react";
import { Meteor } from "meteor/meteor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../ui/Pages/app.css";

import { Home } from "./Pages/Home.jsx";
import { Sobre } from "./Pages/Sobre.jsx";
import { ConsultaNomeacoes } from "./Pages/ConsultaNomeacoes.jsx";
import { Indisponibilidades } from "./Pages/Indisponibilidades.jsx";
import { Restricoes } from "./Pages/Restricoes.jsx";
import { ContaNova } from "./Pages/ContaNova.jsx";
import { Autenticar } from "./Pages/Autenticar.jsx";
import { Profile } from "./Pages/Profile.jsx";
import { Clubes_da_AVL } from "./Pages/Clubes_da_AVL.jsx";
import { ForgotPassword } from "./Pages/ForgotPassword.jsx";
import { NotFoundPage } from "./Pages/NotFoundPage.jsx";

import { Header } from "./Header";
import { ProfileCA } from "./Pages/ProfileCA";

import { useTracker } from "meteor/react-meteor-data";
import { ProtectedRoutes } from "./Pages/ProtectedRoutes";
import { UserSettings } from "./Pages/UserSettings";
import { FileInput } from "./Pages/FileInput";
import { AtribuirJogos } from "./Pages/AtribuirJogos";

export const App = () => {
  //Track the current user in our application

  const [user, setUser] = React.useState(Meteor.user());

  const handleLogin = () => setUser(Meteor.user());

  const [isAdmin, setIsAdmin] = React.useState(
    Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
      if (result === 1) return true;
      else if (result === 0) return false;
    })
  );

  const handleLogout = () => setUser(null);

  return (
    <>
      <Router>
        <Header user={user} />
        <div
          style={{ textAlign: "center", backgroundColor: "#b9b7b7" }}
          onClick={() => {
            try {
              document.getElementById("react-burger-cross-btn").tabIndex = -1;
            } catch (error) {}
          }}
        >
          <Routes>
            {/* NAO EH NECESSARIO AUTORIZACOES */}
            <Route path="/" element={<Home />}></Route>
            <Route path="/sobre" element={<Sobre />}></Route>
            <Route
              path="/ConsultaNomeacoes"
              element={<ConsultaNomeacoes />}
            ></Route>
            <Route path="/Autenticar" element={<Autenticar />}></Route>
            <Route path="/Clubes_da_AVL" element={<Clubes_da_AVL />}></Route>
            <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
            <Route path="*" element={<NotFoundPage />}></Route>

            {/* EH NECESSARIO SER ARBITRO */}
            <Route
              path="Profile"
              element={
                <ProtectedRoutes
                  user={user}
                  allowed={!isAdmin}
                  redirectPath="/"
                >
                  <Profile user={user} />
                </ProtectedRoutes>
              }
            >
              <Route
                path="/Profile/Indisponibilidades"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={!isAdmin}
                    redirectPath="/"
                  >
                    <Indisponibilidades user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/Profile/Relacoes"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={!isAdmin}
                    redirectPath="/"
                  >
                    <Restricoes user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/Profile/Definicoes"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={!isAdmin}
                    redirectPath="/"
                  >
                    <UserSettings user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              {/* EH NECESSARIO SER CONSELHO DE ARBITRAGEM*/}

              <Route
                path="/ProfileCA"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={isAdmin}
                    redirectPath="/"
                  >
                    <ProfileCA user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/ProfileCA/Carregar_Novos_Jogos"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={isAdmin}
                    redirectPath="/"
                  >
                    <FileInput user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/ProfileCA/Atribuir_Arbitros"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={isAdmin}
                    redirectPath="/"
                  >
                    <AtribuirJogos user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/ProfileCA/Criar_Arbitro"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={isAdmin}
                    redirectPath="/"
                  >
                    <ContaNova user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/ProfileCA/Indisponibilidades"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={isAdmin}
                    redirectPath="/"
                  >
                    <Indisponibilidades user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/ProfileCA/Relacoes"
                element={
                  <ProtectedRoutes
                    user={user}
                    allowed={isAdmin}
                    redirectPath="/"
                  >
                    <Restricoes user={user} />
                  </ProtectedRoutes>
                }
              ></Route>

              <Route
                path="/ProfileCA/Definicoes"
                elelement={
                  <ProtectedRoutes
                    user={user}
                    allowed={isAdmin}
                    redirectPath="/"
                  >
                    <UserSettings user={user} />
                  </ProtectedRoutes>
                }
              ></Route>
            </Route>
          </Routes>
        </div>
      </Router>
    </>
  );
};
