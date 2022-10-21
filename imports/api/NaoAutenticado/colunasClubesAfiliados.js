export const colunasClubesAfiliados = [
  {
    title: "Clube",
    dataIndex: "Clube",
    key: "Clube",
    sorter: (a, b) => comparaAminhaLindaString(a.Clube, b.Clube),
    sortDirections: ["descend", "ascend"],
  },
  // {
  //   title: "Localização",
  //   dataIndex: "Localizacao",
  //   key: "Localizacao",
  //   sorter: (a, b) => comparaAminhaLindaString(a.Localizacao, b.Localizacao),
  //   sortDirections: ["descend", "ascend"],
  // },
  {
    title: "Email",
    dataIndex: "Email",
    key: "Email",
    sorter: (a, b) => comparaAminhaLindaString(a.Email, b.Email),
    sortDirections: ["descend", "ascend"],
  },
  {
    title: "Telemóvel",
    dataIndex: "Telemovel",
    key: "Telemovel",
    sorter: (a, b) => comparaAminhaLindaString(a.Telemovel, b.Telemovel),
    sortDirections: ["descend", "ascend"],
    width: "12%",
  },

  {
    title: "Telefone",
    dataIndex: "Telefone",
    key: "Telefone",
    sorter: (a, b) => comparaAminhaLindaString(a.Telefone, b.Telefone),
    sortDirections: ["descend", "ascend"],
    width: "12%",
  },
  {
    title: "NIF",
    dataIndex: "NIF",
    key: "NIF",
    sorter: (a, b) => comparaAminhaLindaString(a.Telefone, b.Telefone),
    sortDirections: ["descend", "ascend"],
    width: "12%",
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
