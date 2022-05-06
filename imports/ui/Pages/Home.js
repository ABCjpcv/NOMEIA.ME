import React from "react";
import { useNavigate } from "react-router-dom";

export function Home(){

    let navigate = useNavigate();
    
    return <div><h1>Bem-vindo</h1><div>
    <button onClick={()=> navigate("/ConsultaNomeacoes")}>Consulta de Nomeações</button><p></p>
    <button onClick={()=> navigate("/ContaNova")}>Criar Conta Nova</button><p></p>
    <button onClick={()=> navigate("/Autenticar")}>Autenticar</button>
    </div>
    </div>
}