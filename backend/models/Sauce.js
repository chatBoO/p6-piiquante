// import du module "Mongoose" pour l'accès à la base de données
const mongoose = require('mongoose');

//import du plugin mongoose error pour le gestion des erreur 
const mongooseErrors = require('mongoose-errors');

// Déclaration de notre schema pour "sauce"
const sauceSchema = mongoose.Schema({

  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
  
});

// Appel du plugin mongoose pour les erreurs
sauceSchema.plugin(mongooseErrors);

module.exports = mongoose.model("Sauce", sauceSchema);