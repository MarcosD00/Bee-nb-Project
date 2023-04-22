'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {

    static associate(models) {

      // Booking.belongsTo(models.Spot);
      // Booking.belongsTo(models.User);
      Booking.belongsTo(models.Spot,
        { foreignKey: 'spotId' });
        
      Booking.belongsTo(models.User,
        { foreignKey: 'userId' });

    }
  }
  Booking.init({
    spotsId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate:{
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate:{
      type: DataTypes.DATE,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Booking',
    defaultScope: {
      attributes: {
        exclude: ["createdAt", "updatedAt"]
      }
    }
  });
  return Booking;
};
