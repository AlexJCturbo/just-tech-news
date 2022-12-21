const router = require('express').Router();
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');

//we include the User model for the post-routes because in a query to the post table, we would like to retrieve not only information about each post, but also the user that posted it. With the foreign key, user_id, we can form a JOIN, an essential characteristic of the relational data model

//Get all users posts
router.get('/', (req, res) => {
  console.log('========================');
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'
      ]
    ],
    //The "order" property is assigned a nested array that orders by the created_at column in descending order.
    order: [['created_at', 'DESC']],
    //The Sequelize "include" property makes the JOIN to the User table. We do this by adding the property include. The value of include is an array of objects, each of which describes a JOIN to make. In this case, we only need to JOIN to the User table, so we only need one object in the array.
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        //Include User model itself so it can attach the username to the comment.
        include: {
          model: User,
          attributes: ['username']
        }
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
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count'
      ]
    ],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
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


//Vote on a post
//Make sure this PUT route is defined before the /:id PUT route, though. Otherwise, Express.js will think the word "upvote" is a valid parameter for /:id.
// router.put('/upvote', (req, res) => {
//   Vote.create({
//     user_id: req.body.user_id,
//     post_id: req.body.post_id
//   })
//     .then(() => {
//       // then find the post we just voted on
//       return Post.findOne({
//         where: {
//           id: req.body.post_id
//         },
//         attributes: [
//           'id',
//           'post_url',
//           'title',
//           'created_at',
//           //Using raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`.
//           [
//             sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
//             'vote_count'
//           ]
//           //Because we're counting an associated table's data and not the post itself, the .findAndCountAll() method won't work here.
//           //Instead of trying to predict and build a method for every possible use developers have for SQL databases, Sequelize provides us with a special method called .literal() that allows us to run regular SQL queries from within the Sequelize method-based queries. So when we vote on a post, we'll see that post—and its updated vote total—in the response.
//         ]
//       })
//     })
//     .then(dbPostData => res.json(dbPostData))
//     .catch(error => {
//       console.log(error);
//       res.status(400).json(error);
//     });
// })

//Vote on a post
//After adding the custom static method in the Post.js model, the new endpoint fo the upvote route will look like this:
router.put('/upvote', (req, res) => {
  // custom static .upvote() method created in models/Post.js
  Post.upvote(req.body, { Vote })
    .then(updatedPostData => res.json(updatedPostData))
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
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
      //Sending back data that has been modified and stored in the database
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