import React from "react";
import { useNavigate } from "react-router-dom";

export function ContaNova(){

    let navigate = useNavigate();
    
    return <div> <h1>Criar Conta Nova </h1>
    <div>
        Nome: <input type={"text"}></input><p></p>
        Email: <input type={"text"}></input><p></p>
        Password: <input type={"text"}></input><p></p>
        Repetir Password: <input type={"text"}></input><p></p>
        <button onClick={()=> navigate("/Profile")}> Registar </button>
        <p></p>
        Já tem conta? <button onClick={()=> navigate("/Autenticar")}>Autenticar</button>
        
    </div>
    </div>
}