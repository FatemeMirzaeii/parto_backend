'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_tracking_option', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "user",
          key: "id",
          as:"user_id"
        },
        onDelete: "RESTRICT",
      },
      tracking_option_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "health_tracking_option",
          key: "id",
        },
        onDelete: "RESTRICT",
      },
      date: {
        type: Sequelize.DATEONLY ,
        get: function() {
          return moment.utc(this.getDataValue('birthdate')).format('YYYY-MM-DD');
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
      {
        indexes: [
            {
                unique: true,
                fields: ['user_id', 'tracking_option_id', 'date']
            }
        ]
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_tracking_option');
  }
};