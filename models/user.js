'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Course, {
        foreignKey: 'userId',
        as: 'courses'
  });
    }
  }
 User.init({
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'First name is required'
      },
      notEmpty: {
        msg: 'First name cannot be empty'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Last name is required'
      },
      notEmpty: {
        msg: 'Last name cannot be empty'
      }
    }
  },
  emailAddress: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: {
      msg: 'Email address must be unique'
    },
    validate: {
      notNull: {
        msg: 'Email address is required'
      },
      isEmail: {
        msg: 'Email address must be valid'
      }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Password is required'
      },
      notEmpty: {
        msg: 'Password cannot be empty'
      }
    }
  }
}, {
  sequelize,
  modelName: 'User',
});
  return User;
};