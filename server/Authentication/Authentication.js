import { mergeEventStores } from "@fullcalendar/react";
import { Meteor} from "meteor/meteor";
import {Accounts} from "meteor/accounts-base";

const users = Meteor.users; //Stores the Meteor Users Collection in a single Variable.


function authenticateUser(user_email,password){

    var user = Accounts.findUserByEmail(user_email);
    if(user == undefined){
        throw new Meteor.Error("Invalid credentials / user does not exist.");
    }
    
    //Verificar ambiguidade dos Hashes, Hash nao inserido manualmente em registo.
    var result = Accounts._checkPassword(user,{digest:password,algorithm:"sha-256"});
    return result;
}


function registerUser(user_name,user_email,user_password,password_repeat){
    if(user_password != password_repeat)
        throw new Meteor.Error("Passwords do not match."); 
   return Accounts.createUser({username:user_name,email:user_email,password:user_password},null);
}