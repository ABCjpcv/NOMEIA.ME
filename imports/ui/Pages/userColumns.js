import moment from "moment";

export const userColumns = [
  {
    title: "Jogo",
    dataIndex: "Jogo",
    key: "Jogo",
    sorter: (a, b) => a.Jogo - b.Jogo,
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Dia",
    dataIndex: "Dia",
    key: "Dia",
    sorter: (a, b) => comparaAminhaLindaData(a.Dia, b.Dia),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Hora",
    dataIndex: "Hora",
    key: "Hora",
    sorter: (a, b) => comparaAminhaLindaString(a.Hora, b.Hora),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Prova",
    dataIndex: "Prova",
    key: "Prova",
    sorter: (a, b) => comparaAminhaLindaString(a.Prova, b.Prova),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Serie",
    dataIndex: "Serie",
    key: "Serie",
    sorter: (a, b) => comparaAminhaLindaString(a.Serie, b.Serie),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Equipas",
    dataIndex: "Equipas",
    key: "Equipas",
    sorter: (a, b) => comparaAminhaLindaString(a.Equipas, b.Equipas),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Pavilhao",
    dataIndex: "Pavilhao",
    key: "Pavilhao",
    sorter: (a, b) => comparaAminhaLindaString(a.Pavilhao, b.Pavilhao),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Arbitro1",
    dataIndex: "Arbitro1",
    key: "Arbitro1",
    sorter: (a, b) => comparaAminhaLindaString(a.Arbitro1, b.Arbitro1),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Arbitro2",
    dataIndex: "Arbitro2",
    key: "Arbitro2",
    sorter: (a, b) => comparaAminhaLindaString(a.Arbitro2, b.Arbitro2),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "JL",
    dataIndex: "JL1",
    key: "JL1",
    sorter: (a, b) => comparaAminhaLindaString(a.JL1, b.JL1),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "JL",
    dataIndex: "JL2",
    key: "JL2",
    sorter: (a, b) => comparaAminhaLindaString(a.JL2, b.JL2),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "JL",
    dataIndex: "JL3",
    key: "JL3",
    sorter: (a, b) => comparaAminhaLindaString(a.JL3, b.JL3),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "JL",
    dataIndex: "JL4",
    key: "JL4",
    sorter: (a, b) => comparaAminhaLindaString(a.JL4, b.JL4),
    sortDirections: ["descend", "ascend"],
  },
];

function comparaAminhaLindaString(a, b) {
  let x = 0;
  let tamanho = a.length > b.length ? b.length : a.length;
  for (let index = 0; index < tamanho; index++) {
    posA = a.charCodeAt(index);
    posB = b.charCodeAt(index);
    if (posA != posB) {
      x = posB - posA;
      break;
    }
  }
  if (x != 0) return x;
  else return b.length - a.length;
}

function comparaAminhaLindaData(a, b) {
  let x = 0;
  let dataSplitada1 = a.split("/");
  let dataSplitada2 = b.split("/");
  for (let index = dataSplitada1.length-1; index >= 0; index--) {
    // PROF, DESCULPE, A MINHA SA4NIDADE MENTAL SE FOI...
    let res = comparaAminhaLindaString(dataSplitada1[index], dataSplitada2[index])
    if(res != 0){
      return res
    }
  }
  return 0;
}
