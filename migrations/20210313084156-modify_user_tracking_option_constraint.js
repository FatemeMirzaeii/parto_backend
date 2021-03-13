'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'user_tracking_option',
        'user_tracking_option_ibfk_1',
        { transaction }
      );
      await queryInterface.addConstraint('user_tracking_option', ['user_id'], {
        type: 'foreign key',
        name: 'user_tracking_option_ibfk_1',
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
        'user_tracking_option',
        'user_tracking_option_ibfk_1',
        { transaction }
      );
      await queryInterface.addConstraint('user_tracking_option', ['user_id'], {
        type: 'foreign key',
        name: 'user_tracking_option_ibfk_1',
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