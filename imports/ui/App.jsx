import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Home } from "./Pages/Home.jsx";
import { Sobre } from "./Pages/Sobre.jsx";
import { ConsultaNomeacoes } from "./Pages/ConsultaNomeacoes.jsx";
import { Indisponibilidades } from "./Pages/Indisponibilidades.jsx";
import { Restricoes } from "./Pages/Restricoes.jsx";
import { ContaNova } from "./Pages/ContaNova.jsx";
import { Autenticar } from "./Pages/Autenticar.jsx";
import { Profile } from "./Pages/Profile.jsx";

import "./Pages/app.css";
import { ProfileCA } from "./Pages/ProfileCA.jsx";
import { EscolhaArbitros } from "./Pages/EscolhaArbitros.jsx";

import {Header} from "./Header";

export const App = () => (
  <div>
    <Router>
    <Header></Header>
    <div style={{ textAlign: "center" }}>
      
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/sobre" element={<Sobre />}></Route>
          <Route
            path="/ConsultaNomeacoes"
            element={<ConsultaNomeacoes />}
          ></Route>
          <Route
            path="/Indisponibilidades"
            element={<Indisponibilidades />}
          ></Route>
          <Route path="/Restricoes" element={<Restricoes />}></Route>
          <Route path="/ContaNova" element={<ContaNova />}></Route>
          <Route path="/Autenticar" element={<Autenticar />}></Route>
          <Route path="/Profile" element={<Profile />}></Route>
          <Route path="/ProfileCA" element={<ProfileCA />}></Route>
          <Route path="/EscolhaArbitros" element={<EscolhaArbitros />}></Route>
        </Routes>
      
    </div>
    </Router>
  </div>
);
