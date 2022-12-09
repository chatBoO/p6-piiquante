// import du module "mongoose" pour l'accès à la base de données
const mongoose = require('mongoose');

//import du plugin mongoose error pour le gestion des erreur 
const MongooseErrors = require('mongoose-errors');

// import du plugin "mongoose-unique-validator" qui s'assure, en plus de (unique : true), qu'une adresse e-mail ne peut être utilisée que pour un seul compte
const uniqueValidator = require('mongoose-unique-validator');

// Déclaration de notre schema pour "user"
const userSchema = mongoose.Schema({

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
  
});

userSchema.plugin(MongooseErrors);
userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('User', userSchema);