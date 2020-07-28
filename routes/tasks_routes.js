const express = require('express'); // -> A partir de esto voy a generar mi objeto router

let TasksController = require('../controllers/tasks');

let router = express.Router();

//Sobre esta misma ruta puedo definir multiples verbos http
router.route('/tasks')
  .get(TasksController.index) //Hago referencia a la funcion index de mi controlador
  .post(TasksController.create); // Estoy usando la funcion previamente definida en tasks controllers

// Nueva ruta 
//                   AQUI enlazo la accion new  que coloque en task.controller, con la ruta para mostrar el formulario 
router.get('/tasks/new', TasksController.new); // Esta solo es una ruta que enviara nuestro formulario para que eventualemte se cree

router.get('/tasks/:id/edit', TasksController.edit); // -> La funcoin edit de mis controladores

router.route('/tasks/:id').get(TasksController.show) //los dos puntos son un wildcard -> comodin
                          .put(TasksController.update)
                          .delete(TasksController.destroy);
//Para montar todo esto en el server principal, lo necesito expotar
module.exports = router;