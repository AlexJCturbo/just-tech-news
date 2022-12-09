const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

const bcrypt = require('bcrypt');

//The saltRounds parameter is known as the cost factor and controls how many rounds of hashing are done by the bcrypt algorithm. The more hashing rounds, the longer it takes to hash, the more time it would take to crack

//Create our User model
//Every time we extend a class from the Sequelize Model class, that new class (or model, in this case) inherits a number of methods for creating, reading, updating, and deleting data from a database.
class User extends Model { }

// define table columns and configuration
User.init(
  {
    //Define an id column
    id: {
      //Use the special Sequelize DataTypes object provide what type of data it is
      type: DataTypes.INTEGER,
      //This is the equivalent of SQL's `NOT NULL` option
      allowNull: false,
      //Instruct that this is the Primary Key
      primaryKey: true,
      //Turn on auto increment (equivalent to MySQL AUTO INCREMENT)
      autoIncrement: true
    },
    //Define a username column
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    //Define an email column
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      //There cannot be any duplicate email values in this table
      unique: true,
      //If allowNull is set to false, we can run our data through validators before creating the table data
      validate: {
        isEmail: true
      }
    },
    //Define a password column
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //This means the password must be at least four characters long
        len: [4]
      }
    },
  },
  {
    //Adding hooks for password hashing, that will fire just before a new instance of User is created
    hooks: {
      //Set up beforeCreate lifecycle "hook" functionality
      //Using the beforeCreate() hook to execute the bcrypt hash function on the plaintext password. In the bcrypt hash function, we pass in the userData object that contains the plaintext password in the password property. We also pass in a saltRound value of 10.
      // beforeCreate(userData) {
      //   return bcrypt.hash(userData.password, 10).then(newUserData => {
      //     return newUserData
      //   });
      // }
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      //Set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))


    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'
  }
);

module.exports = User;