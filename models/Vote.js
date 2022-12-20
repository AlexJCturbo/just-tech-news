//We want to allow many users to vote on many posts, creating a many-to-many relationship. In this relationship, each side must hold a reference to its counterpart, as they each share ownership in a vote. We need to create a third table (in this case the Vote table), for the sole purpose of connecting the data between two other tables with their primary keys. This is known as a through table.
const sequelize = require('../config/connection');
const { Model, DataTypes } = require('sequelize');

class Vote extends Model { }

Vote.init(
  {
    //Because the user_id and post_id pairings must be unique, we're protected from the possibility of a single user voting on one post multiple times. This layer of protection is called a foreign key constraint.
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id'
      }
    },
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'post',
        key: 'id'
      }
    }
  },
  //with user_id and post_id columns in place, we can track the posts that users vote on.
  {
    sequelize,
    freezeTableName: true,
    underscored: true,
    timestamps: false,
    modelName: 'vote'
  }
);

module.exports = Vote;