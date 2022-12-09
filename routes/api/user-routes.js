const router = require('express').Router();
const { User } = require('../../models');

//GET /api/users, setting up the API endpoint
router.get('/', (req, res) => {
  //Access our User model and run .findAll() method()
  //The .findAll() method lets us query all users from the user table in the database. It is the JavaScript equivalent of: SELECT * FROM users;
  User.findAll({
    //This line is to prevent that the GET request returns the password
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//IMPORTANT: Sequelize is a JavaScript Promise-based library, meaning we get to use .then() with all of the model methods.
// GET /api/users/1
router.get('/:id', (req, res) => {
  User.findOne({
    //Using the where option to indicate we want to find a user where its id value equals whatever req.params.id is, much like the SQL query: SELECT * FROM users WHERE id = 1
    where: {
      id: req.params.id
    },
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//POST /api/users
router.post('/', (req, res) => {
  //Expects {username: 'Toby', email: 'toby@gmail.com', password: '123456'}
  //To insert data, we can use Sequelize's .create() method and pass in key/value with the keys defined in the User model and the values from req.body. In SQL, this command would look like the following code: INSERT INTO users (username, email, password) VALUES ("Toby", "toby@gmail.com", "123456");
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//PUT /api/users/1
router.put('/:id', (req, res) => {
  //Expects {username: 'Toby', email: 'toby@gmail.com', password: '123456'}
  //This .update() method combines the parameters for creating data and looking up data. If req.body has exact key/value pairs to match the model, you can just use `req.body` instead. The associated SQL syntax be: UPDATE users SET username = 'Toby', email: 'toby@gmail.com', password: '123456newPassword1234' WHERE id = 1;
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//DELETE /api/users/1
router.delete('/:id', (req, res) => {
  //The .destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table.
  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

//After we interface with Sequelize, the library interprets our request to it and goes ahead to convey the request to the database and return to us with a response. This means we don't have to directly work with the SQL database, for the most part.