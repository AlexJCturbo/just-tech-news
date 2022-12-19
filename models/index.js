const User = require('./User');
const Post = require('./Post');

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


module.exports = { User, Post };