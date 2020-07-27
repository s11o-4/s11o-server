'use strict';

const socket = require('../realtime/client');//Esta es la socket conectada al servidor

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     // Task.belongsTo(models.User); //Esto establece la relacion de uno a mucho con el modelo user.js V1
    }
  };
  Task.init({
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Task',
  });

   Task.associate = function(models){
     Task.belongsTo(models.User, {
       as: 'user'
     }); //Esto establece la relacion de uno a mucho con el modelo user.js V2
    }
  
  Task.afterCreate(function(task, options){// Luego que se termine de registrar una nueva tarea , lo voy a poder anviar a los clientes web sockets
    socket.emit('new_task', task)//El primer arguemtno es el identificador con lo que lo voy a mandar y dentro un json con la info que yo quiera
     // ...task // -> Esto manda todas las propiedades de task
    //})
  })
  return Task;
};

