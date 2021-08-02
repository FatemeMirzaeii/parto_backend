'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('bank_receipt', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      invoice_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "invoice",
          key: "id",
          as:"invoice_id"
        },
        onDelete: "CASCADE",
      },
      order_id:{
        type: Sequelize.STRING
      },
      gateway:{
        type: Sequelize.ENUM('zp' ,'ID_pay'),
        allowNull: false,
        defaultValue:'ID_pay',
      },
      status:{
        type: Sequelize.ENUM('Success', 'UnSuccess', 'Reversed', 'Waiting', 'Cancel'),
        allowNull: false,
        defaultValue:'Waiting',
      },
      gateway_link:{
        type: Sequelize.STRING
      },
      authority:{
        type: Sequelize.STRING
      },
      meta_data:{
        type: Sequelize.TEXT
        },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('bank_receipt');
  }
};