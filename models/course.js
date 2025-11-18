'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
});
    }
  }
  Course.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Course title is required' },
      notEmpty: { msg: 'Course title cannot be empty' }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notNull: { msg: 'Course description is required' },
      notEmpty: { msg: 'Course description cannot be empty' }
    }
  },
  estimatedTime: DataTypes.STRING,
  materialsNeeded: DataTypes.STRING
}, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};