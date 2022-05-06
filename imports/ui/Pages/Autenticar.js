import { mergeEventStores } from "@fullcalendar/react";
import {Meteor} from "meteor/meteor";
import React from "react";
import { useNavigate } from "react-router-dom";

export function Autenticar(){

    let navigate = useNavigate();
    
    return <div> <h1>Autenticar: </h1>
    <div>
        Email: <input type={"text"}></input><p></p>
        Password: <input type={"text"}></input><p></p>
        <button onClick={()=> 
            Meteor.call("authenticateUser",email,password,(err,result) =>{
                if(err){
                    //Fazer aparecer mensagem de texto de credenciais erradas.
                }
                navigate("/Profile")
            })
            }> Autenticar </button>
        <p></p>
        Ainda não tem conta? <button onClick={()=> navigate("/ContaNova")}> Criar Conta Nova</button>
        
    </div>
    </div>
    }