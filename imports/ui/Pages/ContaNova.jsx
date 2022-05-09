import { mergeEventStores } from "@fullcalendar/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import {Meteor} from "meteor/meteor";

export function ContaNova(){

    let navigate = useNavigate();
    
    return <div> <h1>Criar Conta Nova </h1>
    <div>
        Nome: <input type={"text"} id="nome"></input><p></p>
        Email: <input type={"text"} id="email"></input><p></p>
        Password: <input type={"text"} id="pass"></input><p></p>
        Repetir Password: <input type={"text"} id="pass2"></input><p></p>
        <button onClick={()=>
            Meteor.call("registerUser",document.getElementById("nome").value, document.getElementById("email").value, document.getElementById("pass").value, document.getElementById("pass2").value,(err,result) =>{
                navigate("/Profile")
            })}> Registar </button>
        <p></p>
        Já tem conta? <button onClick={()=> navigate("/Autenticar")}>Autenticar</button>
        
    </div>
    </div>
}