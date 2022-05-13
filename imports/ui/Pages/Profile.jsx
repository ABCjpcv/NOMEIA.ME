import React from 'react'; 
import ReactDOM from "react-dom";
import {Meteor} from "meteor/meteor"

import "./styles.css";
import SideBar from "./sidebar";
import { Fragment } from "react/cjs/react.production.min";
import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";




export const Profile = () => {

    let user = Meteor.users.findOne({ id: Meteor.userId()});
    console.log(user);
    let username = user.username;

    
            
        return (
            <Fragment>
            <div id="profile">
                <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />
                <div  style={{position: "fixed", width: "80px", height: "50px", right: "120px", top: "36px"}}>
                    <p id="div_username"></p>
                    </div>
                
    
                <div id="indisponibilidades" hidden>
                <Indisponibilidades></Indisponibilidades>
                </div>
    
                <div id="restricoes" hidden>
                <Restricoes></Restricoes>
                </div>
    
                <div id="consultaPrivada">
                <ConsultaPrivada></ConsultaPrivada>
    
                <div id="page-wrap"></div>
                </div>
            </div>
            </Fragment>
        );
};
