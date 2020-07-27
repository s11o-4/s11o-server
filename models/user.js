'use strict';

const bcrypt = require('bcrypt'); // bcrypt incluye las funciones para generar el hash del password

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { // EL OBJETO MODELS HACE REFERENCIA A LOS OTROS OBJETOS DEL PROYECTO
      // define association here
     // User.hasMany(models.Task, {  // un usuario puede tener miuchas tareas  V2
     //    as: 'tasks' 
     // });
    }
  };
  User.init({
    email: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password_hash: DataTypes.STRING,
    password: DataTypes.VIRTUAL
  }, {
    sequelize,
    modelName: 'User',
  });

  User.login = function(email, password) { // LO que retirnara todo esto es una promesa que puede ser verdadero o falso dependiendo si las credenciales que se nos enviaron fueron las correctas o erroneas
    // Buscar al usuario 
    return User.findOne({
      where: {
        email: email
      }
    }).then(user => {
     if(!user) return null;
     return user.authenticatePassword(password).then(valid => {
       if(valid) return user;
       return null;
     });
    });
  };

  // Todo esto es el metodo para saber si la contraseña es correcta o no
  User.prototype.authenticatePassword = function(password){
    return new Promise((res, rej) => {
      bcrypt.compare(password, this.password_hash, function(err, valid){// Este metodo recibe dos argemtos. El primero es el password orignal y el segundo es el hash del password
        // Y el tercero es un callback para cuando la comparacion halla finalizado -> el primer argumento es un objeto que recibe los errores, el segundo es un valor booleano que de ser verdader oindica q ambos datos son iguales
        if(err) return rej(err);

        res(valid);
      }) 
    })
    
  } 
   
  User.associate = function(models){
    User.hasMany(models.Task, {  // un usuario puede tener miuchas tareas V2
      as: 'tasks' 
   });
  };

  User.beforeCreate((user, options) => { //Envio como arguemnto una funcion que sera guardada, para luego ser ejecutada cuando se almacene el user
   
    return new Promise((res, rej) => {

      if(user.password){ // Para que encripte solo si el atributo password tiene algun valor
        bcrypt.hash(user.password, 10, function(error, hash){ // Recibe como arguemtnos el texto que va a procesar, y la cantidad de rondas que se llevaran a cabo para obtener un hash seguro. Y por ultimo el callback en el que recibiremos el valor hash del texto que hallamos enviado 
          //La funcion que retorna recibe dos arguemntos: 1.- los errores que hallan sucedido 2.- El hash en caso de que no hallan habido errores 
            user.password_hash = hash;
            res(); // Simplemente continua el programa una ves que a termino la operacion. Y con eso nos quitamos el pronlema de que ncrypt es asincrono
         })
        };     
      });
  
    }); 
  return User;
};