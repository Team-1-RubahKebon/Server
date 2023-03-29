"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsToMany(models.Assignment, {
        through: models.StudentAssignment,
      });
    }
  }
  Student.init(
    {
      nkk: DataTypes.INTEGER,
      averageScore: DataTypes.FLOAT,
      name: DataTypes.STRING,
      ClassId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
