import { Meteor } from 'meteor/meteor';
import { interactionSettingsStore, mergeEventStores } from "@fullcalendar/react";
import {Accounts} from "meteor/accounts-base";
import { parsePath } from 'react-router-dom';
import {Papa} from "meteor/harrison:papa-parse";
import SimpleSchema from "simpl-schema";

let users = Meteor.users; //Stores the Meteor Users Collection in a single Variable.
let jogos = new Mongo.Collection("jogos");
let clubes = new Mongo.Collection("clubes");
let arbitros = new Mongo.Collection("arbitros");
let nomeacoes = new Mongo.Collection("nomeacoes");

//Schema nomeacoes:
nomeacoes.schema = new SimpleSchema({
  arbitro: {type:arbitros, optional: false},
  jogo: {type:jogos, optional:false}
});


//Schema Arbitros:
arbitros.schema = new SimpleSchema({
  nome:{type:String,optional:false},
  licenca:{type:Number,optional:false},
  nivel:{type:Number,optional:false},
  //indisponibilidades:{type:Array,optional:false}
});

//Schema Jogos importados de um dado csv.
jogos.schema = new SimpleSchema({
  id:{type: Number, optional: false}, //Retirar Unique no futuro
  dia: {type:Date, optional:false},
  hora:{type: String, optional:false },
  prova: {type: String,optional:false},
  Serie: {type: String, optional:false},
  equipa_casa: {type: String,optional:false},
  equipa_fora: {type: String, optional:false},
  pavilhao:{type:String, optional:false},
  arbitro_1 : {type:String,optional:false}, // Verificar se possivel colocar Objecto Arbitro.
  arbitro_2 : {type:String,optional:true}, //Mesmo que acima.
  juiz_linha_1 : {type:String, optional:true},
  juiz_linha_2: {type:String, optional:true},
  juiz_linha_3 : {type:String,optional:true},
  juiz_linha_4 : {type:String,optional:true}

});


//Schema Clubes:
clubes.schema = new SimpleSchema({
  clube:{type:String, optional:false},
  localizacao:{type:String,optional:false},
  email:{type:String,optional:false},
  email_2:{type:String,optional:true},
  telemovel:{type:String,optional:true},
  telemovel_2:{type:String,optional:true},
  telefone:{type:String,optional:true}
});

Meteor.startup(() => {
  // If the Links collection is empty, add some data.
  


  //Read the clubs:
  var clubsCsv = Assets.getText("Clubes_AVL.csv");
  var rows = Papa.parse(clubsCsv).data;
  for(i in rows){
    clubes.insert(rows[i]);
    console.log("inserted" + rows[i]);
  }
});


Meteor.methods({
  "authenticateUser": function authenticateUser(user_email,password){
    if(user_email.length == 0)
      throw new Meteor.Error("Must insert an email.");
    if(password.length == 0)
      throw new Meteor.Error("Must insert a password.");

      console.log(user_email)

    var user = Accounts.findUserByUsername(user_email);

    console.log(user);


    if(user == undefined){
        throw new Meteor.Error("Invalid credentials / user does not exist.");
    }

    console.log("User found by email.");
    
    //Verificar ambiguidade dos Hashes, Hash nao inserido manualmente em registo.
    var result = Accounts._checkPassword(user,{digest:password,algorithm:"sha-256"});
    console.log(result.error == null);
    return result;
}

,
  "registerUser": function registerUser(user_name,user_email,user_password,password_repeat){
    console.log("Here Register.");
    console.log(user_name.length);
    if(user_name.length == 0 || user_email.length == 0 || user_password.length == 0, password_repeat.length == 0){
      console.log("Must insert fields");
      throw new Meteor.Error("Fields Missing");
    }
      if(user_password != password_repeat)
         throw new Meteor.Error("Passwords do not match."); 
      console.log("Passwords match. User registered.");
    return Accounts.createUser({username:user_name,email:user_email,password:user_password},null);
  }

,
  
  //To test:
  "readCsv" : function readCsv(filename){
    //Get the csvText:
    var csvFile = Assets.getText(filename);
    var rows = Papa.parse(csvFile).data;

    //Setup the database, by adding games.
    for(i in rows){
      jogos.insert(rows[i]);
      console.log("inserted" + rows[i]);
    }
  }
  ,

  "addNomeacao" : function addNomeacao(licenca_arbitro,id_jogo){
    var arbitro = arbitros.find({licenca:licenca_arbitro});
    var jogo = jogos.find({id:id_jogo});
    var nomeacao = {arbitro,jogo};
    console.log("Arbitro " + arbitro + " ficou com o jogo " + jogo);
    nomeacoes.insert(nomeacao);
  }
  ,
  
  "getNomeacoes" : function getNomeacoes(licenca_arbitro){
    var arbitro = arbitros.find({licenca:licenca_arbitro});
    var result = nomeacoes.find({arbitro:arbitro});
    console.log(result);
    return result;
  }
  ,

  "registerIndisponibilidades": function registerIndisponibilidades(nome, events){
    var arbitro = arbitros.find(nome);
    var novo = {arbitro,events};
    arbitro.update(novo);
    return result;
  }

});