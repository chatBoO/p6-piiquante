// import du package "express" (Framework)
const express = require('express');

// import du controller "user"
const userCtrl = require('../controllers/user');

// import du module "router" d'express
const router = express.Router();

// création d'un nouvel utilisateur
router.post('/signup', userCtrl.signup);

// connexion d'un utilisateur
router.post('/login', userCtrl.login);

// exportation du module "router"
module.exports = router;