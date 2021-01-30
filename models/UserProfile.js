'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserProfile = sequelize.define('user_profile', {
    birthdate: {
      type: DataTypes.DATEONLY 
    },
    avg_cycle_length: DataTypes.INTEGER,
    avg_period_length: DataTypes.INTEGER,
    avg_sleeping_hour: DataTypes.INTEGER,
    pms_length: DataTypes.INTEGER,
    height: DataTypes.INTEGER,
    weight: DataTypes.INTEGER,
    pregnant: DataTypes.BOOLEAN,
    pregnancy_try: DataTypes.BOOLEAN,
    locked: DataTypes.BOOLEAN,
    last_period_date:DataTypes.DATEONLY ,
    blood_type:DataTypes.STRING,
    period_prediction: DataTypes.BOOLEAN,
    ovulation_prediction: DataTypes.BOOLEAN,
    red_days:DataTypes.BOOLEAN,
    image:DataTypes.STRING,
    createdAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE(3),
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP(3)'),
      field: 'updated_at',
    },

  }, {
    freezeTableName: true,
    underscored: true,
  });
  UserProfile.associate = function (models) {
    UserProfile.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return UserProfile;
};