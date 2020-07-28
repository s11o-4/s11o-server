'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Tasks', 'userId', { // nobre de la tabla, nombre del campo, el tipo de dato del campo que se agregara 
      type: Sequelize.INTEGER,
      references: {
        model: {
          tableName: 'Users' // -> tu tabla
        },
        key: 'id' // -> la otra 
      }
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Tasks','userId');
  }
};
