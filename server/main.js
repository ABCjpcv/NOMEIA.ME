import { Meteor } from 'meteor/meteor';
import { LinksCollection } from '/imports/api/links';
import { interactionSettingsStore, mergeEventStores } from "@fullcalendar/react";
import {Accounts} from "meteor/accounts-base";
import { parsePath } from 'react-router-dom';
import {Papa} from "meteor/harrison:papa-parse";
import SimpleSchema from "simpl-schema";

function insertLink({ title, url }) {
  LinksCollection.insert({title, url, createdAt: new Date()});
}

const users = Meteor.users; //Stores the Meteor Users Collection in a single Variable.
const jogos = new Mongo.Collection("jogos");
const clubes = new Mongo.Collection("clubes");

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
  if (LinksCollection.find().count() === 0) {
    insertLink({
      title: 'Do the Tutorial',
      url: 'https://www.meteor.com/tutorials/react/creating-an-app'
    });

    insertLink({
      title: 'Follow the Guide',
      url: 'http://guide.meteor.com'
    });

    insertLink({
      title: 'Read the Docs',
      url: 'https://docs.meteor.com'
    });

    insertLink({
      title: 'Discussions',
      url: 'https://forums.meteor.com'
    });
  }


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

    var user = Accounts.findUserByEmail(user_email);
    if(user == undefined){
        throw new Meteor.Error("Invalid credentials / user does not exist.");
    }

    console.log("User found by email.");
    
    //Verificar ambiguidade dos Hashes, Hash nao inserido manualmente em registo.
    var result = Accounts._checkPassword(user,{digest:password,algorithm:"sha-256"});
    return result;
}

,
  "registerUser": function registerUser(user_name,user_email,user_password,password_repeat){
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
});
