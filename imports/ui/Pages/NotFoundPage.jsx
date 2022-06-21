import React from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {

  
  
    return (

      <div>
        <h1 className="blue"> 404 - Página Não Encontrada</h1>
        <div>
          <div className="botao">
            <Link to="/">
            Voltar à página inicial</Link>
          </div>
        </div>
      </div>
    );
  }

