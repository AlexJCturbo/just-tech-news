//Sequelize is a JavaScript library that works with any dialect of SQL. Because it doesn't know which dialect of SQL we'll use, we have to install that dialect and then instruct Sequelize that we're using it. This is why we installed the mysql2.
//With Sequelize we can use object-oriented concepts to model our database tables using JavaScript classes. This lets us add validators and custom rules to the SQL data.
//With Sequelize, we no longer have to create a entire SQL schema and running it through the SQL shell. All we need to do is create a database; then when we start the app, Sequelize will create the tables.
const express = require('express');

//we don't have to worry about importing multiple files for different endpoints because the router instance in routes/index.js collected everything and packaged them up for server.js to use.
const routes = require('./routes/index.js');

//We're importing the connection to Sequelize from config/connection.js
const sequelize = require('./config/connection.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Turn on routes
app.use(routes);

//Turn on connection to db and server
//The "sync" term means that this is Sequelize taking the models and connecting them to associated database tables. If it doesn't find a table, it'll create it.
//The use of {force: false} in the .sync() method if set to true, it drops and re-create all of the database tables and their associations on startup.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});