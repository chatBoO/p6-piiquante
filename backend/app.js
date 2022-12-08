//import package express
const express = require ('express');
const cors = require('cors');

const path  = require('path');

const mongoose = require('mongoose');

const dotenv = require('dotenv');

const userRoutes = require('./routes/user')


mongoose.connect('mongodb+srv://chatBoO:dragonball@cluster0.mwniqdf.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(cors());

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/auth', userRoutes);

module.exports = app;
