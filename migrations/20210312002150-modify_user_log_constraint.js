'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'user_log',
        'user_log_ibfk_1',
        { transaction }
      );
      await queryInterface.addConstraint('user_log', ['user_id'], {
        type: 'foreign key',
        name: 'user_log_ibfk_1',
        references: {
          table: 'user',
          field: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate:'CASCADE',
        transaction
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'use_log',
        'user_log_ibfk_1',
        { transaction }
      );
      await queryInterface.addConstraint('user_log', ['user_id'], {
        type: 'foreign key',
        name: 'user_log_ibfk_1',
        references: {
          table: 'user',
          field: 'id',
        },
        transaction
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};