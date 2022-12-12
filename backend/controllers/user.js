//import du module "bcrypt" pour le hachage du mot de passe avant d'être enregistré en BDD
const bcrypt = require('bcrypt');

// import du module "jsonwebtoken" pour créer le token d'authentification
const jwt = require('jsonwebtoken');

// import du module "dotenv" pour utiliser les variables d'environnement (ici la variable TOKEN pour la clé d'encodage)
const dotenv = require('dotenv');
dotenv.config();
const TOKEN = process.env.TOKEN;

// import de notre modèle "User"
const User = require('../models/User');

// export de la fonction "signup"
exports.signup =(req, res, next) => {
    bcrypt.hash(req.body.password, 10) // Une fois le formulaire d'inscription rempli on crypte le mot de passe avec la méthode ".hash" de "bcrypt"
    .then(hash => {
        const user = new User({ // on utilise notre schéma "User" pour créer un nouvel utilisateur avec le mot de passe crypté
            email: req.body.email,
            password: hash,
        });
        user.save() // On enregistre le nouvel utilisateur dans la base de données
        .then(() => res.status(201).json({ message : 'utilisateur créé !' }))
        .catch (error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

// export de la fonction "login"
exports.login = (req, res, next) => {
    User.findOne({email: req.body.email}) // On cherche si le mail renseigné existe dans la base de données "users"
        .then(user => {
            if (!user) { // Si elle n'existe pas on renvoie une erreur 401 + message
               return res.status(401).json({message: "Combinaison identifiant/mot de passe incorrecte"});
            } else {
                bcrypt.compare(req.body.password, user.password) // Si elle existe on compare les mots de passe avec la méthode .compare de bcrypt pour comparer avec le hash
                    .then(valid => {
                        if (!valid) { // Si mdp incorrect on renvoie une erreur 401 + message
                           return res.status(401).json({message: "Combinaison identifiant/mot de passe incorrecte"});
                        } else {
                            res.status(200).json({ // Si l'adresse et le mdp sont corrects alors on renvoie un statut 200 pour dire que la requête a bien aboutie et :
                                userId: user._id,
                                token: jwt.sign( // On demande l'encodage du "userId" ainsi qu'un "token" d'une validité de 24h
                                    {userId: user._id},
                                    TOKEN,
                                    {expiresIn: '24h'}
                                )
                            });
                        }
                    })
                    .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};
