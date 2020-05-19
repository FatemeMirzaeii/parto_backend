'use strict';
module.exports = (sequelize, DataTypes) => {
  const User_profile = sequelize.define('user_profile', {
    avg_cycle_length: DataTypes.INTEGER,
    avg_period_length: DataTypes.INTEGER,
    pregnancy_try: DataTypes.BOOLEAN,
    use_lock: DataTypes.BOOLEAN
  }, {
    freezeTableName: true,
    underscored: true,
  });
  User_profile.associate = function (models) {
    User_profile.belongsTo(models.user, {
      onDelete: "RESTRICT",
    })
  };
  return User_profile;
};