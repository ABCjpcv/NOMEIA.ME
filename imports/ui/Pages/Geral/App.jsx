import React from "react";
import { Meteor } from "meteor/meteor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate, Outlet } from "react-router";

import "../../Pages/app.css";

import { Navbar } from "./Navbar.jsx";
import { Sobre } from "./Sobre.jsx";
import { ConsultaNomeacoes } from "../NaoAutenticado/ConsultaNomeacoes.jsx";
import { Indisponibilidades } from "../Arbitros/Indisponibilidades.jsx";
import { Restricoes } from "../Arbitros/Restricoes.jsx";
import { ContaNova } from "../Arbitros/CA/ContaNova.jsx";
import { Autenticar } from "../NaoAutenticado/Autenticar.jsx";
import { Profile } from "../Arbitros/Profile.jsx";
import { Clubes_da_AVL } from "../NaoAutenticado/Clubes_da_AVL.jsx";
import { ForgotPassword } from "../NaoAutenticado/ForgotPassword.jsx";
import { NotFoundPage } from "./NotFoundPage.jsx";
import { Header } from "./Header";
import { ProfileCA } from "../Arbitros/CA/ProfileCA";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { UserSettings } from "../Arbitros/UserSettings";
import { FileInput } from "../Arbitros/CA/FileInput";
import { AtribuirJogos } from "../Arbitros/CA/AtribuirJogos";

import { useTracker } from "meteor/react-meteor-data";

const { Link } = require("react-router-dom");

export const App = () => {
  const user = useTracker(() => Meteor.user());

  // function isAdmin(user) {
  //   Meteor.call("isAdmin", user, true, (err, result) => {
  //     if (result === 1) return true;
  //     else if (result === 0) return false;
  //   });
  // }

  return (
    <Router>
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
          <Route path="/" element={<Navbar />}></Route>
          <Route path="/sobre" element={<Sobre />}></Route>
          <Route
            path="/ConsultaNomeacoes"
            element={<ConsultaNomeacoes />}
          ></Route>
          <Route
            path="/Autenticar"
            element={<Autenticar user={user} />}
          ></Route>
          <Route path="/Clubes_da_AVL" element={<Clubes_da_AVL />}></Route>
          <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
          <Route path="*" element={<NotFoundPage />}></Route>

          {/* COM PROTECTED ROUTES */}
          <Route exact path="/Conta" element={<ProtectedRoute />}>
            <Route path="Profile" element={<Profile user={user} />}></Route>
            <Route
              path="Profile/Indisponibilidades"
              element={<Indisponibilidades user={user} />}
            ></Route>
            <Route
              path="Profile/Relacoes"
              element={<Restricoes user={user} />}
            ></Route>
            <Route
              path="Profile/Definicoes"
              element={<UserSettings user={user} />}
            ></Route>

            <Route path="ProfileCA" element={<ProfileCA user={user} />}></Route>
            <Route
              path="ProfileCA/Indisponibilidades"
              element={<Indisponibilidades user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Relacoes"
              element={<Restricoes user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Definicoes"
              element={<UserSettings user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Criar_Arbitro"
              element={<ContaNova user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Carregar_Novos_Jogos"
              element={<FileInput user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Atribuir_Arbitros"
              element={<AtribuirJogos user={user} />}
            ></Route>
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export const ProtectedRoute = ({
  component: Comp,
  loggedIn,
  path,
  ...rest
}) => {
  const auth = Meteor.user(); // determine if authorized, from context or however you're doing it

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return auth ? <Outlet /> : <Navigate to="/Autenticar" />;
};

{
  /* EH NECESSARIO SER ARBITRO
          <Route
            path="Profile"
            element={
              <ProtectedRoutes
                user={Meteor.user()}
                allowed={!isAdmin(Meteor.user())}
                redirectPath="/"
              >
                <Profile user={Meteor.user()} />
              </ProtectedRoutes>
            }
          >
            <Route
              path="/Profile/Indisponibilidades"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={!isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <Indisponibilidades user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/Profile/Relacoes"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={!isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <Restricoes user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/Profile/Definicoes"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={!isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <UserSettings user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            {/* EH NECESSARIO SER CONSELHO DE ARBITRAGEM 

            <Route
              path="/ProfileCA"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <ProfileCA user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/ProfileCA/Carregar_Novos_Jogos"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <FileInput user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/ProfileCA/Atribuir_Arbitros"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <AtribuirJogos user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/ProfileCA/Criar_Arbitro"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <ContaNova user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/ProfileCA/Indisponibilidades"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <Indisponibilidades user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/ProfileCA/Relacoes"
              element={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <Restricoes user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route>

            <Route
              path="/ProfileCA/Definicoes"
              elelement={
                <ProtectedRoutes
                  user={Meteor.user()}
                  allowed={isAdmin(Meteor.user())}
                  redirectPath="/"
                >
                  <UserSettings user={Meteor.user()} />
                </ProtectedRoutes>
              }
            ></Route> 
          </Route>*/
}
