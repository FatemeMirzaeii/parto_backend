'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'user',
        'User_partner_id_foreign_idx',
        { transaction }
      );
      await queryInterface.addConstraint('user', ['partner_id'], {
        type: 'foreign key',
        name: 'partner_id',
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
        'user',
        'User_partner_id_foreign_idx',
        { transaction }
      );
      await queryInterface.addConstraint('user', ['partner_id'], {
        type: 'foreign key',
        name: 'partner_id',
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