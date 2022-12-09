// import du module "Mongoose" pour l'accès à la base de données
const mongoose = require('mongoose');

//import du plugin mongoose error pour le gestion des erreur 
const MongooseErrors = require('mongoose-errors');

// Déclaration de notre schema pour "sauce"
const sauceSchema = mongoose.Schema({

  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, default: 0}, // Par défaut à 0 qui ne contient pas de note
  dislikes: { type: Number, default: 0},
  usersLiked: { type: Array, default: []}, // Par défaut un tableau vide qui ne contient pas de d'utilisateurs
  usersDisliked: { type: Array, default: []},
  
});

// Appel du plugin mongoose pour les erreurs
sauceSchema.plugin(MongooseErrors);

module.exports = mongoose.model("Sauce", sauceSchema);