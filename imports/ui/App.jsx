import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import {Home} from './Pages/Home.js';
import {About} from './Pages/About.js';
import {ConsultaNomeacoes}  from './Pages/ConsultaNomeacoes.js';
import {Indisponibilidades}  from './Pages/Indisponibilidades.js';
import {Restricoes} from './Pages/Restricoes.js';
import {ContaNova} from './Pages/ContaNova.js';
import {Autenticar} from './Pages/Autenticar.js';


export const App = () => (

  <div>
    <div style={{height: "50px", textAlign: "center"}}>
      <img src={'/logo.PNG'}/>
      Nomeia.Me - Plataforma Online de Nomeações de Árbitros de Voleibol
    </div>
    <div style={{textAlign: "center"}}>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/about' element={<About/>}></Route>
          <Route path='/ConsultaNomeacoes' element={<ConsultaNomeacoes/>}></Route>
          <Route path='/Indisponibilidades' element={<Indisponibilidades/>}></Route>
          <Route path='/Restricoes' element={<Restricoes/>}></Route>
          <Route path='/ContaNova' element={<ContaNova/>}></Route>
          <Route path='/Autenticar' element={<Autenticar/>}></Route>
        </Routes>
      </Router>
    </div>
  </div>
);
