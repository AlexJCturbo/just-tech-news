const router = require('express').Router();
const { Post, User } = require('../../models');

//we include the User model for the post-routes because in a query to the post table, we would like to retrieve not only information about each post, but also the user that posted it. With the foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model

//Get all users posts
router.get('/', (req, res) => {
  console.log('========================');
  Post.findAll({
    attributes: ['id', 'post_url', 'title', 'created_at'],
    order: [['created_at', 'DESC']],
    //The Sequelize "include" property makes the JOIN to the User table. We do this by adding the property include. The value of include is an array of objects, each of which describes a JOIN to make. In this case, we only need to JOIN to the User table, so we only need one object in the array.
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    //Promise that captures the response from the database call
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Get posts by id
router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'post_url', 'title', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Create a post
router.post('/', (req, res) => {
  // expects {title: 'Winter is not so cold for Yorkies', post_url: 'https://all-dogs.com/winter-yorkies', user_id: 1}
  Post.create({
    //Using req.body to populate the columns in the post table.
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Edit a post
router.put('/:id', (req, res) => {
  Post.update(
    {
      title: req.body.title,
      // post_url: req.body.post_url
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Delete a post
router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;