const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

//GET /api/users, setting up the API endpoint
router.get('/', (req, res) => {
  //Access our User model and run .findAll() method()
  //The .findAll() is a method inherited from Sequelize Model that lets us query all users from the user table in the database. It is the JavaScript equivalent of: SELECT * FROM users;
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
    //.findOne is also a method inherited from Sequelize Model. Using the where option to indicate we want to find a user where its id value equals whatever req.params.id is, much like the SQL query: SELECT * FROM users WHERE id = 1
    where: {
      id: req.params.id
    },
    attributes: { exclude: ['password'] },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_url', 'created_at']
      },
      {
        model: Post,
        attributes: ['title'],
        through: Vote,
        as: 'voted_posts'
        //Now when we query a single user, we'll receive the title information of every post they've ever voted on
      }
    ]
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
  //.create is also a method inherited from Sequelize Model. To insert data, we can use Sequelize's .create() method and pass in key/value with the keys defined in the User model and the values from req.body. In SQL, this command would look like the following code: INSERT INTO users (username, email, password) VALUES ("Toby", "toby@gmail.com", "123456");
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


//POST for login
//For login we use POST methods to verify the user's identity. The reason is that a GET method carries the request parameter appended in the URL string, whereas a POST method carries the request parameter in req.body which makes it a more secure way of transferring data from the client to the server. The password is still in plaintext, which makes this transmission process a vulnerable link in the chain.
router.post('/login', (req, res) => {
  //We queried the User table using the findOne() method for the email entered by the user and assigned it to req.body.email
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    //If the user's email is in the database, this instance of a user must be returned in a Promise so we can proceed with the password verification process.
    if (!dbUserData) {
      res.status(400).json({ message: 'No user found with that email or password!' });
      return;
    }
    //res.json({ user: dbUserData });
    //Verify user
    const validPassword = dbUserData.checkPassword(req.body.password);
    //The .findOne() Sequelize method looks for a user with the specified email. The result of the query is passed as dbUserData to the .then() part of the .findOne() method. If the query result is successful (i.e., not empty), we can call .checkPassword(), which is on the dbUserData object. We pass the plaintext password, which is stored in req.body.password, into .checkPassword() as the argument.
    //The .compareSync() method, which is inside the .checkPassword() method, can then confirm or deny that the supplied password matches the hashed password stored on the object. .checkPassword() will then return true on success or false on failure. We store that boolean value to the variable validPassword.
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    //Confirms true or false to grant login access
    res.json({ user: dbUserData, message: 'You are now logged in!' });
  });
});


//PUT /api/users/1
router.put('/:id', (req, res) => {
  //Expects {username: 'Toby', email: 'toby@gmail.com', password: '123456'}
  //This .update() method is also inherited from Sequelize Model and it combines the parameters for creating data and looking up data. If req.body has exact key/value pairs to match the model, you can just use `req.body` instead. The associated SQL syntax be: UPDATE users SET username = 'Toby', email: 'toby@gmail.com', password: '123456newPassword1234' WHERE id = 1;
  User.update(req.body, {
    //We need to add the option { individualHooks: true } so that the the beforeUpdate method in the User model will be able to hash the password before the update is made.
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
  //The .destroy() method is also inherited from Sequelize Model and it provides some the means to indicate where exactly we would like to delete data from the user database table.
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


/*
RESTful APIs
There are a number of guidelines that go into creating a RESTful API, and many are quite abstract and take time to truly grasp. Still, there are three guidelines we can put to use:

- Name your endpoints in a way that describes the data you're interfacing with, such as /api/users.
- Use HTTP methods like GET, POST, PUT, and DELETE to describe the action you're performing to interface with that endpoint; for example, GET /api/users means you should expect to receive user data.
- Use the proper HTTP status codes like 400, 404, and 500 to indicate errors in a request.
*/