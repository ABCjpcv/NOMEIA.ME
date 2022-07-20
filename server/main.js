import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Papa } from "meteor/harrison:papa-parse";
import nodemailer from "nodemailer";
import SimpleSchema from "simpl-schema";
import _ from "lodash.uniqueid";
import { Roles } from "meteor/alanning:roles";

try {
  Roles.createRole("arbitro");
  Roles.createRole("admin");
} catch (error) {}

let usersCollection = Meteor.users; //Stores the Meteor Users Collection in a single Variable.
let jogos = new Mongo.Collection("jogos");
let clubes = new Mongo.Collection("clubes");
let arbitros = new Mongo.Collection("arbitros");
let conselhoDeArbitragem = new Mongo.Collection("conselhoDeArbitragem");
let nomeacoes = new Mongo.Collection("nomeacoes");
let indisponibilidades = new Mongo.Collection("indisponibilidades");
let restricoes = new Mongo.Collection("restricoes");
let definicoesPessoais = new Mongo.Collection("definicoesPessoais");

/************************************************************************************************
 *********************************** SCHEMA TABLE ***********************************************
 ************************************************************************************************
 */

//Schema restricoes

const relacoesSchema = new SimpleSchema({
  key: { type: Number, optional: false },
  // key = linha da Tabela
  clube: { type: String, optional: false },
  restricao: { type: Array, optional: true },
  "restricao.$": { type: Boolean },
  descricao: { type: String, optional: true },
});

restricoes.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  relacoes: [relacoesSchema],
});

//Schema indisponibilidades

const eventSchema = new SimpleSchema({
  id: { type: Number, optional: false },
  start: { type: String, optional: false },
  end: { type: String, optional: false },
});

indisponibilidades.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  disponibilidades: [eventSchema],
});

//Schema nomeacoes:

const nomSchema = new SimpleSchema({
  jogo: { type: jogos, optional: false },
  confirmacao: { type: String, optional: false },
});

nomeacoes.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  nomeacoesPrivadas: [nomSchema],
});

//Schema Definicoes:
definicoesPessoais.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  temCarro: { type: Boolean, optional: false },
  emiteRecibo: { type: Boolean, optional: false },
  naoTemCarro: { type: Boolean, optional: false },
  naoEmiteRecibo: { type: Boolean, optional: false },
});

//Schema Arbitros:
arbitros.schema = new SimpleSchema({
  nome: { type: String, optional: false },
  email: { type: String, optional: false },
  licenca: { type: Number, optional: false },
  nivel: { type: Number, optional: false },
  isAdmin: { type: Boolean, optional: false },
});

//Schema Jogos importados de um dado csv.
jogos.schema = new SimpleSchema({
  id: { type: Number, optional: false }, //Retirar Unique no futuro
  dia: { type: String, optional: false },
  hora: { type: String, optional: false },
  prova: { type: String, optional: false },
  serie: { type: String, optional: false },
  equipas: { type: String, optional: false },
  pavilhao: { type: String, optional: false },
  arbitro_1: { type: String, optional: false }, // Verificar se possivel colocar Objecto Arbitro.
  arbitro_2: { type: String, optional: true }, //Mesmo que acima.
  juiz_linha_1: { type: String, optional: true },
  juiz_linha_2: { type: String, optional: true },
  juiz_linha_3: { type: String, optional: true },
  juiz_linha_4: { type: String, optional: true },
  key: { type: Number, optional: true },
});

//Schema ConselhoDeArbitragem
conselhoDeArbitragem.schema = new SimpleSchema({
  arbitrosCA: { type: arbitros, optional: false },
  preNomeacoes: [jogos],
});

//Schema Clubes:
clubes.schema = new SimpleSchema({
  clube: { type: String, optional: false },
  localizacao: { type: String, optional: false },
  email: { type: String, optional: false },
  email_2: { type: String, optional: true },
  telemovel: { type: String, optional: true },
  telemovel_2: { type: String, optional: true },
  telefone: { type: String, optional: true },
});

Meteor.startup(() => {
  process.env.MAIL_URL =
    "smtp://nomeiame_ponav@hotmail.com:ElChefinho8@smtp.live.com:587/";

  let transporter = nodemailer.createTransport({
    service: "Hotmail", // no need to set host or port etc.
    auth: {
      user: "nomeiame_ponav@hotmail.com",
      pass: "ElChefinho8",
    },
  });

  clubes.rawCollection().drop();

  //Read the clubs:
  var clubsCsv = Assets.getText("Clubes_AVL.csv");
  var rows = Papa.parse(clubsCsv).data;

  console.log(
    "*****************************************************************************"
  );
  console.log(
    "***********************   DATABASE FOR CLUBES AVL       *********************"
  );
  console.log(
    "*****************************************************************************"
  );

  for (i in rows) {
    clubes.insert(rows[i]);
    console.log("inserted: " + rows[i]);
  }

  console.log(
    "******************************************************************************"
  );
  console.log(
    "*****************   DATABASE FOR ARBITROS   ************************"
  );
  console.log(
    "*****************************************************************************"
  );

  var utilizadores = Meteor.users.find();

  arbitros.rawCollection().drop();

  let nivel1 = [
    "andre.21carvalho@gmail.com",
    "danielcborga9@gmail.com",
    "diogosilva.ovc@gmail.com",
    "gabrielaciriani@gmail.com",
    "riquelopes03@gmail.com",
    "inespereira04@gmail.com",
    "jjustocaldeira@gmail.com",
    "mariacferreira98@hotmail.com",
    "clatoven.musica@gmail.com",
    "matilde.maranha@gmail.com",
    "ricardo03fernandes@hotmail.com",
    "ricardo.madeira11@hotmail.com",
    "andrecruz5094@gmail.com",
  ];
  let nivel2 = [
    "analoidearbitragem@gmail.com",
    "aca.pereira@campus.fct.unl.pt",
    "catarinafiliparodrigues@hotmail.com",
    "eliz.munteanu@gmail.com",
    "hugocruz116@gmail.com",
    "joaopmateus@hotmail.com",
    "margaridapformiga@gmail.com",
    "ralha.marta19@gmail.com",
    "sousanicky@gmail.com",
    "samuelpatrao@gmail.com",
    "mtvaleria20@gmail.com",
  ];
  let nivel3 = [
    "mafalda.bento@gmail.com",
    "danieljafernandes@gmail.com",
    "sergiosp@netcabo.pt",
    "aninhasfranco@gmail.com",
    "brunoescorpiao1984@gmail.com",
    "silvacvoleibol@gmail.com",
    "diogo.rcgeraldes@gmail.com",
    "goncalomonteiro.arbitragem@gmail.com",
    "jorgereis1995@gmail.com",
    "ralha.madalena18@gmail.com",
    "michellecferreira@yahoo.com",
    "rui.costa.reis@gmail.com",
    "sandra.deveza@gmail.com",
    "sofiarodrcosta@gmail.com",
    "andrebrascorreia.42@gmail.com",
  ];

  utilizadores.forEach((user) => {
    let nivel = 1;
    if (nivel2.includes(user.emails[0].address)) {
      nivel = 2;
    } else if (nivel3.includes(user.emails[0].address)) {
      nivel = 3;
    }

    arbitros.insert({
      nome: user.username,
      email: user.emails[0].address,
      licenca: 0,
      nivel: nivel,
      isAdmin: false,
    });
    console.log("inserted: " + user.username);

    Roles.addUsersToRoles(user._id, ["arbitro"]);
  });

  console.log(
    "******************************************************************************"
  );
  console.log(
    "*****************   DATABASE FOR CONSELHO DE ARBITRAGEM   ********************"
  );
  console.log(
    "*****************************************************************************"
  );

  conselhoDeArbitragem.rawCollection().drop();

  // NAO EXISTE CA NA BASE DE DADOS

  console.log("Nao existe CA");
  var currCA = [
    "sergiosp@netcabo.pt",
    "danieljafernandes@gmail.com",
    "mafalda.bento@gmail.com",
  ];

  for (let index = 0; index < currCA.length; index++) {
    var mail = currCA[index];
    var a = arbitros.findOne({ email: mail });
    console.log("arbitro: " + a.nome);

    let isAdmin = true;

    if (a.nome != "" || a.nome != undefined) {
      a.isAdmin = isAdmin;
      conselhoDeArbitragem.insert({
        arbitrosCA: a,
        preNomeacoes: [],
      });
      arbitros.update({ email: a.email }, { $set: { isAdmin: true } });
    }

    let u = Meteor.users.findOne({ username: a.nome });
    Roles.addUsersToRoles(u._id, [isAdmin ? "admin" : "arbitro"]);
  }

  var ca = conselhoDeArbitragem.find();

  if (ca.length != 0) {
    for (var a of ca) {
      // JA EXISTE CA NA BASE DE DADOS
      a.isAdmin = true;
    }
  }

  console.log(
    "******************************************************************************"
  );
  console.log(
    "*****************   DATABASE FOR INDISPONIBILIDADES   ************************"
  );
  console.log(
    "*****************************************************************************"
  );

  var arb = arbitros.find();

  indisponibilidades.rawCollection().drop();

  arb.forEach((arbitro) => {
    indisponibilidades.insert({
      arbitro: arbitro,
      disponibilidades: "",
    });
    console.log("inserted: INDISPONIBILIDADE");
  });

  console.log(
    "******************************************************************************"
  );
  console.log(
    "************   DATABASE FOR RESTRICOES    ******************************"
  );
  console.log(
    "*****************************************************************************"
  );

  restricoes.rawCollection().drop();

  arb.forEach((arbitro) => {
    restricoes.insert({
      arbitro: arbitro,
      relacoes: [],
    });
    console.log("inserted: RESTRICAO ");
  });

  console.log(
    "******************************************************************************"
  );
  console.log(
    "*****************   DATABASE FOR DEFINICOES PESSOAIS   ************************"
  );
  console.log(
    "*****************************************************************************"
  );

  definicoesPessoais.rawCollection().drop();

  arb.forEach((arbitro) => {
    definicoesPessoais.insert({
      arbitro: arbitro,
      temCarro: false,
      emiteRecibo: false,
      naoTemCarro: false,
      naoTemRecibo: false,
    });
    console.log("inserted : DEFINICOES PESSOAIS BASE ");
  });

  console.log(
    "******************************************************************************"
  );
  console.log(
    "*****************   DATABASE FOR JOGOS   ************************"
  );
  console.log(
    "*****************************************************************************"
  );

  //Get the csvText:
  var csvFile = Assets.getText("Livro1.csv");

  var rows = Papa.parse(csvFile).data;

  jogos.rawCollection().drop();

  function titleCase(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }

  //Setup the database, by adding games.
  for (let index = 1; index < rows.length - 1; index++) {
    // row[i] = [ '1695', '01/05/2022',   '11:00',   'CNFINIC', 'C',   'LUSOFVC- SPORTCP',   'PAV. PROF.TEOTONIO LIMA', 'Andr� Carvalho',  '',   '',   '',   '',   '']

    jogos.insert({
      id: parseInt(rows[index][0]),
      dia: rows[index][1],
      hora: rows[index][2],
      prova: rows[index][3],
      serie: rows[index][4],
      equipas: rows[index][5],
      pavilhao: rows[index][6],
      arbitro_1: titleCase(rows[index][7]),
      arbitro_2: titleCase(rows[index][8]),
      juiz_linha_1: titleCase(rows[index][9]),
      juiz_linha_2: titleCase(rows[index][10]),
      juiz_linha_3: titleCase(rows[index][11]),
      juiz_linha_4: titleCase(rows[index][12]),
      key: index,
    });
    console.log("inserted JOGO " + rows[index][0]);
  }

  console.log(
    "******************************************************************************"
  );
  console.log(
    "*****************   DATABASE FOR NOMEACOES   ************************"
  );
  console.log(
    "*****************************************************************************"
  );

  nomeacoes.rawCollection().drop();

  var jog = jogos.find();

  arb.forEach((arbitro) => {
    let nomeacoesAuxiliares = [];

    jog.forEach((jogo) => {
      if (
        jogo.arbitro_1 == arbitro.nome ||
        jogo.arbitro_1 == arbitro.nome ||
        jogo.arbitro_2 == arbitro.nome ||
        jogo.juiz_linha_1 == arbitro.nome ||
        jogo.juiz_linha_2 == arbitro.nome ||
        jogo.juiz_linha_3 == arbitro.nome ||
        jogo.juiz_linha_4 == arbitro.nome
      ) {
        nomeacoesAuxiliares.push({
          jogo: jogo,
          confirmacaoAtual: ["pendente"],
        });
      }
    });

    nomeacoes.insert({
      arbitro: arbitro,
      nomeacoesPrivadas: nomeacoesAuxiliares,
    });

    console.log("inserted nomeacoes a: " + arbitro.nome);
  });
});

Meteor.methods({
  /*************************************************************
   ************************** METODOS DO UTILIZADOR *************
   ***************************************************************
   */
  authenticateUser: function authenticateUser(user_email, password) {
    if (user_email.length == 0) throw new Meteor.Error("Must insert an email.");
    if (password.length == 0) throw new Meteor.Error("Must insert a password.");
    var user = Accounts.findUserByEmail(user_email);
    if (user == undefined) {
      return "Invalid credentials / user does not exist.";
    }

    console.log("User found by email.");

    //Verificar ambiguidade dos Hashes, Hash nao inserido manualmente em registo.
    var result = Accounts._checkPassword(user, {
      digest: password,
      algorithm: "sha-256",
    });
    if (result) return user;
    else return "Passwords do not match";
  },

  registerUser: function registerUser(
    user_name,
    user_email,
    nivelArbitro,
    licencaArbitro,
    user_password,
    password_repeat,
    isAdmin
  ) {
    if (
      (user_name.length == 0 ||
        user_email.length == 0 ||
        user_password.length == 0,
      password_repeat.length == 0)
    ) {
      console.log("Must insert fields");
      throw new Meteor.Error("Fields Missing");
    }
    if (user_password != password_repeat)
      throw new Meteor.Error("Passwords do not match.");
    console.log("Passwords match.");

    //Accounts.verifyEmail(user_email, (error) => {
    //  if (!error) {
    //    return
    Accounts.createUser({
      username: user_name,
      email: user_email,
      password: user_password,
    });
    //   } else {
    //     throw new Meteor.Error("Email is invalid.");
    //   }
    // });

    let a = {
      nome: user_name,
      email: user_email,
      licenca: parseInt(licencaArbitro),
      nivel: parseInt(nivelArbitro),
      isAdmin: isAdmin,
    };

    let u = Meteor.users.findOne({ emails: user_email });

    Roles.addUsersToRoles(u._id, [isAdmin ? "admin" : "arbitro"]);

    arbitros.insert(a);

    console.log("inserted: " + user_name);

    if (isAdmin) {
      let ca = conselhoDeArbitragem.findOne();

      conselhoDeArbitragem.insert({
        arbitrosCA: a,
        preNomeacoes: ca.preNomeacoes,
      });
    }

    return true;
  },

  esqueceuPassword: function esqueceuPassword(email) {
    let u = Accounts.findUserByEmail(email);
    let newDefaultPassword = randomPassword(8);

    Accounts.setPassword(u._id, newDefaultPassword);

    let transporter = nodemailer.createTransport({
      service: "Hotmail", // no need to set host or port etc.
      auth: {
        user: "nomeiame_ponav@hotmail.com",
        pass: "ElChefinho8",
      },
    });

    transporter.sendMail({
      from: "nomeiame_ponav@hotmail.com",
      to: email,
      subject: "Recuperacao de password de " + u.username + "",
      text:
        "Boas " +
        u.username +
        ", \n\n A sua password foi alterada para: " +
        newDefaultPassword +
        ". \n Por favor altere a mesma na sua página da plataforma Nomeia.Me acedendo às suas Definições. \n\n Saudações Desportivas, \n A equipa Nomeia.Me",
    });

    return true;
  },

  alteraPassword: function alteraPassword(user, novaPass) {
    let utilizador = Meteor.users.findOne({ username: user.username });
    //console.log("utilizador", utilizador);
    let result = Accounts.setPassword(utilizador._id, novaPass);
    //console.log("result", result);
    return 1;
  },

  isAdmin: function isAdmin(user, loggado) {
    if (loggado != null) {
      var arbitro = arbitros.findOne({ email: user.emails[0].address });
      var admin = arbitro.isAdmin;
      console.log(arbitro.nome + " is admin? " + admin);
      return admin ? 1 : 0;
    }
    return -1;
  },

  addConfirmacaoNomeacao: function addConfirmacaoNomeacao(
    email,
    games,
    confirmacoes
  ) {
    var arb = arbitros.findOne({ email: email });
    let nomeacoesAuxiliares = [];

    for (let index = 0; index < games.length; index++) {
      let jogo = jogos.findOne({ key: games[index].key });
      console.log("jogo", jogo);

      let confirmacaoAtual = confirmacoes[index];

      var nomeacao = { jogo: jogo, confirmacaoAtual: confirmacaoAtual };
      nomeacoesAuxiliares.push(nomeacao);
      console.log("Arbitro " + arb.nome + " ficou com o jogo " + jogo.id);
    }

    //console.log("nomeacoesAuxiliares: ", nomeacoesAuxiliares);

    nomeacoes.update(
      { arbitro: arb },
      { $set: { nomeacoesPrivadas: nomeacoesAuxiliares } }
    );
  },

  carregaNomeacoes: function carregaNomeacoes(email) {
    var arb = arbitros.findOne({ email: email });
    var result = nomeacoes.findOne({ arbitro: arb });
    return result;
  },

  nomeacoesForamUpdated: function nomeacoesForamUpdated(user, data) {
    let arb = arbitros.findOne({ email: user.emails[0].address });
    let nomeacoesArbitro = nomeacoes.findOne({ arbitro: arb });

    console.log("data", data);
    // console.log("atuaisPreNomeacoes[0]", atuaisPreNomeacoes[0]);

    // console.log("atuaisPreNomeacoes.length", atuaisPreNomeacoes.length);

    if (data.length != nomeacoesArbitro.nomeacoesPrivadas.length) {
      return true;
    } else {
      for (
        let index = 0;
        index < nomeacoesArbitro.nomeacoesPrivadas.length;
        index++
      ) {
        let numeroJogoDaBD = parseInt(
          nomeacoesArbitro.nomeacoesPrivadas[index].jogo.id
        );
        let numeroJogoRecebido = parseInt(data[index].Jogo);
        if (numeroJogoDaBD != numeroJogoRecebido) {
          return true;
        }
      }
    }

    return false;
  },

  /*****************************************************************
   **************** METODOS DAS INDISPONIBILIDADES *************
   *****************************************************************
   */
  addIndisponibilidade: function addIndisponibilidade(username, events) {
    events.forEach((element) => {
      element.title = " Indisponível ";
    });

    try {
      const a = arbitros.findOne({ nome: username });
      indisponibilidades.update(
        { arbitro: a },
        { $set: { disponibilidades: events } }
      );
      return true;
    } catch (error) {
      return false;
    }
  },
  carregaHorario: function carregaHorario(username) {
    const a = arbitros.findOne({ nome: username });
    return indisponibilidades.findOne({ arbitro: a });
  },

  /*****************************************************************
   **************** METODOS DAS RESTRICOES_PRIVADAS *************
   *****************************************************************
   */

  addRestricao: function addRestricao(username, restrictions) {
    try {
      const a = arbitros.findOne({ nome: username });
      restricoes.update({ arbitro: a }, { $set: { relacoes: restrictions } });
      return true;
    } catch (error) {
      return false;
    }
  },

  carregaRestricoes: function carregaRestricoes(username) {
    const a = arbitros.findOne({ nome: username });
    return restricoes.findOne({ arbitro: a });
  },

  /*****************************************************************
   **************** METODOS DAS DEFINICOES PESSOAIS  *************
   *****************************************************************
   */

  adicionaRecibo: function adicionaRecibo(user) {
    try {
      let utilizador = Meteor.users.findOne(user);
      let username = utilizador.username;
      let a = arbitros.findOne({ nome: username });
      definicoesPessoais.update(
        { arbitro: a },
        { $set: { emiteRecibo: true } },
        { $set: { naoEmiteRecibo: false } }
      );
      return 1;
    } catch (error) {
      return -1;
    }
  },

  adicionaTransporte: function adicionaTransporte(user) {
    try {
      let utilizador = Meteor.users.findOne(user);
      let username = utilizador.username;
      let a = arbitros.findOne({ nome: username });
      definicoesPessoais.update(
        { arbitro: a },
        { $set: { temCarro: true } },
        { $set: { naoTemCarro: false } }
      );
      return 1;
    } catch (error) {
      return -1;
    }
  },

  removeRecibo: function removeRecibo(user) {
    try {
      let utilizador = Meteor.users.findOne(user);
      let username = utilizador.username;
      let a = arbitros.findOne({ nome: username });
      definicoesPessoais.update(
        { arbitro: a },
        { $set: { emiteRecibo: false } },
        { $set: { naoEmiteRecibo: true } }
      );
      return 1;
    } catch (error) {
      return -1;
    }
  },

  removeTransporte: function removeTransporte(user) {
    try {
      let utilizador = Meteor.users.findOne(user);
      let username = utilizador.username;
      let a = arbitros.findOne({ nome: username });
      definicoesPessoais.update(
        { arbitro: a },
        { $set: { temCarro: false } },
        { $set: { naoTemCarro: true } }
      );
      return 1;
    } catch (error) {
      return -1;
    }
  },

  getRecibo: function getRecibo(user) {
    //console.log("user in getRecibo", user);

    let utilizador = Meteor.users.findOne({ username: user.username });

    //console.log("utilizador", utilizador);

    let email = utilizador.emails[0].address;

    //console.log("email", email);

    var arb = arbitros.findOne({ email: email });

    // console.log("arb", arb);

    var def = definicoesPessoais.findOne({ arbitro: arb });

    //console.log("def", def);

    var result = def.emiteRecibo;

    //console.log("TEM RECIBO NA BD?", result);
    return result;
  },

  getTransporte: function getTransporte(user) {
    let utilizador = Meteor.users.findOne(user);
    let email = utilizador.emails[0].address;
    var arb = arbitros.findOne({ email: email });
    var def = definicoesPessoais.findOne({ arbitro: arb });
    var result = def.temCarro;
    //console.log("TEM CARRO NA BD?", result);
    return result;
  },

  getNivel: function getNivel(user) {
    let utilizador = Meteor.users.findOne(user);
    let email = utilizador.emails[0].address;
    var arb = arbitros.findOne({ email: email });
    var result = arb.nivel;
    //  console.log("NIVEL DE ARBITRO NA BD?", result);
    return result;
  },

  /*****************************************************************
   **************** METODOS DO CONSELHO DE ARBITRAGEM *************
   *****************************************************************
   */

  jogosForamUpdated: function jogosForamUpdated(user, data) {
    let arb = arbitros.findOne({ email: user.emails[0].address });
    // console.log("arbitro CA", arb);
    let ca = conselhoDeArbitragem.findOne({ arbitrosCA: arb });
    // console.log("ca", ca);
    let atuaisPreNomeacoes = ca.preNomeacoes;
    // console.log("data[0]", data[0]);
    // console.log("atuaisPreNomeacoes[0]", atuaisPreNomeacoes[0]);

    // console.log("atuaisPreNomeacoes.length", atuaisPreNomeacoes.length);

    if (data.length != atuaisPreNomeacoes.length) {
      return true;
    } else {
      for (let index = 0; index < atuaisPreNomeacoes.length; index++) {
        let numeroJogoDaBD = parseInt(atuaisPreNomeacoes[index].id);
        let numeroJogoRecebido = parseInt(data[index].Jogo);
        if (numeroJogoDaBD != numeroJogoRecebido) {
          return true;
        }
      }
    }

    return false;
  },

  getPreNomeacoesRealizadas: function getPreNomeacoesRealizadas(user) {
    try {
      let arb = arbitros.findOne({ nome: user.username });
      let ca = conselhoDeArbitragem.findOne({ arbitrosCA: arb });
      return ca.preNomeacoes;
    } catch (error) {
      return -1;
    }
  },

  submeteJogosComNomeacoes: function submeteJogosComNomeacoes(data) {
    // REVER MUITO BEM

    jogos.remove({});

    for (let index = 0; index < data.length; index++) {
      const jogo = data[index];
      jogos.insert({
        id: jogo.id,
        dia: jogo.dia,
        hora: jogo.hora,
        prova: jogo.prova,
        serie: jogo.serie,
        equipas: jogo.equipas,
        pavilhao: jogo.pavilhao,
        arbitro_1: jogo.arbitro_1,
        arbitro_2: jogo.arbitro_2,
        juiz_linha_1: jogo.juiz_linha_1,
        juiz_linha_2: jogo.juiz_linha_2,
        juiz_linha_3: jogo.juiz_linha_3,
        juiz_linha_4: jogo.juiz_linha_4,
        key: jogo.key,
      });
    }

    nomeacoes.remove({});

    let games = jogos.find();
    let refs = arbitros.find();

    refs.forEach((arbitro) => {
      let nomeacoesAuxiliares = [];

      games.forEach((jogo) => {
        if (
          jogo.arbitro_1 == arbitro.nome ||
          jogo.arbitro_1 == arbitro.nome ||
          jogo.arbitro_2 == arbitro.nome ||
          jogo.juiz_linha_1 == arbitro.nome ||
          jogo.juiz_linha_2 == arbitro.nome ||
          jogo.juiz_linha_3 == arbitro.nome ||
          jogo.juiz_linha_4 == arbitro.nome
        ) {
          nomeacoesAuxiliares.push({
            jogo: jogo,
            confirmacaoAtual: ["pendente"],
          });
        }
      });

      nomeacoes.insert({
        arbitro: arbitro,
        nomeacoesPrivadas: nomeacoesAuxiliares,
      });

      console.log("inserted nomeacoes a: " + arbitro.nome);
    });
  },

  getClubesDisponiveis: function getClubesDisponiveis() {
    let clubesDisponiveis = [];

    clubes.find().forEach((clube) => {
      clubesDisponiveis.push(clube);
    }); //Vai buscar toda a info na bd de clubes

    let resultado = [];
    for (let i = 1; i < clubesDisponiveis.length; i++) {
      if (clubesDisponiveis[i][0] != "") {
        resultado.push(clubesDisponiveis[i][0]);
      }
    }
    return resultado.sort();
  },

  verificaRestricoes: function verificaRestricoes(nomeArbitro) {
    let arb = arbitros.findOne({ nome: nomeArbitro });
    let defP = definicoesPessoais.findOne({ arbitro: arb });
    let temCarro = defP.temCarro;
    let emiteRecibo = defP.emiteRecibo;

    let resultado = {
      temCarro: temCarro,
      emiteRecibo: emiteRecibo,
      relacaoComEquipas: "",
    };

    let relacoesClubes = restricoes.findOne({ arbitro: arb });
    let relacoes = relacoesClubes.relacoes;

    if (relacoes.length === 0) {
      return resultado;
    } else {
      let auxiliarRelacaoes = [];

      relacoes.forEach((element) => {
        let clubeAnalisar = element.Clube;
        if (element.Descricao != "") {
          auxiliarRelacaoes.push({
            informacao: element.Descricao,
            clube: clubeAnalisar,
          });
        }
        for (let index = 0; index < element.Restricao.length; index++) {
          if (element.Restricao[index]) {
            if (index === 0) {
              auxiliarRelacaoes.push({ cargo: "Atleta", clube: clubeAnalisar });
            } else if (index === 1) {
              auxiliarRelacaoes.push({
                cargo: "Dirigente",
                clube: clubeAnalisar,
              });
            } else if (index === 2) {
              auxiliarRelacaoes.push({
                cargo: "Treinador",
                clube: clubeAnalisar,
              });
            } else if (index === 3) {
              auxiliarRelacaoes.push({ cargo: "Outro", clube: clubeAnalisar });
            }
          }
        }
      });

      resultado.relacaoComEquipas = auxiliarRelacaoes.sort();

      return resultado;
    }
  },

  addNomeacaoCalendarioArbitro: function addNomeacaoCalendarioArbitro(
    nomeArbitro,
    currJogo,
    funcao
  ) {
    //console.log(" currJogo: ", currJogo);

    let titulo =
      "Jogo nº " +
      currJogo.Jogo +
      " " +
      currJogo.Prova +
      " Serie " +
      currJogo.Serie +
      " " +
      currJogo.Equipas +
      " " +
      currJogo.Pavilhao;
    console.log("titulo: ", titulo);

    // FORMAT -> 2022-07-17T11:00:00+01:00

    // DIA DE JOGO : "24/07/2022"

    let diaDeJogo = currJogo.Dia;
    let horaDeJogo = currJogo.Hora;

    let diaDividido = diaDeJogo.split("/");
    let horaDividido = horaDeJogo.split(":");

    // console.log("diaDividido", diaDividido);

    let startStr =
      diaDividido[2] +
      "-" +
      diaDividido[1] +
      "-" +
      diaDividido[0] +
      "T" +
      horaDividido[0] +
      ":" +
      horaDividido[1] +
      ":00+01:00";
    let endStr =
      diaDividido[2] +
      "-" +
      diaDividido[1] +
      "-" +
      diaDividido[0] +
      "T" +
      (parseInt(horaDividido[0]) + 2) +
      ":" +
      horaDividido[1] +
      ":00+01:00";

    let newId = _("jogo");

    let novoEvento = {
      title: "\n" + titulo,
      id: newId,
      start: startStr,
      end: endStr,
      color: "#000000",
      editable: false,
    };

    // console.log("novoEvento", novoEvento);

    const a = arbitros.findOne({ nome: nomeArbitro });
    console.log("a", a);
    let i = indisponibilidades.findOne({ arbitro: a });
    console.log("i", i);

    let events = i.disponibilidades;
    console.log("events", events);

    if (events === "") {
      events = [];
    }

    events.push(novoEvento);

    // console.log("events after push", events);

    indisponibilidades.update(
      { arbitro: a },
      { $set: { disponibilidades: events } }
    );

    i = indisponibilidades.findOne({ arbitro: a });

    // console.log("events depois de mudanca", i.disponibilidades);

    let ca = conselhoDeArbitragem.find();
    let arbCAs = [];
    let ca1;
    ca.forEach((ca) => {
      arbCAs.push(ca.arbitrosCA);
      ca1 = ca;
    });

    let atuaisPreNomeacoes = ca1.preNomeacoes;

    for (let index = 0; index < atuaisPreNomeacoes.length; index++) {
      if (atuaisPreNomeacoes[index].id === currJogo.Jogo) {
        if (funcao.toString().includes("option_1_arbitro")) {
          atuaisPreNomeacoes[index].arbitro_1 = nomeArbitro;
        } else if (funcao.toString().includes("option_2_arbitro")) {
          atuaisPreNomeacoes[index].arbitro_2 = nomeArbitro;
        } else if (funcao.toString().includes("option_1_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_1 = nomeArbitro;
        } else if (funcao.toString().includes("option_2_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_2 = nomeArbitro;
        } else if (funcao.toString().includes("option_3_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_3 = nomeArbitro;
        } else if (funcao.toString().includes("option_4_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_4 = nomeArbitro;
        }
      }
    }
    let newGames = atuaisPreNomeacoes;

    conselhoDeArbitragem.remove({});

    for (let index = 0; index < arbCAs.length; index++) {
      conselhoDeArbitragem.insert({
        arbitrosCA: arbCAs[index],
        preNomeacoes: newGames,
      });
    }

    return true;
  },

  removeNomeacaoCalendarioArbitro: function removeNomeacaoCalendarioArbitro(
    nomeArbitro,
    tituloJogo,
    currJogo,
    funcao
  ) {
    //console.log("nomeArbitro", nomeArbitro);

    const a = arbitros.findOne({ nome: nomeArbitro });
    console.log("a", a);
    const i = indisponibilidades.findOne({ arbitro: a });
    console.log("i", i);

    let events = i.disponibilidades;
    console.log("events", events);

    if (events === "") {
      events = [];
      return true;
    }

    let novosEvents = [];
    for (let index = 0; index < events.length; index++) {
      const titulo = events[index].title;

      // console.log("TITULO DO JOGO DA BD: ", events[index].title);
      // console.log("TITULO RECEBIDO A COMPARAR:", titulo);

      // console.log("SÃO IGUAIS?", titulo === tituloJogo);

      let numeroJogoDaBD = parseInt(titulo.split(" ")[2]);

      let numeroJogoRecebido = parseInt(tituloJogo.split(" ")[2]);

      // console.log("numeroJogoDaBD : ", numeroJogoDaBD);
      // console.log("numeroJogoRecebido:", numeroJogoRecebido);

      // console.log("SÃO IGUAIS?", numeroJogoDaBD === numeroJogoRecebido);

      if (numeroJogoDaBD != numeroJogoRecebido) {
        novosEvents.push(events[index]);
      }
    }

    indisponibilidades.update(
      { arbitro: a },
      { $set: { disponibilidades: novosEvents } }
    );

    let ca = conselhoDeArbitragem.find();
    let arbCAs = [];
    let ca1;
    ca.forEach((ca) => {
      arbCAs.push(ca.arbitrosCA);
      ca1 = ca;
    });

    let atuaisPreNomeacoes = ca1.preNomeacoes;

    for (let index = 0; index < atuaisPreNomeacoes.length; index++) {
      if (atuaisPreNomeacoes[index].id === currJogo.Jogo) {
        if (funcao.toString().includes("option_1_arbitro")) {
          atuaisPreNomeacoes[index].arbitro_1 = "";
        } else if (funcao.toString().includes("option_2_arbitro")) {
          atuaisPreNomeacoes[index].arbitro_2 = "";
        } else if (funcao.toString().includes("option_1_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_1 = "";
        } else if (funcao.toString().includes("option_2_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_2 = "";
        } else if (funcao.toString().includes("option_3_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_3 = "";
        } else if (funcao.toString().includes("option_4_jl")) {
          atuaisPreNomeacoes[index].juiz_linha_4 = "";
        }
      }
    }
    let newGames = atuaisPreNomeacoes;

    conselhoDeArbitragem.rawCollection().drop();

    for (let index = 0; index < arbCAs.length; index++) {
      conselhoDeArbitragem.insert({
        arbitrosCA: arbCAs[index],
        preNomeacoes: newGames,
      });
    }
    return true;
  },

  addJogosSemanais: function addJogosSemanais(jogos) {
    let ca = conselhoDeArbitragem.find();
    let arbCAs = [];
    ca.forEach((ca) => {
      arbCAs.push(ca.arbitrosCA);
    });

    let newGames = [];

    for (let index = 1; index < jogos.length; index++) {
      if (jogos[index][0] != "") {
        let game = {
          id: jogos[index][0],
          dia: jogos[index][1],
          hora: jogos[index][2],
          prova: jogos[index][3],
          serie: jogos[index][4],
          equipas: jogos[index][5],
          pavilhao: jogos[index][6],
          arbitro_1: jogos[index][7],
          arbitro_2: jogos[index][8],
          juiz_linha_1: jogos[index][9],
          juiz_linha_2: jogos[index][10],
          juiz_linha_3: jogos[index][11],
          juiz_linha_4: jogos[index][12],
          key: index,
          tags: ["pendente"],
        };
        newGames.push(game);
      }
    }

    conselhoDeArbitragem.rawCollection().drop();

    for (let index = 0; index < arbCAs.length; index++) {
      conselhoDeArbitragem.insert({
        arbitrosCA: arbCAs[index],
        preNomeacoes: newGames,
      });
    }
    return true;
  },

  carregaJogosSemanais: function carregaJogosSemanais(email) {
    const a = arbitros.findOne({ email: email });
    const ca = conselhoDeArbitragem.findOne({ arbitrosCA: a });
    return ca.preNomeacoes;
  },

  arbitrosDisponiveis: function arbitrosDisponiveis(
    jogo,
    temRecibo,
    naoTemRecibo,
    temTransporte,
    naoTemTransporte,
    clubesRelacionados,
    nivel
  ) {
    // ESTA DISPONIVEL PARA AQUELE HORARIO???

    let todasIndisponibilidades = [];

    indisponibilidades.find().forEach((indisponibilidade) => {
      todasIndisponibilidades.push(indisponibilidade);
    }); //Vai buscar todas as indisponibilidades

    let diaDeJogo = (jogo.Dia + "").split("/");
    let horaDeJogo = (jogo.Hora + "").split(":");

    let horaPavilhao = parseInt(horaDeJogo[0]) - 1;

    let dataInicio =
      diaDeJogo[2] +
      "-" +
      diaDeJogo[1] +
      "-" +
      diaDeJogo[0] +
      "T" +
      (horaPavilhao + 1) + // NAO FACO IDEIA PORQUE, MAS TEVE DE SER
      ":" +
      horaDeJogo[1] +
      ":00";

    let inicioDoJogo = new Date(dataInicio);

    let horaFimDeJogo = parseInt(horaDeJogo[0]) + 2;
    //console.log("horaFimDeJogo: ", horaFimDeJogo);

    let dataFim =
      diaDeJogo[2] +
      "-" +
      diaDeJogo[1] +
      "-" +
      diaDeJogo[0] +
      "T" +
      (horaFimDeJogo + 1) + // NAO FACO IDEIA PORQUE, MAS TEVE DE SER
      ":" +
      horaDeJogo[1] +
      ":00";

    let fimDoJogo = new Date(dataFim);

    //Primeiro passo:

    let nomesArbitrosDisponiveis = [];

    todasIndisponibilidades.forEach((indisponibilidade) => {
      //console.log("ENTREI NO CICLO");

      // console.log("ESTOU NA INDISPONIBILIDADE", indisponibilidade);

      let disponibilidades = indisponibilidade.disponibilidades; //Vai buscar o array de disponibilidades

      //console.log("disponibilidades", disponibilidades);

      //console.log("disponibilidades length", disponibilidades.length);

      if (disponibilidades.length == 0) {
        // console.log("Disponivel.");
        nomesArbitrosDisponiveis.push(indisponibilidade.arbitro.nome);
      } else {
        let v = validDate(disponibilidades, inicioDoJogo, fimDoJogo);
        if (!v) {
          // Nao esta disponivel
          // console.log("arbitrosDisponiveis", nomesArbitrosDisponiveis);
        } else if (v) {
          //console.log("Disponivel.");
          nomesArbitrosDisponiveis.push(indisponibilidade.arbitro.nome);
        }
      }
    });

    //console.log("nivel", nivel);

    let auxiliarNivel = [];

    if (
      parseInt(nivel) === 1 ||
      parseInt(nivel) === 2 ||
      parseInt(nivel) === 3
    ) {
      nomesArbitrosDisponiveis.forEach((nomeArbitro) => {
        let arb = arbitros.findOne({ nome: nomeArbitro });
        // console.log("nivel do Arbitro", arb.nivel);
        if (parseInt(arb.nivel) - parseInt(nivel) == 0) {
          auxiliarNivel.push(nomeArbitro);
        }
      });

      nomesArbitrosDisponiveis = auxiliarNivel;
    }

    // Segundo passo:
    // QUERO SABER DE MAIS ALGUMA COISA????
    if (!temRecibo && !naoTemRecibo) {
      // NAO QUERO SABER SE EMITE RECIBO OU NAO
      if (!temTransporte && !naoTemTransporte) {
        //NAO QUERO SABER SE TEM CARRO OU NAO
        if (clubesRelacionados.length === 0) {
          // NAO QUERO SABER DAS RELACOES COM CLUBES
          nomesArbitrosDisponiveis.push(" ");
          return nomesArbitrosDisponiveis.sort();
        }
      }
    }

    // QUERO RECIBOS:

    let arbitrosDisponiveisComRecibo = [];
    let arbitrosDisponiveisSemRecibo = [];

    let arbitrosDisponiveisRecibos = [];

    if (temRecibo) {
      for (let index = 0; index < nomesArbitrosDisponiveis.length; index++) {
        let arb = arbitros.findOne({ nome: nomesArbitrosDisponiveis[index] });
        let def = definicoesPessoais.findOne({ arbitro: arb });
        if (def.temRecibo) {
          arbitrosDisponiveisComRecibo.push(arb.nome);
        }
      }
      arbitrosDisponiveisRecibos = arbitrosDisponiveisComRecibo;
    } else if (naoTemRecibo) {
      for (let index = 0; index < nomesArbitrosDisponiveis.length; index++) {
        let arb = arbitros.findOne({ nome: nomesArbitrosDisponiveis[index] });
        let def = definicoesPessoais.findOne({ arbitro: arb });
        if (!def.temRecibo) {
          arbitrosDisponiveisSemRecibo.push(arb.nome);
        }
      }
      arbitrosDisponiveisRecibos = arbitrosDisponiveisSemRecibo;
    }

    // NAO QUERO RECIBOS
    if (!temRecibo && !naoTemRecibo) {
      arbitrosDisponiveisRecibos = nomesArbitrosDisponiveis;
    }

    // Depois de adicionar os arbitros que tem ou nao recibo

    // QUERO TRANSPORTES

    let arbitrosDisponiveisComTransporte = [];
    let arbitrosDisponiveisSemTransporte = [];

    let arbitrosDisponiveisTransportes = [];

    if (temTransporte) {
      for (let index = 0; index < arbitrosDisponiveisRecibos.length; index++) {
        let arb = arbitros.findOne({ nome: arbitrosDisponiveisRecibos[index] });
        let def = definicoesPessoais.findOne({ arbitro: arb });
        if (def.temCarro) {
          arbitrosDisponiveisComTransporte.push(arb.nome);
        }
      }
      arbitrosDisponiveisTransportes = arbitrosDisponiveisComTransporte;
    } else if (naoTemTransporte) {
      for (let index = 0; index < novosArbitrosDisponiveis.length; index++) {
        let arb = arbitros.findOne({ nome: novosArbitrosDisponiveis[index] });
        let def = definicoesPessoais.findOne({ arbitro: arb });
        if (!def.temCarro) {
          arbitrosDisponiveisSemTransporte.push(arb.nome);
        }
      }
      arbitrosDisponiveisTransportes = arbitrosDisponiveisSemTransporte;
    }

    if (!temTransporte && !naoTemTransporte) {
      arbitrosDisponiveisTransportes = arbitrosDisponiveisRecibos;
    }

    // Terceiro Passo:

    //console.log("clubesRelacionados", clubesRelacionados);

    // VAMOS ASSUMIR QUE NINGUEM TEM RELACOES COM CLUBES
    let relacoes = [];
    for (
      let index = 0;
      index < arbitrosDisponiveisTransportes.length;
      index++
    ) {
      relacoes.push(false);
    }

    //console.log("Array com relacoes", relacoes);

    let arbitrosDisponiveisSemRelacoes = [];

    // TENHO CLUBES PARA VERIFICAR:
    if (clubesRelacionados.length != 0) {
      clubesRelacionados.forEach((element) => {
        let index = clubesRelacionados.indexOf(element);
        clubesRelacionados[index] = element.toUpperCase();
      });
      // DENTRO DOS ARBITROS DISPONIVEIS PROCURA OS QUE NAO TEM RELACOES COM OS CLUBES RECEBIDOS
      for (let i = 0; i < arbitrosDisponiveisTransportes.length; i++) {
        let arb = arbitros.findOne({ nome: arbitrosDisponiveisTransportes[i] });

        //console.log("Vou verificar Restricoes do Arbitro:", arb.nome);

        let restricoesArb = restricoes.findOne({ arbitro: arb });

        // console.log("As Restricoes:", restricoesArb.relacoes);

        // VOU PESQUISAR CADA UMA DAS RELACOES EXISTENTES DO ARBITRO A SER REVISTO ATUALMENTE
        for (let j = 0; j < restricoesArb.relacoes.length; j++) {
          let currentRelacao = restricoesArb.relacoes[j];

          //console.log("currentRelacao:", currentRelacao);

          //console.log("clube da CurrentRelacao", currentRelacao.Clube);

          // NESTA RELACAO TENHO O CLUBE PEDIDO?
          if (clubesRelacionados.includes(currentRelacao.Clube.toUpperCase())) {
            let temRelacao = false;
            for (let index = 0; index < 3 && !temRelacao; index++) {
              if (currentRelacao.Restricao[index]) {
                // TEM RELACOES COM O CLUBE
                relacoes[i] = true;
                temRelacao = true;
              } else {
                // NAO TEM RELACOES COM O CLUBE
              }
            }
          }
        }
      }

      for (let index = 0; index < relacoes.length; index++) {
        if (!relacoes[index]) {
          arbitrosDisponiveisSemRelacoes.push(
            arbitrosDisponiveisTransportes[index]
          );
        }
      }

      arbitrosDisponiveisSemRelacoes.push(" ");
      return arbitrosDisponiveisSemRelacoes.sort();
    } else {
      arbitrosDisponiveisTransportes.push(" ");
      return arbitrosDisponiveisTransportes.sort();
    }
  },
});

function validDate(eventsArray, newStart, newEnd) {
  if (eventsArray.length === 0) return true;
  else {
    let resultado = true;
    for (var element of eventsArray) {
      // console.log("resultado", resultado);
      // console.log("newStart", newStart);
      // console.log("element.start", element.start);
      // console.log("newStart < element.start", newStart < element.start);
      // console.log("new Date(element.start", new Date(element.start));
      // console.log(
      //   "newStart < new Date(element.start)",
      //   newStart < new Date(element.start)
      // );
      if (newStart < new Date(element.start)) {
        // console.log("newEnd", newEnd);
        // console.log(
        //   "newEnd < new Date(element.start))",
        //   newEnd < new Date(element.start)
        // );
        if (newEnd < new Date(element.start)) {
          //console.log("TRUEEEEEE");
          resultado = true;
        } else {
          //console.log("FALSEEE");
          resultado = false;
          break;
        }
        // console.log("new Date(element.end)", new Date(element.end));
        // console.log(
        //   "newStart >= new Date(element.end)",
        //   newStart >= new Date(element.end)
        // );
      } else if (newStart >= new Date(element.end)) {
        //console.log("TRUEEEEEE");
        resultado = true;
      } else {
        //console.log("FALSEEE");
        resultado = false;
        break;
      }
    }

    return resultado;
  }
}

function randomPassword(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
