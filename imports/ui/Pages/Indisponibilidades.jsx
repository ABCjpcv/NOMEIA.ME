import React from "react";
import { Meteor } from "meteor/meteor";
import FullCalendar, {
  CalendarApi,
  EventSourceApi,
  eventTupleToStore,
  formatDate,
  isValidDate,
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
      <div>
        <div className="demo-app-main" style={{ overflow: "auto" }}>
          <form>
            <div>
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
            <input
              className="botao"
              type={"button"}
              value="Submeter"
              onClick={() => {
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
                        "Indisponibilidades registadas " +
                          Meteor.user().username
                      );
                    }
                  }
                );
              }}
            />
          </form>
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

    let newStart = new Date(selectInfo.start);

    let newEnd = new Date(selectInfo.end);

    let r = this.validDate(this.state.currentEvents, newStart, newEnd, hoje);

    if (r) {
      this.calendarApi.addEvent({
        id: _(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        color: "#eb3434",
      });
    } else {
      window.alert(
         Meteor.user().username + ", já possui indisponibilidades marcadas nesse intervalo."
      );
    }
  };

  validDate(eventsArray, newStart, newEnd, hoje) {
    let resultado = true;
    for (var element of eventsArray) {
      if (newStart < hoje) return false;
      if (newStart < element.start) {
        if (newEnd < element.start) {
          resultado = true;
        } else {
          resultado = false;
          break;
        }
      } else if (newStart > element.end) {
        resultado = true;
      } else {
        resultado = false;
        break;
      }
    }
    return resultado;
  }

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
