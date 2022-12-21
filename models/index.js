const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

//A user can make many posts, but a post only belongs to a single user.
//Create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});
//This association creates the reference for the id column in the User model to link to the corresponding foreign key pair, which is the user_id in the Post model.

//We also need to make the reverse association with the following statement:
Post.belongsTo(User, {
  foreignKey: 'user_id',
});
//The constraint we impose here is that a post can belong to one user, but not many users. Again, we declare the link to the foreign key, which is designated at user_id in the Post model.

//We associate User and Post to one another in a way that when we query Post, we can see a total of how many votes a user creates; and when we query a User, we can see all of the posts they've voted on. For this we use the .belongsToMany() method, which creates a many-to-many relationship between two models.
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});
//We instruct the application that the User and Post models will be connected through the Vote model. We state what we want the foreign key to be in Vote, which aligns with the fields we set up in the model. We also stipulate that the name of the Vote model should be displayed as voted_posts when queried on, making it a little more informative

Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});
//By also creating one-to-many associations directly between these models, we can perform aggregated SQL functions between models. In this case, we'll see a total count of votes for a single post when queried.

Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});
//Note that we don't have to specify Comment as a through table like we did for Vote. This is because we don't need to access Post through Comment; we just want to see the user's comment and which post it was for. Thus, the query will be slightly different.

module.exports = { User, Post, Vote, Comment };

//Because a vote belongs to a post, instead of creating an endpoint at api/vote, we simply will create a new endpoint at /api/post.