const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

//Create our Post model
//Adding a model method
class Post extends Model {
  //Using JavaScript's built-in static keyword to indicate that the upvote method is one that is based on the Post model and not an instance method.
  static upvote(body, models) {
    //We can now execute Post.upvote() as if it were one of Sequelize's other built-in methods. With this upvote method, we'll pass in the value of req.body (as body) and an object of the models (as models) as parameters.
    return models.Vote.create({
      user_id: body.user_id,
      post_id: body.post_id
    }).then(() => {
      return Post.findOne({
        where: {
          id: body.post_id
        },
        attributes: [
          'id',
          'post_url',
          'title',
          'created_at',
          [
            sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
            'vote_count'
          ]
        ]
      });
    });
  }
}

//Create fields/columns for Post model
Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    post_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isURL: true
      }
    },
    //The user_id column determines who posted the news article. Using the references property, we establish the relationship between this post and the user by creating a reference to the User model. user_id is defined as the foreign key and will be the matching link.
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      }
    }
  },
  {
    //Configuration of the metadata, including the naming conventions
    sequelize,
    freezeTableName: true,
    underscored: true,
    modelName: 'post'
  }
);

module.exports = Post;