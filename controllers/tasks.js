//Aqui importe mi modelo
//esta es la primera forma de hacerlo
const Task = require('../models').Task;

//Esta es la segunda
//import { Task } from '../models';

//Esta es la tercera
//const Task = import { Task } from '../models';


//Cuando tu importes esto automaticamente
//se importara el objeto que este exportando
//el archivo index.js
//EN la segunda parte indico que quiero la propiedad
//task, el cual contiene nuestro modelo
//y luego se guarda en la varibale task que en resumen
//contiene nuestro modelo

/*
export function home(req, res) {
    //recibe como argumento el resultado final de la promesa
    //en este caso el registro de todos los datos
    Task.findAll().then(function(tasks){
        res.render('tasks/index', {tasks:tasks});
    });
 }
*/

//Si no sirve lo de arriba
module.exports = {
   home: function(req, res){
       //El resultado de esta promesa, es este objeto la cual es un arreglo de objetos
       //                        ||||| 
    Task.findAll().then(function(tasks){
        res.render('tasks/index', {tasks:tasks});
    });
   }
};