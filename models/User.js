const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

const bcrypt = require('bcrypt');

//The saltRounds parameter is known as the cost factor and controls how many rounds of hashing are done by the bcrypt algorithm. The more hashing rounds, the longer it takes to hash, the more time it would take to crack

//Create our User model
//Every time we extend a class from the Sequelize Model class, that new class (or model, in this case) inherits a number of methods for creating, reading, updating, and deleting data from a database. The .init() method we execute after is the part that actually provides context as to how those inherited methods should work
class User extends Model {
  //Set up method to run on instance data (per user) to check password
  //We create an instance method on the User model called checkPassword to access the password property of each user instance. checkPassword method takes in the plaintext password retrieved from the client request at req.body.email and compares that with the hashed password. This method will include the compareSync function from bcrypt.
  checkPassword(loginPw) {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// define table columns and configuration
//use the .init() method to initialize the model's data and configuration
//First object defines the columns and data types for those columns. The second object configures certain options for the table
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
    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

    //Adding hooks for password hashing, that will fire just before a new instance of User is created
    hooks: {
      //Set up beforeCreate lifecycle "hook" functionality
      //Using the beforeCreate() hook to execute the bcrypt hash function on the plaintext password. In the bcrypt hash function, we pass in the userData object that contains the plaintext password in the password property. We also pass in a saltRound value of 10.The resulting hashed password is then passed to the Promise object as a newUserData object with a hashed password property. The return statement then exits out of the function, returning the hashed password in the newUserData function.

      // beforeCreate(userData) {
      //   return bcrypt.hash(userData.password, 10).then(newUserData => {
      //     return newUserData
      //   });
      // }

      //The keyword pair, async/await, works in tandem. The async keyword is used as a prefix to the function that contains the asynchronous function. await can be used to prefix the async function, which will then assign the value from the response to the newUserData's password property. The newUserData is then returned to the application with the hashed password.
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