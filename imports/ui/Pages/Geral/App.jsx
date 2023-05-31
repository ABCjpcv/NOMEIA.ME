import React from "react";
import { Meteor } from "meteor/meteor";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate, Outlet } from "react-router";
import { useEffect, useState } from 'react';

import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import "../../Pages/app.css";

import { Navbar } from "./Navbar.jsx";
import { Sobre } from "../NaoAutenticado/Sobre.jsx";
import { ConsultaNomeacoes } from "../NaoAutenticado/ConsultaNomeacoes.jsx";
import { Calendario } from "../Arbitros/Calendario.jsx";
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
import { Cev } from "../Arbitros/CA/AtribuirJogos/Cev";
import { JogosPassados } from "../Arbitros/JogosPassados";
import { JogosPassadosCA } from "../Arbitros/CA/JogosPassadosCA";

import { useTracker } from "meteor/react-meteor-data";
import { EditarConta } from "../Arbitros/CA/EditarConta";
import { Adesl } from "../Arbitros/CA/AtribuirJogos/Adesl";
import { CampeonatoRegionalNacional } from "../Arbitros/CA/AtribuirJogos/CampeonatoRegionalNacional";
import { GestaoPagamentos } from "../Arbitros/GestaoPagamentos";

const { Link } = require("react-router-dom");

const antIcon = (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "fit-content",
        }}
    >
        <LoadingOutlined
            style={{
                fontSize: "24px",
                justifyContent: "center",
            }}
            spin
        />
        <br></br>
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: "fit-content",
            }}
        >
            <span
                style={{ display: "flex", width: "fit-content", whiteSpace: "nowrap" }}
            >
                {" "}
                A carregar...{" "}
            </span>
        </div>
    </div>
);

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
      <div style={{ width: "100%", height: "1%" }}></div>
      <div
        style={{ textAlign: "center" }}
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
              path="Profile/Calendario"
              element={<Calendario user={user} />}
            ></Route>
            <Route
              path="Profile/Relacoes"
              element={<Restricoes user={user} />}
            ></Route>
            <Route
              path="Profile/Definicoes"
              element={<UserSettings user={user} />}
            ></Route>

            <Route
              path="Profile/Jogos_Passados"
              element={<JogosPassados user={user} />}
                      ></Route>

                      <Route path="Profile/Gestao_Pagamentos" element={<GestaoPagamentos user={user} />}></Route>

            <Route path="ProfileCA" element={<ProfileCA user={user} />}></Route>
            <Route
              path="ProfileCA/Calendario"
              element={<Calendario user={user} />}
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
              path="ProfileCA/Remover_Arbitro"
              element={<EditarConta user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Carregar_Novos_Jogos"
              element={<FileInput user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Atribuir_Arbitros/ADESL"
              element={<Adesl user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Atribuir_Arbitros/CEV"
              element={<Cev user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Atribuir_Arbitros/CR_CN"
              element={<CampeonatoRegionalNacional user={user} />}
            ></Route>
            <Route
              path="ProfileCA/Jogos_Passados"
              element={<JogosPassadosCA user={user} />}
                      ></Route>
                      <Route path="ProfileCA/Gestao_Pagamentos" element={<GestaoPagamentos user={user} />}></Route>
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
    const [auth, setAuth] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await new Promise(resolve => setTimeout(resolve, 3000)); // Atraso de 1 segundo

            const user = Meteor.user(); // Determine se está autorizado, a partir do contexto ou de qualquer outra forma que esteja utilizando
            setAuth(user);
            setIsLoading(false);
        };

        fetchData();

        return () => {
            // Limpar algo, se necessário
        };
    }, []);

    if (isLoading) {
        // Retorna null ou um componente vazio enquanto o valor de auth está sendo buscado
        return (
            <Spin
                style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "15%",
                }}
                indicator={antIcon}
            />
        );
    }

    // Se autorizado, retorna um outlet que irá renderizar os elementos filhos
    // Se não autorizado, retorna um elemento que irá navegar para a página de login
    return auth ? <Outlet /> : <Navigate to="/Autenticar" />;
};








