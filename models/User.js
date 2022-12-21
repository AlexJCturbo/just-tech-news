const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

//Creating the User model
class User extends Model {
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
  {
    //Defining an id column
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    //Defining a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //Defining an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //There cannot be any duplicate email values in the table
      unique: true,
      validate: {
        isEmail: true
      }
    },
    //Defining a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4]
      }
    },
  },
  {
    hooks: {
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;