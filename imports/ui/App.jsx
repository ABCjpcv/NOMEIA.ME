import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "../ui/Pages/app.css"

import { Home } from "./Pages/Home.jsx";
import { Sobre } from "./Pages/Sobre.jsx";
import { ConsultaNomeacoes } from "./Pages/ConsultaNomeacoes.jsx";
import { Indisponibilidades } from "./Pages/Indisponibilidades.jsx";
import { Restricoes } from "./Pages/Restricoes.jsx";
import { ContaNova } from "./Pages/ContaNova.jsx";
import { Autenticar } from "./Pages/Autenticar.jsx";
import { Profile } from "./Pages/Profile.jsx";
import { EscolhaArbitros } from "./Pages/EscolhaArbitros.jsx";
import { NotFoundPage } from "./Pages/NotFoundPage.jsx";

import {Header} from "./Header";

export const App = () => (

    <Router>
    <Header></Header>
    <div style={{ textAlign: "center", backgroundColor: "#b9b7b7"}} onClick={ ()=> {document.getElementById("react-burger-cross-btn").tabIndex=-1}}>
      
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
          <Route path="/EscolhaArbitros" element={<EscolhaArbitros />}></Route>
          {/* <Route path="*" element={<NotFoundPage />}></Route> */}
        </Routes>
      
    </div>
    </Router>

);
