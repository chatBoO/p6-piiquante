// import du module "http" pour recevoir et répondre à des requêtes http
const http = require('http');

// import de l'application
const app = require('./app');

const normalizePort = val => { // permet de renvoyé un port valide sous forme "number" ou "chaîne de caractères"
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};


const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // On donne le port à utiliser par le serveur (le port 3000 ou la variable d'environnement)

const errorHandler = error => { //  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// création du serveur qui recevra notre application app.js
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => { // un écouteur d'évènements consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// méthode "listen" qui permet d'écouter les requêtes envoyées au server sur le port selectionné (ici le port 3000 par défaut ou bien une variable d'environnement)
server.listen(port);
