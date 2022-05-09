import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import {Home} from './Pages/Home.jsx';
import {About} from './Pages/About.jsx';
import {ConsultaNomeacoes}  from './Pages/ConsultaNomeacoes.jsx';
import {Indisponibilidades}  from './Pages/Indisponibilidades.jsx';
import {Restricoes} from './Pages/Restricoes.jsx';
import {ContaNova} from './Pages/ContaNova.jsx';
import {Autenticar} from './Pages/Autenticar.jsx';
import { Profile } from './Pages/Profile.jsx';


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
          <Route path='/Profile' element={<Profile/>}></Route>
        </Routes>
      </Router>
    </div>
  </div>
);
