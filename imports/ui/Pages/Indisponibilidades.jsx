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

export class Indisponibilidades extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weekendsVisible: true,
      currentEvents: [],
      loaded: false,
      resultado: []
    };
  }

  componentDidMount() {
    this.loadData();
    console.log(this.state.resultado);
   
  }

  render() {
    // const pixa = loadData();

    // console.log("pixa:");
    // console.log(pixa);

    // console.log("PIXOTA");
    // console.log([{title: "CARALHO", start: "2022-06-18T10:00:00+01:00", end: "2022-06-18T14:00:00+01:00"},
    //              {title: "CARALHO DA TARDE", start: "2022-06-18T16:00:00+01:00", end: "2022-06-18T18:00:00+01:00"},
    //              {title: "CARALHO DA NOITE", start: "2022-06-18T18:00:00+01:00", end: "2022-06-18T20:00:00+01:00"}
    //             ]);

    function leitura(indis) {
      let aLer = indis;
      let lido = "";
      for (let index = 0; index < aLer.length; index++) {
        lido = lido + aLer[index].startStr + " " + aLer[index].endStr + " ";
      }
      return lido;
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
              initialEvents={ 
                
                this.state.resultado}

                // [{title: "EXEMPLO 1 ", start: "2022-06-18T10:00:00+01:00", end: "2022-06-18T14:00:00+01:00"},
                //  {title: "EXEMPLO 2 MAIS À TARDE DA TARDE", start: "2022-06-18T16:00:00+01:00", end: "2022-06-18T18:00:00+01:00"},
                //  {title: "EXEMPLO 3 -  DA NOITE", start: "2022-06-18T18:00:00+01:00", end: "2022-06-18T20:00:00+01:00"}
               //  ]}
                
                
                //this.state.resultado}
              //

              //this.INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
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
              Meteor.call(
                "addIndisponibilidade",
                Meteor.user().username,
                leitura(this.state.currentEvents),
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
    Meteor.call("carregaHorario", Meteor.user().username, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO");
      } else if (result) {
        const novoResultado = this.state.resultado;
        let r = result.disponibilidades;

        // r EH UMA STRING ASSIM:
        // 2022-06-17T18:00:00+01:00 2022-06-17T19:00:00+01:00

        if (r.toString().length > 1) {
          //REMOVO O ULTIMO ESPACO DA STRING
          r = r.substring(0, r.toString().length - 1);

          let v = r.split(" ");

          let inicio = "";
          let fim = "";
          
          let evento = { title: "Indisponível", start: "", end: "" }

          for (let index = 0; index < v.length; index += 2) {
            inicio = v[index];
            fim = v[index + 1];

            evento.start = inicio;
            evento.end = fim;
            novoResultado.push(evento);
          }

          console.log("ANTES DO SET STATE");
          console.log(this.state.resultado);

          this.setState({ resultado: novoResultado });

          console.log("RESULTADO  DEPOIS DO SET STATE!!!!");

          console.log(this.state.resultado);
        }
      }
    });
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

    if (diaIndisponivel > hoje) {
      this.calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
      });
      // console.log(selectInfo.startStr);
      // console.log(selectInfo.endStr);
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