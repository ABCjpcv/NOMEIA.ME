import React from "react";
import FullCalendar, { formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { INITIAL_EVENTS, createEventId } from '../../../node_modules/event-utils';

export const Indisponibilidades = () => {

  let state = {
    weekendsVisible: true,
    currentEvents: []
  }
    return (
      <div className='demo-app'>
        {renderSidebar()}
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'anterior,seguinte hoje',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='timeGridWeek'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={state.weekendsVisible}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={handleDateSelect()}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick()}
            eventsSet={handleEvents()} // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
    )

  function renderSidebar(){
    return (
      <div className='demo-app-sidebar'>
        <div className='demo-app-sidebar-section'>
          <h2>Instruções</h2>
          <ul>
            <li>Seleciona os horários conforme se encontra indisponível: Select dates and you will be prompted to create a new event</li>
            <li> Arraste e ajuste o tamanho das indisponibilidade</li>
            <li> Clique numa indisponibilidade para apagar a mesma </li>
            <button> Guardar indisponibilidades </button>
          </ul>
        </div>
        <div className='demo-app-sidebar-section'>
          
        </div>
        <div className='demo-app-sidebar-section'>
          <h2>All Events ({state.currentEvents.length})</h2>
          <ul>
            {state.currentEvents.map(renderSidebarEvent)}
          </ul>
        </div>
      </div>
    )
  

  function handleDateSelect (selectInfo) {
    let title = "Indisponível" 
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
  }

  handleEventClick = (clickInfo) => {
    
      clickInfo.event.remove()
    
  }

  handleEvents = (events) => {
    state.currentEvents = events;
  }

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  )
}
}
}
