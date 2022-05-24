import React from "react";
import FullCalendar, { formatDate } from "@fullcalendar/react";
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

  render() {
    return (
      <div
        className="demo-app"
        style={{ height: "10%", width: "915px", float: "right" }}
      >
        {this.renderSidebar()}
        <div>
          <div className="demo-app-main" style={{ overflow: "auto" }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              locale="pt"
              allDaySlot={false}
              height={"350px"}
              dayMinWidth={"8px"}
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
              /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
            />
          </div>
          <br></br>
          <input className="botao" type="submit" value="Submeter" onClick={
            console.log(this.state.currentEvents)
          }

          />
        </div>
      </div>
    );
  }

  renderSidebar() {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <h2>Marcação de Indisponibilidades</h2>
        </div>
        <div className="demo-app-sidebar-section" hidden>
          <h2>
            Indisponibilidades marcadas: ({this.state.currentEvents.length})
          </h2>
          <ul>{this.state.currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  }

  handleDateSelect = (selectInfo) => {
    let title = "Indisponível";
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
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
