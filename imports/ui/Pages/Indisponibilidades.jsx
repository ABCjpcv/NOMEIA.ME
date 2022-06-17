import React from "react";
import { Meteor } from "meteor/meteor";
import FullCalendar, {
  CalendarApi,
  EventSourceApi,
  eventTupleToStore,
  formatDate,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import _ from "lodash.uniqueid";

export class Indisponibilidades extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvents: [],
      loaded: false,
      resultado: [],
    };
  }

  componentDidMount() {
    if (!this.state.loaded) {
      this.loadData();
    }
  }

  render() {
    const _ = require("lodash");

    const { loaded, resultado } = this.state;
    if (!loaded) {
      return "";
    }

    return (
      <div
        className="demo-app"
        style={{ height: "10%", width: "auto", height: "auto" }}
      >
        <div className="demo-app-sidebar">
          <div className="demo-app-sidebar-section" hidden>
            <h2>
              Indisponibilidades marcadas: ({this.state.currentEvents.length})
            </h2>
            <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
          </div>
        </div>
        <div>
          <div className="demo-app-main" style={{}}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              locale="pt"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              allDaySlot={false}
              height={"350px"}
              dayMinWidth={"8px"}
              firstDay={1}
              slotDuration={"00:60:00"}
              slotMinTime={"09:00:00"}
              slotMaxTime={"23:00:00"}
              initialView="timeGridWeek"
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              initialEvents={resultado} // Indisponibilidades da BD
              select={this.handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={this.handleEventClick}
              eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            />
          </div>
          <br></br>
          <input
            className="botao"
            type={"button"}
            value="Submeter"
            onClick={() => {
              console.log("OLA OLA");

              let curr = this.state.currentEvents;
              let eventos = [];
              curr.map((evento) =>
                eventos.push({
                  id: evento.id,
                  start: evento.startStr,
                  end: evento.endStr,
                })
              );

              Meteor.call(
                "addIndisponibilidade",
                Meteor.user().username,
                eventos,
                (err, result) => {
                  if (err) {
                    //Fazer aparecer mensagem de texto de credenciais erradas.
                    console.log(err);
                  } else if (result) {
                    window.alert(
                      "Indisponibilidades registadas " + Meteor.user().username
                    );
                  }
                }
              );
            }}
          />
        </div>
      </div>
    );
  }

  loadData() {
    // Verifica se o utilizador loggado tem indisponibilidades guardadas na bd
    Meteor.call("carregaHorario", Meteor.user?.()?.username, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", { err });
      } else if (result) {
        let r = result.disponibilidades;
        const { state: currentState } = this;
        const newState = { ...currentState, resultado: r, loaded: true };
        this.setState(newState);
      }
    });
  }

  handleDateSelect = (selectInfo) => {
    let title = " Indisponível ";
    this.calendarApi = selectInfo.view.calendar;

    this.calendarApi.unselect(); // clear date selection

    let hoje = new Date();
    let ano = (selectInfo.startStr + "").substring(0, 4);
    let mes = (selectInfo.startStr + "").substring(5, 7);
    let dia = (selectInfo.startStr + "").substring(8, 10);
    let horaInicio = (selectInfo.startStr + "").substring(11, 13);
    let diaIndisponivel = new Date(ano, mes - 1, dia, horaInicio, 0, 0, 0);

    if (diaIndisponivel > hoje) {
      this.calendarApi.addEvent({
        id: _(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        color: "#eb3434"
      });
    }
  };

  handleEventClick = (clickInfo) => {
    clickInfo.event.remove();
  };

  handleEvents = (events) => {
    this.setState({
      currentEvents: events,
    });
  };
}

function renderEventContent(eventInfo) {
  return (
    <React.Fragment key={eventInfo.timeText}>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </React.Fragment>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.start}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <p></p>
      <b>
        <i>{event.title}</i>
      </b>
    </li>
  );
}
