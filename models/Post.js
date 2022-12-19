const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

//Create our Post model
class Post extends Model { }

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