import React from "react";
import { Meteor } from "meteor/meteor";
import FullCalendar, {
  CalendarApi,
  eventTupleToStore,
  formatDate,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  INITIAL_EVENTS,
  createEventId,
} from "../../../node_modules/event-utils";

export class Indisponibilidades extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
  };

  calendarApi;

  render() {
    function leitura(indis) {
      let aLer = indis;
      let lido = "";
      for (let index = 0; index < aLer.length; index++) {
        lido = lido + aLer[index].start + " " + aLer[index].end + " ";
        console.log(lido);
      }
      return lido;
    }

    return (
      <div
        className="demo-app"
        style={{ height: "10%", width: "auto", height: "auto" }}
      >
        {this.renderSidebar()}
        {this.loadData()}
        <div>
          <div className="demo-app-main" style={{ overflow: "auto" }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              locale="pt"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
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
              weekends={this.state.weekendsVisible}
              initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
              select={this.handleDateSelect}
              eventContent={renderEventContent} // custom render function
              eventClick={this.handleEventClick}
              eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
              eventAdd={function () {}}
              eventChange={function () {}}
              eventRemove={function () {}}
            />
          </div>
          <br></br>
          <input
            className="botao"
            type={"button"}
            value="Submeter"
            onClick={() => {
              Meteor.call(
                "addIndisponibilidade",
                Meteor.user().username,
                leitura(this.state.currentEvents),
                (err, result) => {
                  if (err) {
                    //Fazer aparecer mensagem de texto de credenciais erradas.
                    console.log(err);
                  } else if (result) {
                    this.loadData();
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

  renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section" hidden>
          <h2>
            Indisponibilidades marcadas: ({this.state.currentEvents.length})
          </h2>
          <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  }

  loadData() {
    let disponibilidades = "";

    // Verifica se o utilizador loggado tem indisponibilidades guardadas na bd
    Meteor.call("carregaHorario", Meteor.user().username, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO");
      } else if (result) {
        console.log("ENTRAS CARALHO????");
        let r = result.disponibilidades;
        console.log("r: " + r);
        if (r.toString().length > 1) {
          //MUDA MESES
          r = r
            .replaceAll("Jan", "01")
            .replaceAll("Fev", "02")
            .replaceAll("Mar", "03")
            .replaceAll("Abr", "04")
            .replaceAll("Mai", "05")
            .replaceAll("Jun", "06")
            .replaceAll("Jul", "07")
            .replaceAll("Ago", "08")
            .replaceAll("Sep", "09")
            .replaceAll("Out", "10")
            .replaceAll("Nov", "11")
            .replaceAll("Des", "12");

          //MUDA DIAS
          r = r
            .replaceAll("Mon", "")
            .replaceAll("Tue", "")
            .replaceAll("Wed", "")
            .replaceAll("Thu", "")
            .replaceAll("Fri", "")
            .replaceAll("Sat", "")
            .replaceAll("Sun", "");

          //MUDA UMA CENA
          r = r
            .replaceAll("\\(Hora de verão da Europa Ocidental\\)", "")
            .replaceAll("GMT", "");

          r = r.substring(1);
          var v = r.split(" ");

          var inicio = "";
          var fim = "";

          for (let index = 0; index < v.length; index += 14) {
            inicio =
              v[index + 2] +
              "-" +
              v[index] +
              "-" +
              v[index + 1] +
              "T" +
              v[index + 3] +
              "+01:00";
            fim =
              v[index + 9] +
              "-" +
              v[index + 7] +
              "-" +
              v[index + 8] +
              "T" +
              v[index + 10] +
              "+01:00";

            this.calendarApi.addEvent({
              title: "Indisponível",
              start: inicio,
              end: fim,
            });
          }
        }
      }
    });

    // Se sim, fazer ciclo para adicionar ao Calendário de novo programaticamante as indisponibilidades já submetidas

    console.log(disponibilidades);
  }

  handleDateSelect = (selectInfo) => {
    let title = "Indisponível";
    this.calendarApi = selectInfo.view.calendar;

    this.calendarApi.unselect(); // clear date selection

    let hoje = new Date();
    let ano = (selectInfo.startStr + "").substring(0, 4);
    let mes = (selectInfo.startStr + "").substring(5, 7);
    let dia = (selectInfo.startStr + "").substring(8, 10);
    let horaInicio = (selectInfo.startStr + "").substring(11, 13);
    let diaIndisponivel = new Date(ano, mes - 1, dia, horaInicio, 0, 0, 0);

    if (title) {
      //if (diaIndisponivel > hoje) {
        this.calendarApi.addEvent({
          title,
          start: selectInfo.startStr,
          end: selectInfo.endStr,
        });
     //   console.log(selectInfo.startStr);
      //  console.log(selectInfo.endStr);
      //}
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
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event) {
  return (
    <li key={event.id}>
      <b>
        {formatDate(event.start, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </b>
      <i>{event.title}</i>
    </li>
  );
}
