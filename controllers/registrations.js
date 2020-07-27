const User = require('../models').User;

module.exports = {
   new: function(req, res){
    res.render('registrations/new');
   },
   create: function(req, res){
     let data = { // Es un json es que se usa para pasar los datos de un registro
      email: req.body.email,
      password: req.body.password // se guardara en un archvio virtual que servira solamente para encriptar el password
     };
     
     User.create(data).then(result => { // Le paso mi objeto data recien creado
        res.json(result); 
     }).catch(err => {
        res.json(err);
     }); 
   }
};
