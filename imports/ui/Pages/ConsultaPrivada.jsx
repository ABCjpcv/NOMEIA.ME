import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from '../../../node_modules/event-utils'

export class ConsultaPrivada extends React.Component {

  render() {
    return (
      
      <div className='demo-app' style={{height: "10%", width: '915px', float: 'right'}}>
        {this.renderSidebar()}
        <div >
            <div className='demo-app-main' style={{overflow: "auto"}}>
                <p></p>
                <p></p>
                AQUI VAI ESTAR A TABELA COM LISTA DE NOMEAÇÕES SEMANAIS
            </div>
      </div>
      </div>
    )
  }

  renderSidebar() {
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2> As minhas nomeações 📅🏐</h2>
          <ul style={{textAlign: "left"}}>
            <li>Bem vindo ao teu perfil. Clica na barra lateral para visualizar mais opções! </li>
            <li>Aqui encontram-se as suas nomeações semanais:</li>
          </ul>
        </div>
      </div>
    )
  }

}