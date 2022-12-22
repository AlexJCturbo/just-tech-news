const express = require('express');
const routes = require('./routes/index.js');

//Importing the connection to Sequelize from config/connection.js
const sequelize = require('./config/connection.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Turn on routes
app.use(routes);

//Turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});