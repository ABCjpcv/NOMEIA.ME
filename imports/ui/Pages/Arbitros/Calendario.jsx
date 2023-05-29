import React from "react";
import { Meteor } from "meteor/meteor";
import {
  Button,
  DatePicker,
  Form,
  message,
  Modal,
  Select,
  Space,
  Spin,
  TimePicker,
} from "antd";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import _ from "lodash.uniqueid";
import { Header } from "../Geral/Header";

import locale from "antd/es/locale/pt_PT";

import moment from "moment";

import "antd/dist/antd.css";
import { LoadingOutlined, QuestionCircleOutlined } from "@ant-design/icons";

let horasI = "";
let horasF = "";
let frequencia = "";
let diaInicioRecorrente = "";

const disabledDate = (current) => {
  // Can not select days before today

  return !moment().isSameOrBefore(current);
};

const antIcon = (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      width: "fit-content",
    }}
  >
    <LoadingOutlined
      style={{
        fontSize: "24px",
        justifyContent: "center",
      }}
      spin
    />
    <br></br>
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        width: "fit-content",
      }}
    >
      <span
        style={{ display: "flex", width: "fit-content", whiteSpace: "nowrap" }}
      >
        {" "}
        A carregar página...{" "}
      </span>
    </div>
  </div>
);

export class Calendario extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentEvents: [],
      loaded: false,
      resultado: [],
      show: false,
      isCA: false,
    };
  }

  componentDidMount() {
    let myPromise = new Promise((resolve, reject) => {
      Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
        if (result == 1 || result == 0) {
          resolve(this.state, result);
        } else {
          reject();
        }
        return result === 1;
      });
    });

    var that = this;

    myPromise.then(function (state, resultado) {
      //console.log("state", state);
      const { state: currentState } = state;
      const admin = resultado === 1;
      const newState = { ...currentState, isCA: admin };
      that.setState(newState);

      if (!that.state.loaded) {
        that.loadData();
      }

      setTimeout(() => {
        const { state: currentState } = that;
        const newState = { ...currentState, show: true };
        that.setState(newState);
      }, 200);
    });
  }

  componentDidUpdate() {
    let r;
    let myPromise = new Promise((resolve, reject) => {
      Meteor.call("isAdmin", Meteor.user(), true, (err, result) => {
        if (result == 1 || result == 0) {
          r = result;
          resolve(this.state);
        } else {
          reject();
        }
        return result === 1;
      });
    });

    setTimeout(() => {}, 100);

    var that = this;

    myPromise.then(function (state) {
      const { state: currentState } = state;
      const admin = r === 1;
      const newState = { ...currentState, show: true, isCA: admin };
      that.setState(newState);
    });
  }

  render() {
    const _ = require("lodash");

    const { loaded, resultado, show } = this.state;

    if (!loaded) {
      return (
        <Spin
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "15%",
          }}
          indicator={antIcon}
        />
      );
    }
    if (!show) {
      return (
        <Spin
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "15%",
          }}
          indicator={antIcon}
        />
      );
    }
    if (show) {
      const info = () => {
        Modal.info({
          title: "Instruções",
          content: (
            <div>
              <p>Selecione as datas para criar uma nova Indisponibilidade.</p>
              <p>
                Arraste, solte ou redimensione a Indisponibilidade como quiser.
              </p>
              <p>
                {" "}
                Para eliminar uma Indisponibilidade basta clicar na mesma.{" "}
              </p>
              <p>
                Quando terminar carregue no botão 'Submeter Indisponibilidades'
                .
              </p>
            </div>
          ),

          onOk() {},
        });
      };

      function recorrente() {
        Modal.confirm({
          title: "Indisponibilidade Recorrente",
          content: (
            <div>
              <>
                <br></br>
                <Form
                  labelCol={{
                    span: 6,
                    offset: 0,
                  }}
                  wrapperCol={{
                    span: 21,
                  }}
                  layout="horizontal"
                  size="small"
                >
                  <Form.Item label="Horas:">
                    <TimePicker.RangePicker
                      format={"HH:mm"}
                      placeholder={[" Início ", " Fim "]}
                      onChange={(e) => {
                        horasI = e[0].format("HH:mm");
                        horasF = e[1].format("HH:mm");
                      }}
                      minuteStep={60}
                    />
                  </Form.Item>
                  <Form.Item label="Frequência:">
                    <Select
                      onChange={(e) => {
                        frequencia = e;
                      }}
                    >
                      <Select.Option value="todosDias">
                        Todos os dias
                      </Select.Option>
                      <Select.Option value="diasUteis">
                        Dias úteis
                      </Select.Option>
                      <Select.Option value="semanalmente">
                        Semanalmente
                      </Select.Option>
                      {/*<Select.Option value="mensalmente">*/}
                      {/*  Mensalmente*/}
                      {/*</Select.Option>*/}
                    </Select>
                  </Form.Item>
                  <Form.Item label="Começa:">
                    <DatePicker
                      locale={locale}
                      placeholder="Selecione o dia..."
                      style={{ width: "100%" }}
                      disabledDate={disabledDate}
                      onChange={(e) => {
                        diaInicioRecorrente = e.format();
                      }}
                    />
                  </Form.Item>
                  <Form.Item label="Nota: ">
                    {" "}
                    Será registada até ao próximo mês.
                  </Form.Item>
                </Form>
              </>
            </div>
          ),
          keyboard: false,
          okText: "Adicionar indisponibilidades",
          onOk() {
            //console.log("hora", horasI + "   " + horasF);
            //console.log("freq", frequencia);
            //console.log("diaInicioRecorrente", diaInicioRecorrente);

            if (horasI == "" || horasF == "") {
              message.warn("Não colocou as horas!");
              //this.visible(true);
            } else if (frequencia == "") {
              message.warn("Não colocou a frequência!");
              //this.visible(true);
            } else {
              handleIndisponibilidadeRecorrente(
                [horasI, horasF],
                frequencia,
                diaInicioRecorrente
              );
              //this.visible(false);
            }
          },
          cancelText: "Cancelar",
          className: "modalRecusa",
        });
      }

      function handleIndisponibilidadeRecorrente(
        hora,
        freq,
        diaInicioRecorrente
      ) {
        //console.log("hora", hora);
        //console.log("freq", freq);
        //console.log("diaInicioRecorrente", diaInicioRecorrente);

        Meteor.call(
          "adicionaIndisponibilidadeRecorrente",
          Meteor.user().username,
          hora,
          freq,
          diaInicioRecorrente,
          (err, result) => {
            if (err) {
              //Fazer aparecer mensagem de texto de credenciais erradas.
              console.log(err);
            } else if (result) {
              message.success(
                "Indisponibilidades registadas " + Meteor.user().username + "!"
                );
                window.location.reload();
            }
          }
          );


        // Meteor.call(
        //   "carregaHorario",
        //   Meteor.user?.()?.username,
        //   (err, result) => {
        //     if (err) {
        //       console.log("ERRRRROOOOO", { err });
        //     } else if (result) {
        //       let r = result.disponibilidades;
        //       console.log("r", r);
        //       const { state: currentState } = this;
        //       const newState = {
        //         ...currentState,
        //         resultado: r,
        //         loaded: true,
        //       };
        //       this.setState(newState);
        //     }
        //   }
        // );
      }

      return (
        <div>
          <Header
            user={Meteor.user()}
            titulo={true}
            consultaPrivada={true}
            menuPrivado={this.state.isCA}
            menuPrivadoCA={!this.state.isCA}
            atribuirArbitrosAdesl={true}
            atribuirArbitrosCev={true}
            atribuirArbitrosCR_CN={true}
            carregarJogos={true}
            criarContaNova={true}
            removerConta={true}
            indisponibilidadePrivadas={false}
            restricoesPrivadas={true}
            definicoes={true}
            historico={true}
            forgotPasswordHeader={true}
          />
          {/* <ul>
            <li>
              Selecione as datas e você será solicitado a criar um novo evento
            </li>
            <li>Arraste, solte e redimensione eventos</li>
            <li>Clique em um evento para excluí-lo</li>
          </ul> */}
          <div className="demo-app-main" style={{ overflow: "auto" }}>
            <form>
              <div
                style={{
                  backgroundColor: "rgba(230, 230, 230, 0.1)",
                  marginTop: "1%",
                  marginLeft: "1%",
                  marginRight: "1%",
                }}
              >
                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  locale="pt"
                  headerToolbar={{
                    left: "prev,next today",
                    center: "title",
                    right: "timeGridWeek,timeGridDay",
                  }}
                  buttonText={{
                    // prev: "⬅ Anterior",
                    // next: "Seguinte ➡",
                    today: "Hoje",
                    month: "Mês",
                    week: "Semana",
                    day: "Dia",
                  }}
                  allDaySlot={false}
                  height={(20 * window.screen.height) / 48}
                  dayMinWidth={"8px"}
                  firstDay={1}
                  slotDuration={"00:60:00"}
                  slotMinTime={"08:00:00"}
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
                  eventOverlap={false}
                />
              </div>
              <br></br>
               <Button
                onClick={() => {
                  recorrente();
                }}
                type="default"
                style={{
                  marginBottom: 16,
                }}
              >
                Indisponibilidade recorrente
              </Button> 
              <Button
                onClick={() => {
                  let curr = this.state.currentEvents;
                  //console.log("curr", curr);
                  let eventos = [];
                  curr.map((evento) => {
                    if (
                      evento.id.includes("jogo") ||
                      evento.id.includes("feriado")
                    ) {
                      eventos.push({
                        id: evento.id,
                        title: evento.title,
                        start: evento.startStr,
                        end: evento.endStr,
                        color: "#000000",
                      });
                    } else {
                      eventos.push({
                        id: evento.id,
                        title: " Indisponível ",
                        start: evento.startStr,
                        end: evento.endStr,
                      });
                    }
                  });

                  Meteor.call(
                    "adicionaIndisponibilidade",
                    Meteor.user().username,
                    eventos,
                    (err, result) => {
                      //console.log("result", result);
                      if (err) {
                        //Fazer aparecer mensagem de texto de credenciais erradas.
                        console.log(err);
                      } else if (result) {

                        return message.success(
                          "Indisponibilidades registadas " +
                            Meteor.user().username +
                            "!"
                        );
                      }
                    }
                              );

                }}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
              >
                Submeter Indisponibilidades
              </Button>
              <Space wrap>
                <Button
                  shape="round"
                  style={{
                    marginBottom: 16,
                  }}
                  value="Instruções"
                  onClick={info}
                >
                  <QuestionCircleOutlined />
                </Button>
              </Space>
            </form>
          </div>
        </div>
      );
    }
  }

  loadData() {
    // Verifica se o utilizador loggado tem indisponibilidades guardadas na bd
    Meteor.call("carregaHorario", Meteor.user?.()?.username, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO", { err });
      } else if (result) {
        let r = result.disponibilidades;
        console.log("r", r);
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

    console.log("selectInfo.start", selectInfo.startStr);
    console.log("selectInfo.end", selectInfo.endStr);
    let newStart = new Date(selectInfo.start);

    let newEnd = new Date(selectInfo.end);

    let r = this.validDate(this.state.currentEvents, newStart, newEnd, hoje);

    if (newStart < hoje) {
      message.error(
        Meteor.user().username +
          ", não pode marcar indisponibilidade antes de hoje."
      );
    } else if (r) {
      this.calendarApi.addEvent({
        id: _(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        color: "#eb3434",
      });
    } else {
      message.error(
        Meteor.user().username +
          ", não pode marcar indisponibilidades nesse intervalo."
      );
    }
  };

  validDate(eventsArray, newStart, newEnd, hoje) {
    // console.log("newStart: ", newStart);
    // console.log("newEnd: ", newEnd);

    let resultado = true;
    for (var element of eventsArray) {
      if (newStart < hoje) return false;
      if (newStart < element.start) {
        if (newEnd <= element.start) {
          resultado = true;
        } else {
          resultado = false;
          break;
        }
      } else if (newStart >= element.end) {
        resultado = true;
      } else {
        resultado = false;
        break;
      }
    }
    return resultado;
  }

  handleEventClick = (clickInfo) => {
    console.log("click event", clickInfo.event._def);
    if (clickInfo.event._def.publicId.includes("feriado")) {
      message.warn("Impossível remover feriado!");
    } else if (clickInfo.event._def.title === " Indisponível ") {
      clickInfo.event.remove();
    } else {
      message.error("Impossível remover um Jogo Nomeado");
    }
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
