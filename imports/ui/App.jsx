import React, { Fragment } from "react";
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

export const App = () => {
  //Track the current user in our application
  const user = useTracker(() => Meteor.user());

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
            <Route path="/" element={<Home />}></Route>
            <Route path="/sobre" element={<Sobre />}></Route>
            <Route
              path="/ConsultaNomeacoes"
              element={<ConsultaNomeacoes />}
            ></Route>
            <Route path="/Autenticar" element={<Autenticar />}></Route>

            <Route element={<ProtectedRoutes user={user} />}>
              <Route path="/Profile" element={<Profile user={user} />}></Route>
              <Route
                path="/ProfileCA"
                element={<ProfileCA user={user} />}
              ></Route>
            </Route>

            <Route path="/Clubes_da_AVL" element={<Clubes_da_AVL />}></Route>
            <Route path="/ForgotPassword" element={<ForgotPassword />}></Route>
            <Route path="*" element={<NotFoundPage />}></Route>
          </Routes>
        </div>
      </Router>
    </>
  );
};
