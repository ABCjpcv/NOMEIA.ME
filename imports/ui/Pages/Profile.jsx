import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";
import SideBar from "./sidebar";
import { Fragment } from "react/cjs/react.production.min";
import { Indisponibilidades } from "./Indisponibilidades";
import { Restricoes } from "./Restricoes";
import { ConsultaPrivada } from "./ConsultaPrivada";

export const Profile = () => {
    return (
        <Fragment>
    <div id="profile">
    <SideBar pageWrapId={"page-wrap"} outerContainerId={"App"} />

        <div id="indisponibilidades" hidden>
            <Indisponibilidades></Indisponibilidades>
        </div>

        <div id="restricoes" hidden>
            <Restricoes></Restricoes>
        </div>

        <div id="consultaPrivada">
            <ConsultaPrivada></ConsultaPrivada>
            
                
                <div id="page-wrap">
                    
                </div>
        </div>
      
    </div>
    </Fragment>
    )
}