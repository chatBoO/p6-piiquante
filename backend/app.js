//import package express
const express = require ('express');
const cors = require('cors');
const morgan = require('morgan');

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const path  = require('path');

const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


const app = express();

app.use(cors());

app.use(morgan("dev"));

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;

