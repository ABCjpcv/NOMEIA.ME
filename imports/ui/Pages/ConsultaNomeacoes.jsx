import React from "react";
import { useNavigate } from "react-router-dom";
import { ConsultaTotal } from "./ConsultaTotal";

export const ConsultaNomeacoes = () => {




  let navigate = useNavigate();
  // let nomeacoesFiltradas = this.props.nomeacoes.filter(
  //   (nomeacao) => {
  //       return nomeacao.nome.toLowerCase().indexOf(this.state.search.toLowerCase()) !== -1;
  //   }
  // );

  return (

    

    <div>
      <h1 className="blue"> Nomeações Semanais: </h1>
      <div>
        <button onClick={() => navigate("/")}>HomePage 🏠</button>
        
      </div>
      <div id="consulta">
      <ConsultaTotal></ConsultaTotal>
      </div>
      {/* <div id="consultaFiltrada">
      <ul>
        {nomeacoesFiltradas.map((nomeacao)=>{
          return <Nomeacao nomeacao={nomeacao} key={nomeacao.id}/>
        })}
      </ul>
      </div> */}
    </div>
  );
};

