
/**
 * UNUSED 
 */


export const INITIAL_EVENTS = [
    {
      title: 'Indisponível',
      start: "inicio",
      end: "fim"
    }
  ]

  export function loadData() {

    let eventos = {title: String, start: String, end: String}
    let resultado = [eventos];

    // Verifica se o utilizador loggado tem indisponibilidades guardadas na bd
    Meteor.call("carregaHorario", Meteor.user().username, (err, result) => {
      if (err) {
        console.log("ERRRRROOOOO");
      } else if (result) {
        let r = result.disponibilidades;
        console.log(r);
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
            .replaceAll("Dez", "12");

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
            .replaceAll("(Hora de verão da Europa Ocidental)", "")
            .replaceAll("GMT", "");

          r = r.substring(1);

          console.log("BANANANANANANANANANANANANANANANANANANANANANAN");
          console.log(r);

          let v = r.split(" ");

          let inicio = "";
          let fim = "";


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

            let event = { title: "Indisponível", start: inicio, end: fim };
            console.log(event);
            resultado.push(event);
            
          }
          
          for (let index = 0; index < resultado.length; index++) {
            console.log("resultado:  " + resultado[index]);
          }
        }
      }
    });
    return resultado;
  }