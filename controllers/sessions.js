const User = require('../models').User;

module.exports = {
  new: function(req, res){ // Va a desplegar el formulario de autenticacion
     res.render('sessions/new');
  }, 
  create: function(req, res){// Va a recibir los datos del formulario para poder crear la sesion y completar el proceso de autenticacion  
    User.login(req.body.email, req.body.password)// Estos datos tienen que coincidir con los datos de la vista
    .then(user => {
        if(user){
          req.session.userId = user.id; // Esoy guardando el id del usuario que obtuvo el proceso de autenticacion 
        }
        res.json(user)
    })  
    .catch(err => {
     console.log(err);
     res.json(err);
   })
  },
  destroy: function(req, res){ // destruir la sesion
    req.session.destroy(function(){ //Este metodo retorna una funcion se halla eliminad una sesion por completo
       res.redirect('/sessions'); // TODOS LOS REDIRECCIONAMIENTOS SE HACEN CON LA PETICION GET -> Esto lo retorna a la route / sessions y se vuelve a ejecutar la peticion get
    }); 
  }
};