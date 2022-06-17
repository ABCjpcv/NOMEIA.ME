import { Meteor } from "meteor/meteor";
import { Accounts } from "meteor/accounts-base";
import { Papa } from "meteor/harrison:papa-parse";
import SimpleSchema from "simpl-schema";

let usersCollection = Meteor.users; //Stores the Meteor Users Collection in a single Variable.
let jogos = new Mongo.Collection("jogos");
let clubes = new Mongo.Collection("clubes");
let arbitros = new Mongo.Collection("arbitros");
let nomeacoes = new Mongo.Collection("nomeacoes");
let indisponibilidades = new Mongo.Collection("indisponibilidades");
let restricoes = new Mongo.Collection("restricoes");



/************************************************************************************************
 *********************************** SCHEMA TABLE ***********************************************
 ************************************************************************************************
 */

 //Schema restricoes
restricoes.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  recibo: { type:Boolean, optional: false},
  carro: { type:Boolean, optional: false},
  clubeRelacionado:{type: clubes, optional:true}
})

const eventSchema = new SimpleSchema({
  
    id: {type: Number, optional: false},
    start: {type: String, optional: false},
    end: {type: String, optional: false},
  
})

//Schema indisponibilidades
indisponibilidades.schema = new SimpleSchema({
  arbitro: { type:arbitros, optional: false},
  disponibilidades: [eventSchema]
})

//Schema nomeacoes:
nomeacoes.schema = new SimpleSchema({
  arbitro: { type: arbitros, optional: false },
  jogo: { type: jogos, optional: false },
});

//Schema Arbitros:
arbitros.schema = new SimpleSchema({
  nome: { type: String, optional: false },
  licenca: { type: Number, optional: false },
  nivel: { type: Number, optional: false },
});

//Schema Jogos importados de um dado csv.
jogos.schema = new SimpleSchema({
  id: { type: Number, optional: false }, //Retirar Unique no futuro
  dia: { type: Date, optional: false },
  hora: { type: String, optional: false },
  prova: { type: String, optional: false },
  Serie: { type: String, optional: false },
  equipa_casa: { type: String, optional: false },
  equipa_fora: { type: String, optional: false },
  pavilhao: { type: String, optional: false },
  arbitro_1: { type: String, optional: false }, // Verificar se possivel colocar Objecto Arbitro.
  arbitro_2: { type: String, optional: true }, //Mesmo que acima.
  juiz_linha_1: { type: String, optional: true },
  juiz_linha_2: { type: String, optional: true },
  juiz_linha_3: { type: String, optional: true },
  juiz_linha_4: { type: String, optional: true },
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

  utilizadores.forEach((user) => {
    arbitros.insert({
      nome: user.username,
      licenca: 0,
      nivel: 0
    });
    console.log("inserted: " + user.username);
  });

  var arb = arbitros.find();

  indisponibilidades.rawCollection().drop();

  arb.forEach((arbitro)=> {
    indisponibilidades.insert({
      arbitro: arbitro,
      disponibilidades: ""
    });
  });

  //Get the csvText:
  var csvFile = Assets.getText("Livro1.csv");
  var rows = Papa.parse(csvFile).data;

  //Setup the database, by adding games.
  for (i in rows) {
    jogos.insert(rows[i]);
    console.log("inserted" + rows[i]);
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
      throw new Meteor.Error("Invalid credentials / user does not exist.");
    }
    console.log("User found by email.");

    //Verificar ambiguidade dos Hashes, Hash nao inserido manualmente em registo.
    var result = Accounts._checkPassword(user, {
      digest: password,
      algorithm: "sha-256",
    });
    console.log(result.error == null);
    if (result) return user.username;
    if (!result) return result;
  },

  registerUser: function registerUser(
    user_name,
    user_email,
    user_password,
    password_repeat
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
    console.log("Passwords match. User registered.");
    return Accounts.createUser(
      { username: user_name, email: user_email, password: user_password },
      null
    );
  },
  addNomeacao: function addNomeacao(licenca_arbitro, id_jogo) {
    var arbitro = arbitros.find({ licenca: licenca_arbitro });
    var jogo = jogos.find({ id: id_jogo });
    var nomeacao = { arbitro, jogo };
    console.log("Arbitro " + arbitro + " ficou com o jogo " + jogo);
    nomeacoes.insert(nomeacao);
  },
  getNomeacoes: function getNomeacoes(licenca_arbitro) {
    var arbitro = arbitros.find({ licenca: licenca_arbitro });
    var result = nomeacoes.find({ arbitro: arbitro });
    console.log(result);
    return result;
  },

  /*****************************************************************
   **************** METODOS DAS INDISPONIBILIDADES *************
   *****************************************************************
   */
  addIndisponibilidade: function addIndisponibilidade(username, events) {

    

    events.forEach(element => {
      element.title = " Indisponível "
    });

    try {
      const a = arbitros.findOne({nome: username});
      indisponibilidades.update({ arbitro: a }, { $set: { disponibilidades: events } })
      return true;
    } catch (error) {
      return false;
    }
  },
  carregaHorario: function carregaHorario(username){
    const a = arbitros.findOne({nome: username});
    return indisponibilidades.findOne({arbitro: a});
  },
});


