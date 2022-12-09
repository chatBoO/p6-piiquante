// import du module "multer" pour gérer les fichiers entrants dans les requêtes
const multer = require('multer');

// objet dictionnaire pour traiter les extensions
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/bmp': 'bmp',
  'image/gif': 'gif',
  'image/svg': 'svg'
};

// création de la logique d'enregistrement des fichiers entrants sur le disque (.diskStorage)
const storage = multer.diskStorage({
  destination: (req, file, callback) => { // indique à multer où enregistrer les fichiers :
    callback(null, 'images') // null = pas d'erreurs | "images" = dossier de destination
  },
  filename: (req, file, callback) => { // indique à multer d'utiliser pour le nom de fichier : 
    const name = file.originalname.split(' ').join('_') // le nom d'origine, de remplacer les espaces par des underscores 
    const extension = MIME_TYPES[file.mimetype] // créer l'extension grâce au dictionnaire qui correspond au MIME_TYPE envoyé par le front-end
    callback(null, name + Date.now() + '.' + extension) // et d'ajouter un timestamp "Date.now()" comme nom de fichier. Elle utilise ensuite la constante dictionnaire de type MIME pour l'extension de fichier appropriée
  },
});

// export du middleware multer configuré
module.exports = multer({storage}).single('image'); // Appel de la méthode multer à laquelle on passe l'objet "storage", ainsi que de la méthode single car c'est un fichier unique qui est une image