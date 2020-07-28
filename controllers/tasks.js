const Task = require('../models').Task;
const User = require('../models').User;


//Este es el archvio al que hace referencia la ruta en el metodo get. y este controlador es el que le manda la indicacion al modelo para 
//que posteriormente este haga la peticion o consulta a la base de datos
module.exports = {
  index: function(req, res){ // Esto consulta a todos los elementos que hay en mi tabla
     Task.findAll().then((tasks) => {
        // res.json(tasks) -> Esto pertenece a la v1 cuando solo mandaba json, pero ahora lo mejore y mandare html o en este caso una vista
        res.render('tasks/index',{tasks: req.user.tasks});
    })
  },
  show: function(req, res){ // consulta individual de recursos
    // res.send(req.params.id); //Envia lo que se halla enviado como parametros, en la barra buscadora. Todo esto me sirvio para que ahora haga una busqueda mas especifica pero por id 
    Task.findByPk(req.params.id, {
      include: [ // Cada uno de los elementos del arreglo es la informacion que vamos a cargar de manera anticipada
         {
           model: User, 
           as: 'user' // -> Nombre de la relacion que estoy renombrando
          }
        ]
    }).then(function(task){
        // res.json(task); -> ESto antes mandaba json, pero subi de nivel y ahora mandare una vista del docuemnto encontrado
        res.render('tasks/show',{task: task})
    })
},
edit: function(req, res){
     Task.findByPk(req.params.id).then(function(task){
        res.render('tasks/edit',{task: task})
    })
},
destroy: function(req, res){
   Task.destroy({
    where: { // Mi filtro
        id: req.params.id
     }
   }).then(function(constadorElementosEliminados){
     res.redirect('/tasks');
   })
}, 
  create: function(req, res){
    Task.create({
        description: req.body.description,
        userId: req.user.id //Es para poder guardar y establecer una relacion entre las dos tablas  inserto el ide que hara ref.
    }).then(result => {
        res.json(result);
    }).catch(err => {
        console.log(err);
        res.json(err);
    })
  },
  update: function(req, res){
    Task.update({description: req.body.description},{
        where: { // Mi filtro
           id: req.params.id
        }
    }).then(function(response){
       // res.json(response); -> Esto esta bien. Pero el arreglo con el numero 1 que hace referencia a los valores actualizados, no me dice mucho. Asi que hare un redireccionamiento al valor actualizado
       res.redirect('/tasks/'+req.params.id) // Esto va directito a la peticion get con show y asi es como lo mostraria
    })
  },
  new: function(req, res){
    res.render('tasks/new');
  }
};