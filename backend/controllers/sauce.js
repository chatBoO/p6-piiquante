// import du modèle "Sauce"
const Sauce = require('../models/Sauce');

// import du module FS (File System) pour créer et gérer des fichiers pour y lire ou stocker
const fs  = require ('fs');

// export du controlleur pour créer une sauce
exports.createSauce = (req, res, next) => {

    const sauceObject = JSON.parse(req.body.sauce); // on récupère l'objet en parsant la chaine de caractères JSON
    delete sauceObject._id; // supression de l'id de la requête car il sera créé automatiquement par la BDD
    delete sauceObject._userId; // supression de l'userId pour éviter les requêtes malveillantes. On va utiliser l'userId du token d'identification à la place
    
    const sauce = new Sauce({ // création d'une nouvelle sauce via le schéma "SAUCE" 
      ...sauceObject, // on parcourt l'objet pour récupérer les informations
      userId: req.auth.userId, // on remplace de userId de la requête par l'userID du token
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}` // on créer l'URL de l'image : {http}://{localhost:3000}/images/{nom de limage par multer}
    });
    sauce.save() // On sauvegarde dans la BDD
      .then(() => res.status(201).json({message: "Nouvelle sauce enregistrée !"}))
      .catch((error) => res.status(400).json({ error }));
};

// export du controller qui affiche TOUTES les sauces
exports.getAllSauce = (req, res, next) => {
    Sauce.find() // utilisation de la méthode .find() pour récupérer la liste complète des sauces
      .then((sauces) => res.status(200).json(sauces)) // récupération du tableau de toutes les sauces dans la base
      .catch((error) => res.status(400).json({ error }));
};

// export du controller qui affiche UNE SEULE sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id}) // utilisation de la méthode .findOne avec en paramètre la comparaison de l'id en paramètre de requête et les id de la BDD
        .then((sauce) => res.status(200).json(sauce)) // récupération des informations de la sauce récupérée
        .catch((error) => res.status(404).json({ error: error}));
};


// export du controller qui supprime une sauce
exports.deleteOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id}) // utilisation de la méthode .findOne avec en paramètre la comparaison de l'id en paramètre de requête et les id de la BDD
    .then((sauce) => {
       // on vérifie que l'userID de la BDD correspond au userID récupéré du TOKEN
      if (sauce.userId != req.auth.userId) { // Si ce n'est pas le cas on renvoie une erreur "requête non autorisée"
        res.status(403).json({message : 'Unauthorized request !'});
      } else {
        const filename = sauce.imageUrl.split('/images/')[1]; // on récupère le nom de l'image après le dossier "images" dans l'URL

        fs.unlink(`images/${filename}`, () => { // La méthode fs.unlink() est utilisée pour supprimer le fichier "filename" dans "images"
            Sauce.deleteOne({_id: req.params.id}) // puis on supprime la sauce de la BDD
                .then(() => res.status(200).json({message: "La sauce a bien été supprimée !"}))
                .catch((error) => res.status(400).json({error}));
        })
      }
    })
    .catch((error) => res.status(500).json({error}));
};

// export du controller qui modifie une sauce
exports.modifySauce = (req, res, next) => {

  const sauceObject = req.file ? { // est-ce que la requête contient un champs "File" ? si oui
    ...JSON.parse(req.body.sauce), // on récupère l'objet en parsant la chaine de caractères JSON
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`// on créer l'URL de l'image : {http}://{localhost:3000}/images/{nom de limage par multer}
  } 
  : {...req.body };   // sinon on récupère l'objet directement

  delete sauceObject._userId; // supression de l'userId pour éviter les requêtes malveillantes

  Sauce.findOne({_id: req.params.id}) // On récupère les informations de la sauce demandée
  .then((sauce) => {
    // on vérifie que l'userID de la BDD correspond au userID récupéré du TOKEN
    if (sauce.userId != req.auth.userId) { // Si ce n'est pas le cas on renvoie une erreur "requête non autorisée"
      res.status(403).json({message : "Unauthorized request !"});
    
    } else {

      if (req.file) { // si la requête contenait une image :
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, (error) => { // alors on supprime l'ancienne image du dossier image
          if (error) {
            console.log(error);
          }
        })
      }

      // Si c'est le bon utilisateur, on met à jour la sauce avec avec l'objet "sauceObject" et l'id des paramètres de l'url
      Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({message: "La sauce a bien été modifiée !"}))
        .catch((error) => res.status(401).json({error}));
    }
  })
  .catch((error) => res.status(500).json({ error}));
};

































// exports.likeNDislike = (req,res,next) => {
//   const like = req.body.like;
//   const userId  = req.body.userId;
//   const sauceId = req.params.id;
  
//   switch (like) {
//     // like = case est égal à 1 on incremente le like de +1
//     case 1:
//      Sauce.updateOne(
//       {
//         _id: sauceId
//       },
//       {
//         $push: {usersLiked: userId}, $inc: {likes: +1}
//       }
//      )
//      .then(() => {
//       res.status(200).json({ message: "like ajouté !" });
//      })
//      .catch((error) => res.status(400).json({error}));
//      break;
//     // permet de modifié un like 
//      case 0 :
//       Sauce.findOne({_id: sauceId})
//       .then((sauce) =>{

//         if (sauce.usersLiked.includes(userId)){
//           Sauce.updateOne({_id: sauceId},
//             {$pull: {usersLiked: userId}, $inc: {likes:-1}}
//             )
//             .then(() => res .status(200).json({message: "like modifié !"}))
//             .catch((error) => res.status(400).json({error}));
//         }
//         if (sauce.usersDisliked.includes(userId)){
//           Sauce.updateOne({_id: sauceId},
//             {$pull: {usersDisliked: userId}, $inc: {likes: -1}})
//             .then (() => res.status(200).json({message: "disliked modifié !"}))
//             .catch((error) => res.status(400).json({error}));
//         }
//       })
//       .catch((error) => res.status(404).json({error}));
//       break;
//       // permet de disliker une sauce 
//     case -1:
//       Sauce.updateOne({_id: sauceId},
//       {$push: {usersDisliked : userId}, $inc: {dislikes: +1}})
//       .then(() => res.status(200).json({message: "disliked ajouté!"}))
//       .catch((error) => res.status(400).json({error}));
//       break;

//       default:console.log(error);
//   }
// }