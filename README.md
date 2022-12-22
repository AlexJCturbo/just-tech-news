# Just Tech News

## Table of Contents
- [Project Description](#Project-Description)
- [User Story](#User-Story)
- [Usage](#Usage)
- [Screen Captures](#Screen-Captures)
- [Technologies](#Technologies)
- [Links and Testing](#Links-and-Testing)

## Project Description
Just Tech News is a project that develops the back-end for a news-based site using a SQL database. It was developed by working with the Express.js API and using Sequelize to configure and interact with a MySQL database.

Sequelize provides a robust approach for interacting with databases through the implementation of various models for the database tables. With the models in place, adding CRUD operations to the endpoints becomes a simplified task thanks to Sequelize. In this project, four models were implemented for the database: User, Post, Vote and Comment. Sequelize also enables a more practical and efficient interaction between the tables that each model represents, resulting in more efficient and simplified CRUD operations.
###### [Back to Index](#Table-of-Contents)

## User Story
```
AS A back-end developer working with an online news website
I WANT to get a web server up and running using Sequelize
SO THAT the company can create database tables
```
###### [Back to Index](#Table-of-Contents)


## Usage
To use the Just Tech News back end, the user must have Node.js. First clone the repository, then using the command line in the root folder run the command:
```
$npm init
$npm install
```
This will install the required packages: Express.js, Sequelize, MySQL2, Dotenv and Bcrypt.
Then, just start the server on your computer by typing in the command line `npm start`.

###### [Back to Index](#Table-of-Contents)


## Screen Captures
POST user
![just-tech-news 01 POST user](./utils/images/01_post_user.png)

GET users
![just-tech-news 02 GET users](./utils/images/02_get_users.png)

PUT user
![just-tech-news 03 PUT user](./utils/images/03_put_user.png)

PUT upvote
![just-tech-news 04 PUT upvote](./utils/images/05_put_vote.png)

GET posts
![just-tech-news 05 GET posts](./utils/images/04_get_posts.png)

POST comment
![just-tech-news 06 POST comment](./utils/images/08_post_comment.png)
###### [Back to Index](#Table-of-Contents)


## Technologies
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)

![Sequelize](https://img.shields.io/badge/Sequelize-52B0E7?style=for-the-badge&logo=Sequelize&logoColor=white)
###### [Back to Index](#Table-of-Contents)


## Links and Testing
You can use Insomnia or Postman for testing the APIs of the app. Use the following URL: [https://justtechnews-pups.herokuapp.com/api/](https://justtechnews-pups.herokuapp.com/) and just add the type of HTTP request (GET, POST, PUT, etc.) and the corresponding endpoint to perform all the CRUD operations on this database, e.g. POST request @ https://justtechnews-pups.herokuapp.com/users
###### [Back to Index](#Table-of-Contents)