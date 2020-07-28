const User = require('../models').User;

module.exports = function(req, res, next){ // Esto se esta conectando con el archivo server.js al momento en el que tu lo importas. Estoy exportando la funcion de middlewares 
    if (!req.session.userId) return next();
    User.findByPk(req.session.userId, {
      include: [
        {
          association: 'tasks' // Voy a cargar todas las colecciones que le pertenecen al usuario
        }
      ] 
    }).then(user => {
        if(user){
        req.user = user;//Almaceno en el request la propiedad user
        next(); 
     }
  });
}

// Ya que tengo mi middleware lo voy a montar en el stack de middlewares
// y que asi se haga uso de el