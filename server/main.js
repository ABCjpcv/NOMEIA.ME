import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Papa } from "meteor/harrison:papa-parse";
import nodemailer from "nodemailer";
import SimpleSchema from "simpl-schema";
import _ from "lodash.uniqueid";

let jogos = new Mongo.Collection("jogos");
let clubes = new Mongo.Collection("clubes");
let arbitros = new Mongo.Collection("arbitros");
let conselhoDeArbitragem = new Mongo.Collection("conselhoDeArbitragem");
let nomeacoes = new Mongo.Collection("nomeacoes");
let indisponibilidades = new Mongo.Collection("indisponibilidades");
let restricoes = new Mongo.Collection("restricoes");
let definicoesPessoais = new Mongo.Collection("definicoesPessoais");
let jogosPassados = new Mongo.Collection("jogosPassados");
let jogosPassadosCA = new Mongo.Collection("jogosPassadosCA");

let CURRENT_YEAR = new Date().getFullYear();

let DROP_ALL_TABLES = true;

let CONSELHO_DE_ARBITRAGEM = [
  "sergiosp@netcabo.pt",
  "danieljafernandes@gmail.com",
  "silvacvoleibol@gmail.com",
];

/**********************************************************************************************
 ******************************* SCHEMA TABLE ************************************************
 ************************************************************************************************
 */

//Schema restricoes
const relacoesSchema = new SimpleSchema({
  key: { type: Number, optional: false },
  // key ==  linha da table
  clube: { type: String, optional: false },
  cargo: { type: Array, optional: true },
  "cargo.$": { type: Boolean },
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
const parciais = new SimpleSchema({
  pontos: { type: Number, optional: false },
});
const resultado = new SimpleSchema({
  total: [parciais],
  set1: [parciais],
  set2: [parciais],
  set3: [parciais],
  set4: [parciais],
  set5: [parciais],
});
const nomSchema = new SimpleSchema({
  jogo: { type: jogos, optional: false },
  resultado: [resultado],
  confirmacao: { type: String, optional: false },
});
nomeacoes.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  nomeacoesPrivadas: [nomSchema],
});

//Schema jogosPassados
jogosPassados.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  nomeacoesPrivadas: [nomSchema],
});

//Schema Definicoes:
definicoesPessoais.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  temCarro: { type: Boolean, optional: false },
  emiteRecibo: { type: Boolean, optional: false },
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
  juiz_linha: [String],
  key: { type: Number, optional: true },
});

//Schema ConselhoDeArbitragem
conselhoDeArbitragem.schema = new SimpleSchema({
  arbitrosCA: { type: arbitros, optional: false },
  preNomeacoes: [jogos],
  enviado: { type: Boolean, optional: false },
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
    "smtp://nomeia_me_ponav@hotmail.com:2*qzEB)eKR*KZ6gn@smtp.live.com:587/";

  if (DROP_ALL_TABLES) {
    clubes.rawCollection().drop();

    //Read the clubs:
    var clubsCsv = Assets.getText("Clubes_AVL.csv");
    var rows = Papa.parse(clubsCsv).data;

    console.log("*****************************************************");
    console.log("************   DATABASE FOR CLUBES AVL       ********");
    console.log("*****************************************************");

    for (i in rows) {
      clubes.insert(rows[i]);
      //console.log("inserted: " + rows[i]);
    }

    console.log("*****************************************************");
    console.log("***********   DATABASE FOR ARBITROS   ***************");
    console.log("*****************************************************");

    var utilizadores = Meteor.users.find();

    arbitros.rawCollection().drop();

    let nivel1 = [
      "andre.21carvalho@gmail.com",
      "danielcborga9@gmail.com",
      "diogosilva.ovc@gmail.com",
      "riquelopes03@gmail.com",
      "inespereira04@gmail.com",
      "jjustocaldeira@gmail.com",
      "mariacferreira98@hotmail.com",
      "clatoven.musica@gmail.com",
      "matilde.maranha@gmail.com",
      "ricardo03fernandes@hotmail.com",
      "ricardo.madeira11@hotmail.com",
      "andrecruz5094@gmail.com",
      "rodrigo.omitti@gmail.com",
      "marianatimoteo33@gmail.com",
      "ruicastanheira0708@gmail.com",
      "ion.andrusenco1@gmail.com",
      "gctramos@gmail.com",
      "jscanelas15@gmail.com",
    ];
    let nivel2 = [
      "analoidearbitragem@gmail.com",
      "aca.pereira@campus.fct.unl.pt",
      "catarinafiliparodrigues@hotmail.com",
      "gabrielaciriani@gmail.com",
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
    });

    console.log("*****************************************************");
    console.log("******   DATABASE CONSELHO DE ARBITRAGEM   *********");
    console.log("*****************************************************");

    conselhoDeArbitragem.rawCollection().drop();

    var currCA = CONSELHO_DE_ARBITRAGEM;

    for (let index = 0; index < currCA.length; index++) {
      var mail = currCA[index];
      var a = arbitros.findOne({ email: mail });

      let isAdmin = true;

      if (a != undefined) {
        a.isAdmin = isAdmin;
        conselhoDeArbitragem.insert({
          arbitrosCA: a,
          preNomeacoes: [],
          enviado: false,
        });
        arbitros.update({ email: a.email }, { $set: { isAdmin: true } });
      }
    }

    var ca = conselhoDeArbitragem.find();

    if (ca.length != 0) {
      for (var a of ca) {
        // JA EXISTE CA NA BASE DE DADOS
        a.isAdmin = true;
      }
    }

    console.log("*****************************************************");
    console.log("*****   DATABASE FOR INDISPONIBILIDADES   ***********");
    console.log("*****************************************************");

    var arb = arbitros.find();

    indisponibilidades.rawCollection().drop();

    let r = [];
    r = addFeriados(r);

    arb.forEach((arbitro) => {
      indisponibilidades.insert({
        arbitro: arbitro,
        disponibilidades: r,
      });
      console.log("inserted: INDISPONIBILIDADE");
    });

    console.log("*****************************************************");
    console.log("**********   DATABASE FOR RESTRICOES    *************");
    console.log("*****************************************************");

    restricoes.rawCollection().drop();

    arb.forEach((arbitro) => {
      restricoes.insert({
        arbitro: arbitro,
        relacoes: [],
      });
      console.log("inserted: RESTRICAO ");
    });

    console.log("*****************************************************");
    console.log("*******   DATABASE FOR DEFINICOES PESSOAIS   ********");
    console.log("*****************************************************");

    definicoesPessoais.rawCollection().drop();

    arb.forEach((arbitro) => {
      definicoesPessoais.insert({
        arbitro: arbitro,
        temCarro: false,
        emiteRecibo: false,
      });
      console.log("inserted : DEFINICOES PESSOAIS BASE ");
    });

    console.log("****************************************************");
    console.log("************   DATABASE FOR JOGOS   *****************");
    console.log("*****************************************************");

    //Get the c sv Text:
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
        juiz_linha: [
          titleCase(rows[index][9]),
          titleCase(rows[index][10]),
          titleCase(rows[index][11]),
          titleCase(rows[index][12]),
        ],
        key: index,
      });
      console.log("inserted JOGO " + rows[index][0]);
    }

    console.log("*****************************************************");
    console.log("***********   DATABASE FOR NOMEACOES   **************");
    console.log("*****************************************************");

    nomeacoes.rawCollection().drop();

    var jog = jogos.find();

    arb.forEach((arbitro) => {
      let nomeacoesAuxiliares = [];

      jog.forEach((jogo) => {
        if (
          jogo.arbitro_1 == arbitro.nome ||
          jogo.arbitro_1 == arbitro.nome ||
          jogo.arbitro_2 == arbitro.nome ||
          jogo.juiz_linha.includes(arbitro.nome)
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

    console.log("*****************************************************");
    console.log("*********   DATABASE FOR JOGOS PASSADOS  ************");
    console.log("*****************************************************");

    jogosPassados.rawCollection().drop();

    arb.forEach((arbitro) => {
      jogosPassados.insert({
        arbitro: arbitro,
        nomeacoesPrivadas: [],
      });

      console.log("inserted jogosPassados a: " + arbitro.nome);
    });
  } else {
    console.log("*****************************************************");
    console.log("*****************   SERVIDOR LIGADO       ***********");
    console.log("*****************************************************");
  }
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
      return "User does not exist.";
    } else {
      //console.log("User found by email.");
      return user;
    }

    // //Verificar ambiguidade dos Hashes, Hash nao inserido manualmente em registo.
    // var result = Accounts._checkPassword(user, {
    //   digest: password,
    //   algorithm: "sha-256",
    // });

    // console.log("RESULT", result.error);
    // if (result.error) return user;
    // else return "Passwords do not match";
  },

  registerArbitro: function registerArbitro(
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
      // console.log("Must insert fields");
      throw new Meteor.Error("Fields Missing");
    }
    if (user_password != password_repeat)
      throw new Meteor.Error("Passwords do not match.");
    // console.log("Passwords match.");

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
    arbitros.insert(a);

    console.log("inserted: " + user_name);

    if (isAdmin) {
      let ca = conselhoDeArbitragem.findOne();

      conselhoDeArbitragem.insert({
        arbitrosCA: a,
        preNomeacoes: ca.preNomeacoes,
        enviado: false,
      });
    }

    indisponibilidades.insert({
      arbitro: a,
      disponibilidades: "",
    });

    restricoes.insert({
      arbitro: a,
      relacoes: [],
    });

    definicoesPessoais.insert({
      arbitro: a,
      temCarro: false,
      emiteRecibo: false,
    });

    let nomeacoesAuxiliares = [];

    let games = jogos.find();

    // VERIFICA PARA CADA JOGO QUE ARBITRO(S) ESTA(O) ASSOCIADO(S) A ELE
    games.forEach((jogo) => {
      if (
        jogo.arbitro_1 === a.nome ||
        jogo.arbitro_2 === a.nome ||
        jogo.juiz_linha.includes(a.nome)
      ) {
        nomeacoesAuxiliares.push({
          jogo: jogo,
          confirmacaoAtual: ["pendente"],
        });
      }
    });
    nomeacoes.insert({
      arbitro: a,
      nomeacoesPrivadas: nomeacoesAuxiliares,
    });

    return true;
  },

  editUser: function (username, emailNovo, nivelNovo, licencaNova, CAnovo) {
    try {
      let user = Meteor.users.findOne({ username: username });
      let arb = arbitros.findOne({ nome: username });

      if (user.emails[0].address !== emailNovo) {
        // ALTERA O EMAIL:
        Meteor.users.update(
          { username: username },
          { $set: { "emails.0.address": emailNovo } }
        );
        arbitros.update({ nome: username }, { $set: { email: emailNovo } });
      }

      if (arb.nivel !== nivelNovo) {
        // ALTERA O NIVEL:
        arbitros.update({ nome: username }, { $set: { nivel: nivelNovo } });
      }

      if (arb.licenca !== licencaNova) {
        // ALTERA O LIBENCAO:
        arbitros.update({ nome: username }, { $set: { licenca: licencaNova } });
      }

      // Altera as permissoes de admin
      if (arb.isAdmin != CAnovo) {
        // ERA ADMIN, JA NAO EH
        if (arb.isAdmin) {
          conselhoDeArbitragem.remove({ arbitrosCA: arb });
        } else {
          //PASSOU A SER ADMIN
          let ca = conselhoDeArbitragem.find();

          let ca1;
          ca.forEach((ca) => {
            ca1 = ca;
          });

          let atuaisPreNomeacoes = ca1.preNomeacoes;
          conselhoDeArbitragem.insert({
            arbitrosCA: arb,
            preNomeacoes: atuaisPreNomeacoes,
            enviado: false,
          });
        }
        arbitros.update({ nome: username }, { $set: { isAdmin: CAnovo } });
      }
    } catch (error) {
      //console.log("Error", error);
      return -1;
    }
    return 1;
  },

  deleteUser: function deleteUser(username) {
    Meteor.users.remove({ username: username });
    let a = arbitros.findOne({ nome: username });
    indisponibilidades.remove({ arbitro: a });
    restricoes.remove({ arbitro: a });
    definicoesPessoais.remove({ arbitro: a });
    nomeacoes.remove({ arbitro: a });
    if (a.isAdmin) conselhoDeArbitragem.remove({ arbitrosCA: a });
    arbitros.remove({ nome: username });
    return 1;
  },

  getArbitros: function getArbitros() {
    let todosArbitros = [];
    let arb = arbitros.find();
    arb.forEach((element) => {
      todosArbitros.push(element.nome);
    });
    return todosArbitros.sort();
  },

  getArbitroFromUsername: function getArbitroFromUsername(username) {
    let user = arbitros.findOne({ nome: username });
    return user;
  },

  esqueceuPassword: function esqueceuPassword(email) {
    let u = Accounts.findUserByEmail(email);

    if (u === undefined) {
      return false;
    }

    let newDefaultPassword = randomPassword(8);

    try {
      let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com", // hostname
        secureConnection: false, // TLS requires secureConnection to be false
        port: 587, // port for secure SMTP
        tls: {
          ciphers: "SSLv3",
        },
        requireTLS: true, //this parameter solved problem for me
        service: "Hotmail", // no need to set host or port etc.
        auth: {
          user: "nomeia_me_ponav@hotmail.com",
          pass: "2*qzEB)eKR*KZ6gn",
        },
      });

      transporter.sendMail({
        from: "nomeia_me_ponav@hotmail.com",
        to: email,
        subject: "Recuperação de password de " + u.username + "",
        text:
          u.username +
          ", \n\n A sua password foi alterada para: " +
          newDefaultPassword +
          "\n Por favor altere a mesma na sua conta através da plataforma" +
          " Nomeia.Me acedendo ao seu Perfil." +
          "\n\n Saudações Desportivas, \n A equipa Nomeia.Me",
      });

      Accounts.setPassword(u._id, newDefaultPassword);
    } catch (error) {
      return false;
    }

    return true;
  },

  alteraPassword: function alteraPassword(user, novaPass) {
    let utilizador = Meteor.users.findOne({ username: user.username });
    Accounts.setPassword(utilizador._id, novaPass);
    return 1;
  },

  isAdmin: function isAdmin(user, loggado) {
    user === null ? (user = Meteor.user()) : (user = user);

    if (user === null) loggado = !loggado;

    if (loggado != null) {
      var arbitro = arbitros.findOne({ email: user.emails[0].address });
      var admin = arbitro.isAdmin;
      return admin ? 1 : 0;
    }
    return -1;
  },

  // BONECO
  addResultadoJogo: function addResultadoJogo(email, game, resultado) {
    let confirmacao = "realizado";
    let resultadoJogo = resultado.split("-");
    let total = [resultadoJogo[0], resultadoJogo[1]];
    let set1 = [resultadoJogo[2], resultadoJogo[3]];
    let set2 = [resultadoJogo[4], resultadoJogo[5]];
    let set3 = [resultadoJogo[6], resultadoJogo[7]];
    let set4 = [resultadoJogo[8], resultadoJogo[9]];
    let set5 = [resultadoJogo[10], resultadoJogo[11]];

    var arb = arbitros.findOne({ email: email });
    let jogo = jogos.findOne({ key: game.key });

    var resultado = {
      total: total,
      set1: set1,
      set2: set2,
      set3: set3,
      set4: set4,
      set5: set5,
    };

    var nomeacao = {
      jogo: jogo,
      resultado: resultado,
      confirmacaoAtual: confirmacao,
    };

    var alteraNomeacoes = nomeacoes.findOne({ arbitro: arb });

    var atuais = alteraNomeacoes.nomeacoesPrivadas;
    var novas = [];

    // console.log("JOGO", jogo);

    // console.log("game.key", game.key);

    atuais.forEach((element) => {
      if (element.jogo.key !== game.key) novas.push(element);
    });

    // console.log("NOVAS", novas);

    nomeacoes.update({ arbitro: arb }, { $set: { nomeacoesPrivadas: novas } });

    var jogosAntigos = jogosPassados.findOne({ arbitro: arb });

    var gamesJogosAntigos = jogosAntigos.nomeacoesPrivadas;

    gamesJogosAntigos.push(nomeacao);

    jogosPassados.update(
      { arbitro: arb },
      { $set: { nomeacoesPrivadas: gamesJogosAntigos } }
    );
  },

  addConfirmacaoNomeacao: function addConfirmacaoNomeacao(
    email,
    games,
    confirmacoes
  ) {
    var arb = arbitros.findOne({ email: email });

    let nomeacoesAuxiliares = [];

    let arbConfirmacaoJogo = [];

    for (let index = 0; index < games.length; index++) {
      let jogo = jogos.findOne({ key: games[index].key });

      let confirmacaoAtual = confirmacoes[index];

      var nomeacao = { jogo: jogo, confirmacaoAtual: confirmacaoAtual };
      nomeacoesAuxiliares.push(nomeacao);
      console.log(
        "Arbitro " +
          arb.nome +
          " indicou " +
          confirmacaoAtual +
          " do jogo " +
          jogo.id
      );
      arbConfirmacaoJogo.push({
        arbitro: arb.nome,
        confirmacaoAtual: confirmacaoAtual[0],
        jogo: jogo.id,
      });
    }

    nomeacoes.update(
      { arbitro: arb },
      { $set: { nomeacoesPrivadas: nomeacoesAuxiliares } }
    );

    let preNomeacoes = conselhoDeArbitragem.findOne().preNomeacoes;

    //console.log("PRENOMEACOES SEM AS CONFIRMAÇÕES");

    for (let i = 0; i < arbConfirmacaoJogo.length; i++) {
      //console.log("arbConfirmacaoJogo[i]", arbConfirmacaoJogo[i]);
      //Current id do jogo:
      let jogoId = arbConfirmacaoJogo[i].jogo;
      for (let j = 0; j < preNomeacoes.length; j++) {
        if (preNomeacoes[j].id == jogoId) {
          if (preNomeacoes[j].arbitro_1 == arbConfirmacaoJogo[i].arbitro) {
            preNomeacoes[j].tags[0] = arbConfirmacaoJogo[i].confirmacaoAtual;
          }
          if (preNomeacoes[j].arbitro_2 == arbConfirmacaoJogo[i].arbitro) {
            preNomeacoes[j].tags[1] = arbConfirmacaoJogo[i].confirmacaoAtual;
          }
          if (preNomeacoes[j].juiz_linha[0] == arbConfirmacaoJogo[i].arbitro) {
            preNomeacoes[j].tags[2] = arbConfirmacaoJogo[i].confirmacaoAtual;
          }
          if (preNomeacoes[j].juiz_linha[1] == arbConfirmacaoJogo[i].arbitro) {
            preNomeacoes[j].tags[3] = arbConfirmacaoJogo[i].confirmacaoAtual;
          }
          if (preNomeacoes[j].juiz_linha[2] == arbConfirmacaoJogo[i].arbitro) {
            preNomeacoes[j].tags[4] = arbConfirmacaoJogo[i].confirmacaoAtual;
          }
          if (preNomeacoes[j].juiz_linha[3] == arbConfirmacaoJogo[i].arbitro) {
            preNomeacoes[j].tags[5] = arbConfirmacaoJogo[i].confirmacaoAtual;
          }
        }
      }
    }

    // console.log("PRENOME+ACOES COM AS CONFIRMAÇÕES");

    // console.log(preNomeacoes);

    // for (let index = 0; index < preNomeacoes.length; index++) {
    //   if (preNomeacoes[index].arbitro_1 === arb.nome) {
    //     let n = nomeacoes.findOne({ arbitro: arb });
    //     for (let index = 0; index < n.nomeacoesPrivadas.length; index++) {
    //       const jogo = n.nomeacoesPrivadas[index].jogo;
    //       // console.log("jogo", jogo);
    //       // console.log("preNomeacoes[index].id", preNomeacoes[index].id);
    //       if (jogo.id == preNomeacoes[index].id) {
    //         preNomeacoes[index].tags[0] =
    //           n.nomeacoesPrivadas[index].confirmacaoAtual[0];
    //         // console.log("mudou?? agora está assim", preNomeacoes);
    //       }
    //     }
    //   }
    //   if (preNomeacoes[index].arbitro_2 === arb.nome) {
    //     let n = nomeacoes.findOne({ arbitro: arb });
    //     for (let index = 0; index < n.nomeacoesPrivadas.length; index++) {
    //       const jogo = n.nomeacoesPrivadas[index].jogo;
    //       if (jogo.id == preNomeacoes[index].id) {
    //         preNomeacoes[index].tags[1] =
    //           n.nomeacoesPrivadas[index].confirmacaoAtual[0];
    //       }
    //     }
    //   }
    //   if (preNomeacoes[index].juiz_linha[0].includes(arb.nome)) {
    //     let n = nomeacoes.findOne({ arbitro: arb });
    //     for (let index = 0; index < n.nomeacoesPrivadas.length; index++) {
    //       const jogo = n.nomeacoesPrivadas[index].jogo;
    //       if (jogo.id == preNomeacoes[index].id) {
    //         preNomeacoes[index].tags[2] =
    //           n.nomeacoesPrivadas[index].confirmacaoAtual[0];
    //       }
    //     }
    //   }
    //   if (preNomeacoes[index].juiz_linha[1].includes(arb.nome)) {
    //     let n = nomeacoes.findOne({ arbitro: arb });
    //     for (let index = 0; index < n.nomeacoesPrivadas.length; index++) {
    //       const jogo = n.nomeacoesPrivadas[index].jogo;
    //       if (jogo.id == preNomeacoes[index].id) {
    //         preNomeacoes[index].tags[3] =
    //           n.nomeacoesPrivadas[index].confirmacaoAtual[0];
    //       }
    //     }
    //   }
    //   if (preNomeacoes[index].juiz_linha[2].includes(arb.nome)) {
    //     let n = nomeacoes.findOne({ arbitro: arb });
    //     for (let index = 0; index < n.nomeacoesPrivadas.length; index++) {
    //       const jogo = n.nomeacoesPrivadas[index].jogo;
    //       if (jogo.id == preNomeacoes[index].id) {
    //         preNomeacoes[index].tags[4] =
    //           n.nomeacoesPrivadas[index].confirmacaoAtual[0];
    //       }
    //     }
    //   }
    //   if (preNomeacoes[index].juiz_linha[3].includes(arb.nome)) {
    //     let n = nomeacoes.findOne({ arbitro: arb });
    //     for (let index = 0; index < n.nomeacoesPrivadas.length; index++) {
    //       const jogo = n.nomeacoesPrivadas[index].jogo;
    //       if (jogo.id == preNomeacoes[index].id) {
    //         preNomeacoes[index].tags[5] =
    //           n.nomeacoesPrivadas[index].confirmacaoAtual[0];
    //       }
    //     }
    //   }
    // }

    let ca = conselhoDeArbitragem.find();
    ca.forEach((ca) => {
      conselhoDeArbitragem.update(
        { arbitrosCA: ca.arbitrosCA },
        { $set: { preNomeacoes: preNomeacoes } }
      );
    });
  },

  carregaNomeacoesTotal: function carregaNomeacoesTotal() {
    let n = [];
    var j = jogos.find();
    j.forEach((element) => {
      n.push(element);
    });
    return n;
  },

  carregaNomeacoes: function carregaNomeacoes(email) {
    var arb = arbitros.findOne({ email: email });
    var result = nomeacoes.findOne({ arbitro: arb });
    return result;
  },

  nomeacoesForamUpdated: function nomeacoesForamUpdated(user, data) {
    let arb = arbitros.findOne({ email: user.emails[0].address });
    let nomeacoesArbitro = nomeacoes.findOne({ arbitro: arb });

    // console.log("data", data);
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

  carregaResultadosJogosPassados: function (email) {
    var arb = arbitros.findOne({ email: email });
    var result = jogosPassados.findOne({ arbitro: arb });
    return result;
  },

  carregaResultadosJogosPassadosCA: function () {
    var arb = arbitros.find();
    let result = [];
    arb.forEach((element) => {
      var prelimResult = jogosPassados.findOne({ arbitro: element });
      if (prelimResult.nomeacoesPrivadas != undefined) {
        prelimResult = prelimResult.nomeacoesPrivadas;
        if (prelimResult.length > 0) {
          for (let index = 0; index < prelimResult.length; index++) {
            result.push(prelimResult[index]);
          }
        }
      }
    });
    return result.sort();
  },

  /*****************************************************************
   **************** METODOS DAS INDISPONIBILIDADES *************
   *****************************************************************
   */
  addIndisponibilidade: function addIndisponibilidade(username, events) {
    // console.log("events recebidos", events);

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

  addRestricao: function addRestricao(username, novaRestricao) {
    try {
      //console.log("novaR", novaRestricao);

      const a = arbitros.findOne({ nome: username });
      //console.log("a", a);
      const r = restricoes.findOne({ arbitro: a });
      //console.log("r", r);
      let restricoesDoArbitro = r.relacoes;

      //console.log("restricoesDoArbitro", restricoesDoArbitro);

      for (let index = 0; index < restricoesDoArbitro.length; index++) {
        const element = restricoesDoArbitro[index];
        let cargos = element.Cargo;

        if (element.key === novaRestricao.key) {
          //console.log("chaves iguais");
          if (element.Clube === novaRestricao.Clube) {
            //console.log("clubes iguais");
            if (
              cargos[0] === novaRestricao.Cargo[0] &&
              cargos[1] === novaRestricao.Cargo[1] &&
              cargos[2] === novaRestricao.Cargo[2] &&
              cargos[3] === novaRestricao.Cargo[3]
            ) {
              // console.log("cargos iguais");
              if (element.Descricao === novaRestricao.Descricao) {
                //  console.log("descricao igual");
                return -1;
              }
            }
          }
        }
      }

      restricoesDoArbitro.push(novaRestricao);

      restricoes.update(
        { arbitro: a },
        { $set: { relacoes: restricoesDoArbitro } }
      );
      return 1;
    } catch (error) {
      return 0;
    }
  },

  updateRestricoes: function updateRestricoes(username, key) {
    try {
      const a = arbitros.findOne({ nome: username });
      const r = restricoes.findOne({ arbitro: a });
      let restricoesDoArbitro = r.relacoes;

      let restricoesNovas = [];

      restricoesDoArbitro.forEach((element) => {
        if (element.key != key) {
          restricoesNovas.push(element);
        }
      });

      restricoes.update(
        { arbitro: a },
        { $set: { relacoes: restricoesNovas } }
      );
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
        { $set: { emiteRecibo: true } }
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
      definicoesPessoais.update({ arbitro: a }, { $set: { temCarro: true } });
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
        { $set: { emiteRecibo: false } }
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
      definicoesPessoais.update({ arbitro: a }, { $set: { temCarro: false } });
      return 1;
    } catch (error) {
      return -1;
    }
  },

  getRecibo: function getRecibo(user) {
    let utilizador = Meteor.users.findOne({ username: user.username });
    let email = utilizador.emails[0].address;
    var arb = arbitros.findOne({ email: email });
    var def = definicoesPessoais.findOne({ arbitro: arb });
    var result = def.emiteRecibo;
    return result;
  },

  getTransporte: function getTransporte(user) {
    let utilizador = Meteor.users.findOne(user);
    let email = utilizador.emails[0].address;
    var arb = arbitros.findOne({ email: email });
    var def = definicoesPessoais.findOne({ arbitro: arb });
    var result = def.temCarro;
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

  getLicenca: function getLicenca(user) {
    let utilizador = Meteor.users.findOne(user);
    let email = utilizador.emails[0].address;
    var arb = arbitros.findOne({ email: email });
    var result = arb.licenca;
    return result;
  },

  /*****************************************************************
   **************** METODOS DO CONSELHO DE ARBITRAGEM *************
   *****************************************************************
   */

  jogosForamUpdated: function jogosForamUpdated(user, data) {
    let arb = arbitros.findOne({ email: user.emails[0].address });
    let ca = conselhoDeArbitragem.findOne({ arbitrosCA: arb });
    let atuaisPreNomeacoes = ca.preNomeacoes;
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
        id: jogo.id + "",
        dia: jogo.dia,
        hora: jogo.hora,
        prova: jogo.prova,
        serie: jogo.serie,
        equipas: jogo.equipas,
        pavilhao: jogo.pavilhao,
        arbitro_1: jogo.arbitro_1,
        arbitro_2: jogo.arbitro_2,
        juiz_linha: jogo.juiz_linha,
        key: jogo.key,
      });
    }

    nomeacoes.remove({});

    let games = jogos.find();
    let refs = arbitros.find();

    refs.forEach((arbitro) => {
      let nomeacoesAuxiliares = [];

      // VERIFICA PARA CADA JOGO QUE ARBITRO(S) ESTA(O) ASSOCIADO(S) A ELE
      games.forEach((jogo) => {
        if (
          jogo.arbitro_1 === arbitro.nome ||
          jogo.arbitro_2 === arbitro.nome ||
          jogo.juiz_linha.includes(arbitro.nome)
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

    let ca = conselhoDeArbitragem.find();

    let ca1;

    ca.forEach((ca) => {
      conselhoDeArbitragem.update(
        { arbitrosCA: ca.arbitrosCA },
        { $set: { enviado: true } }
      );

      //console.log("CA", ca);
      ca1 = ca.arbitrosCA;
    });

    let games_ca = conselhoDeArbitragem.findOne({
      arbitrosCA: ca1,
    }).preNomeacoes;

    let newGames_ca = [];

    for (let index = 0; index < games_ca.length; index++) {
      let element = games_ca[index];

      if (element.arbitro_1 !== "") {
        element.tags[0] = "pendente";
        games_ca[index] = element;
      }
      if (element.arbitro_2 !== "") {
        element.tags[1] = "pendente";
        games_ca[index] = element;
      }
      if (element.juiz_linha[0] !== "") {
        element.tags[2] = "pendente";
        games_ca[index] = element;
      }
      if (element.juiz_linha[1] !== "") {
        element.tags[3] = "pendente";
        games_ca[index] = element;
      }
      if (element.juiz_linha[2] !== "") {
        element.tags[4] = "pendente";
        games_ca[index] = element;
      }
      if (element.juiz_linha[3] !== "") {
        element.tags[5] = "pendente";
        games_ca[index] = element;
      }

      newGames_ca.push(element);
    }

    ca.forEach((ca) => {
      conselhoDeArbitragem.update(
        { arbitrosCA: ca.arbitrosCA },
        { $set: { preNomeacoes: newGames_ca } }
      );
    });
  },

  alteraNomeacao: function alteraNomeacao(jogo, user) {
    jogo = {
      id: jogo.Jogo,
      dia: jogo.Dia,
      equipas: jogo.Equipas,
      hora: jogo.Hora,
      prova: jogo.Prova,
      serie: jogo.Serie,
      pavilhao: jogo.Pavilhao,
      arbitro_1: jogo.Arbitro1,
      arbitro_2: jogo.Arbitro2,
      juiz_linha: [
        jogo.JL1,
        jogo.JL2,
        // , jogo.JL3, jogo.JL4
      ],
      key: jogo.key,
    };

    // 1º PASSO: Encontra jogo em Jogos pelo id
    // Remove o jogo antigo e adiciona o jogo atualizado
    let novosJogos = [];
    let j = jogos.find();
    let jogosAntigos = [];

    j.forEach((jogo) => {
      jogosAntigos.push(jogo);
    });
    let jogoAntigo;

    for (let index = 0; index < jogosAntigos.length; index++) {
      // console.log("jogosAntigos[index]", jogosAntigos[index]);
      // console.log("jogo", jogo);

      if (jogosAntigos[index].id !== jogo.id)
        novosJogos.push(jogosAntigos[index]);
      else jogoAntigo = jogosAntigos[index];
    }

    novosJogos.push(jogo);

    jogos.remove({});
    for (let index = 0; index < novosJogos.length; index++) {
      jogos.insert(novosJogos[index]);
    }

    // 2º PASSO
    // Altera membros da equipa de arbitragem associada ao jogo

    // EQUIPA DE ARBITRAGEM ANTIGA
    let arbitro1Antigo = jogoAntigo.arbitro_1;
    let arbitro2Antigo = jogoAntigo.arbitro_2;
    let jl1Antigo = jogoAntigo.juiz_linha[0];
    let jl2Antigo = jogoAntigo.juiz_linha[1];
    // let jl3Antigo = jogo.juiz_linha[2];
    // let jl4Antigo = jogo.juiz_linha[3];

    // EQUIPA DE ARBITRAGEM NOVA

    let arbitro1Novo = jogo.arbitro_1;
    let arbitro2Novo = jogo.arbitro_2;
    let jl1Novo = jogo.juiz_linha[0];
    let jl2Novo = jogo.juiz_linha[1];
    // let jl3Novo = jogo.juiz_linha[2];
    // let jl4Novo = jogo.juiz_linha[3];

    // Verificar as diferenças entre as equipas de arbitragem
    // Altera a confirmação para pendente

    // console.log("user", user);

    let arb = arbitros.findOne({ email: user.emails[0].address });
    let ca = conselhoDeArbitragem.findOne({ arbitrosCA: arb });
    let caPreGames = ca.preNomeacoes;

    if (arbitro1Antigo !== arbitro1Novo) {
      // Nomeacao foi alterada no 1º Arbitro
      mudaArbitro(arbitro1Antigo, arbitro1Novo, jogo);

      for (let index = 0; index < caPreGames.length; index++) {
        const element = caPreGames[index];

        if (element.id === jogo.id) {
          element.tags = [
            "pendente",
            element.tags[1],
            element.tags[2],
            element.tags[3],
            element.tags[4],
            element.tags[5],
          ];
          caPreGames[index] = element;
        }
      }
    }

    if (arbitro2Antigo !== arbitro2Novo) {
      // Nomeacao foi alterada no 2º Arbitro
      mudaArbitro(arbitro2Antigo, arbitro2Novo, jogo);
      for (let index = 0; index < caPreGames.length; index++) {
        const element = caPreGames[index];

        if (element.id === jogo.id) {
          element.tags = [
            element.tags[0],
            "pendente",
            element.tags[2],
            element.tags[3],
            element.tags[4],
            element.tags[5],
          ];
          caPreGames[index] = element;
        }
      }
    }

    if (jl1Antigo !== jl1Novo) {
      // Nomeacao foi alterada no JL1
      mudaArbitro(jl1Antigo, jl1Novo, jogo);
      for (let index = 0; index < caPreGames.length; index++) {
        const element = caPreGames[index];

        if (element.id === jogo.id) {
          element.tags = [
            element.tags[0],
            element.tags[1],
            "pendente",
            element.tags[3],
            element.tags[4],
            element.tags[5],
          ];
          caPreGames[index] = element;
        }
      }
    }

    if (jl2Antigo !== jl2Novo) {
      mudaArbitro(jl2Antigo, jl2Novo, jogo);
      for (let index = 0; index < caPreGames.length; index++) {
        const element = caPreGames[index];

        if (element.id === jogo.id) {
          element.tags = [
            element.tags[0],
            element.tags[1],
            element.tags[2],
            "pendente",
            element.tags[4],
            element.tags[5],
          ];
          caPreGames[index] = element;
        }
      }
    }

    // if (jl3Antigo !== jl3Novo) {
    //   // Nomeacao foi alterada no JL3
    //   mudaArbitro(jl3Antigo, jl3Novo, jogo);
    // }

    // if (jl4Antigo !== jl4Novo) {
    //   // Nomeacao foi alterada no JL4
    //   mudaArbitro(jl4Antigo, jl4Novo, jogo);
    // }

    ca = conselhoDeArbitragem.find();
    ca.forEach((ca) => {
      conselhoDeArbitragem.update(
        { arbitrosCA: ca.arbitrosCA },
        { $set: { preNomeacoes: caPreGames } }
      );
    });

    return true;
  },

  getClubesDisponiveis: function getClubesDisponiveis() {
    let clubesDisponiveis = [];

    clubes.find().forEach((clube) => {
      clubesDisponiveis.push(clube);
    }); //   Vai buscar toda a info na bd de clubes

    let resultado = [];
    for (let i = 1; i < clubesDisponiveis.length; i++) {
      if (clubesDisponiveis[i][0] != "")
        resultado.push(clubesDisponiveis[i][0]);
    }
    return resultado.sort();
  },

  verificaRestricoes: function verificaRestricoes(nomeArbitro) {
    let arb = arbitros.findOne({ nome: nomeArbitro });
    let resultado;

    try {
      let defP = definicoesPessoais.findOne({ arbitro: arb });
      // console.log("arb", arb);
      // console.log("defP", defP);

      let temCarro = defP.temCarro;
      let emiteRecibo = defP.emiteRecibo;

      resultado = {
        temCarro: temCarro,
        emiteRecibo: emiteRecibo,
        relacaoComEquipas: "",
      };
    } catch (error) {
      resultado = {
        temCarro: false,
        emiteRecibo: false,
        relacaoComEquipas: "",
      };
    }

    let relacoesClubes = restricoes.findOne({ arbitro: arb });
    let relacoes = relacoesClubes.relacoes;

    if (relacoes == undefined || relacoes.length === 0) {
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
        for (let index = 0; index < element.Cargo.length; index++) {
          if (element.Cargo[index]) {
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
    funcao,
    edit
  ) {
    //console.log(" currJogo: ", currJogo);

    let titulo =
      "Jogo nº" +
      currJogo.Jogo +
      " " +
      // currJogo.Prova +
      // " " +
      // currJogo.Serie +
      // " " +
      // currJogo.Equipas
      // +
      // " " +
      currJogo.Pavilhao;
    // console.log("titulo: ", titulo);

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
      title: titulo,
      id: newId,
      start: startStr,
      end: endStr,
      color: "#000000",
      editable: false,
      className: "hideCalendarTime",
      draggable: false,
    };

    // console.log("novoEvento", novoEvento);

    const a = arbitros.findOne({ nome: nomeArbitro });
    // console.log("a", a);
    let i = indisponibilidades.findOne({ arbitro: a });
    // console.log("i", i);

    let events = i.disponibilidades;
    // console.log("events", events);

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
          atuaisPreNomeacoes[index].juiz_linha[0] = nomeArbitro;
        } else if (funcao.toString().includes("option_2_jl")) {
          atuaisPreNomeacoes[index].juiz_linha[1] = nomeArbitro;
        } else if (funcao.toString().includes("option_3_jl")) {
          atuaisPreNomeacoes[index].juiz_linha[2] = nomeArbitro;
        } else if (funcao.toString().includes("option_4_jl")) {
          atuaisPreNomeacoes[index].juiz_linha[3] = nomeArbitro;
        }
      }
    }
    let newGames = atuaisPreNomeacoes;

    conselhoDeArbitragem.remove({});

    for (let index = 0; index < arbCAs.length; index++) {
      conselhoDeArbitragem.insert({
        arbitrosCA: arbCAs[index],
        preNomeacoes: newGames,
        enviado: edit,
      });
    }

    return true;
  },

  // PUTO ESTA MAL ELE ADICIONA REPETIDO!!!!

  removeNomeacaoCalendarioArbitro: function removeNomeacaoCalendarioArbitro(
    nomeArbitro,
    tituloJogo,
    currJogo,
    funcao
  ) {
    // console.log("nomeArbitro", nomeArbitro);
    // console.log("tituloJogo", tituloJogo);
    // console.log("currJogo", currJogo);
    // console.log("funcao", funcao);

    const a = arbitros.findOne({ nome: nomeArbitro });
    // console.log("a", a);
    const i = indisponibilidades.findOne({ arbitro: a });
    // console.log("i", i);

    let events = i.disponibilidades;

    // console.log("events", events);

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

    // console.log("novosEvents", novosEvents);

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
          atuaisPreNomeacoes[index].juiz_linha[0] = "";
        } else if (funcao.toString().includes("option_2_jl")) {
          atuaisPreNomeacoes[index].juiz_linha[1] = "";
        } else if (funcao.toString().includes("option_3_jl")) {
          atuaisPreNomeacoes[index].juiz_linha[2] = "";
        } else if (funcao.toString().includes("option_4_jl")) {
          atuaisPreNomeacoes[index].juiz_linha[3] = "";
        }
      }
    }
    let newGames = atuaisPreNomeacoes;

    for (let index = 0; index < arbCAs.length; index++) {
      let arbitroCA = arbCAs[index];
      conselhoDeArbitragem.update(
        {
          arbitrosCA: arbitroCA,
        },
        { $set: { preNomeacoes: newGames } }
      );
      conselhoDeArbitragem.update(
        {
          arbitrosCA: arbitroCA,
        },
        { $set: { enviado: true } }
      );
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
          juiz_linha: [
            jogos[index][9],
            jogos[index][10],
            jogos[index][11],
            jogos[index][12],
          ],
          key: index,
          tags: ["", "", "", "", "", ""],
        };
        newGames.push(game);
      }
    }

    for (let index = 0; index < arbCAs.length; index++) {
      let arbitroCA = arbCAs[index];

      conselhoDeArbitragem.update(
        {
          arbitrosCA: arbitroCA,
        },
        { $set: { preNomeacoes: newGames } }
      );

      conselhoDeArbitragem.update(
        {
          arbitrosCA: arbitroCA,
        },
        { $set: { enviado: false } }
      );
    }

    return true;
  },

  carregaJogosSemanais: function carregaJogosSemanais(email) {
    // console.log("email", email);
    const a = arbitros.findOne({ email: email });
    //console.log("a", a);
    const ca = conselhoDeArbitragem.findOne({ arbitrosCA: a });
    //console.log("ca", ca);
    return [ca.preNomeacoes, ca.enviado];
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
    // ESTA DISPONIVEL NAQUELE HORARIO?

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
      let disponibilidades = indisponibilidade.disponibilidades; //Vai buscar o array de disponibilidades

      if (disponibilidades.length == 0) {
        // console.log("Disponivel.");
        nomesArbitrosDisponiveis.push(indisponibilidade.arbitro.nome);
      } else {
        let v = validDate(disponibilidades, inicioDoJogo, fimDoJogo, jogo);
        if (!v) {
          // Nao esta disponivel
        } else if (v) {
          //console.log("Disponivel.");
          nomesArbitrosDisponiveis.push(indisponibilidade.arbitro.nome);
        }
      }
    });

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

    // console.log("tem recibo?", temRecibo);
    // console.log("não tem recibo?", naoTemRecibo);
    // console.log("tem transporte", temTransporte);
    // console.log("não tem transporte?", naoTemTransporte);

    let filtrosAtivos =
      temRecibo || naoTemRecibo || temTransporte || naoTemTransporte;

    if (!filtrosAtivos)
      if (clubesRelacionados.length === 0) {
        // NAO QUERO SABER DAS RELACOES COM CLUBES
        nomesArbitrosDisponiveis.push(" ");
        return nomesArbitrosDisponiveis.sort();
      }

    // QUERO RECIBOS:

    let arbitrosDisponiveisComRecibo = [];
    let arbitrosDisponiveisSemRecibo = [];

    let arbitrosDisponiveisRecibos = [];

    //console.log("nomesArbitrosDisponiveis", nomesArbitrosDisponiveis);

    if (temRecibo) {
      for (let index = 0; index < nomesArbitrosDisponiveis.length; index++) {
        let arb = arbitros.findOne({ nome: nomesArbitrosDisponiveis[index] });
        //console.log("arb", arb);
        let def = definicoesPessoais.findOne({ arbitro: arb });
        //console.log("def", def);
        if (def.emiteRecibo) {
          arbitrosDisponiveisComRecibo.push(arb.nome);
        }
      }
      arbitrosDisponiveisRecibos = arbitrosDisponiveisComRecibo;
    } else if (naoTemRecibo) {
      for (let index = 0; index < nomesArbitrosDisponiveis.length; index++) {
        let arb = arbitros.findOne({ nome: nomesArbitrosDisponiveis[index] });
        let def = definicoesPessoais.findOne({ arbitro: arb });
        if (!def.emiteRecibo) {
          arbitrosDisponiveisSemRecibo.push(arb.nome);
        }
      }
      arbitrosDisponiveisRecibos = arbitrosDisponiveisSemRecibo;
    }

    // NAO QUERO RECIBOS
    if (!temRecibo && !naoTemRecibo) {
      arbitrosDisponiveisRecibos = nomesArbitrosDisponiveis;
    }

    //console.log("arbitrosDisponiveisRecibos", arbitrosDisponiveisRecibos);

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
      for (let index = 0; index < arbitrosDisponiveisRecibos.length; index++) {
        let arb = arbitros.findOne({ nome: arbitrosDisponiveisRecibos[index] });
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
              if (currentRelacao.Cargo[index]) {
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

function validDate(disponibilidades, inicioDoJogo, fimDoJogo, jogo) {
  if (disponibilidades.length === 0) return true;
  else {
    let resultado = true;
    // console.log("disponibilidades", disponibilidades);
    // console.log("inicioDoJogo", inicioDoJogo);
    // console.log("fimDoJogo", fimDoJogo);
    for (var element of disponibilidades) {
      // hora de jogo começa antes que indisponibilidade a ser verificada
      if (inicioDoJogo < new Date(element.start)) {
        // jogo termina (contando 2 horas) antes de indisponibilidade a ser verficada
        if (fimDoJogo < new Date(element.start)) {
          resultado = true;
        } // jogo termina depois de uma indisponibilidade já marcada!
        else {
          resultado = false;
          break;
        }
      }
      // hora de jogo começa antes de indisponibilidade já ter terminado
      else if (inicioDoJogo >= new Date(element.end)) {
        resultado = true;

        // o arbitro consegue ir a esse pavilhao se já tem outro jogo?

        // for (let index = 0; index < disponibilidades.length; index++) {
        //   if (disponibilidades[index].title.includes("Jogo")) {
        //     let pavilhaoDaNomeacao = disponibilidades[index].title;
        //     pavilhaoDaNomeacao = pavilhaoDaNomeacao.substring(7);
        //     let indexC = pavilhaoDaNomeacao.indexOf(" ");
        //     pavilhaoDaNomeacao = pavilhaoDaNomeacao.substring(indexC);

        //     console.log("pavilhaoDaNomeacao?", pavilhaoDaNomeacao);
        //   }
        // }
      } else {
        resultado = false;
        break;
      }
    }

    //console.log("jogo", jogo);

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

function mudaArbitro(arbitroAntigo, arbitroNovo, jogo) {
  if (arbitroAntigo === "") {
    // Não havia 1º Arbitro designado
    let arb = arbitros.findOne({ nome: arbitroNovo });
    let n = nomeacoes.findOne({ arbitro: arb });

    let nPriv = n.nomeacoesPrivadas;

    nPriv.push({ jogo: jogo, confirmacaoAtual: ["pendente"] });

    nomeacoes.update({ arbitro: arb }, { $set: { nomeacoesPrivadas: nPriv } });
  } else {
    // Havia arbitro designado

    // Remove a nomeacao ao arbitro designado anterior
    let arb = arbitros.findOne({ nome: arbitroAntigo });
    let n = nomeacoes.findOne({ arbitro: arb });

    let nPriv = n.nomeacoesPrivadas;
    let novasNpriv = [];

    for (let index = 0; index < nPriv.length; index++) {
      if (nPriv[index].jogo.id != jogos.id) {
        novasNpriv.push(nPriv[index]);
      }
    }
    nomeacoes.update({ arbitro: arb }, { $set: { nomeacoesPrivadas: nPriv } });

    // Adiciona a nomeação ao novo arbitro designado

    arb = arbitros.findOne({ nome: arbitroNovo });
    n = nomeacoes.findOne({ arbitro: arb });
    nPriv = n.nomeacoesPrivadas;
    nPriv.push({ jogo: jogo, confirmacaoAtual: ["pendente"] });
    nomeacoes.update({ arbitro: arb }, { $set: { nomeacoesPrivadas: nPriv } });

    // Falta modificar as nomeações de modo a incluir o novo membro da equipa de arbitragem

    let nTotal = nomeacoes.find();

    nTotal.forEach((element) => {
      if (element.nomeacoesPrivadas.length > 0) {
        let newPrivNom = [];
        for (let index = 0; index < element.nomeacoesPrivadas.length; index++) {
          if (element.nomeacoesPrivadas[index].jogo.key !== jogo.key) {
            newPrivNom.push(element.nomeacoesPrivadas[index]);
          } else {
            let confirmacao = element.nomeacoesPrivadas[index].confirmacaoAtual;
            newPrivNom.push({ jogo: jogo, confirmacaoAtual: confirmacao });
          }
        }
      }
    });
  }
}

function hasDST(str) {
  // O atual regime de mudança da hora é regulado por uma diretiva (lei comunitária) de 2000, que prevê que todos os anos os relógios sejam, respetivamente, adiantados e atrasados uma hora no último domingo de março e no último domingo de outubro, marcando o início e o fim da hora de verão.

  Date.prototype.stdTimezoneOffset = function () {
    var fy = this.getFullYear();
    console.log("fy", fy);
    if (!Date.prototype.stdTimezoneOffset.cache.hasOwnProperty(fy)) {
      var maxOffset = new Date(fy, 0, 1).getTimezoneOffset();
      console.log("maxOffset", maxOffset);
      var monthsTestOrder = [6, 7, 5, 8, 4, 9, 3, 10, 2, 11, 1];

      for (var mi = 0; mi < 12; mi++) {
        var offset = new Date(fy, monthsTestOrder[mi], 1).getTimezoneOffset();
        console.log("offset: ", offset);
        if (offset != maxOffset) {
          maxOffset = Math.max(maxOffset, offset);
          break;
        }
      }
      Date.prototype.stdTimezoneOffset.cache[fy] = maxOffset;
      console.log(
        "   Date.prototype.stdTimezoneOffset.cache[fy]",
        Date.prototype.stdTimezoneOffset.cache[fy]
      );
    }
    return Date.prototype.stdTimezoneOffset.cache[fy];
  };

  Date.prototype.stdTimezoneOffset.cache = {};

  let d = new Date(str);

  Date.prototype.isDST = function () {
    console.log("this.getTimezoneOffset()", this.getTimezoneOffset());
    return this.getTimezoneOffset() < this.stdTimezoneOffset();
  };
}

function addFeriados(r) {
  let feriadosNacionais = [
    { nome: "Dia de Ano Novo", data: "01/01" },
    { nome: "Dia da Liberdade", data: "25/04" },
    { nome: "Dia do Trabalhador", data: "01/05" },
    {
      nome: "Portugal, Camões e Comunidades Portuguesas",
      data: "10/06",
    },
    { nome: "Implantação da República", data: "05/10" },
    { nome: "Restauração da Independência", data: "01/12" },
    { nome: "Imaculada Conceição", data: "08/12" },
    { nome: "Natal", data: "25/12" },
  ];
  for (let index = 0; index < feriadosNacionais.length; index++) {
    let newId = _("feriado");
    let titulo = feriadosNacionais[index].nome;
    let startStr =
      CURRENT_YEAR +
      "-" +
      feriadosNacionais[index].data.split("/")[1] +
      "-" +
      feriadosNacionais[index].data.split("/")[0] +
      "T08:00:00Z";

    let endStr =
      CURRENT_YEAR +
      "-" +
      feriadosNacionais[index].data.split("/")[1] +
      "-" +
      feriadosNacionais[index].data.split("/")[0] +
      "T09:00:00Z";

    if (!hasDST(startStr)) {
      startStr =
        CURRENT_YEAR +
        "-" +
        feriadosNacionais[index].data.split("/")[1] +
        "-" +
        feriadosNacionais[index].data.split("/")[0] +
        "T07:00:00Z";

      endStr =
        CURRENT_YEAR +
        "-" +
        feriadosNacionais[index].data.split("/")[1] +
        "-" +
        feriadosNacionais[index].data.split("/")[0] +
        "T08:00:00Z";
    }

    let novoEvento = {
      title: titulo,
      id: newId,
      start: startStr,
      end: endStr,
      color: "#000000",
      editable: false,
      className: "hideCalendarTime",
      draggable: false,
    };

    r.push(novoEvento);
  }
  return r;
}
