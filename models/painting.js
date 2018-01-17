module.exports = function(sequelize, DataTypes){
  const painting = sequelize.define('painting', {
    title: {type: DataTypes.STRING, allowNull: false},
    data: {type: DataTypes.TEXT, allowNull: false},
    points: {type: DataTypes.INTEGER, defaultValue: 0},
    deletedAt: {type: DataTypes.DATEONLY, defaultValue: null}
  });

  return painting;
}