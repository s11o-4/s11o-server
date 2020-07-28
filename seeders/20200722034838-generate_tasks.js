'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('tasks', [
      {id: 1, description: 'porsche', createdAt: new Date(), updatedAt: new Date()},
      {id: 2, description: 'lambo', createdAt: new Date(), updatedAt: new Date()}
    
    ], {});
  
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
