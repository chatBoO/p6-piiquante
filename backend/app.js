// import du package "express" (Framework)
const express = require ('express');

// import du module "mongoose" pour la base de données
const mongoose = require('mongoose');

// import module "morgan" pour l'aide au developpement, il retourne les requêtes dans la console 
const morgan = require('morgan');

// import module "path" pour la gestion de chemins de stockage
const path  = require('path');

// import du module "dotenv" pour utiliser les variables d'environnement (ici cacher l'ID et le MDP de la base de données)
const dotenv = require('dotenv');
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI; // //import de la variabe d'environnement de connection à la base da données

// import du module "cors" pour la gestion des headers 
// const cors = require('cors');

// importation de nos routes "user" et "sauce"
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//connexion à la base de données grâce à la variable d'environnement comprenant ID & MDP 
mongoose.connect(MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express(); 

// app.use(cors());

// Ajout du middleware global pour contourner les protections "CORS" lorsque les serveurs sont différents (ici Localhost:4200 et Localhost:3000)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// 
app.use(express.json());
app.use(morgan("dev"));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

