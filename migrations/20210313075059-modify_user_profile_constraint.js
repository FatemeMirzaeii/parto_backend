'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'user_profile',
        'user_profile_ibfk_1',
        { transaction }
      );
      await queryInterface.addConstraint('user_profile', ['user_id'], {
        type: 'foreign key',
        name: 'user_profile_ibfk_1',
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
        'user_profile',
        'user_profile_ibfk_1',
        { transaction }
      );
      await queryInterface.addConstraint('user_profile', ['user_id'], {
        type: 'foreign key',
        name: 'user_profile_ibfk_1',
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