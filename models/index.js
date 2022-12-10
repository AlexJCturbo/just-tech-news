const User = require('./User');
const Post = require('./Post');

//A user can make many posts, but a post only belongs to a single user
//Create associations
User.hasMany(Post, {
  foreignKey: 'user_id'
});

Post.belongsTo(User, {
  foreignKey: 'user_id',
});


module.exports = { User, Post };